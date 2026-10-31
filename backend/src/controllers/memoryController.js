import Memory from '../models/Memory.js';
import Incident from '../models/Incident.js';
import MemoryExtractionAgent from '../agents/MemoryExtractionAgent.js';
import MemoryRetrievalAgent from '../agents/MemoryRetrievalAgent.js';
import MemoryManagementAgent from '../agents/MemoryManagementAgent.js';
import { inMemoryStore } from '../utils/inMemoryStore.js';
import mongoose from 'mongoose';

export const getMemories = async (req, res) => {
  try {
    const { category, type, verificationStatus, componentId, search } = req.query;
    const filter = {};

    const targetType = category || type;
    if (targetType && targetType !== 'All') filter.type = targetType;
    if (verificationStatus && verificationStatus !== 'All') filter.verificationStatus = verificationStatus;
    if (componentId && componentId !== 'All') filter.componentId = componentId;

    if (mongoose.connection.readyState === 1) {
      if (search) {
        filter.$text = { $search: search };
      }
      const memories = await Memory.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(memories);
    }

    let result = inMemoryStore.memories;
    if (targetType && targetType !== 'All') result = result.filter((m) => m.type === targetType);
    if (verificationStatus && verificationStatus !== 'All') result = result.filter((m) => m.verificationStatus === verificationStatus);
    if (componentId && componentId !== 'All') result = result.filter((m) => m.componentId === componentId);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.content.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.componentId.toLowerCase().includes(q) ||
          m.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const extractMemory = async (req, res) => {
  try {
    const { incidentId, incidentData } = req.body;
    let targetIncident = incidentData;

    if (!targetIncident && incidentId) {
      if (mongoose.connection.readyState === 1) {
        targetIncident = await Incident.findOne({ id: incidentId });
      } else {
        targetIncident = inMemoryStore.incidents.find((i) => i.id === incidentId);
      }
    }

    if (!targetIncident) {
      return res.status(400).json({ success: false, message: 'Valid incidentId or incidentData is required' });
    }

    const { memory, isDuplicate } = await MemoryExtractionAgent.extractFromIncident(targetIncident);

    return res.status(201).json({
      success: true,
      memory,
      isDuplicate,
      message: isDuplicate ? 'Existing memory verified; duplicate creation skipped.' : 'New agentic memory extracted.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const searchMemories = async (req, res) => {
  try {
    const { query, componentId, systemId, limit = 5, minScore = 0.45 } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query string is required' });
    }

    const retrievalResult = await MemoryRetrievalAgent.retrieve({
      query,
      componentId,
      systemId,
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
    const { action, verificationStatus, content, reason, engineerName } = req.body;
    const author = engineerName || req.user?.name || 'Keshav Gattani';

    let result;

    if (action === 'verify' || verificationStatus === 'Verified') {
      result = await MemoryManagementAgent.verify(id, author);
    } else if (action === 'unverify' || verificationStatus === 'Unverified') {
      result = await MemoryManagementAgent.unverify(id);
    } else if (action === 'correct' || verificationStatus === 'Corrected' || (content && reason)) {
      result = await MemoryManagementAgent.correct(id, {
        newContent: content,
        reason: reason || 'Technical heuristic precision correction',
        engineerName: author,
      });
    } else if (action === 'archive' || verificationStatus === 'Archived') {
      result = await MemoryManagementAgent.archive(id);
    } else {
      // General field update
      if (mongoose.connection.readyState === 1) {
        result = await Memory.findOneAndUpdate({ id }, req.body, { new: true });
      } else {
        const mem = inMemoryStore.memories.find((m) => m.id === id);
        if (!mem) return res.status(404).json({ success: false, message: `Memory ${id} not found` });
        Object.assign(mem, req.body);
        result = mem;
      }
    }

    return res.status(200).json({
      success: true,
      memory: result,
      message: `Memory ${id} status updated successfully.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMemory = async (req, res) => {
  try {
    const { id } = req.params;
    await MemoryManagementAgent.delete(id);
    return res.status(200).json({ success: true, message: `Memory ${id} purged from persistent store.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
