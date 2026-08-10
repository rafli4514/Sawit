/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure the build doesn't fail due to font fetching in restricted environments
  // You can remove this or use local fonts if you have them.
  // outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
