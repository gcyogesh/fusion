/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['newapi.fusionexpeditions.com'],
  },
  typescript: {
    ignoreBuildErrors: true, // ⛔️ Skips TypeScript type checking during build
  },
  eslint: {
    ignoreDuringBuilds: true, // ⛔️ Skips ESLint errors during build
  },
};

module.exports = nextConfig;
