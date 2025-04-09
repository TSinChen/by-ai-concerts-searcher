import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/by-ai-concerts-searcher",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
