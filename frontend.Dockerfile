FROM node:18-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || true
COPY . .
RUN cd frontend && npm install && npm run build
RUN cp -r frontend/dist backend/public 2>/dev/null || true
EXPOSE 3003
ENV NODE_ENV=production
CMD ["next", "start", "-p", "3003"]
