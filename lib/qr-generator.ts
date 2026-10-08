/*
 * Fast, self-contained QR Code Generator in pure TypeScript
 * Based on Project Nayuki's QR Code library (Public Domain / MIT License)
 * No external dependencies or npm packages required.
 */

export namespace QrCodeGenerator {
  export enum Ecc {
    LOW = 0,
    MEDIUM = 1,
    QUARTILE = 2,
    HIGH = 3,
  }

  const ECC_FORMAT_BITS: number[] = [1, 0, 3, 2];

  export class QrSegment {
    public constructor(
      public readonly mode: Mode,
      public readonly numChars: number,
      public readonly bitData: boolean[]
    ) {}

    public static makeBytes(data: Uint8Array): QrSegment {
      const bitData: boolean[] = [];
      for (const b of data) {
        for (let i = 7; i >= 0; i--) {
          bitData.push(((b >>> i) & 1) !== 0);
        }
      }
      return new QrSegment(Mode.BYTE, data.length, bitData);
    }

    public static getTotalBits(segs: ReadonlyArray<QrSegment>, version: number): number {
      let result = 0;
      for (const seg of segs) {
        const ccbits = seg.mode.numCharCountBits(version);
        result += 4 + ccbits + seg.bitData.length;
      }
      return result;
    }
  }

  export class Mode {
    public static readonly NUMERIC = new Mode(0x1, [10, 12, 14]);
    public static readonly ALPHANUMERIC = new Mode(0x2, [9, 11, 13]);
    public static readonly BYTE = new Mode(0x4, [8, 16, 16]);
    public static readonly KANJI = new Mode(0x8, [8, 10, 12]);

    private constructor(
      public readonly modeBits: number,
      private readonly numBitsCharCount: [number, number, number]
    ) {}

    public numCharCountBits(version: number): number {
      return this.numBitsCharCount[Math.floor((version + 7) / 17)];
    }
  }

  class BitBuffer {
    private bitList: boolean[] = [];

    public get length(): number {
      return this.bitList.length;
    }

    public getBit(index: number): boolean {
      return this.bitList[index];
    }

    public appendBits(val: number, len: number): void {
      for (let i = len - 1; i >= 0; i--) {
        this.bitList.push(((val >>> i) & 1) !== 0);
      }
    }
  }

  export class QrCode {
    public static readonly MIN_VERSION: number = 1;
    public static readonly MAX_VERSION: number = 40;

    public readonly size: number;
    public readonly mask: number;
    private readonly modules: boolean[][];
    private readonly isFunction: boolean[][];

    public constructor(
      public readonly version: number,
      public readonly errorCorrectionLevel: Ecc,
      dataCodewords: Uint8Array,
      msk: number
    ) {
      if (version < QrCode.MIN_VERSION || version > QrCode.MAX_VERSION) {
        throw new RangeError("Version value out of range");
      }
      if (msk < -1 || msk > 7) {
        throw new RangeError("Mask value out of range");
      }
      this.size = version * 4 + 17;
      this.modules = [];
      this.isFunction = [];
      for (let y = 0; y < this.size; y++) {
        this.modules.push(new Array(this.size).fill(false));
        this.isFunction.push(new Array(this.size).fill(false));
      }

      this.drawFunctionPatterns();
      const allCodewords = this.addEccAndInterleave(dataCodewords);
      this.drawCodewords(allCodewords);

      if (msk === -1) {
        let minPenalty = Infinity;
        let bestMask = 0;
        for (let m = 0; m < 8; m++) {
          this.applyMask(m);
          this.drawFormatBits(m);
          const penalty = this.getPenaltyScore();
          if (penalty < minPenalty) {
            minPenalty = penalty;
            bestMask = m;
          }
          this.applyMask(m); // unapply
        }
        msk = bestMask;
      }
      this.mask = msk;
      this.applyMask(msk);
      this.drawFormatBits(msk);
    }

    public getModule(x: number, y: number): boolean {
      return x >= 0 && x < this.size && y >= 0 && y < this.size && this.modules[y][x];
    }

    public static encodeText(text: string, ecl: Ecc = Ecc.MEDIUM): QrCode {
      const seg = QrSegment.makeBytes(new TextEncoder().encode(text));
      return QrCode.encodeSegments([seg], ecl);
    }

