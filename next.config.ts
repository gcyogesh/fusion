// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['yogeshbhai.ddns.net'],
  },
    typescript: {
    ignoreBuildErrors: true, // ⛔️ This skips type checking during build
  },
};

module.exports = nextConfig;
