import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All imagery is served from /public, so no remote patterns are needed.
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
