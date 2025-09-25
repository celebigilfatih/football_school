const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Logging middleware
app.use((req, res, next) => {
  console.log(`\n=== ${new Date().toISOString()} ===`);
  console.log(`📥 Incoming: ${req.method} ${req.url}`);
  console.log(`🌐 Host: ${req.headers.host}`);
  
  // API isteği kontrolü
  if (req.url.startsWith('/api')) {
    console.log(`🔍 API Request Detected: ${req.url}`);
  } else {
    console.log(`🏠 Frontend Request: ${req.url}`);
  }
  
  next();
});

// API Proxy Middleware - /api ile başlayan tüm istekler
const apiProxyMiddleware = createProxyMiddleware({
  target: 'http://localhost:5005',
  changeOrigin: true,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    // Original URL'yi restore et
    const originalUrl = req.originalUrl || req.url;
    console.log(`🔄 Proxying to Backend: ${req.method} ${originalUrl} -> http://localhost:5005${originalUrl}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    const originalUrl = req.originalUrl || req.url;
    console.log(`✅ Backend Response: ${proxyRes.statusCode} for ${req.method} ${originalUrl}`);
  },
  onError: (err, req, res) => {
    console.error(`❌ Backend Proxy Error:`, err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Backend Proxy Error', message: err.message });
    }
  }
});

// Frontend Proxy Middleware - diğer tüm istekler
const frontendProxyMiddleware = createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  ws: true,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`🔄 Proxying to Frontend: ${req.method} ${req.url} -> http://localhost:3000${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`✅ Frontend Response: ${proxyRes.statusCode} for ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error(`❌ Frontend Proxy Error:`, err.message);
    if (!res.headersSent) {
      res.status(500).send('Frontend Proxy Error');
    }
  }
});

// Route handlers - sıra önemli!
app.use('/api', (req, res, next) => {
  console.log(`🎯 API Route Handler: ${req.method} ${req.originalUrl || req.url} (stripped: ${req.url})`);
  // Original URL'yi korumak için req.url'yi restore et
  req.url = req.originalUrl || req.url;
  apiProxyMiddleware(req, res, next);
});

app.use('/', (req, res, next) => {
  console.log(`🎯 Frontend Route Handler: ${req.method} ${req.url}`);
  frontendProxyMiddleware(req, res, next);
});

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`\n🚀 Reverse Proxy Server Started`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
  console.log(`🎯 Backend Target: http://localhost:5005`);
  console.log(`🎯 Frontend Target: http://localhost:3000`);
  console.log(`\n📋 Routing Rules:`);
  console.log(`   /api/* -> Backend (http://localhost:5005)`);
  console.log(`   /*     -> Frontend (http://localhost:3000)`);
  console.log(`\n⏳ Ready to handle requests...\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});