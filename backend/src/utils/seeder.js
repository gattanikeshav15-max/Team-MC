import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import System from '../models/System.js';
import Component from '../models/Component.js';
import Incident from '../models/Incident.js';
import Memory from '../models/Memory.js';
import Conversation from '../models/Conversation.js';
import { initialSystems, initialComponents, initialIncidents, initialMemories, initialConversations } from './inMemoryStore.js';
import embeddingService from '../services/embeddingService.js';

export const seedDatabase = async () => {
  console.log('🌱 Starting SiliconSentinel database seeding...');

  if (mongoose.connection.readyState !== 1) {
    console.log('⚠️  MongoDB connection not active. Seeding in-memory store instead.');
    return {
      success: true,
      mode: 'in-memory',
      message: 'In-memory demonstration dataset seeded with realistic semiconductor telemetry.',
      counts: {
        systems: initialSystems.length,
        components: initialComponents.length,
        incidents: initialIncidents.length,
        memories: initialMemories.length,
      },
    };
  }

  try {
    // 1. Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      System.deleteMany({}),
      Component.deleteMany({}),
      Incident.deleteMany({}),
      Memory.deleteMany({}),
      Conversation.deleteMany({}),
    ]);

    console.log('🧹 Purged existing collections.');

    // 2. Seed Default Engineer User
    await User.create({
      name: 'Keshav Gattani',
      email: 'keshav.gattani@svnit.ac.in',
      password: 'Password@2026',
      role: 'Lead Reliability & Avionics Engineer',
      team: 'Team MC — SVNIT Nexus',
      clearanceLevel: 'Level 3 Clearance',
    });

    // 3. Seed Systems
    await System.insertMany(initialSystems);

    // 4. Seed Components
    await Component.insertMany(initialComponents);

    // 5. Seed Incidents
    await Incident.insertMany(initialIncidents);

    // 6. Seed Memories with Real Vector Embeddings
    const memoryDocs = [];
    for (const mem of initialMemories) {
      const { embedding } = await embeddingService.generateEmbedding(
        `${mem.componentName} ${mem.componentId} ${mem.type} ${mem.content}`
      );
      memoryDocs.push({
        ...mem,
        embedding,
      });
    }
    await Memory.insertMany(memoryDocs);

    // 7. Seed Initial VAJRA Conversations
    await Conversation.insertMany(initialConversations);

    console.log(`✅ Successfully seeded:
    - ${initialSystems.length} Electronic Systems
    - ${initialComponents.length} Semiconductor Components
    - ${initialIncidents.length} Telemetry Incidents
    - ${memoryDocs.length} Agentic Engineering Memories (with Vector Embeddings)
    - 1 Default Engineer Account (keshav.gattani@svnit.ac.in)`);

    return {
      success: true,
      mode: 'atlas',
      counts: {
        systems: initialSystems.length,
        components: initialComponents.length,
        incidents: initialIncidents.length,
        memories: memoryDocs.length,
      },
    };
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    throw error;
  }
};

// Allow running standalone from CLI: `node src/utils/seeder.js`
if (process.argv[1]?.includes('seeder.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  })();
}

export default seedDatabase;
