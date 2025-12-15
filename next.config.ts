import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/u/**",
      },
    ],
    domains: [
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "utfs.io",
    ],
  },
};

export default nextConfig;

