import System from '../models/System.js';
import { inMemoryStore } from '../utils/inMemoryStore.js';
import mongoose from 'mongoose';

export const getSystems = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const systems = await System.find().sort({ createdAt: -1 });
      return res.status(200).json(systems);
    }
    return res.status(200).json(inMemoryStore.systems);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSystemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const system = await System.findOne({ id });
      if (!system) return res.status(404).json({ success: false, message: `System ${id} not found` });
      return res.status(200).json(system);
    }

    const system = inMemoryStore.systems.find((s) => s.id === id);
    if (!system) return res.status(404).json({ success: false, message: `System ${id} not found` });
    return res.status(200).json(system);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createSystem = async (req, res) => {
  try {
    const systemData = req.body;
    const systemId = systemData.id || `SYS-${Date.now().toString(36).toUpperCase()}`;

    const newSystem = {
      ...systemData,
      id: systemId,
      componentCount: Number(systemData.componentCount) || 0,
      reliabilityScore: Number(systemData.reliabilityScore) || 98.0,
      registrationDate: systemData.registrationDate || new Date().toISOString().split('T')[0],
      status: systemData.status || 'Nominal',
    };

    if (mongoose.connection.readyState === 1) {
      const created = await System.create(newSystem);
      return res.status(201).json(created);
    }

    inMemoryStore.systems.unshift(newSystem);
    return res.status(201).json(newSystem);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSystem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (mongoose.connection.readyState === 1) {
      const updated = await System.findOneAndUpdate({ id }, updateData, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: `System ${id} not found` });
      return res.status(200).json(updated);
    }

    const index = inMemoryStore.systems.findIndex((s) => s.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: `System ${id} not found` });

    inMemoryStore.systems[index] = { ...inMemoryStore.systems[index], ...updateData };
    return res.status(200).json(inMemoryStore.systems[index]);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSystem = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const result = await System.deleteOne({ id });
      if (result.deletedCount === 0) return res.status(404).json({ success: false, message: `System ${id} not found` });
      return res.status(200).json({ success: true, message: `System ${id} deleted` });
    }

    const index = inMemoryStore.systems.findIndex((s) => s.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: `System ${id} not found` });

    inMemoryStore.systems.splice(index, 1);
    return res.status(200).json({ success: true, message: `System ${id} deleted` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

