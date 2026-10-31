import Maintenance from '../models/Maintenance.js';
import Component from '../models/Component.js';
import { inMemoryStore } from '../utils/inMemoryStore.js';
import mongoose from 'mongoose';

export const getMaintenanceLogs = async (req, res) => {
  try {
    const { componentId } = req.query;
    const filter = {};
    if (componentId) filter.componentId = componentId;

    if (mongoose.connection.readyState === 1) {
      const logs = await Maintenance.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(logs);
    }

    let result = inMemoryStore.maintenance;
    if (componentId) result = result.filter((m) => m.componentId === componentId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createMaintenanceLog = async (req, res) => {
  try {
    const data = req.body;
    const id = data.id || `MNT-${Date.now().toString(36).toUpperCase()}`;

    const newLog = {
      ...data,
      id,
      date: data.date || new Date().toISOString().split('T')[0],
      technician: data.technician || req.user?.name || 'K. Gattani',
      outcome: data.outcome || 'Pass',
    };

    if (mongoose.connection.readyState === 1) {
      const created = await Maintenance.create(newLog);
      // Append to component's maintenance history
      if (data.componentId) {
        await Component.findOneAndUpdate(
          { id: data.componentId },
          { $push: { maintenanceHistory: { date: newLog.date, action: newLog.action, technician: newLog.technician, outcome: newLog.outcome } } }
        );
      }
      return res.status(201).json(created);
    }

    inMemoryStore.maintenance.unshift(newLog);
    const comp = inMemoryStore.components.find((c) => c.id === data.componentId);
    if (comp) {
      if (!comp.maintenanceHistory) comp.maintenanceHistory = [];
      comp.maintenanceHistory.unshift({ date: newLog.date, action: newLog.action, technician: newLog.technician, outcome: newLog.outcome });
    }
    return res.status(201).json(newLog);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

