/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Ignorar errores de TypeScript durante el build
    tsconfigPath: './tsconfig.json',
  },
};

module.exports = nextConfig;
