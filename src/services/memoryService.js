import api from './api';

export const memoryService = {
  async getMemories(filterParams = {}) {
    try {
      const response = await api.get('/api/memory', { params: filterParams });
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  },

  async searchMemories(query, vectorParams = {}) {
    try {
      const response = await api.post('/api/memory/search', { query, ...vectorParams });
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  },

  async extractMemoryFromIncident(incidentId) {
    try {
      const response = await api.post('/api/memory/extract', { incidentId });
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  },

  async updateMemory(id, patchData) {
    try {
      const response = await api.patch(`/api/memory/${id}`, patchData);
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  },

  async deleteMemory(id) {
    try {
      await api.delete(`/api/memory/${id}`);
      return { success: true, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  }
};
