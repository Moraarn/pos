import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['lucide-react', 'zustand'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './',
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      '@': './',
    },
  },
};

export default nextConfig;
