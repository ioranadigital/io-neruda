FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY backend/package.json ./
COPY backend/.npmrc ./

# Install dependencies
RUN npm install

# Copy source
COPY backend ./

# Create logs directory
RUN mkdir -p logs

# Run
EXPOSE 4003
CMD ["npm", "start"]
