import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* config options here */
  images: {
    remotePatterns: [
   {
    protocol: 'https',
    hostname: 'avatars.githubusercontent.com',
    port: '',
    pathname: '/u/**'
   },
   {
    protocol: 'https',
    hostname: 'utfs.io',
    port: '',
    pathname: '/u/**'
   },

    ],
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'utfs.io'],
  },
};

export default nextConfig;
