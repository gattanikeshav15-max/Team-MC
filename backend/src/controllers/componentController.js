import Component from '../models/Component.js';
import System from '../models/System.js';
import { inMemoryStore } from '../utils/inMemoryStore.js';
import mongoose from 'mongoose';

export const getComponents = async (req, res) => {
  try {
    const { category, systemId, status } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (systemId && systemId !== 'All') filter.systemId = systemId;
    if (status && status !== 'All') filter.status = status;

    if (mongoose.connection.readyState === 1) {
      const components = await Component.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(components);
    }

    let result = inMemoryStore.components;
    if (category && category !== 'All') result = result.filter((c) => c.category === category);
    if (systemId && systemId !== 'All') result = result.filter((c) => c.systemId === systemId);
    if (status && status !== 'All') result = result.filter((c) => c.status === status);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getComponentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const component = await Component.findOne({ id });
      if (!component) return res.status(404).json({ success: false, message: `Component ${id} not found` });
      return res.status(200).json(component);
    }

    const component = inMemoryStore.components.find((c) => c.id === id);
    if (!component) return res.status(404).json({ success: false, message: `Component ${id} not found` });
    return res.status(200).json(component);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createComponent = async (req, res) => {
  try {
    const compData = req.body;
    const compId = compData.id || `CMP-${Date.now().toString(36).toUpperCase()}`;

    // Lookup associated system name
    let systemName = compData.systemName || '';
    if (compData.systemId) {
      if (mongoose.connection.readyState === 1) {
        const sys = await System.findOne({ id: compData.systemId });
        if (sys) systemName = sys.name;
      } else {
        const sys = inMemoryStore.systems.find((s) => s.id === compData.systemId);
        if (sys) systemName = sys.name;
      }
    }

    const newComponent = {
      ...compData,
      id: compId,
      systemName,
      incidentCount: 0,
      mtbfHours: Number(compData.mtbfHours) || 500000,
      status: compData.status || 'Nominal',
      maintenanceHistory: compData.maintenanceHistory || [],
    };

    if (mongoose.connection.readyState === 1) {
      const created = await Component.create(newComponent);
      // Increment component count on system
      if (compData.systemId) {
        await System.findOneAndUpdate({ id: compData.systemId }, { $inc: { componentCount: 1 } });
      }
      return res.status(201).json(created);
    }

    inMemoryStore.components.unshift(newComponent);
    if (compData.systemId) {
      const sys = inMemoryStore.systems.find((s) => s.id === compData.systemId);
      if (sys) sys.componentCount = (sys.componentCount || 0) + 1;
    }
    return res.status(201).json(newComponent);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (mongoose.connection.readyState === 1) {
      const updated = await Component.findOneAndUpdate({ id }, updateData, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: `Component ${id} not found` });
      return res.status(200).json(updated);
    }

    const index = inMemoryStore.components.findIndex((c) => c.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: `Component ${id} not found` });

    inMemoryStore.components[index] = { ...inMemoryStore.components[index], ...updateData };
    return res.status(200).json(inMemoryStore.components[index]);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteComponent = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const result = await Component.deleteOne({ id });
      if (result.deletedCount === 0) return res.status(404).json({ success: false, message: `Component ${id} not found` });
      return res.status(200).json({ success: true, message: `Component ${id} deleted` });
    }

    const index = inMemoryStore.components.findIndex((c) => c.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: `Component ${id} not found` });

    inMemoryStore.components.splice(index, 1);
    return res.status(200).json({ success: true, message: `Component ${id} deleted` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

