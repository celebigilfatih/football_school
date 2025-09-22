# Football School - Production Deployment Guide

## 🎯 Sorun Analizi

Sisteminizde şu sorunlar tespit edildi:
- ✅ **Yerel geliştirme ortamı**: Tamamen çalışıyor
- ❌ **Production sunucusu**: Backend API çalışmıyor, sadece frontend çalışıyor

## 🔧 Yapılan Düzeltmeler

### 1. Docker Compose Konfigürasyonu
- Frontend environment değişkenleri production URL'lerine güncellendi
- Backend ve frontend servisleri arasındaki bağlantı düzeltildi

### 2. Nginx Konfigürasyonu
- API isteklerini backend'e yönlendiren Nginx config dosyası oluşturuldu
- Static dosya servisi için gerekli ayarlar eklendi

### 3. Deployment Script
- Otomatik deployment için `deploy.sh` scripti oluşturuldu
- Container build, test ve monitoring işlemleri dahil

## 🚀 Production Deployment Adımları

### Adım 1: Sunucuda Gerekli Yazılımları Yükleyin

```bash
# Docker ve Docker Compose yükleyin
sudo apt update
sudo apt install docker.io docker-compose-plugin nginx -y
sudo systemctl enable docker
sudo systemctl start docker
```

### Adım 2: Projeyi Sunucuya Yükleyin

```bash
# Projeyi sunucuya kopyalayın (git clone veya scp ile)
git clone [your-repo-url] /var/www/football-school
cd /var/www/football-school
```

### Adım 3: Nginx Konfigürasyonunu Ayarlayın

```bash
# Nginx config dosyasını kopyalayın
sudo cp nginx.conf /etc/nginx/sites-available/football-school

# Site'ı aktif edin
sudo ln -s /etc/nginx/sites-available/football-school /etc/nginx/sites-enabled/

# Default site'ı devre dışı bırakın (isteğe bağlı)
sudo rm /etc/nginx/sites-enabled/default

# Nginx konfigürasyonunu test edin
sudo nginx -t

# Nginx'i yeniden başlatın
sudo systemctl reload nginx
```

### Adım 4: SSL Sertifikası Ekleyin (Önerilen)

```bash
# Let's Encrypt ile SSL sertifikası
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d futbol.webmahsul.com.tr
```

### Adım 5: Uygulamayı Deploy Edin

```bash
# Deploy scriptini çalıştırın
chmod +x deploy.sh
./deploy.sh
```

## 🔍 Test ve Doğrulama

### Yerel Test (Geliştirme)
```bash
# Backend API testi
curl http://localhost:5000/api

# Frontend testi
curl http://localhost:3005
```

### Production Test
```bash
# Backend API testi (Nginx üzerinden)
curl https://futbol.webmahsul.com.tr/api

# Frontend testi
curl https://futbol.webmahsul.com.tr
```

## 📊 Monitoring ve Troubleshooting

### Container Durumunu Kontrol Etme
```bash
docker compose ps
docker compose logs backend
docker compose logs frontend
```

### Nginx Loglarını Kontrol Etme
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Port Kullanımını Kontrol Etme
```bash
netstat -tulpn | grep -E ":80|:443|:3005|:5000"
```

## 🔄 Güncelleme Süreci

Kod değişikliklerinden sonra:

```bash
# Git'ten son değişiklikleri çekin
git pull origin main

# Container'ları yeniden build edin
docker compose up --build -d

# Nginx'i yeniden yükleyin (gerekirse)
sudo systemctl reload nginx
```

## ⚠️ Önemli Notlar

1. **Environment Variables**: Production ortamında `.env.production` dosyasındaki değerlerin doğru olduğundan emin olun
2. **Firewall**: 80 ve 443 portlarının açık olduğundan emin olun
3. **Domain**: DNS ayarlarının doğru yapılandırıldığından emin olun
4. **Backup**: Düzenli MongoDB backup'ları alın

## 🆘 Yaygın Sorunlar ve Çözümleri

### Problem: API 404 Hatası
**Çözüm**: Nginx konfigürasyonunu kontrol edin ve backend container'ının çalıştığından emin olun

### Problem: Frontend Yüklenmiyor
**Çözüm**: Frontend container loglarını kontrol edin ve build hatalarını düzeltin

### Problem: Database Bağlantı Hatası
**Çözüm**: MongoDB container'ının çalıştığından ve network ayarlarının doğru olduğundan emin olun

## 📞 Destek

Sorun yaşarsanız:
1. Container loglarını kontrol edin
2. Nginx error loglarını inceleyin
3. Network bağlantılarını test edin
4. Environment değişkenlerini doğrulayın