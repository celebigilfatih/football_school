# 🚨 Production API Routing Fix Guide

## Problem Analysis

Your Football School application is experiencing **404 errors** for all API endpoints in production. Here's what we discovered:

### ✅ What's Working
- ✅ Backend API server is running correctly on `localhost:5000`
- ✅ Frontend is running correctly on `localhost:3005`
- ✅ Domain `https://futbol.webmahsul.com.tr` serves the frontend
- ✅ Docker containers are healthy and running

### ❌ What's Not Working
- ❌ API requests to `https://futbol.webmahsul.com.tr/api/*` return 404 errors
- ❌ No web server is configured to route API requests to the backend

## Root Cause

**The domain is only serving the frontend application.** There's no web server configuration (Nginx/Apache) to proxy API requests from `/api/*` to the backend server running on `localhost:5000`.

When the frontend makes API calls to `https://futbol.webmahsul.com.tr/api/announcements`, the request goes to the frontend server instead of the backend API server.

## 🔧 Solution Options

### Option 1: Configure Web Server (Recommended)

You need to configure a web server (Nginx or Apache) to:
1. Serve the frontend for all root requests (`/`)
2. Proxy API requests (`/api/*`) to `localhost:5000`
3. Proxy upload requests (`/uploads/*`) to `localhost:5000`

#### For Nginx:
```bash
# 1. Install Nginx (if not installed)
sudo apt update
sudo apt install nginx

# 2. Copy the configuration file
sudo cp nginx-production.conf /etc/nginx/sites-available/futbol.webmahsul.com.tr

# 3. Enable the site
sudo ln -s /etc/nginx/sites-available/futbol.webmahsul.com.tr /etc/nginx/sites-enabled/

# 4. Remove default site (if exists)
sudo rm -f /etc/nginx/sites-enabled/default

# 5. Test configuration
sudo nginx -t

# 6. Restart Nginx
sudo systemctl restart nginx

# 7. Enable Nginx to start on boot
sudo systemctl enable nginx
```

#### For Apache:
```bash
# 1. Install Apache (if not installed)
sudo apt update
sudo apt install apache2

# 2. Enable required modules
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite

# 3. Create virtual host configuration
sudo nano /etc/apache2/sites-available/futbol.webmahsul.com.tr.conf

# Add the following content:
<VirtualHost *:80>
    ServerName futbol.webmahsul.com.tr
    
    # Frontend proxy
    ProxyPreserveHost On
    ProxyPass /api/ http://localhost:5000/api/
    ProxyPassReverse /api/ http://localhost:5000/api/
    
    ProxyPass /uploads/ http://localhost:5000/uploads/
    ProxyPassReverse /uploads/ http://localhost:5000/uploads/
    
    ProxyPass / http://localhost:3005/
    ProxyPassReverse / http://localhost:3005/
</VirtualHost>

# 4. Enable the site
sudo a2ensite futbol.webmahsul.com.tr.conf

# 5. Disable default site
sudo a2dissite 000-default.conf

# 6. Restart Apache
sudo systemctl restart apache2
```

### Option 2: Use Cloudflare/Hosting Provider

If you're using Cloudflare or a hosting provider, configure:

1. **Main domain** (`futbol.webmahsul.com.tr`) → Point to your server IP:3005
2. **API subdomain** (`api.futbol.webmahsul.com.tr`) → Point to your server IP:5000

Then update your frontend configuration:
```typescript
// frontend/src/config.ts
export const API_URL = 'https://api.futbol.webmahsul.com.tr/api';
```

### Option 3: Docker Compose with Nginx

Add Nginx to your Docker Compose setup:

```yaml
# Add to docker-compose.yml
  nginx:
    image: nginx:alpine
    container_name: football_school_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-production.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - frontend
      - backend
    networks:
      - football_school_network
```

## 🧪 Testing the Fix

After implementing the solution, test with:

```bash
# Test API endpoint
curl -X GET https://futbol.webmahsul.com.tr/api

# Should return: {"message":"Welcome to Football School API"}

# Test specific endpoints
curl -X GET https://futbol.webmahsul.com.tr/api/announcements
curl -X GET https://futbol.webmahsul.com.tr/api/groups
curl -X GET https://futbol.webmahsul.com.tr/api/about
```

## 🔍 Troubleshooting

### Check Web Server Status
```bash
# For Nginx
sudo systemctl status nginx
sudo nginx -t

# For Apache
sudo systemctl status apache2
sudo apache2ctl configtest
```

### Check Logs
```bash
# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Apache logs
sudo tail -f /var/log/apache2/error.log
sudo tail -f /var/log/apache2/access.log
```

### Verify Port Accessibility
```bash
# Check if ports are accessible
netstat -tlnp | grep -E ':80|:443|:3005|:5000'
```

## 📋 Quick Diagnosis Script

Run the diagnosis script to check the current status:
```bash
./fix-production-api.sh
```

## 🚀 Next Steps

1. **Choose your preferred solution** (Option 1 recommended)
2. **Implement the web server configuration**
3. **Test all API endpoints**
4. **Add SSL certificate** for HTTPS (recommended)
5. **Monitor logs** for any issues

## 📞 Support

If you need help implementing these solutions:

1. **Check your hosting provider's documentation** for web server configuration
2. **Contact your server administrator** if you don't have root access
3. **Use the provided configuration files** as templates

## 🔒 Security Notes

- Always use HTTPS in production
- Configure proper firewall rules
- Keep your web server updated
- Use strong SSL certificates

---

**Files Created:**
- `nginx-production.conf` - Ready-to-use Nginx configuration
- `fix-production-api.sh` - Diagnostic script
- `PRODUCTION-FIX-GUIDE.md` - This comprehensive guide