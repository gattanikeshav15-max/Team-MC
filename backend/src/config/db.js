import mongoose from 'mongoose';

let isConnected = false;
let connectionMode = 'uninitialized';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    connectionMode = 'demo';
    isConnected = false;
    console.log('\n================================================================');
    console.log('⚠️  [SILICONSENTINEL DATABASE NOTICE]');
    console.log('No valid MONGODB_URI found in backend/.env');
    console.log('MODE: Standalone In-Memory / Demo Storage Mode (Zero Database Drift)');
    console.log('All API endpoints, agentic memory retrieval, and CRUD are operational.');
    console.log('To connect MongoDB Atlas, paste your URI in backend/.env and restart.');
    console.log('================================================================\n');
    return { isConnected: false, mode: 'demo' };
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    isConnected = true;
    connectionMode = 'atlas';
    console.log(`\n✅ MongoDB Atlas Connected: ${conn.connection.host}/${conn.connection.name}`);
    return { isConnected: true, mode: 'atlas', host: conn.connection.host };
  } catch (error) {
    isConnected = false;
    connectionMode = 'demo_fallback';
    console.error(`\n❌ MongoDB Atlas Connection Error: ${error.message}`);
    console.log('⚠️  Falling back to Standalone In-Memory Demo Mode for zero-downtime development.\n');
    return { isConnected: false, mode: 'demo_fallback', error: error.message };
  }
};

export const getDBStatus = () => ({
  isConnected,
  mode: connectionMode,
  readyState: mongoose.connection.readyState,
  statusLabel: isConnected ? 'Connected to MongoDB Atlas' : 'Standalone Development / Demo Mode',
});