    public static encodeSegments(
      segs: ReadonlyArray<QrSegment>,
      ecl: Ecc,
      minVersion: number = 1,
      maxVersion: number = 40,
      mask: number = -1,
      boostEcl: boolean = true
    ): QrCode {
      let version: number;
      let dataUsedBits: number = 0;
      for (version = minVersion; ; version++) {
        const dataCapacityBits = QrCode.getNumDataCodewords(version, ecl) * 8;
        const used = QrSegment.getTotalBits(segs, version);
        if (used <= dataCapacityBits) {
          dataUsedBits = used;
          break;
        }
        if (version >= maxVersion) {
          throw new RangeError("Data too long for QR code");
        }
      }

      if (boostEcl) {
        for (const newEcl of [Ecc.MEDIUM, Ecc.QUARTILE, Ecc.HIGH]) {
          if (dataUsedBits <= QrCode.getNumDataCodewords(version, newEcl) * 8) {
            ecl = newEcl;
          }
        }
      }

      const bb = new BitBuffer();
      for (const seg of segs) {
        bb.appendBits(seg.mode.modeBits, 4);
        bb.appendBits(seg.numChars, seg.mode.numCharCountBits(version));
        for (let i = 0; i < seg.bitData.length; i++) {
          bb.appendBits(seg.bitData[i] ? 1 : 0, 1);
        }
      }

      const dataCapacityBits = QrCode.getNumDataCodewords(version, ecl) * 8;
      bb.appendBits(0, Math.min(4, dataCapacityBits - bb.length));
      bb.appendBits(0, (8 - (bb.length % 8)) % 8);
      for (let padByte = 0xec; bb.length < dataCapacityBits; padByte ^= 0xec ^ 0x11) {
        bb.appendBits(padByte, 8);
      }

      const dataCodewords = new Uint8Array(bb.length / 8);
      for (let i = 0; i < bb.length; i++) {
        dataCodewords[i >>> 3] |= (bb.getBit(i) ? 1 : 0) << (7 - (i & 7));
      }

      return new QrCode(version, ecl, dataCodewords, mask);
    }

    private drawFunctionPatterns(): void {
      for (let i = 0; i < this.size; i++) {
        this.setFunctionModule(6, i, i % 2 === 0);
        this.setFunctionModule(i, 6, i % 2 === 0);
      }

      this.drawFinderPattern(3, 3);
      this.drawFinderPattern(this.size - 4, 3);
      this.drawFinderPattern(3, this.size - 4);

      const alignPos = this.getAlignmentPatternPositions();
      const numAlign = alignPos.length;
      for (let i = 0; i < numAlign; i++) {
        for (let j = 0; j < numAlign; j++) {
          if (
            (i === 0 && j === 0) ||
            (i === 0 && j === numAlign - 1) ||
            (i === numAlign - 1 && j === 0)
          ) {
            continue;
          }
          this.drawAlignmentPattern(alignPos[i], alignPos[j]);
        }
      }

      this.drawFormatBits(0);
      this.drawVersion();
    }

    private drawFormatBits(mask: number): void {
      const data = (ECC_FORMAT_BITS[this.errorCorrectionLevel] << 3) | mask;
      let rem = data;
      for (let i = 0; i < 10; i++) {
        rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      }
      const bits = ((data << 10) | rem) ^ 0x5412;

      for (let i = 0; i <= 5; i++) {
        this.setFunctionModule(8, i, ((bits >>> i) & 1) !== 0);
      }
      this.setFunctionModule(8, 7, ((bits >>> 6) & 1) !== 0);
      this.setFunctionModule(8, 8, ((bits >>> 7) & 1) !== 0);
      this.setFunctionModule(7, 8, ((bits >>> 8) & 1) !== 0);
      for (let i = 9; i < 15; i++) {
        this.setFunctionModule(14 - i, 8, ((bits >>> i) & 1) !== 0);
      }

      for (let i = 0; i < 8; i++) {
        this.setFunctionModule(this.size - 1 - i, 8, ((bits >>> i) & 1) !== 0);
      }
      for (let i = 8; i < 15; i++) {
        this.setFunctionModule(8, this.size - 15 + i, ((bits >>> i) & 1) !== 0);
      }
      this.setFunctionModule(8, this.size - 8, true);
    }

