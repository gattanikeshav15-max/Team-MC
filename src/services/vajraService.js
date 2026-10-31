import api from './api';

export const vajraService = {
  async sendChatMessage(message, conversationId, contextData = {}) {
    try {
      const response = await api.post('/api/ai/chat', {
        message,
        conversationId,
        context: contextData,
      });
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  },

  async submitFeedback(messageId, feedbackType) {
    try {
      const response = await api.post('/api/ai/feedback', { messageId, feedbackType });
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      return { success: false, source: 'mock' };
    }
  }
};
