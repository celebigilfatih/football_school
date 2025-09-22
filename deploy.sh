#!/bin/bash

# Football School Deployment Script
# Bu script projeyi production ortamına deploy eder

echo "🚀 Football School Deployment Başlıyor..."

# Mevcut container'ları durdur ve temizle
echo "📦 Mevcut container'lar durduruluyor..."
docker-compose down

# Eski image'ları temizle
echo "🧹 Eski Docker image'ları temizleniyor..."
docker system prune -f

# Production environment dosyasını kopyala
echo "⚙️ Production environment ayarları yapılıyor..."
cp .env.production .env

# Docker container'ları build et ve başlat
echo "🔨 Docker container'ları build ediliyor..."
docker-compose up --build -d

# Container'ların başlamasını bekle
echo "⏳ Container'ların başlaması bekleniyor..."
sleep 30

# Container durumlarını kontrol et
echo "📊 Container durumları kontrol ediliyor..."
docker-compose ps

# Backend API'sinin çalışıp çalışmadığını test et
echo "🔍 Backend API testi yapılıyor..."
if curl -f http://localhost:5000/api > /dev/null 2>&1; then
    echo "✅ Backend API çalışıyor!"
else
    echo "❌ Backend API çalışmıyor! Logları kontrol edin:"
    docker-compose logs backend
fi

# Frontend'in çalışıp çalışmadığını test et
echo "🔍 Frontend testi yapılıyor..."
if curl -f http://localhost:3005 > /dev/null 2>&1; then
    echo "✅ Frontend çalışıyor!"
else
    echo "❌ Frontend çalışmıyor! Logları kontrol edin:"
    docker-compose logs frontend
fi

echo "🎉 Deployment tamamlandı!"
echo "📝 Nginx konfigürasyonunu sunucunuza yüklemeyi unutmayın:"
echo "   sudo cp nginx.conf /etc/nginx/sites-available/football-school"
echo "   sudo ln -s /etc/nginx/sites-available/football-school /etc/nginx/sites-enabled/"
echo "   sudo nginx -t && sudo systemctl reload nginx"