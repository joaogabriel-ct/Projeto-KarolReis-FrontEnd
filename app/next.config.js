/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/google-callback',
        destination: '/google-callback',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: 'http://localhost:8000/backend/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
