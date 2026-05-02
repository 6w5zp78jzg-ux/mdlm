import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 1080, 1920, 2560],
  },
  experimental: {
    serverComponentsExternalPackages: ["next-intl"],
  },
};

export default nextConfig;
