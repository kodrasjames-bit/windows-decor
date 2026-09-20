import type { NextConfig } from 'next';
const config: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  trailingSlash: true,
  output: 'export', images: { unoptimized: true },
  experimental: { workerThreads: true, useTypeScriptCli: false },
};
export default config;
