import Memory from '../models/Memory.js';
import embeddingService from '../services/embeddingService.js';
import { inMemoryStore } from '../utils/inMemoryStore.js';
import mongoose from 'mongoose';

export class MemoryRetrievalAgent {
  /**
   * Semantic Vector Retrieval over MongoDB Atlas or Fallback Vector Math
   */
  static async retrieve({ query, componentId = null, systemId = null, limit = 4, minScore = 0.45 }) {
    // 1. Generate Query Vector Embedding
    const { embedding: queryVector, model: embeddingModel } = await embeddingService.generateEmbedding(query);
    const vectorIndexName = process.env.MONGODB_VECTOR_INDEX || 'vector_index_memories';

    // 2. Attempt MongoDB Atlas $vectorSearch Aggregation Pipeline if Connected
    if (mongoose.connection.readyState === 1) {
      try {
        const filter = {};
        if (componentId) filter.componentId = componentId;
        if (systemId) filter.systemId = systemId;

        const pipeline = [
          {
            $vectorSearch: {
              index: vectorIndexName,
              path: 'embedding',
              queryVector: queryVector,
              numCandidates: 50,
              limit: limit * 2,
              ...(Object.keys(filter).length > 0 ? { filter } : {}),
            },
          },
          {
            $project: {
              id: 1,
              componentId: 1,
              componentName: 1,
              systemId: 1,
              type: 1,
              category: 1,
              content: 1,
              source: 1,
              confidence: 1,
              importance: 1,
              verificationStatus: 1,
              createdDate: 1,
              score: { $meta: 'vectorSearchScore' },
            },
          },
        ];

        const atlasResults = await Memory.aggregate(pipeline);

        if (atlasResults && atlasResults.length > 0) {
          return {
            results: atlasResults.slice(0, limit),
            retrievalMethod: 'MongoDB Atlas $vectorSearch Index',
            indexName: vectorIndexName,
            embeddingModel,
          };
        }
      } catch (atlasError) {
        // If vector index is still building or not yet created, fall back gracefully to in-memory cosine ranking
        console.warn('Atlas $vectorSearch aggregation note (index might be provisioning):', atlasError.message);
      }

      // If Atlas $vectorSearch did not match or failed, calculate vector cosine over MongoDB documents
      const allMongooseMemories = await Memory.find(
        componentId ? { componentId } : {}
      ).lean();

      const scored = allMongooseMemories.map((doc) => {
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
      return {
        ...mem,
        score: similarity,
      };
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
