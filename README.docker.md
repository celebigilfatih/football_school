# Football School - Docker Kurulumu

Bu proje Docker ve Docker Compose kullanılarak kolayca çalıştırılabilir.

## Gereksinimler

- Docker
- Docker Compose

## Kurulum ve Çalıştırma

### 1. Projeyi klonlayın
```bash
git clone <repository-url>
cd football_school
```

### 2. Docker konteynerlerini başlatın
```bash
docker-compose up -d
```

### 3. Uygulamaya erişin
- **Frontend**: http://localhost:3005
- **Backend API**: http://localhost:5000/api
- **MongoDB**: localhost:27017

## Kullanışlı Docker Komutları

### Konteynerları durdur
```bash
docker-compose down
```

### Konteynerları yeniden başlat
```bash
docker-compose restart
```

### Logları görüntüle
```bash
# Tüm servisler
docker-compose logs -f

# Sadece backend
docker-compose logs -f backend

# Sadece frontend
docker-compose logs -f frontend
```

### Konteyner durumunu kontrol et
```bash
docker-compose ps
```

### Veritabanını sıfırla
```bash
docker-compose down -v
docker-compose up -d
```

## Geliştirme Modu

Geliştirme için yerel olarak çalıştırmak istiyorsanız:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (yeni terminal)
cd frontend
npm install
npm run dev
```

## Sorun Giderme

### Port çakışması
Eğer portlar kullanımdaysa, docker-compose.yml dosyasındaki port ayarlarını değiştirin.

### Konteyner yeniden oluşturma
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Veritabanı bağlantı sorunu
MongoDB konteynerinin tamamen başladığından emin olun:
```bash
docker-compose logs mongodb
```