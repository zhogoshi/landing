import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@hogoshi/ui", "@hogoshi/tokens"],
  agentRules: false,
};

export default nextConfig;
