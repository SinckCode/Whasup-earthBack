FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar todas las dependencias (incluyendo dev para migraciones)
RUN npm ci

# Copiar codigo fuente, migraciones, seeders y scripts
COPY src/ ./src/
COPY migrations/ ./migrations/
COPY seeders/ ./seeders/
COPY scripts/ ./scripts/
COPY .sequelizerc ./

# Exponer puerto
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/ || exit 1

# Start
CMD ["node", "src/app.js"]
