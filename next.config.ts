import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
   {
    protocol: 'https',
    hostname: 'avatars.githubusercontent.com',
    port: '',
    pathname: '/u/**'
   }
    ],
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
};

export default nextConfig;
