const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
};

module.exports = nextConfig;
