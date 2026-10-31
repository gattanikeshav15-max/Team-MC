import Memory from '../models/Memory.js';
import Project from '../models/Project.js';
import Document from '../models/Document.js';
import Conversation from '../models/Conversation.js';
import embeddingService from '../services/embeddingService.js';
import documentProcessingService from '../services/documentProcessingService.js';
import mongoose from 'mongoose';

export class MemoryExtractionAgent {
  /**
   * Extract research memories from an uploaded document buffer or path
   */
  static async extractFromDocument({
    documentId,
    fileBuffer,
    fileType,
    originalFilename,
    projectId,
    chatId = null,
  }) {
    // 1. Fetch Project Details
    let project = null;
    if (mongoose.connection.readyState === 1) {
      project = await Project.findOne({ id: projectId });
    }

    const projectName = project ? project.name : 'Semiconductor Research';
    const teamName = project ? project.teamName : 'Team Alpha';

    // 2. Extract Plain Text
    const fullText = await documentProcessingService.extractText(fileBuffer, fileType, originalFilename);
    const chunks = documentProcessingService.chunkText(fullText);

    const extractedMemories = [];

    // 3. Process each chunk into structured research findings
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const findings = this.classifyChunkContent(chunk.text, chunk.section);

      for (const finding of findings) {
        const memoryId = `MEM-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

        // Generate vector embedding
        const { embedding } = await embeddingService.generateEmbedding(
          `${finding.category}: ${finding.content} | Context: ${projectName} ${teamName}`
        );

        const memoryDoc = {
          id: memoryId,
          projectId,
          projectName,
          teamName,
          chatId: chatId || '',
          documentId,
          documentName: originalFilename,
          category: finding.category,
          content: finding.content,
          sourceSection: chunk.section || `Section ${i + 1}`,
          verificationStatus: finding.confidence > 90 ? 'Verified' : 'Unverified',
          confidence: finding.confidence,
          embedding,
          tags: [finding.category, teamName, pathSafe(projectName)],
          verifiedBy: 'Pending Peer Review',
          createdDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };

        if (mongoose.connection.readyState === 1) {
          const saved = await Memory.create(memoryDoc);
          extractedMemories.push(saved);
        } else {
          extractedMemories.push(memoryDoc);
        }
      }
    }

    // 4. Update Document extracted count
    if (mongoose.connection.readyState === 1) {
      await Document.findOneAndUpdate(
        { id: documentId },
        {
          processingStatus: 'Extracted',
          extractedMemoriesCount: extractedMemories.length,
        }
      );

      // If document was uploaded inside a chat, register it in the chat session
      if (chatId) {
        await Conversation.findOneAndUpdate(
          { id: chatId },
          {
            $push: {
              'messages.$[last].uploadedDocuments': {
                id: documentId,
                filename: originalFilename,
                extractedCount: extractedMemories.length,
              },
            },
          },
          {
            arrayFilters: [{ 'last.id': { $exists: true } }],
          }
        );
      }
    }

    return extractedMemories;
  }

  /**
   * Deterministic Semantic Rule-Based & Keyword Research Classifier
   */
  static classifyChunkContent(text, defaultSection = 'Research Summary') {
    const findings = [];
    const lower = text.toLowerCase();
    const sentences = text.split(/(?<=[.?!])\s+/).filter((s) => s.trim().length > 25);

    for (const sent of sentences) {
      const sLower = sent.toLowerCase();

      // Successful Experiment
      if (
        sLower.includes('achieved') ||
        sLower.includes('successful') ||
        sLower.includes('confirmed that') ||
        sLower.includes('demonstrated') ||
        sLower.includes('passed all') ||
        sLower.includes('optimal result')
      ) {
        findings.push({
          category: 'Successful Experiment',
          content: sent.trim(),
          confidence: 94,
        });
      }
      // Failed Experiment
      else if (
        sLower.includes('failed') ||
        sLower.includes('breakdown') ||
        sLower.includes('thermal runaway') ||
        sLower.includes('degradation') ||
        sLower.includes('did not meet') ||
        sLower.includes('damage') ||
        sLower.includes('latchup')
      ) {
        findings.push({
          category: 'Failed Experiment',
          content: sent.trim(),
          confidence: 95,
        });
      }
      // Technical Limitation
      else if (
        sLower.includes('limited to') ||
        sLower.includes('maximum boundary') ||
        sLower.includes('cannot exceed') ||
        sLower.includes('restricted by') ||
        sLower.includes('bottleneck')
      ) {
        findings.push({
          category: 'Technical Limitation',
          content: sent.trim(),
          confidence: 90,
        });
      }
      // Engineering Decision
      else if (
        sLower.includes('we decided') ||
        sLower.includes('selected') ||
        sLower.includes('adopted') ||
        sLower.includes('standardized on') ||
        sLower.includes('mandated')
      ) {
        findings.push({
          category: 'Engineering Decision',
          content: sent.trim(),
          confidence: 92,
        });
      }
      // Lesson Learned
      else if (
        sLower.includes('lesson') ||
        sLower.includes('recommend') ||
        sLower.includes('in future') ||
        sLower.includes('must ensure') ||
        sLower.includes('crucial that')
      ) {
        findings.push({
          category: 'Lesson Learned',
          content: sent.trim(),
          confidence: 88,
        });
      }
      // Unresolved Question
      else if (
        sLower.includes('unclear') ||
        sLower.includes('requires further') ||
        sLower.includes('unknown') ||
        sLower.includes('open question') ||
        sLower.includes('to be investigated')
      ) {
        findings.push({
          category: 'Unresolved Question',
          content: sent.trim(),
          confidence: 85,
        });
      }
    }

    if (findings.length === 0 && sentences.length > 0) {
      findings.push({
        category: 'Observation',
        content: sentences[0].trim(),
        confidence: 82,
      });
    }

    return findings.slice(0, 5);
  }
}

function pathSafe(str) {
  return (str || '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

export default MemoryExtractionAgent;
