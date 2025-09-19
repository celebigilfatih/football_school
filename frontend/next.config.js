/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'futbol.webmahsul.com.tr'],
  },
  eslint: {
    ignoreDuringBuilds: true, // Vercel deploy sırasında ESLint hatalarını yok say
  },
  typescript: {
    ignoreBuildErrors: true, // TypeScript hatalarını yok say
  },
};

module.exports = nextConfig;
