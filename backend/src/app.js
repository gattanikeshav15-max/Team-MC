import express from 'express';
import cors from 'cors';
import path from 'path';
import { getDBStatus } from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import memoryRoutes from './routes/memoryRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import knowledgeTransferRoutes from './routes/knowledgeTransferRoutes.js';
import { getStats, runSeed } from './controllers/statsController.js';

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded documents statically
app.use('/uploads', express.static(path.resolve('uploads')));

// Health & Diagnostics
app.get('/api/health', (req, res) => {
  const db = getDBStatus();
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE');

  res.status(200).json({
    status: 'ONLINE',
    platform: 'SiliconSentinel Research Platform',
    vajraCoreVersion: 'v3.0 - Research Knowledge Transfer Engine',
    database: {
      connected: db.isConnected,
      mode: db.mode,
      label: db.statusLabel,
    },
    aiEngine: {
      geminiConfigured: hasGemini,
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      activeProvider: hasGemini ? 'Google Gemini' : 'VAJRA Grounded Synthesis Engine',
    },
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/knowledge-transfer', knowledgeTransferRoutes);
app.get('/api/stats', getStats);
app.post('/api/seed', runSeed);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`,
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
