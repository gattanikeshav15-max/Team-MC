import Memory from '../models/Memory.js';
import Component from '../models/Component.js';
import embeddingService from '../services/embeddingService.js';
import { inMemoryStore } from '../utils/inMemoryStore.js';
import mongoose from 'mongoose';

export class MemoryExtractionAgent {
  /**
   * Autonomous Memory Extraction from Incident or Engineering Telemetry
   */
  static async extractFromIncident(incidentData) {
    const componentId = incidentData.componentId;
    let component = null;

    if (mongoose.connection.readyState === 1) {
      component = await Component.findOne({ id: componentId });
    } else {
      component = inMemoryStore.components.find((c) => c.id === componentId);
    }

    const componentName = component ? component.name : incidentData.componentName || 'Semiconductor Part';

    // 1. Classify Category based on Failure Mode & Symptoms
    let memoryType = 'Observation Memory';
    let importance = 'Medium';
    let confidence = 82;

    const symptomsLower = (incidentData.symptoms || '').toLowerCase();
    const titleLower = (incidentData.title || '').toLowerCase();
    const descLower = (incidentData.description || '').toLowerCase();
    const combined = `${symptomsLower} ${titleLower} ${descLower}`;

    if (incidentData.severity === 'Critical' || combined.includes('latchup') || combined.includes('sel') || combined.includes('breakdown')) {
      memoryType = 'Failure Memory';
      importance = 'Critical';
      confidence = 94;
    } else if (combined.includes('moisture') || combined.includes('vacuum') || combined.includes('cryo') || combined.includes('radiation') || combined.includes('thermal')) {
      memoryType = 'Environmental Memory';
      importance = 'High';
      confidence = 88;
    } else if (combined.includes('snubber') || combined.includes('capacitor') || combined.includes('mitigation') || combined.includes('derating')) {
      memoryType = 'Decision Memory';
      importance = 'High';
      confidence = 91;
    }

    // 2. Synthesize concise factual heuristic content
    const memoryContent = `Anomaly on ${componentName} (${componentId}): ${incidentData.title}. Telemetry signature: ${incidentData.symptoms || 'None recorded'}. Operational conditions: ${incidentData.environmentalConditions || 'Standard'}. Circuit outcome: ${incidentData.outcome || incidentData.description}`;

    // 3. Generate Vector Embedding
    const { embedding } = await embeddingService.generateEmbedding(
      `${componentName} ${componentId} ${memoryType} ${memoryContent}`
    );

    const memoryId = `MEM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newMemoryDoc = {
      id: memoryId,
      componentId,
      componentName,
      systemId: incidentData.systemId || component?.systemId || '',
      type: memoryType,
      category: memoryType,
      content: memoryContent,
      sourceType: 'Incident',
      sourceId: incidentData.id,
      source: `${incidentData.id} / Autonomous VAJRA Extraction`,
      confidence,
      importance,
      verificationStatus: 'Unverified', // Crucial rule: new autonomous extractions begin as Unverified
      embedding,
      tags: [incidentData.severity, memoryType.replace(' Memory', ''), 'Autonomous-Extraction'],
      verifiedBy: 'Pending Peer Review',
      notes: `Extracted automatically from ${incidentData.id}. Requires Level-3 engineer verification before flight certification.`,
      correctionAuditTrail: [],
      createdDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    // 4. Check for duplicate memory
    let savedMemory;
    if (mongoose.connection.readyState === 1) {
      const existing = await Memory.findOne({
        componentId,
        sourceId: incidentData.id,
      });

      if (existing) {
        return { memory: existing, isDuplicate: true };
      }

      savedMemory = await Memory.create(newMemoryDoc);
    } else {
      const existing = inMemoryStore.memories.find(
        (m) => m.componentId === componentId && m.sourceId === incidentData.id
      );
      if (existing) {
        return { memory: existing, isDuplicate: true };
      }
      inMemoryStore.memories.unshift(newMemoryDoc);
      savedMemory = newMemoryDoc;
    }

    return { memory: savedMemory, isDuplicate: false };
  }
}

export default MemoryExtractionAgent;
