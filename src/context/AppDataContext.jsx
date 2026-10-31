import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import api from '../services/api';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { showToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectChats, setProjectChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState('');
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

  // Fetch initial projects and stats
  const refreshData = async () => {
    try {
      const [healthRes, projRes, memRes, statsRes] = await Promise.allSettled([
        api.get('/api/health'),
        api.get('/api/projects'),
        api.get('/api/memory'),
        api.get('/api/stats'),
      ]);

      if (healthRes.status === 'fulfilled') {
        setBackendStatus({
          connected: healthRes.value.data.database?.connected || false,
          label: healthRes.value.data.database?.label || 'Online',
          aiProvider: healthRes.value.data.aiEngine?.activeProvider,
        });
      }

      if (projRes.status === 'fulfilled' && Array.isArray(projRes.value.data)) {
        setProjects(projRes.value.data);
        if (!selectedProjectId && projRes.value.data.length > 0) {
          setSelectedProjectId(projRes.value.data[0].id);
        }
      }

      if (memRes.status === 'fulfilled' && Array.isArray(memRes.value.data)) {
        setMemories(memRes.value.data);
      }

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data);
      }
    } catch (err) {
      console.warn('Backend sync error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Sync chats whenever the selected project changes
  useEffect(() => {
    if (!selectedProjectId) return;
    const fetchChats = async () => {
      try {
        const res = await api.get(`/api/ai/projects/${selectedProjectId}/chats`);
        setProjectChats(res.data || []);
        if (res.data?.length > 0) {
          setActiveChatId(res.data[0].id);
        } else {
          setActiveChatId('');
        }
      } catch (err) {
        console.warn('Error fetching project chats:', err.message);
      }
    };
    fetchChats();
  }, [selectedProjectId]);

  // Create new project
  const addProject = async (projectData) => {
    try {
      const res = await api.post('/api/projects', projectData);
      setProjects((prev) => [res.data, ...prev]);
      setSelectedProjectId(res.data.id);
      showToast(`Project "${res.data.name}" created successfully.`, 'success');
      refreshData();
      return res.data;
    } catch (err) {
      showToast(`Failed to create project: ${err.message}`, 'error');
      throw err;
    }
  };

  // Create new chat inside a project
  const createChat = async (projectId, title) => {
    try {
      const res = await api.post('/api/ai/chats', { projectId, title });
      setProjectChats((prev) => [res.data, ...prev]);
      setActiveChatId(res.data.id);
      showToast(`New consultation "${res.data.title}" opened.`, 'success');
      return res.data;
    } catch (err) {
      showToast(`Error creating chat: ${err.message}`, 'error');
      throw err;
    }
  };

  // Mark project completed
  const markProjectCompleted = async (projectId) => {
    try {
      const res = await api.patch(`/api/projects/${projectId}`, {
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

  // Upload Document to MongoDB GridFS & Extract Memories
  const uploadDocument = async (projectId, file, chatId = null) => {
    try {
      const formData = new FormData();
      formData.append('projectId', projectId);
      if (chatId) formData.append('chatId', chatId);
      formData.append('file', file);

      const res = await api.post('/api/documents/upload', formData, {
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
      const res = await api.patch(`/api/memory/${memoryId}`, {
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
        selectedProjectId,
        setSelectedProjectId,
        projectChats,
        setProjectChats,
        activeChatId,
        setActiveChatId,
        memories,
        stats,
        isLoading,
        backendStatus,
        refreshData,
        addProject,
        createChat,
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
