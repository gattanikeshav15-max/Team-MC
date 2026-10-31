import Project from '../models/Project.js';
import Memory from '../models/Memory.js';
import Document from '../models/Document.js';
import mongoose from 'mongoose';

export const getProjects = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const projects = await Project.find().sort({ createdAt: -1 });
      return res.status(200).json(projects);
    }
    return res.status(200).json([]);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const project = await Project.findOne({ id });
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

      const documents = await Document.find({ projectId: id });
      const memories = await Memory.find({ projectId: id }).sort({ createdAt: -1 });

      return res.status(200).json({
        ...project.toObject(),
        documents,
        memories,
      });
    }
    return res.status(404).json({ success: false, message: 'Database disconnected' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const data = req.body;
    const projectId = data.id || `PRJ-${Date.now().toString(36).toUpperCase()}`;

    const newProject = {
      ...data,
      id: projectId,
      createdDate: new Date().toISOString().split('T')[0],
      status: data.status || 'In Progress',
    };

    if (mongoose.connection.readyState === 1) {
      const created = await Project.create(newProject);
      return res.status(201).json(created);
    }

    return res.status(201).json(newProject);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    if (update.status === 'Completed' && !update.completionDate) {
      update.completionDate = new Date().toISOString().split('T')[0];
    }

    if (mongoose.connection.readyState === 1) {
      const updated = await Project.findOneAndUpdate({ id }, update, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Project not found' });
      return res.status(200).json(updated);
    }
    return res.status(404).json({ success: false, message: 'Database disconnected' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      await Project.deleteOne({ id });
      await Document.deleteMany({ projectId: id });
      await Memory.deleteMany({ projectId: id });
      return res.status(200).json({ success: true, message: `Project ${id} removed` });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

