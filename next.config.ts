import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend-api/:path*",
        destination: "https://loan.cavkim.tech/:path*",
      },
    ];
  },
};

export default nextConfig;
