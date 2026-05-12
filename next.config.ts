import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/dist/shared/lib/constants";

const nextConfig = (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const prodBasePath = "/invitation";

  return {
    output: "export",
    images: {
      unoptimized: true,
    },
    trailingSlash: true,
    basePath: isDev ? "" : prodBasePath,
    assetPrefix: isDev ? "" : `${prodBasePath}/`,
    sassOptions: {
      additionalData: `$basePath: "${isDev ? "" : prodBasePath.replace(/\/+$/, "")}";`,
    },
    allowedDevOrigins: ["192.168.0.11"],
  };
};

export default nextConfig;
