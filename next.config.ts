import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'books.googleusercontent.com',
        pathname: '/books/content',
      },
      {
        protocol: 'http',
        hostname: 'books.googleusercontent.com',
        pathname: '/books/content',
      },
      {
        protocol: 'https',
        hostname: 'books.google.com',
        pathname: '/books/**',
      },
      {
        protocol: 'http',
        hostname: 'books.google.com',
        pathname: '/books/**',
      },
    ],
  },
};

export default nextConfig;
