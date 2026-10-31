import Memory from '../models/Memory.js';
import Project from '../models/Project.js';
import MemoryRetrievalAgent from '../agents/MemoryRetrievalAgent.js';
import mongoose from 'mongoose';

export const getMemories = async (req, res) => {
  try {
    const { category, projectId, verificationStatus, search } = req.query;
    const filter = {};

    if (category && category !== 'All') filter.category = category;
    if (projectId && projectId !== 'All') filter.projectId = projectId;
    if (verificationStatus && verificationStatus !== 'All') filter.verificationStatus = verificationStatus;

    if (mongoose.connection.readyState === 1) {
      if (search) {
        filter.$text = { $search: search };
      }
      const memories = await Memory.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(memories);
    }

    return res.status(200).json([]);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const searchMemories = async (req, res) => {
  try {
    const { query, projectId, limit = 5, minScore = 0.25 } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query string is required' });
    }

    const retrievalResult = await MemoryRetrievalAgent.retrieve({
      query,
      projectId,
      limit: Number(limit),
      minScore: Number(minScore),
    });

    return res.status(200).json({
      success: true,
      query,
      resultsCount: retrievalResult.results.length,
      retrievalMethod: retrievalResult.retrievalMethod,
      embeddingModel: retrievalResult.embeddingModel,
      results: retrievalResult.results,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMemory = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    if (mongoose.connection.readyState === 1) {
      const updated = await Memory.findOneAndUpdate({ id }, update, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Memory not found' });
      return res.status(200).json({ success: true, memory: updated });
    }

    return res.status(404).json({ success: false, message: 'Database disconnected' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMemory = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      await Memory.deleteOne({ id });
      return res.status(200).json({ success: true, message: `Memory ${id} deleted` });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
