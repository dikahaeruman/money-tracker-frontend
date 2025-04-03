/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // Option to disable ESLint during build for faster builds
  },
  typescript: {
    ignoreBuildErrors: true,  // Option to ignore TypeScript errors during build for faster builds
  },
  output: 'standalone',  // Ensures that Next.js builds for standalone deployment (e.g., without a Node.js server)
};

export default nextConfig;
