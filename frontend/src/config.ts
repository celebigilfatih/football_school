export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// For client-side image loading, always use localhost since browser cannot resolve docker internal hostnames
export const BASE_URL = typeof window !== 'undefined' 
  ? 'http://localhost:5000' 
  : (process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000');