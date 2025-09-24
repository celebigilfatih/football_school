/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'futbol.webmahsul.com.tr',
        pathname: '/uploads/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Vercel deploy sırasında ESLint hatalarını yok say
  },
  typescript: {
    ignoreBuildErrors: true, // TypeScript hatalarını yok say
  },
  reactStrictMode: false, // Strict mode'u kapatıyoruz
  
  // API isteklerini backend'e yönlendir
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // Local backend'e yönlendir
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5000/uploads/:path*', // Upload dosyalarını da local backend'e yönlendir
      },
    ];
  },
};

module.exports = nextConfig;
