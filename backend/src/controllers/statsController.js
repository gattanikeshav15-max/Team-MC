import Project from '../models/Project.js';
import Document from '../models/Document.js';
import Memory from '../models/Memory.js';
import embeddingService from '../services/embeddingService.js';
import mongoose from 'mongoose';

export const getStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const [totalProjects, completedProjects, totalDocuments, totalMemories] = await Promise.all([
        Project.countDocuments(),
        Project.countDocuments({ status: 'Completed' }),
        Document.countDocuments(),
        Memory.countDocuments(),
      ]);

      const verifiedMemories = await Memory.countDocuments({ verificationStatus: 'Verified' });

      return res.status(200).json({
        totalProjects,
        completedProjects,
        totalDocuments,
        totalMemories,
        verifiedMemories,
      });
    }

    return res.status(200).json({
      totalProjects: 0,
      completedProjects: 0,
      totalDocuments: 0,
      totalMemories: 0,
      verifiedMemories: 0,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const runSeed = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ success: false, message: 'Database disconnected' });
    }

    // Clear old data
    await Project.deleteMany({});
    await Document.deleteMany({});
    await Memory.deleteMany({});

    // 1. Seed Completed Research Project (Team A)
    const projectA = await Project.create({
      id: 'PRJ-GAN-2025',
      name: 'GaN Power Module Thermal & Gate Reliability',
      researchArea: 'Wide-Bandgap Semiconductor Power Systems',
      description:
        'Investigation into 650V GaN HEMT switching reliability, thermal dissipation boundaries, and gate dielectric degradation under inductive surge.',
      teamName: 'Team Alpha (Power Lab)',
      status: 'Completed',
      leadResearcher: 'Dr. Keshav Gattani',
      createdDate: '2025-08-10',
      completionDate: '2026-01-20',
      tags: ['GaN', 'Thermal Reliability', 'Power Converter'],
    });

    // 2. Seed Document for Project A
    const docA = await Document.create({
      id: 'DOC-GAN-FINAL',
      projectId: projectA.id,
      originalFilename: 'GaN_Thermal_Reliability_Final_Report_2026.pdf',
      fileType: 'application/pdf',
      fileSize: 2450000,
      storagePath: 'uploads/documents/sample_gan_report.pdf',
      processingStatus: 'Extracted',
      extractedMemoriesCount: 5,
      uploadDate: '2026-01-22 14:30:00',
    });

    // 3. Seed Structured Memories for Project A with Embeddings
    const memoryDefs = [
      {
        category: 'Successful Experiment',
        content:
          'Utilizing 0.1mm pre-formed pure Indium foil thermal interface material under 15 psi uniform clamping achieved continuous 120W thermal dissipation without dielectric void pump-out.',
        sourceSection: 'Section 4.2 Thermal Dissipation Validation',
        verificationStatus: 'Verified',
        confidence: 96,
      },
      {
        category: 'Failed Experiment',
        content:
          'Standard silicone-based thermal grease experienced catastrophic dry-out and thermal runaway (>165°C junction breakdown) after only 180 vacuum thermal cycles (-40°C to +110°C).',
        sourceSection: 'Section 4.4 Vacuum Cycling Endurance Failure',
        verificationStatus: 'Verified',
        confidence: 98,
      },
      {
        category: 'Technical Limitation',
        content:
          'Negative gate ringing must never dip below -4.2V for longer than 15ns during high dV/dt transitions; exceeding this boundary induces irreversible gate trap leakage (Igss > 100uA).',
        sourceSection: 'Section 3.1 Inductive Gate Drive Snubber Analysis',
        verificationStatus: 'Verified',
        confidence: 94,
      },
      {
        category: 'Engineering Decision',
        content:
          'Standardized on RC snubbers directly adjacent to GaN drain pads (2.2 Ohm + 150pF C0G ceramic) to suppress switching spikes within 8ns.',
        sourceSection: 'Section 5.0 Layout Directives for Future Teams',
        verificationStatus: 'Verified',
        confidence: 92,
      },
      {
        category: 'Lesson Learned',
        content:
          'Do NOT use tantalum electrolytic bypass capacitors on the primary 48V rail; multi-layer ceramic capacitors (MLCC) derated to 40% voltage rating eliminate fire hazard under heavy transients.',
        sourceSection: 'Section 6.1 Component Selection Lessons',
        verificationStatus: 'Verified',
        confidence: 95,
      },
      {
        category: 'Unresolved Question',
        content:
          'Long-term behavior of GaN 2DEG electron mobility under intense cosmic proton radiation flux remains uncharacterized above 50 krad(Si).',
        sourceSection: 'Section 7.0 Future Research Horizons',
        verificationStatus: 'Unverified',
        confidence: 85,
      },
    ];

    for (let i = 0; i < memoryDefs.length; i++) {
      const def = memoryDefs[i];
      const { embedding } = await embeddingService.generateEmbedding(
        `${def.category}: ${def.content} | Context: GaN Power Module Thermal`
      );

      await Memory.create({
        id: `MEM-GAN-00${i + 1}`,
        projectId: projectA.id,
        projectName: projectA.name,
        teamName: projectA.teamName,
        documentId: docA.id,
        documentName: docA.originalFilename,
        category: def.category,
        content: def.content,
        sourceSection: def.sourceSection,
        verificationStatus: def.verificationStatus,
        confidence: def.confidence,
        embedding,
        tags: ['GaN', 'Reliability', 'Thermal'],
        verifiedBy: 'Dr. Keshav Gattani',
        createdDate: '2026-01-22 15:00:00',
      });
    }

    // 4. Seed In-Progress New Project (Team B)
    await Project.create({
      id: 'PRJ-AERO-2026',
      name: 'Next-Gen Aerospace High-Altitude Inverter',
      researchArea: 'Avionics Power Conversion',
      description:
        'Developing a compact 10kW inverter for stratospheric flight using high-frequency GaN semiconductors.',
      teamName: 'Team Beta (Avionics Division)',
      status: 'In Progress',
      leadResearcher: 'Marcus Vance',
      createdDate: '2026-02-14',
      tags: ['Inverter', 'Aerospace', 'GaN'],
    });

    return res.status(200).json({
      success: true,
      message: 'Database seeded with Team A completed research and Team B in-progress project.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
