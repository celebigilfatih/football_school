# Node.js 18 Alpine imajını kullan
FROM node:18-alpine AS base

# Çalışma dizinini ayarla
WORKDIR /app

# Package dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm ci

# Kaynak kodunu kopyala
COPY . .

# Next.js uygulamasını build et
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Production bağımlılıklarını yükle
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Build edilmiş uygulamayı kopyala
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.* ./
COPY --from=base /app/package.json ./package.json

# Next.js kullanıcısı oluştur
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# .next klasörünün sahipliğini değiştir
RUN chown -R nextjs:nodejs /app/.next

USER nextjs

# Port 3000'i aç
EXPOSE 3000

# Uygulamayı başlat
CMD ["npm", "start"]