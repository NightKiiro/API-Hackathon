# ---------- FRONT BUILD ----------
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build


# ---------- BACK ----------
FROM node:20-slim

WORKDIR /app/backend

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./
RUN npm install
RUN npm rebuild sqlite3 --build-from-source

COPY backend/ ./

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 8000

CMD ["sh", "-c", "node src/initDb.js && node src/index.js"]