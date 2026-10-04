/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Cloud Run Docker container & dynamic API routes
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
