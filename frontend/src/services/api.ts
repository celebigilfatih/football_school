import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    console.log(`API Request to: ${config.baseURL}${config.url}`);
    console.log('Request Method:', config.method?.toUpperCase());
    console.log('Request Data:', config.data);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Her istekte önbelleği devre dışı bırakmak için timestamp ekle
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: new Date().getTime()
      };
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api; 