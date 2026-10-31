import Incident from '../models/Incident.js';
import Memory from '../models/Memory.js';
import Component from '../models/Component.js';
import { inMemoryStore } from '../utils/inMemoryStore.js';
import mongoose from 'mongoose';

export class IncidentAnalysisAgent {
  /**
   * Correlates an incident against historical failure memories & telemetry
   */
  static async analyzeIncident(incidentId) {
    let incident = null;
    let component = null;
    let allIncidents = [];
    let relatedMemories = [];

    if (mongoose.connection.readyState === 1) {
      incident = await Incident.findOne({ id: incidentId });
      if (incident) {
        component = await Component.findOne({ id: incident.componentId });
        allIncidents = await Incident.find({ id: { $ne: incidentId } }).lean();
        relatedMemories = await Memory.find({ componentId: incident.componentId }).lean();
      }
    } else {
      incident = inMemoryStore.incidents.find((i) => i.id === incidentId);
      if (incident) {
        component = inMemoryStore.components.find((c) => c.id === incident.componentId);
        allIncidents = inMemoryStore.incidents.filter((i) => i.id !== incidentId);
        relatedMemories = inMemoryStore.memories.filter((m) => m.componentId === incident.componentId);
      }
    }

    if (!incident) {
      throw new Error(`Incident ${incidentId} not found`);
    }

    // Search similar incidents by symptom keywords
    const keywords = (incident.symptoms || incident.title).toLowerCase().split(' ').filter((w) => w.length > 3);
    const similarIncidents = allIncidents.filter((other) => {
      const otherText = `${other.title} ${other.symptoms} ${other.description}`.toLowerCase();
      return keywords.some((k) => otherText.includes(k));
    });

    const isCritical = incident.severity === 'Critical';
    const hasLatchup = incident.symptoms?.toLowerCase().includes('latchup') || incident.title?.toLowerCase().includes('latchup');

    return {
      incidentId: incident.id,
      component: component ? { id: component.id, name: component.name, status: component.status } : null,
      riskLevel: isCritical ? 'Critical Mission Threat' : 'Elevated Anomaly',
      symptomAnalysis: {
        hasLatchupSignature: hasLatchup,
        thermalRelated: incident.environmentalConditions?.toLowerCase().includes('thermal') || incident.environmentalConditions?.toLowerCase().includes('temp'),
        radiationRelated: incident.environmentalConditions?.toLowerCase().includes('radiation') || incident.environmentalConditions?.toLowerCase().includes('flare'),
      },
      similarHistoricalIncidentsCount: similarIncidents.length,
      similarIncidents: similarIncidents.slice(0, 3).map((s) => ({
        id: s.id,
        title: s.title,
        severity: s.severity,
        outcome: s.outcome,
      })),
      correlatedEngineeringMemoriesCount: relatedMemories.length,
      groundedMemories: relatedMemories.slice(0, 3),
      recommendedMitigation: hasLatchup
        ? 'Enforce hardware crowbar current trip ceiling and accelerate SEU scrub interval to 50ms.'
        : 'Inspect thermal boundary conductivity and verify negative gate-source ringing voltage.',
    };
  }
}

export default IncidentAnalysisAgent;

