import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  // Otimização de imagens
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    unoptimized: false,
  },
  // Para deploy na Hostinger
  output: "standalone",
  
  // Headers de segurança
  async headers() {
    return [
      {
        // Aplica headers de segurança a todas as rotas
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  
  // Redirecionar HTTP para HTTPS em produção
  async redirects() {
    return [];
  },
  
  // Configurações de segurança adicionais
  poweredByHeader: false, // Remove header X-Powered-By
  
  // Configurações experimentais de segurança
  experimental: {
    // Habilita verificações de tipos mais estritas
  },
};

export default nextConfig;
