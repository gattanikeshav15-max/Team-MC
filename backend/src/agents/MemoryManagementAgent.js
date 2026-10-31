import Memory from '../models/Memory.js';
import embeddingService from '../services/embeddingService.js';
import { inMemoryStore } from '../utils/inMemoryStore.js';
import mongoose from 'mongoose';

export class MemoryManagementAgent {
  /**
   * Verify Memory as Confirmed Engineering Fact
   */
  static async verify(memoryId, engineerName = 'Keshav Gattani') {
    const timestamp = new Date().toISOString().split('T')[0];
    const auditNote = `[Verified by ${engineerName} on ${timestamp}]`;

    if (mongoose.connection.readyState === 1) {
      const memory = await Memory.findOne({ id: memoryId });
      if (!memory) throw new Error(`Memory ${memoryId} not found`);

      memory.verificationStatus = 'Verified';
      memory.verifiedBy = engineerName;
      memory.notes = `${memory.notes || ''} ${auditNote}`.trim();
      await memory.save();
      return memory;
    } else {
      const memory = inMemoryStore.memories.find((m) => m.id === memoryId);
      if (!memory) throw new Error(`Memory ${memoryId} not found`);

      memory.verificationStatus = 'Verified';
      memory.verifiedBy = engineerName;
      memory.notes = `${memory.notes || ''} ${auditNote}`.trim();
      return memory;
    }
  }

  /**
   * Mark Memory as Unverified Assumption
   */
  static async unverify(memoryId) {
    if (mongoose.connection.readyState === 1) {
      const memory = await Memory.findOne({ id: memoryId });
      if (!memory) throw new Error(`Memory ${memoryId} not found`);

      memory.verificationStatus = 'Unverified';
      memory.verifiedBy = 'Pending Peer Review';
      await memory.save();
      return memory;
    } else {
      const memory = inMemoryStore.memories.find((m) => m.id === memoryId);
      if (!memory) throw new Error(`Memory ${memoryId} not found`);

      memory.verificationStatus = 'Unverified';
      memory.verifiedBy = 'Pending Peer Review';
      return memory;
    }
  }

  /**
   * Apply Technical Correction with Immutable Audit Trail
   */
  static async correct(memoryId, { newContent, reason, engineerName = 'Keshav Gattani' }) {
    if (!newContent) throw new Error('New content is required for correction');

    // Recompute embedding for the corrected knowledge
    const { embedding } = await embeddingService.generateEmbedding(newContent);
    const timestamp = new Date().toISOString();

    const auditEntry = {
      previousContent: '',
      reason: reason || 'Technical heuristic precision correction applied',
      correctedBy: engineerName,
      timestamp,
    };

    if (mongoose.connection.readyState === 1) {
      const memory = await Memory.findOne({ id: memoryId });
      if (!memory) throw new Error(`Memory ${memoryId} not found`);

      auditEntry.previousContent = memory.content;
      memory.content = newContent;
      memory.verificationStatus = 'Corrected';
      memory.verifiedBy = engineerName;
      memory.embedding = embedding;
      memory.notes = `${memory.notes || ''} [Corrected on ${timestamp.split('T')[0]}: ${reason}]`.trim();
      memory.correctionAuditTrail.push(auditEntry);

      await memory.save();
      return memory;
    } else {
      const memory = inMemoryStore.memories.find((m) => m.id === memoryId);
      if (!memory) throw new Error(`Memory ${memoryId} not found`);

      auditEntry.previousContent = memory.content;
      memory.content = newContent;
      memory.verificationStatus = 'Corrected';
      memory.verifiedBy = engineerName;
      memory.embedding = embedding;
      memory.notes = `${memory.notes || ''} [Corrected on ${timestamp.split('T')[0]}: ${reason}]`.trim();
      if (!memory.correctionAuditTrail) memory.correctionAuditTrail = [];
      memory.correctionAuditTrail.push(auditEntry);

      return memory;
    }
  }

  /**
   * Archive Memory
   */
  static async archive(memoryId) {
    if (mongoose.connection.readyState === 1) {
      const memory = await Memory.findOne({ id: memoryId });
      if (!memory) throw new Error(`Memory ${memoryId} not found`);

      memory.verificationStatus = 'Archived';
      await memory.save();
      return memory;
    } else {
      const memory = inMemoryStore.memories.find((m) => m.id === memoryId);
      if (!memory) throw new Error(`Memory ${memoryId} not found`);

      memory.verificationStatus = 'Archived';
      return memory;
    }
  }

  /**
   * Delete Memory from Persistent Store
   */
  static async delete(memoryId) {
    if (mongoose.connection.readyState === 1) {
      const result = await Memory.deleteOne({ id: memoryId });
      if (result.deletedCount === 0) throw new Error(`Memory ${memoryId} not found`);
      return { success: true, id: memoryId };
    } else {
      const idx = inMemoryStore.memories.findIndex((m) => m.id === memoryId);
      if (idx === -1) throw new Error(`Memory ${memoryId} not found`);
      inMemoryStore.memories.splice(idx, 1);
      return { success: true, id: memoryId };
    }
  }
}

export default MemoryManagementAgent;
