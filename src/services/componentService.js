import api from './api';

export const componentService = {
  async getComponents() {
    try {
      const response = await api.get('/api/components');
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  },

  async getComponentById(id) {
    try {
      const response = await api.get(`/api/components/${id}`);
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  },

  async createComponent(componentData) {
    try {
      const response = await api.post('/api/components', componentData);
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  },

  async updateComponent(id, updateData) {
    try {
      const response = await api.put(`/api/components/${id}`, updateData);
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  },

  async deleteComponent(id) {
    try {
      await api.delete(`/api/components/${id}`);
      return { success: true, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  }
};
