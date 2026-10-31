import express from 'express';
import cors from 'cors';
import { getDBStatus } from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import systemRoutes from './routes/systemRoutes.js';
import componentRoutes from './routes/componentRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import memoryRoutes from './routes/memoryRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { getStats, runSeed } from './controllers/statsController.js';

const app = express();

// Middleware
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: '*', // Allow both dev origins and local requests
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health and Diagnostics API
app.get('/api/health', (req, res) => {
  const db = getDBStatus();
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE');

  res.status(200).json({
    status: 'ONLINE',
    platform: 'SiliconSentinel Backend API',
    vajraCoreVersion: 'v2.6',
    database: {
      connected: db.isConnected,
      mode: db.mode,
      label: db.statusLabel,
    },
    aiEngine: {
      geminiConfigured: hasGemini,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      activeProvider: hasGemini ? 'Google Gemini' : 'VAJRA Local Deterministic Synthesis',
    },
    vectorSearch: {
      indexName: process.env.MONGODB_VECTOR_INDEX || 'vector_index_memories',
      dimensions: parseInt(process.env.EMBEDDING_DIMENSION, 10) || 768,
      status: db.isConnected ? 'Atlas Vector Search Ready' : 'In-Memory Cosine Vector Store Active',
    },
    timestamp: new Date().toISOString(),
  });
});

// Mount Core Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/systems', systemRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/ai', aiRoutes);
app.get('/api/stats', getStats);
app.post('/api/seed', runSeed);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found on SiliconSentinel API Gateway.`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

export default app;
