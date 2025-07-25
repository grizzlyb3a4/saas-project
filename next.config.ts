/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // increase from default 1mb
    },
  },
};

module.exports = nextConfig;
