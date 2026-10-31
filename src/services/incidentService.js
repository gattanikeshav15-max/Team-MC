import api from './api';

export const incidentService = {
  async getIncidents() {
    try {
      const response = await api.get('/api/incidents');
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  },

  async getIncidentById(id) {
    try {
      const response = await api.get(`/api/incidents/${id}`);
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  },

  async createIncident(incidentData) {
    try {
      const response = await api.post('/api/incidents', incidentData);
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  },

  async recordMaintenance(maintenanceData) {
    try {
      const response = await api.post('/api/maintenance', maintenanceData);
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  }
};
