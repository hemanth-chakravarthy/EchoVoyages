FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Create directories for file uploads
RUN mkdir -p public/packageImage
RUN mkdir -p public/uploads
RUN mkdir -p public/customerProfiles
RUN mkdir -p public/guideProfiles
RUN mkdir -p public/agencyProfiles

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "dev"]
