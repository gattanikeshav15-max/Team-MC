import System from '../models/System.js';
import Component from '../models/Component.js';
import Incident from '../models/Incident.js';
import Memory from '../models/Memory.js';
import { inMemoryStore } from '../utils/inMemoryStore.js';
import { getDBStatus } from '../config/db.js';
import { seedDatabase } from '../utils/seeder.js';
import mongoose from 'mongoose';

export const getStats = async (req, res) => {
  try {
    const dbStatus = getDBStatus();

    if (mongoose.connection.readyState === 1) {
      const [totalSystems, registeredComponents, totalIncidents, verifiedMemoriesCount, unverifiedMemoriesCount, pendingInvestigations] = await Promise.all([
        System.countDocuments(),
        Component.countDocuments(),
        Incident.countDocuments(),
        Memory.countDocuments({ verificationStatus: 'Verified' }),
        Memory.countDocuments({ verificationStatus: 'Unverified' }),
        Incident.countDocuments({ status: { $ne: 'Resolved' } }),
      ]);

      return res.status(200).json({
        success: true,
        dbStatus,
        stats: {
          totalSystems,
          registeredComponents,
          totalIncidents,
          verifiedMemoriesCount,
          unverifiedMemoriesCount,
          pendingInvestigations,
        },
      });
    }

    const totalSystems = inMemoryStore.systems.length;
    const registeredComponents = inMemoryStore.components.length;
    const totalIncidents = inMemoryStore.incidents.length;
    const verifiedMemoriesCount = inMemoryStore.memories.filter((m) => m.verificationStatus === 'Verified').length;
    const unverifiedMemoriesCount = inMemoryStore.memories.filter((m) => m.verificationStatus === 'Unverified').length;
    const pendingInvestigations = inMemoryStore.incidents.filter((i) => i.status !== 'Resolved').length;

    return res.status(200).json({
      success: true,
      dbStatus,
      stats: {
        totalSystems,
        registeredComponents,
        totalIncidents,
        verifiedMemoriesCount,
        unverifiedMemoriesCount,
        pendingInvestigations,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const runSeed = async (req, res) => {
  try {
    const result = await seedDatabase();
    return res.status(200).json({
      success: true,
      message: 'SiliconSentinel semiconductor baseline data seeded successfully.',
      result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
