import Conversation from '../models/Conversation.js';
import MemoryRetrievalAgent from '../agents/MemoryRetrievalAgent.js';
import aiService from '../services/aiService.js';
import mongoose from 'mongoose';

export const chat = async (req, res) => {
  try {
    const { message, conversationId, projectId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'projectId is mandatory for every chat.' });
    }

    const convId = conversationId || `conv-${Date.now()}`;
    const userMsgId = `msg-${Date.now()}-u`;
    const vajraMsgId = `msg-${Date.now()}-v`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // 1. Cross-Project Semantic Memory Retrieval
    const retrievalResult = await MemoryRetrievalAgent.retrieve({
      query: message,
      limit: 4,
      minScore: 0.22,
    });

    const retrievedMemories = retrievalResult.results || [];

    // 2. Synthesize Grounded Research Evidence
    const memoryContextText =
      retrievedMemories.length > 0
        ? retrievedMemories
            .map(
              (m, i) =>
                `[Finding ${i + 1}] ID: ${m.id} | Project: ${m.projectName || 'Historical'} (by ${m.teamName || 'Prior Team'})\nCategory: ${m.category} | Source File: ${m.documentName || 'Research Log'} (${m.sourceSection || 'Section'})\nStatus: ${m.verificationStatus} (Confidence: ${m.confidence}%)\nContent: "${m.content}"`
            )
            .join('\n\n')
        : 'NO PREVIOUS RESEARCH EXPERIMENTS FOUND IN VAJRA MEMORY REPOSITORY.';

    const systemPrompt = `You are VAJRA, the AI-powered persistent engineering memory engine of SiliconSentinel.
Your purpose: Enable new research teams to reuse verified findings, avoid repeating failed experiments, and respect technical limitations from previous research projects.

CRITICAL INSTRUCTIONS:
1. Base your answer STRICTLY on the retrieved research findings and documents cited below.
2. If NO relevant research is retrieved, clearly state: "No historical research memories matching this topic are stored in the SiliconSentinel repository." Do NOT fabricate experiments or data.
3. Distinguish VERIFIED findings from UNVERIFIED information.
4. Highlight lessons learned, successful parameters, and specifically warn about failed experiments so the new team doesn't repeat past errors.
5. Always cite the original Project Name, Team, and Document Name for provenance.`;

    const userPromptWithContext = `ENGINEER / RESEARCHER QUERY:
"${message}"

RETRIEVED PREVIOUS RESEARCH MEMORIES:
${memoryContextText}

Synthesize a concise, clear knowledge-transfer answer for the research team:`;

    let generatedText = '';
    let provider = 'VAJRA Grounded Synthesis Engine (Local Evidence)';

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
      try {
        const modelPath = model.startsWith('models/') ? model : `models/${model}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 second fail-fast timeout

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\n${userPromptWithContext}` }],
                },
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 1024,
              },
            }),
          }
        );
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const t = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (t) {
            generatedText = t;
            provider = `Google Gemini (${model})`;
          }
        }
      } catch (err) {
        console.warn('Gemini inference skipped or timed out, using instant local synthesis:', err.message);
      }
    }

    // Grounded synthesis fallback
    if (!generatedText) {
      if (retrievedMemories.length === 0) {
        generatedText = `I searched the SiliconSentinel research repository across all previous projects, but found **no relevant historical research memories** matching your query.

If your team is exploring a new domain, you can upload your initial literature or findings in the **Add Research** tab to establish the first baseline memory.`;
      } else {
        generatedText = `VAJRA retrieved **${retrievedMemories.length} relevant historical research finding(s)** from previous teams:\n\n`;
        retrievedMemories.forEach((mem) => {
          const isVerified = mem.verificationStatus === 'Verified';
          generatedText += `* **${mem.category}** from **${mem.projectName}** (${mem.teamName}):\n  "${mem.content}"\n  - *Source Document:* \`${mem.documentName || 'Document'}\` (${mem.sourceSection || 'Section'})\n  - *Status:* ${mem.verificationStatus} (${isVerified ? 'Confirmed Result' : 'Preliminary Hypothesis'})\n\n`;
        });
        generatedText += `**Recommendation for New Team:** Review the cited source documents before setting experimental parameters.`;
      }
    }

    const userMessage = {
      id: userMsgId,
      sender: 'user',
      timestamp,
      text: message,
      uploadedDocuments: [],
    };

    const vajraMessage = {
      id: vajraMsgId,
      sender: 'vajra',
      timestamp,
      text: generatedText,
      retrievedMemories: retrievedMemories.map((m) => ({
        id: m.id,
        category: m.category,
        content: m.content,
        projectName: m.projectName,
        teamName: m.teamName,
        documentName: m.documentName,
        sourceSection: m.sourceSection,
        verificationStatus: m.verificationStatus,
        confidence: m.confidence,
      })),
      metadata: {
        provider,
        retrievalMethod: retrievalResult.retrievalMethod,
        embeddingModel: retrievalResult.embeddingModel,
      },
    };

    // 3. Save to Conversation Session anchored to Project
    if (mongoose.connection.readyState === 1) {
      let conv = await Conversation.findOne({ id: convId });
      if (!conv) {
        await Conversation.create({
          id: convId,
          projectId,
          userId: req.user?.id || 'usr-default',
          title: message.slice(0, 36) + '...',
          timestamp,
          messages: [userMessage, vajraMessage],
        });
      } else {
        conv.messages.push(userMessage);
        conv.messages.push(vajraMessage);
        await conv.save();
      }
    }

    return res.status(200).json({
      success: true,
      conversationId: convId,
      projectId,
      userMessage,
      vajraMessage,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/ai/projects/:projectId/chats
 * Reopen previous chats for a specific project
 */
export const getProjectChats = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (mongoose.connection.readyState === 1) {
      const chats = await Conversation.find({ projectId }).sort({ updatedAt: -1 });
      return res.status(200).json(chats);
    }
    return res.status(200).json([]);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createChat = async (req, res) => {
  try {
    const { projectId, title } = req.body;
    if (!projectId) {
      return res.status(400).json({ success: false, message: 'projectId is required' });
    }

    const chatId = `chat-${Date.now().toString(36)}`;
    const newChat = await Conversation.create({
      id: chatId,
      projectId,
      title: title || 'New Research Consultation',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      messages: [
        {
          id: `msg-${Date.now()}-welcome`,
          sender: 'vajra',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          text: `Welcome! This is a dedicated consultation thread for project **${projectId}**.\n\nAsk questions about previous research findings, thermal boundaries, or upload new files here.`,
          retrievedMemories: [],
          uploadedDocuments: [],
        },
      ],
    });

    return res.status(201).json(newChat);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const conv = await Conversation.findOne({ id });
      if (!conv) return res.status(404).json({ success: false, message: 'Chat not found' });
      return res.status(200).json(conv);
    }
    return res.status(404).json({ success: false, message: 'Not found' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
