const fs = require('node:fs');
const path = require('node:path');

const manifestPath = path.resolve(__dirname, '../subsystem.yaml');
const manifest = fs.readFileSync(manifestPath, 'utf8');
const subsystemMatch = manifest.match(/^name:\s*([a-z0-9-]+)\s*$/m);
if (!subsystemMatch) {
  throw new Error(`Could not read the subsystem name from ${manifestPath}.`);
}

const subsystemId = subsystemMatch[1];
for (const variable of ['SUBSYSTEM_ID', 'NEXT_PUBLIC_SUBSYSTEM_ID']) {
  const configuredId = process.env[variable];
  if (configuredId && configuredId !== subsystemId) {
    throw new Error(`${variable} must match the subsystem name in subsystem.yaml.`);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  env: {
    SUBSYSTEM_ID: subsystemId,
    NEXT_PUBLIC_SUBSYSTEM_ID: subsystemId,
  },
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
