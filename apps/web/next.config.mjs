/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output buat Docker
  output: 'standalone',
  
  // Experimental features
  experimental: {
    serverComponentsExternalPackages: ['telegraf'],
  },
  
  // TypeScript ignore build errors (dev mode)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ESLint ignore during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;