/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'contribution.usercontent.google.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/app',
        destination: '/',
        permanent: false,
      },
      {
        source: '/app/:path*',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
