# Stage 1: Build TypeScript
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npx tsc

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copiar codigo compilado
COPY --from=build /app/dist ./dist/

# Copiar migraciones, seeders, scripts y config de sequelize (se quedan en JS)
COPY migrations/ ./migrations/
COPY seeders/ ./seeders/
COPY scripts/ ./scripts/
COPY .sequelizerc ./
COPY src/config/sequelize-config.js ./src/config/sequelize-config.js

# Exponer puerto
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/ || exit 1

# Start
CMD ["node", "dist/app.js"]
