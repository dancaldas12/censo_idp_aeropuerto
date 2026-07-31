/** @type {import('next').NextConfig} */
const nextConfig = {
  // standalone only for Docker builds; Vercel handles its own output
  ...(process.env.DOCKER_BUILD === 'true' ? { output: 'standalone' } : {}),
  reactStrictMode: true,
};

export default nextConfig;
