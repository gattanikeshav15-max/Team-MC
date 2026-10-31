import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB, getDBStatus } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // 1. Initialize Database Connection (or Demo Fallback)
  await connectDB();

  // 2. Start HTTP Server
  const server = app.listen(PORT, () => {
    const db = getDBStatus();
    const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE');

    console.log('\n================================================================');
    console.log('🛡️   SILICONSENTINEL BACKEND & VAJRA AI ENGINE READY');
    console.log('================================================================');
    console.log(`📡 Port:                http://localhost:${PORT}`);
    console.log(`🏥 Health Check:        http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Database Mode:       ${db.statusLabel} (${db.mode})`);
    console.log(`🧠 AI Engine Provider:   ${hasGemini ? 'Google Gemini (Live API)' : 'VAJRA Local Synthesis (Demo Mode)'}`);
    console.log(`📐 Vector Dimensions:   ${process.env.EMBEDDING_DIMENSION || 768} (Atlas Vector Search Index Ready)`);
    console.log('================================================================\n');
  });

  // Handle unhandled rejections
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
  });
};

startServer();

