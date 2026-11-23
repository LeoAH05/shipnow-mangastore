FROM node:22-alpine

ENV NODE_ENV=production

WORKDIR /app

# Primero solo los package*.json, para aprovechar la caché de capas
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Carpetas que escribe la app, con permisos para el usuario no-root
RUN mkdir -p logs uploads && chown -R node:node /app

USER node

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-8080}/api/health || exit 1

CMD ["npm", "start"]