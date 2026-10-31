import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import axios from 'axios';

const AppDataContext = createContext(null);

const API_BASE = 'http://localhost:5000/api';

export function AppDataProvider({ children }) {
  const { showToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [memories, setMemories] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    totalDocuments: 0,
    totalMemories: 0,
    verifiedMemories: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    label: 'Connecting to MongoDB...',
  });

  // Fetch initial data from backend
  const refreshData = async () => {
    try {
      const [healthRes, projRes, memRes, statsRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/health`),
        axios.get(`${API_BASE}/projects`),
        axios.get(`${API_BASE}/memory`),
        axios.get(`${API_BASE}/stats`),
      ]);

      if (healthRes.status === 'fulfilled') {
        setBackendStatus({
          connected: healthRes.value.data.database?.connected || false,
          label: healthRes.value.data.database?.label || 'Online',
          aiProvider: healthRes.value.data.aiEngine?.activeProvider,
        });
      }

      if (projRes.status === 'fulfilled') {
        setProjects(projRes.value.data || []);
      }

      if (memRes.status === 'fulfilled') {
        setMemories(memRes.value.data || []);
      }

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data);
      }
    } catch (err) {
      console.warn('Backend sync warning:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Add new research project
  const addProject = async (projectData) => {
    try {
      const res = await axios.post(`${API_BASE}/projects`, projectData);
      setProjects((prev) => [res.data, ...prev]);
      showToast(`Project "${res.data.name}" created successfully.`, 'success');
      refreshData();
      return res.data;
    } catch (err) {
      showToast(`Failed to create project: ${err.message}`, 'error');
      throw err;
    }
  };

  // Mark project completed
  const markProjectCompleted = async (projectId) => {
    try {
      const res = await axios.patch(`${API_BASE}/projects/${projectId}`, {
        status: 'Completed',
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? res.data : p))
      );
      showToast('Project marked as Completed! Knowledge is now reusable.', 'success');
      refreshData();
    } catch (err) {
      showToast(`Error updating project: ${err.message}`, 'error');
    }
  };

  // Upload Document & Extract Memories
  const uploadDocument = async (projectId, file) => {
    try {
      const formData = new FormData();
      formData.append('projectId', projectId);
      formData.append('file', file);

      const res = await axios.post(`${API_BASE}/documents/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showToast(res.data.message || 'Document uploaded and memories extracted.', 'success');
      refreshData();
      return res.data;
    } catch (err) {
      showToast(`Upload failed: ${err.response?.data?.message || err.message}`, 'error');
      throw err;
    }
  };

  // Verify memory finding
  const verifyMemory = async (memoryId) => {
    try {
      const res = await axios.patch(`${API_BASE}/memory/${memoryId}`, {
        verificationStatus: 'Verified',
      });
      setMemories((prev) =>
        prev.map((m) => (m.id === memoryId ? res.data.memory : m))
      );
      showToast('Research finding confirmed and marked as Verified.', 'success');
      refreshData();
    } catch (err) {
      showToast(`Error updating memory: ${err.message}`, 'error');
    }
  };

  return (
    <AppDataContext.Provider
      value={{
        projects,
        memories,
        stats,
        isLoading,
        backendStatus,
        refreshData,
        addProject,
        markProjectCompleted,
        uploadDocument,
        verifyMemory,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
