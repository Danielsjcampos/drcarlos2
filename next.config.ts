import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warnings won't block the Vercel production build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
