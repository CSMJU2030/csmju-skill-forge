/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:3002';
    return [
      { source: '/api/:path*', destination: `${backendUrl}/api/:path*` },
      { source: '/auth/login', destination: `${backendUrl}/auth/login` },
      { source: '/auth/callback', destination: `${backendUrl}/auth/callback` },
      { source: '/auth/logout', destination: `${backendUrl}/auth/logout` },
    ];
  },
};
module.exports = nextConfig;
