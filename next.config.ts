import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['lucide-react', 'zustand'],
  turbopack: {
    resolveAlias: {
      '@': './',
    },
  },
};

export default nextConfig;
