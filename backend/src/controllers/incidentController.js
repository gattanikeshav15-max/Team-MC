import Incident from '../models/Incident.js';
import Component from '../models/Component.js';
import MemoryExtractionAgent from '../agents/MemoryExtractionAgent.js';
import IncidentAnalysisAgent from '../agents/IncidentAnalysisAgent.js';
import { inMemoryStore } from '../utils/inMemoryStore.js';
import mongoose from 'mongoose';

export const getIncidents = async (req, res) => {
  try {
    const { severity, status, componentId } = req.query;
    const filter = {};
    if (severity && severity !== 'All') filter.severity = severity;
    if (status && status !== 'All') filter.status = status;
    if (componentId && componentId !== 'All') filter.componentId = componentId;

    if (mongoose.connection.readyState === 1) {
      const incidents = await Incident.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(incidents);
    }

    let result = inMemoryStore.incidents;
    if (severity && severity !== 'All') result = result.filter((i) => i.severity === severity);
    if (status && status !== 'All') result = result.filter((i) => i.status === status);
    if (componentId && componentId !== 'All') result = result.filter((i) => i.componentId === componentId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getIncidentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const incident = await Incident.findOne({ id });
      if (!incident) return res.status(404).json({ success: false, message: `Incident ${id} not found` });
      return res.status(200).json(incident);
    }

    const incident = inMemoryStore.incidents.find((i) => i.id === id);
    if (!incident) return res.status(404).json({ success: false, message: `Incident ${id} not found` });
    return res.status(200).json(incident);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createIncident = async (req, res) => {
  try {
    const incidentData = req.body;
    const incidentId = incidentData.id || `INC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    // Lookup component name
    let componentName = incidentData.componentName || '';
    if (incidentData.componentId) {
      if (mongoose.connection.readyState === 1) {
        const comp = await Component.findOne({ id: incidentData.componentId });
        if (comp) componentName = comp.name;
      } else {
        const comp = inMemoryStore.components.find((c) => c.id === incidentData.componentId);
        if (comp) componentName = comp.name;
      }
    }

    const newIncident = {
      ...incidentData,
      id: incidentId,
      componentName,
      reportedDate: incidentData.reportedDate || new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: incidentData.status || 'Under Investigation',
      outcome: incidentData.outcome || 'Pending engineering root-cause review.',
      assignedEngineer: incidentData.assignedEngineer || req.user?.name || 'Keshav Gattani',
    };

    let savedIncident;
    if (mongoose.connection.readyState === 1) {
      savedIncident = await Incident.create(newIncident);
      // Update component incident count & degradation status
      const newCompStatus = incidentData.severity === 'Critical' ? 'Critical' : incidentData.severity === 'High' ? 'Degraded' : undefined;
      const updateFields = { $inc: { incidentCount: 1 } };
      if (newCompStatus) updateFields.status = newCompStatus;
      await Component.findOneAndUpdate({ id: incidentData.componentId }, updateFields);
    } else {
      inMemoryStore.incidents.unshift(newIncident);
      savedIncident = newIncident;
      const comp = inMemoryStore.components.find((c) => c.id === incidentData.componentId);
      if (comp) {
        comp.incidentCount = (comp.incidentCount || 0) + 1;
        if (incidentData.severity === 'Critical') comp.status = 'Critical';
        else if (incidentData.severity === 'High') comp.status = 'Degraded';
      }
    }

    // Trigger Autonomous VAJRA Agentic Memory Extraction
    let extractedMemory = null;
    try {
      const extractionResult = await MemoryExtractionAgent.extractFromIncident(savedIncident);
      extractedMemory = extractionResult.memory;
    } catch (memErr) {
      console.warn('VAJRA Memory Extraction note:', memErr.message);
    }

    return res.status(201).json({
      success: true,
      incident: savedIncident,
      extractedMemory,
      message: `Incident ${incidentId} recorded and candidate memory extracted.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (mongoose.connection.readyState === 1) {
      const updated = await Incident.findOneAndUpdate({ id }, updateData, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: `Incident ${id} not found` });
      return res.status(200).json(updated);
    }

    const index = inMemoryStore.incidents.findIndex((i) => i.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: `Incident ${id} not found` });

    inMemoryStore.incidents[index] = { ...inMemoryStore.incidents[index], ...updateData };
    return res.status(200).json(inMemoryStore.incidents[index]);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const analyzeIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await IncidentAnalysisAgent.analyzeIncident(id);
    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
