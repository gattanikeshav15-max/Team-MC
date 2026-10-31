import Memory from '../models/Memory.js';
import Project from '../models/Project.js';
import embeddingService from '../services/embeddingService.js';
import mongoose from 'mongoose';

export class MemoryRetrievalAgent {
  /**
   * Cross-Project Semantic Memory Retrieval
   */
  static async retrieve({
    query,
    projectId = null,
    targetArea = null,
    limit = 5,
    minScore = 0.25,
    includeCompletedOnly = false,
  }) {
    // 1. Compute Query Embedding
    const { embedding: queryVector, model: embeddingModel } = await embeddingService.generateEmbedding(query);

    // 2. Query MongoDB Records
    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (projectId) filter.projectId = projectId;

      // If looking across completed projects
      if (includeCompletedOnly) {
        const completedProjects = await Project.find({ status: 'Completed' }).select('id');
        const projectIds = completedProjects.map((p) => p.id);
        filter.projectId = { $in: projectIds };
      }

      const allMemories = await Memory.find(filter).lean();

      // Cosine similarity scoring
      const scored = allMemories.map((doc) => {
        const similarity = embeddingService.cosineSimilarity(queryVector, doc.embedding || []);
        return {
          ...doc,
          score: similarity,
        };
      });

      scored.sort((a, b) => b.score - a.score);
      const topMatches = scored.filter((m) => m.score >= minScore).slice(0, limit);

      return {
        results: topMatches.length > 0 ? topMatches : scored.slice(0, limit),
        retrievalMethod: 'Cross-Project Cosine Semantic Ranking',
        embeddingModel,
      };
    }

    return {
      results: [],
      retrievalMethod: 'No Database Connection',
      embeddingModel: 'none',
    };
  }
}

export default MemoryRetrievalAgent;
