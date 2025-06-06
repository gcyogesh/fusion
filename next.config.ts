/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['yogeshbhai.ddns.net'],
  },
  typescript: {
    ignoreBuildErrors: true, // ⛔️ Skips TypeScript type checking during build
  },
  eslint: {
    ignoreDuringBuilds: true, // ⛔️ Skips ESLint errors during build
  },
};

module.exports = nextConfig;
