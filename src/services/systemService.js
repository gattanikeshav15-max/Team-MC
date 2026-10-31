import api from './api';

export const systemService = {
  async getSystems() {
    try {
      const response = await api.get('/api/systems');
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  },

  async createSystem(systemData) {
    try {
      const response = await api.post('/api/systems', systemData);
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  },

  async getSystemById(id) {
    try {
      const response = await api.get(`/api/systems/${id}`);
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  },

  async updateSystem(id, updateData) {
    try {
      const response = await api.put(`/api/systems/${id}`, updateData);
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  },

  async deleteSystem(id) {
    try {
      await api.delete(`/api/systems/${id}`);
      return { success: true, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  }
};

