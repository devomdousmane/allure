import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empêche Turbopack d’utiliser C:\Users\omdou\package-lock.json comme racine
  // (cache cassé → @swc/helpers introuvable).
  turbopack: {
    root: path.resolve(__dirname),
  },
  transpilePackages: ["react-pageflip", "page-flip"],
  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value:
              "xr-spatial-tracking=(self \"https://my.matterport.com\"), camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
