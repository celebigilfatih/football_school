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
        destination: 'http://backend:5000/api/:path*', // Docker network içinde backend servisine yönlendir
      },
      {
        source: '/uploads/:path*',
        destination: 'http://backend:5000/uploads/:path*', // Upload dosyalarını da yönlendir
      },
    ];
  },
};

module.exports = nextConfig;
