# Stage 1: Build Frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:18 AS backend-builder
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm install
COPY backend/ ./

# Stage 3: Production Image
FROM node:18-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend /app
COPY --from=frontend-builder /app/frontend/dist /app/public
EXPOSE 3000
CMD ["node", "src/index.js"]
