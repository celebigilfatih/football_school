#!/bin/bash

echo "🔧 Production API Routing Fix Script"
echo "===================================="

# Renklendirme için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. Checking current Docker containers...${NC}"
docker compose ps

echo -e "\n${BLUE}2. Testing backend API directly...${NC}"
BACKEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api)
if [ "$BACKEND_TEST" = "200" ]; then
    echo -e "${GREEN}✅ Backend API is working on localhost:5000${NC}"
else
    echo -e "${RED}❌ Backend API is not responding on localhost:5000${NC}"
    echo "Exit code: $BACKEND_TEST"
fi

echo -e "\n${BLUE}3. Testing frontend directly...${NC}"
FRONTEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3005)
if [ "$FRONTEND_TEST" = "200" ]; then
    echo -e "${GREEN}✅ Frontend is working on localhost:3005${NC}"
else
    echo -e "${RED}❌ Frontend is not responding on localhost:3005${NC}"
    echo "Exit code: $FRONTEND_TEST"
fi

echo -e "\n${BLUE}4. Testing production domain...${NC}"
DOMAIN_TEST=$(curl -s -o /dev/null -w "%{http_code}" https://futbol.webmahsul.com.tr)
echo "Domain response code: $DOMAIN_TEST"

echo -e "\n${BLUE}5. Testing API through production domain...${NC}"
API_DOMAIN_TEST=$(curl -s -o /dev/null -w "%{http_code}" https://futbol.webmahsul.com.tr/api)
echo "API domain response code: $API_DOMAIN_TEST"

echo -e "\n${YELLOW}📋 Analysis:${NC}"
echo "============"

if [ "$BACKEND_TEST" = "200" ] && [ "$FRONTEND_TEST" = "200" ]; then
    echo -e "${GREEN}✅ Both backend and frontend are running locally${NC}"
    
    if [ "$API_DOMAIN_TEST" != "200" ]; then
        echo -e "${RED}❌ API is not accessible through the production domain${NC}"
        echo -e "${YELLOW}🔧 Solution: The web server (Nginx/Apache) needs to be configured to proxy API requests${NC}"
        echo ""
        echo "The issue is that your domain is serving the frontend correctly,"
        echo "but API requests to /api/* are not being routed to the backend server."
        echo ""
        echo "You need to configure your web server to:"
        echo "1. Serve frontend from localhost:3005 for all requests"
        echo "2. Proxy /api/* requests to localhost:5000"
        echo "3. Proxy /uploads/* requests to localhost:5000"
        echo ""
        echo "A sample Nginx configuration has been created: nginx-production.conf"
        echo ""
        echo -e "${BLUE}Next steps:${NC}"
        echo "1. Contact your hosting provider or server administrator"
        echo "2. Ask them to configure the web server to proxy API requests"
        echo "3. Or install and configure Nginx/Apache yourself if you have server access"
        echo ""
        echo -e "${YELLOW}If you have server access, you can:${NC}"
        echo "sudo cp nginx-production.conf /etc/nginx/sites-available/futbol.webmahsul.com.tr"
        echo "sudo ln -s /etc/nginx/sites-available/futbol.webmahsul.com.tr /etc/nginx/sites-enabled/"
        echo "sudo nginx -t"
        echo "sudo systemctl reload nginx"
    else
        echo -e "${GREEN}✅ Everything seems to be working correctly${NC}"
    fi
else
    echo -e "${RED}❌ Local services are not running properly${NC}"
    echo "Please ensure Docker containers are running:"
    echo "docker compose up -d"
fi

echo -e "\n${BLUE}6. Checking Docker logs for errors...${NC}"
echo "Backend logs (last 10 lines):"
docker compose logs --tail=10 backend

echo -e "\nFrontend logs (last 10 lines):"
docker compose logs --tail=10 frontend

echo -e "\n${GREEN}Script completed!${NC}"