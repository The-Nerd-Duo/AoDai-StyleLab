import React from "react";

interface FormattedMarkdownProps {
  content: string;
  className?: string;
}

// Chuyển đổi cú pháp in đậm (**text**), in nghiêng (*text*), code (`code`) thành React elements
function renderInlineText(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__|_.*?_|`.*?`)/g);

  return parts.map((part, index) => {
    if (!part) return null;

    if (
      (part.startsWith("**") && part.endsWith("**") && part.length >= 4) ||
      (part.startsWith("__") && part.endsWith("__") && part.length >= 4)
    ) {
      return (
        <strong key={index} className="font-bold text-inherit">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (
      (part.startsWith("*") && part.endsWith("*") && part.length >= 2) ||
      (part.startsWith("_") && part.endsWith("_") && part.length >= 2)
    ) {
      return (
        <em key={index} className="italic text-inherit">
          {part.slice(1, -1)}
        </em>
      );
    }

    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={index}
          className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[11px] font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export const FormattedMarkdown: React.FC<FormattedMarkdownProps> = ({
  content,
  className = "",
}) => {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];

  const flushList = (keyPrefix: number) => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul key={`list-${keyPrefix}`} className="space-y-1.5 my-1.5 pl-1 text-inherit">
          {currentListItems}
        </ul>
      );
      currentListItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(index);
      return;
    }

    // Tiêu đề ### Tiêu đề
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushList(index);
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];
      elements.push(
        <div
          key={`h-${index}`}
          className={`font-bold mt-2.5 mb-1 text-inherit ${
            level <= 2 ? "text-[13px] tracking-wide" : "text-xs"
          } opacity-95`}
        >
          {renderInlineText(headingText)}
        </div>
      );
      return;
    }

    // Danh sách đầu dòng (* hoặc - hoặc số 1.)
    const bulletMatch = trimmed.match(/^([*\-•]|\d+\.)\s+(.+)$/);
    if (bulletMatch) {
      const itemText = bulletMatch[2];
      currentListItems.push(
        <li
          key={`li-${index}`}
          className="flex items-start gap-2 text-inherit leading-relaxed text-xs"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-70 mt-1.5 shrink-0" />
          <span className="flex-1">{renderInlineText(itemText)}</span>
        </li>
      );
      return;
    }

    // Đoạn văn thông thường
    flushList(index);
    elements.push(
      <p key={`p-${index}`} className="my-1 leading-relaxed text-inherit text-xs">
        {renderInlineText(trimmed)}
      </p>
    );
  });

  flushList(lines.length);

  return <div className={`space-y-1 text-inherit ${className}`}>{elements}</div>;
};
