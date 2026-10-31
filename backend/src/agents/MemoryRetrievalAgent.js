import Memory from '../models/Memory.js';
import embeddingService from '../services/embeddingService.js';
import { inMemoryStore } from '../utils/inMemoryStore.js';
import mongoose from 'mongoose';
import { getDBStatus } from '../config/db.js';

export class MemoryRetrievalAgent {
  /**
   * Semantic Vector Retrieval over MongoDB (cosine similarity) or in-memory fallback
   */
  static async retrieve({ query, componentId = null, systemId = null, limit = 4, minScore = 0.35 }) {
    // 1. Generate Query Vector Embedding
    const { embedding: queryVector, model: embeddingModel } = await embeddingService.generateEmbedding(query);

    // 2. MongoDB connected — use cosine similarity over all documents (local MongoDB doesn't support $vectorSearch)
    if (mongoose.connection.readyState === 1) {
      const mongoFilter = {};
      if (componentId) mongoFilter.componentId = componentId;
      if (systemId) mongoFilter.systemId = systemId;

      const allMemories = await Memory.find(mongoFilter).lean();

      const scored = allMemories.map((doc) => {
        const similarity = embeddingService.cosineSimilarity(queryVector, doc.embedding || []);
        return { ...doc, score: similarity };
      });

      scored.sort((a, b) => b.score - a.score);
      const topMatches = scored.filter((m) => m.score >= minScore).slice(0, limit);

      return {
        results: topMatches.length > 0 ? topMatches : scored.slice(0, limit),
        retrievalMethod: 'Vector Cosine Similarity over MongoDB Records',
        embeddingModel,
      };
    }

    // 3. Fallback: In-Memory Vector Store Cosine Similarity
    const pool = inMemoryStore.memories.filter(
      (m) => !componentId || m.componentId === componentId
    );

    const scored = pool.map((mem) => {
      const similarity = embeddingService.cosineSimilarity(queryVector, mem.embedding || []);
      return { ...mem, score: similarity };
    });

    scored.sort((a, b) => b.score - a.score);
    const topMatches = scored.filter((m) => m.score >= minScore).slice(0, limit);

    return {
      results: topMatches.length > 0 ? topMatches : scored.slice(0, limit),
      retrievalMethod: 'Deterministic High-Dimensional Vector Cosine Ranking (Demo Mode)',
      embeddingModel,
    };
  }
}

export default MemoryRetrievalAgent;
