import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // output: 'export',
  // distDir: 'build', // Changes the build output directory to `build`
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  }
}

export default nextConfig
