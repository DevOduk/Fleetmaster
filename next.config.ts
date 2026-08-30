import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. External Images Configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', //change this to cloudflare host for our images
        port: '',
        pathname: '/**',
      },
    ],
  },

  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
