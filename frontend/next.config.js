const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ancla la raiz al frontend: evita que Next elija E:\git por multiples lockfiles
  outputFileTracingRoot: path.join(__dirname),
};

module.exports = nextConfig;
