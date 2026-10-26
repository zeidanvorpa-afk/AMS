import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Force rebuild - Next.js 15.1.6 for Supabase compatibility - fix build cache
};

export default nextConfig;
