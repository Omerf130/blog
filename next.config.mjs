/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow images from common domains (add more as needed)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable SCSS modules
  sassOptions: {
    includePaths: ['./styles'],
  },
};

export default nextConfig;

