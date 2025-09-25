export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://futbol.webmahsul.com.tr/api';

// For client-side image loading, use the domain URL since images are served through Cloudflare tunnel
export const BASE_URL = typeof window !== 'undefined' 
  ? 'https://futbol.webmahsul.com.tr' 
  : (process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5005');