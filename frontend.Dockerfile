FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/package.json ./
COPY frontend/.npmrc ./

# Install dependencies
RUN npm install

# Copy source
COPY frontend ./

# Build
RUN npm run build

# Run
EXPOSE 3003
CMD ["npm", "start"]
