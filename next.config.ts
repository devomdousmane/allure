import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/apartments-type-a",
        destination: "/les-appartements/type-a",
        permanent: true,
      },
      {
        source: "/apartments-type-b",
        destination: "/les-appartements/type-b",
        permanent: true,
      },
      {
        source: "/apartments-type-c",
        destination: "/les-appartements/type-c",
        permanent: true,
      },
      {
        source: "/apartments-type-d",
        destination: "/les-appartements/type-d",
        permanent: true,
      },
      {
        source: "/studio-2",
        destination: "/les-appartements/studio",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
