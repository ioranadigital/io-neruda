import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import fs from 'fs';
import logger from './utils/logger.js';

const envPath = 'E:\\master.env';
const result = config({ path: envPath });
if (result.error) {
  console.warn('⚠️ master.env not loaded:', result.error.message);
}

console.log('Environment variables loaded from:', envPath);
console.log('IO_NERUDA_BACKEND_PORT:', process.env.IO_NERUDA_BACKEND_PORT);
console.log('IO_NERUDA_ENV:', process.env.IO_NERUDA_ENV);

const app = express();
const PORT = parseInt(process.env.IO_NERUDA_BACKEND_PORT || '4006', 10);
const NODE_ENV = process.env.IO_NERUDA_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
const morganFormat = NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// Routes
import projectsRoutes from './routes/projects.routes.js';
import contentRoutes from './routes/content.routes.js';
import exportRoutes from './routes/export.routes.js';
import publishRoutes from './routes/publish.routes.js';
import generatorsRoutes from './routes/generators.routes.js';

app.use('/api/projects', projectsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/publish', publishRoutes);
app.use('/api/generators', generatorsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res.status(err.status || 500).json({
    error: NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  logger.info(`Backend started on port ${PORT}`);
});
