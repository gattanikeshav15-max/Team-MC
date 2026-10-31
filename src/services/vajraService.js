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
    } catch (error) {
      return { success: false, error: error.message, source: 'mock' };
    }
  },

  async submitFeedback(messageId, feedbackType, conversationId) {
    try {
      const response = await api.post('/api/ai/feedback', {
        messageId,
        feedbackType,
        conversationId,
      });
      return { success: true, data: response.data, source: 'backend' };
    } catch (error) {
      return { success: false, error: error.message, source: 'mock' };
    }
  },

  async getConversations() {
    try {
      const response = await api.get('/api/ai/conversations');
      return { success: true, data: response.data, source: 'backend' };
    } catch (error) {
      return { success: false, error: error.message, source: 'mock' };
    }
  },
};

export default vajraService;
