<<<<<<< HEAD
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
=======
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

>>>>>>> ef66ddb8bb285b77ca6d7ed6a01282eb330c466b
CMD ["npm", "start"]