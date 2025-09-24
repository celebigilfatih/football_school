const http = require('http');
const httpProxy = require('http-proxy-middleware');
const express = require('express');

const app = express();

// Frontend için ana sayfa
const frontendProxy = httpProxy.createProxyMiddleware({
  target: 'http://localhost:3005',
  changeOrigin: true,
  ws: true,
});

// Backend API istekleri
const backendProxy = httpProxy.createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
});

// API isteklerini backend'e yönlendir
app.use('/api', (req, res, next) => {
  console.log(`API request: ${req.method} ${req.url}`);
  next();
}, backendProxy);

// Diğer tüm istekleri frontend'e yönlendir
app.use('/', frontendProxy);

const PORT = 80;
const server = app.listen(PORT, () => {
  console.log(`Reverse proxy server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});