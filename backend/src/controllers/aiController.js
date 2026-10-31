import Conversation from '../models/Conversation.js';
import Component from '../models/Component.js';
import System from '../models/System.js';
import MemoryRetrievalAgent from '../agents/MemoryRetrievalAgent.js';
import aiService from '../services/aiService.js';
import { inMemoryStore } from '../utils/inMemoryStore.js';
import mongoose from 'mongoose';

export const chat = async (req, res) => {
  try {
    const { message, conversationId, context = {} } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    const convId = conversationId || `conv-${Date.now()}`;
    const userMsgId = `msg-${Date.now()}-u`;
    const vajraMsgId = `msg-${Date.now()}-v`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // 1. Identify Component or System matches in query
    let componentMatch = null;
    let systemMatch = null;
    const lowerText = message.toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const allComps = await Component.find().lean();
      componentMatch = allComps.find(
        (c) => lowerText.includes(c.id.toLowerCase()) || lowerText.includes(c.name.toLowerCase()) || (c.partNumber && lowerText.includes(c.partNumber.toLowerCase()))
      );

      const allSys = await System.find().lean();
      systemMatch = allSys.find(
        (s) => lowerText.includes(s.id.toLowerCase()) || lowerText.includes(s.name.toLowerCase())
      );
    } else {
      componentMatch = inMemoryStore.components.find(
        (c) => lowerText.includes(c.id.toLowerCase()) || lowerText.includes(c.name.toLowerCase()) || (c.partNumber && lowerText.includes(c.partNumber.toLowerCase()))
      );
      systemMatch = inMemoryStore.systems.find(
        (s) => lowerText.includes(s.id.toLowerCase()) || lowerText.includes(s.name.toLowerCase())
      );
    }

    // 2. Semantic Memory Retrieval via Atlas Vector Search
    const retrievalResult = await MemoryRetrievalAgent.retrieve({
      query: message,
      componentId: componentMatch ? componentMatch.id : null,
      systemId: systemMatch ? systemMatch.id : null,
      limit: 3,
      minScore: 0.35,
    });

    const retrievedMemories = retrievalResult.results || [];

    // 3. Grounded AI Reasoning & Context Synthesis
    const aiOutput = await aiService.generateResponse({
      userQuery: message,
      retrievedMemories,
      componentMatch,
      systemMatch,
    });

    const userMessage = {
      id: userMsgId,
      sender: 'user',
      timestamp,
      text: message,
    };

    const vajraMessage = {
      id: vajraMsgId,
      sender: 'vajra',
      timestamp,
      text: aiOutput.text,
      retrievedMemories: retrievedMemories.map((m) => ({
        id: m.id,
        componentId: m.componentId,
        componentName: m.componentName,
        type: m.type,
        content: m.content,
        confidence: m.confidence,
        verificationStatus: m.verificationStatus,
        source: m.source,
      })),
      feedback: null,
      metadata: {
        provider: aiOutput.provider,
        retrievalMethod: retrievalResult.retrievalMethod,
        embeddingModel: retrievalResult.embeddingModel,
      },
    };

    // 4. Save to Conversation Session
    if (mongoose.connection.readyState === 1) {
      let conv = await Conversation.findOne({ id: convId });
      if (!conv) {
        conv = await Conversation.create({
          id: convId,
          userId: req.user?.id || 'usr-default',
          title: componentMatch ? `${componentMatch.name} Analysis` : message.slice(0, 36) + '...',
          timestamp,
          messages: [userMessage, vajraMessage],
        });
      } else {
        conv.messages.push(userMessage);
        conv.messages.push(vajraMessage);
        await conv.save();
      }
    } else {
      let conv = inMemoryStore.conversations.find((c) => c.id === convId);
      if (!conv) {
        conv = {
          id: convId,
          title: componentMatch ? `${componentMatch.name} Analysis` : message.slice(0, 36) + '...',
          timestamp,
          messages: [userMessage, vajraMessage],
        };
        inMemoryStore.conversations.unshift(conv);
      } else {
        conv.messages.push(userMessage);
        conv.messages.push(vajraMessage);
      }
    }

    return res.status(200).json({
      success: true,
      conversationId: convId,
      userMessage,
      vajraMessage,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const convs = await Conversation.find().sort({ updatedAt: -1 });
      return res.status(200).json(convs);
    }
    return res.status(200).json(inMemoryStore.conversations);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const conv = await Conversation.findOne({ id });
      if (!conv) return res.status(404).json({ success: false, message: `Conversation ${id} not found` });
      return res.status(200).json(conv);
    }

    const conv = inMemoryStore.conversations.find((c) => c.id === id);
    if (!conv) return res.status(404).json({ success: false, message: `Conversation ${id} not found` });
    return res.status(200).json(conv);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { conversationId, messageId, feedbackType } = req.body;

    if (!messageId || !feedbackType) {
      return res.status(400).json({ success: false, message: 'messageId and feedbackType are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const conv = await Conversation.findOne({
        ...(conversationId ? { id: conversationId } : { 'messages.id': messageId }),
      });

      if (conv) {
        const msg = conv.messages.find((m) => m.id === messageId);
        if (msg) {
          msg.feedback = feedbackType;
          await conv.save();
        }
      }
    } else {
      inMemoryStore.conversations.forEach((conv) => {
        const msg = conv.messages.find((m) => m.id === messageId);
        if (msg) msg.feedback = feedbackType;
      });
    }

    return res.status(200).json({
      success: true,
      message: `Feedback '${feedbackType}' logged for alignment.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
