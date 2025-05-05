FROM node:20-alpine as backend-build

# Set working directory for backend
WORKDIR /app/backend

# Copy backend package files and install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend source code
COPY backend/ ./

# Create directories for file uploads
RUN mkdir -p public/packageImage
RUN mkdir -p public/uploads
RUN mkdir -p public/customerProfiles
RUN mkdir -p public/guideProfiles
RUN mkdir -p public/agencyProfiles

# Build frontend
FROM node:20-alpine as frontend-build

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend package files and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source code
COPY frontend/ ./

# Set API URL for production
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-https://echovoyages-backend.onrender.com}

# Build the frontend app
RUN npm run build

# Final stage for backend
FROM node:20-alpine as backend

WORKDIR /app

# Copy built backend from backend-build stage
COPY --from=backend-build /app/backend ./

# Expose backend port
ENV PORT=10000
EXPOSE 10000

# Start the backend application
CMD ["npm", "run", "start"]

# Final stage for frontend
FROM nginx:alpine as frontend

# Copy built frontend assets from frontend-build stage
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose frontend port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