    private drawVersion(): void {
      if (this.version < 7) return;
      let rem = this.version;
      for (let i = 0; i < 12; i++) {
        rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
      }
      const bits = (this.version << 12) | rem;
      for (let i = 0; i < 18; i++) {
        const bit = ((bits >>> i) & 1) !== 0;
        const a = this.size - 11 + (i % 3);
        const b = Math.floor(i / 3);
        this.setFunctionModule(a, b, bit);
        this.setFunctionModule(b, a, bit);
      }
    }

    private drawFinderPattern(x: number, y: number): void {
      for (let dy = -4; dy <= 4; dy++) {
        for (let dx = -4; dx <= 4; dx++) {
          const dist = Math.max(Math.abs(dx), Math.abs(dy));
          const xx = x + dx;
          const yy = y + dy;
          if (xx >= 0 && xx < this.size && yy >= 0 && yy < this.size) {
            this.setFunctionModule(xx, yy, dist !== 2 && dist !== 4);
          }
        }
      }
    }

    private drawAlignmentPattern(x: number, y: number): void {
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }
      }
    }

    private setFunctionModule(x: number, y: number, isDark: boolean): void {
      this.modules[y][x] = isDark;
      this.isFunction[y][x] = true;
    }

    private addEccAndInterleave(data: Uint8Array): Uint8Array {
      const ver = this.version;
      const ecl = this.errorCorrectionLevel;
      const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[ecl][ver];
      const blockEccLen = ECC_CODEWORDS_PER_BLOCK[ecl][ver];
      const rawCodewords = Math.floor(NUM_RAW_DATA_MODULES[ver] / 8);
      const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
      const shortBlockLen = Math.floor(rawCodewords / numBlocks);

      const blocks: Uint8Array[] = [];
      const rsDiv = reedSolomonComputeDivisor(blockEccLen);
      for (let i = 0, k = 0; i < numBlocks; i++) {
        const dat = new Uint8Array(shortBlockLen - blockEccLen + (i >= numShortBlocks ? 1 : 0));
        dat.set(data.subarray(k, k + dat.length));
        k += dat.length;
        const ecc = reedSolomonComputeRemainder(dat, rsDiv);
        const blk = new Uint8Array(dat.length + ecc.length);
        blk.set(dat);
        blk.set(ecc, dat.length);
        blocks.push(blk);
      }

      const result = new Uint8Array(rawCodewords);
      let p = 0;
      for (let i = 0; i < blocks[0].length; i++) {
        for (let j = 0; j < blocks.length; j++) {
          if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) {
            result[p++] = blocks[j][i];
          }
        }
      }
      return result;
    }

    private drawCodewords(data: Uint8Array): void {
      let i = 0;
      for (let right = this.size - 1; right >= 1; right -= 2) {
        if (right === 6) right = 5;
        for (let vert = 0; vert < this.size; vert++) {
          for (let j = 0; j < 2; j++) {
            const x = right - j;
            const upward = ((right + 1) & 2) === 0;
            const y = upward ? this.size - 1 - vert : vert;
            if (!this.isFunction[y][x] && i < data.length * 8) {
              this.modules[y][x] = ((data[i >>> 3] >>> (7 - (i & 7))) & 1) !== 0;
              i++;
            }
          }
        }
      }
    }

    private applyMask(mask: number): void {
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          if (!this.isFunction[y][x]) {
            let invert: boolean;
            switch (mask) {
              case 0:
                invert = (x + y) % 2 === 0;
                break;
              case 1:
                invert = y % 2 === 0;
                break;
              case 2:
                invert = x % 3 === 0;
                break;
              case 3:
                invert = (x + y) % 3 === 0;
                break;
              case 4:
                invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
                break;
              case 5:
                invert = ((x * y) % 2) + ((x * y) % 3) === 0;
                break;
              case 6:
                invert = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
                break;
              case 7:
                invert = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
                break;
              default:
                throw new Error("Unreachable");
            }
            if (invert) {
              this.modules[y][x] = !this.modules[y][x];
            }
          }
        }
      }
    }

    private getPenaltyScore(): number {
      let result = 0;
      for (let y = 0; y < this.size; y++) {
        let runColor = false;
        let runVal = 0;
        for (let x = 0; x < this.size; x++) {
          const color = this.modules[y][x];
          if (color === runColor) {
            runVal++;
            if (runVal === 5) result += 3;
            else if (runVal > 5) result++;
          } else {
            runColor = color;
            runVal = 1;
          }
        }
      }
      for (let x = 0; x < this.size; x++) {
        let runColor = false;
        let runVal = 0;
        for (let y = 0; y < this.size; y++) {
          const color = this.modules[y][x];
          if (color === runColor) {
            runVal++;
            if (runVal === 5) result += 3;
            else if (runVal > 5) result++;
          } else {
            runColor = color;
            runVal = 1;
          }
        }
      }
      return result;
    }

    private getAlignmentPatternPositions(): number[] {
      if (this.version === 1) return [];
      const numAlign = Math.floor(this.version / 7) + 2;
      const step =
        this.version === 32
          ? 26
          : Math.ceil((this.version * 4 + 4) / (numAlign * 2 - 2)) * 2;
      const result: number[] = [6];
      for (let pos = this.version * 4 + 10; result.length < numAlign; pos -= step) {
        result.splice(1, 0, pos);
      }
      return result;
    }

    private static getNumDataCodewords(version: number, ecl: Ecc): number {
      return (
        Math.floor(NUM_RAW_DATA_MODULES[version] / 8) -
        ECC_CODEWORDS_PER_BLOCK[ecl][version] * NUM_ERROR_CORRECTION_BLOCKS[ecl][version]
      );
    }

    public toSvgString(border: number = 4, darkColor: string = "#000000", lightColor: string = "#FFFFFF"): string {
      const parts: string[] = [];
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          if (this.getModule(x, y)) {
            parts.push(`M${x + border},${y + border}h1v1h-1z`);
          }
        }
      }
      const totalSize = this.size + border * 2;
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" stroke="none"><rect width="100%" height="100%" fill="${lightColor}"/><path d="${parts.join(" ")}" fill="${darkColor}"/></svg>`;
    }

    public toDataUrl(border: number = 4, darkColor: string = "#000000", lightColor: string = "#FFFFFF"): string {
      if (typeof document !== "undefined") {
        try {
          const scale = 8;
          const totalSize = (this.size + border * 2) * scale;
          const canvas = document.createElement("canvas");
          canvas.width = totalSize;
          canvas.height = totalSize;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = lightColor;
            ctx.fillRect(0, 0, totalSize, totalSize);
            ctx.fillStyle = darkColor;
            for (let y = 0; y < this.size; y++) {
              for (let x = 0; x < this.size; x++) {
                if (this.getModule(x, y)) {
                  ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
                }
              }
            }
            return canvas.toDataURL("image/png");
          }
        } catch {}
      }

      const svg = this.toSvgString(border, darkColor, lightColor);
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }
  }

  function reedSolomonMultiply(x: number, y: number): number {
    let z: number = 0;
    for (let i = 7; i >= 0; i--) {
      z = ((z << 1) ^ ((z >>> 7) * 0x11d)) & 0xff;
      z ^= ((y >>> i) & 1) * x;
    }
    return z;
  }

  function reedSolomonComputeDivisor(degree: number): Uint8Array {
    const result = new Uint8Array(degree);
    result[degree - 1] = 1;
    let root = 1;
    for (let i = 0; i < degree; i++) {
      for (let j = 0; j < degree; j++) {
        result[j] = reedSolomonMultiply(result[j], root);
        if (j + 1 < degree) {
          result[j] ^= result[j + 1];
        }
      }
      root = reedSolomonMultiply(root, 0x02);
    }
    return result;
  }

  function reedSolomonComputeRemainder(data: Uint8Array, divisor: Uint8Array): Uint8Array {
    const result = new Uint8Array(divisor.length);
    for (const b of data) {
      const factor = b ^ result[0];
      result.copyWithin(0, 1);
      result[result.length - 1] = 0;
      for (let i = 0; i < divisor.length; i++) {
        result[i] ^= reedSolomonMultiply(divisor[i], factor);
      }
    }
    return result;
  }

  const NUM_RAW_DATA_MODULES: number[] = [
    0, 208, 359, 567, 807, 1079, 1383, 1568, 1936, 2336, 2768, 3232, 3728, 4256, 4651,
    5243, 5867, 6523, 7211, 7931, 8683, 9252, 10068, 10916, 11796, 12708, 13652,
    14628, 15371, 16411, 17483, 18587, 19723, 20891, 22091, 23008, 24272, 25568,
    26896, 28256, 29648,
  ];

  const ECC_CODEWORDS_PER_BLOCK: number[][] = [
    [-1,  7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  ];

  const NUM_ERROR_CORRECTION_BLOCKS: number[][] = [
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 72, 74, 77],
  ];
}
