import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Otimização de imagens
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
  // Para deploy na Hostinger
  output: "standalone",
};

export default nextConfig;
