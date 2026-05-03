import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  serverExternalPackages: ["next-intl"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 1080, 1920, 2560],
  },
};

export default nextConfig;
