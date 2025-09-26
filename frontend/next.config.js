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
    const backendUrl = process.env.NODE_ENV === 'production' 
      ? 'http://backend:5000'  // Docker container içinde backend service adını kullan
      : 'http://localhost:5000'; // Local development için localhost
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
