import express from 'express';
import MemoryRetrievalAgent from '../agents/MemoryRetrievalAgent.js';
import Project from '../models/Project.js';
import Memory from '../models/Memory.js';
import aiService from '../services/aiService.js';

const router = express.Router();

/**
 * POST /api/knowledge-transfer/report
 * Generates a structured handoff report from completed research projects
 */
router.post('/report', async (req, res) => {
  try {
    const { targetProjectId, researchQuery, domain } = req.body;

    let targetProject = null;
    if (targetProjectId) {
      targetProject = await Project.findOne({ id: targetProjectId });
    }

    const searchQuery =
      researchQuery ||
      (targetProject
        ? `${targetProject.name} ${targetProject.researchArea} ${targetProject.description}`
        : domain || 'Semiconductor Reliability');

    // Retrieve memories from previous projects
    const { results: retrievedMemories, retrievalMethod, embeddingModel } =
      await MemoryRetrievalAgent.retrieve({
        query: searchQuery,
        limit: 12,
        minScore: 0.2,
      });

    // Group retrieved memories by category
    const categorized = {
      objectives: [],
      successfulExperiments: [],
      failedExperiments: [],
      engineeringDecisions: [],
      technicalLimitations: [],
      lessonsLearned: [],
      unresolvedQuestions: [],
      observations: [],
    };

    const sourceProjectsSet = new Set();
    const sourceDocumentsSet = new Set();

    retrievedMemories.forEach((m) => {
      if (m.projectName) sourceProjectsSet.add(`${m.projectName} (${m.teamName || 'Team A'})`);
      if (m.documentName) sourceDocumentsSet.add(m.documentName);

      switch (m.category) {
        case 'Research Objective':
          categorized.objectives.push(m);
          break;
        case 'Successful Experiment':
          categorized.successfulExperiments.push(m);
          break;
        case 'Failed Experiment':
          categorized.failedExperiments.push(m);
          break;
        case 'Engineering Decision':
          categorized.engineeringDecisions.push(m);
          break;
        case 'Technical Limitation':
          categorized.technicalLimitations.push(m);
          break;
        case 'Lesson Learned':
          categorized.lessonsLearned.push(m);
          break;
        case 'Unresolved Question':
          categorized.unresolvedQuestions.push(m);
          break;
        default:
          categorized.observations.push(m);
      }
    });

    const report = {
      reportId: `KTR-${Date.now().toString(36).toUpperCase()}`,
      generatedDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      targetProject: targetProject ? { id: targetProject.id, name: targetProject.name, team: targetProject.teamName } : null,
      searchQuery,
      retrievalMethod,
      embeddingModel,
      referencedProjects: Array.from(sourceProjectsSet),
      referencedDocuments: Array.from(sourceDocumentsSet),
      totalMemoriesRetrieved: retrievedMemories.length,
      sections: {
        successfulExperiments: categorized.successfulExperiments.map((m) => ({
          content: m.content,
          project: m.projectName,
          team: m.teamName,
          sourceDoc: m.documentName,
          section: m.sourceSection,
          confidence: m.confidence,
        })),
        failedExperiments: categorized.failedExperiments.map((m) => ({
          content: m.content,
          project: m.projectName,
          team: m.teamName,
          sourceDoc: m.documentName,
          section: m.sourceSection,
          confidence: m.confidence,
        })),
        technicalLimitations: categorized.technicalLimitations.map((m) => ({
          content: m.content,
          project: m.projectName,
          team: m.teamName,
          sourceDoc: m.documentName,
          section: m.sourceSection,
        })),
        lessonsLearned: categorized.lessonsLearned.map((m) => ({
          content: m.content,
          project: m.projectName,
          team: m.teamName,
          sourceDoc: m.documentName,
          section: m.sourceSection,
        })),
        unresolvedQuestions: categorized.unresolvedQuestions.map((m) => ({
          content: m.content,
          project: m.projectName,
          team: m.teamName,
          sourceDoc: m.documentName,
          section: m.sourceSection,
        })),
      },
    };

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (err) {
    console.error('Knowledge Transfer Report Generation Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
