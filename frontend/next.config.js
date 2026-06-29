/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  outputFileTracingRoot: path.join(__dirname),
};

module.exports = nextConfig;
