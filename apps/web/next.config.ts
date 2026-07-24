import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
  turbopack: {
    root: path.join(process.cwd(), "../.."),
  },
};

export default nextConfig;
