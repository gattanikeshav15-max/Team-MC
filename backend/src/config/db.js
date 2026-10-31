import mongoose from 'mongoose';

let isConnected = false;
let connectionMode = 'uninitialized';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();

  // No URI provided or still has placeholder text
  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    connectionMode = 'demo';
    isConnected = false;
    console.log('\n================================================================');
    console.log('⚠️  [SILICONSENTINEL DATABASE NOTICE]');
    console.log('No valid MONGODB_URI found in backend/.env');
    console.log('MODE: Standalone In-Memory / Demo Storage Mode');
    console.log('All API endpoints, agentic memory retrieval, and CRUD are operational.');
    console.log('To connect MongoDB, paste your URI in backend/.env and restart.');
    console.log('================================================================\n');
    return { isConnected: false, mode: 'demo' };
  }

  const isLocal = uri.includes('localhost') || uri.includes('127.0.0.1');

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    isConnected = true;
    connectionMode = isLocal ? 'local' : 'atlas';

    console.log(`\n✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    console.log(`   Mode: ${isLocal ? 'Local MongoDB' : 'MongoDB Atlas'}`);
    return { isConnected: true, mode: connectionMode, host: conn.connection.host };
  } catch (error) {
    isConnected = false;
    connectionMode = 'demo_fallback';
    console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️  Falling back to Standalone In-Memory Demo Mode.\n');
    return { isConnected: false, mode: 'demo_fallback', error: error.message };
  }
};

export const getDBStatus = () => ({
  isConnected,
  mode: connectionMode,
  readyState: mongoose.connection.readyState,
  statusLabel: isConnected
    ? connectionMode === 'local'
      ? 'Connected to Local MongoDB'
      : 'Connected to MongoDB Atlas'
    : 'Standalone Development / Demo Mode',
});
