/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['source.unsplash.com', 'picsum.photos', 'localhost', '10.7.7.7', 'futbol.webmahsul.com.tr'],
  },
  eslint: {
    ignoreDuringBuilds: true, // Vercel deploy sırasında ESLint hatalarını engellemez
  },
  typescript: {
    ignoreBuildErrors: true, // Derleme sırasında TypeScript hatalarını yok sayar (Geçici çözüm)
  },
};

module.exports = nextConfig;
