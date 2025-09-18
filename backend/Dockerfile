# Node.js 18 Alpine imajını kullan
FROM node:18-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# Package dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm ci --only=production

# Uygulama kodunu kopyala
COPY . .

# Uploads klasörünü oluştur
RUN mkdir -p uploads/groups

# Port 5000'i aç
EXPOSE 5000

# Uygulamayı başlat
CMD ["npm", "start"]