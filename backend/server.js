/* global process */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env variables
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import syncRoutes from './routes/syncRoutes.js';

// Import error handler
import { errorHandler } from './middleware/errorMiddleware.js';

// Import excel initializer
import { initializeExcel } from './config/excel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  
  // Initialize Excel Database if it doesn't exist
  initializeExcel();
  
  // Standard middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/achievements', achievementRoutes);
  app.use('/api/sync', syncRoutes);
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Backend server is running correctly', timestamp: new Date() });
  });

  // Integrate Vite for single-port frontend & backend development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const rootDir = path.resolve(__dirname, '..');
    const vite = await createViteServer({
      root: rootDir,
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // Use Vite's connect instance as middleware
    app.use(vite.middlewares);
    console.log('Vite middleware integrated for development mode.');
  } else {
    // Serve static frontend files in production
    const distPath = path.resolve(__dirname, '../dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production-ready static frontend from dist.');
  }
  
  // Global Error Handler Middleware
  app.use(errorHandler);
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HOUSEOFSOLUPER Backend] Server is running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Critical failure during server startup:', err);
});
