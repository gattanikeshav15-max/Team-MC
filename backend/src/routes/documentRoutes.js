import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Document from '../models/Document.js';
import Project from '../models/Project.js';
import MemoryExtractionAgent from '../agents/MemoryExtractionAgent.js';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.resolve('uploads/documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
});

/**
 * POST /api/documents/upload
 * Handles document upload & triggers autonomous memory extraction
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { projectId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'projectId is mandatory.' });
    }

    const documentId = `DOC-${Date.now().toString(36).toUpperCase()}`;

    // 1. Create Document record in MongoDB
    const docRecord = await Document.create({
      id: documentId,
      projectId,
      originalFilename: file.originalname,
      fileType: file.mimetype || path.extname(file.originalname),
      fileSize: file.size,
      storagePath: file.path,
      processingStatus: 'Processing',
      uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
    });

    // 2. Trigger MemoryExtractionAgent
    const extractedMemories = await MemoryExtractionAgent.extractFromDocument({
      documentId,
      filePath: file.path,
      fileType: file.mimetype,
      originalFilename: file.originalname,
      projectId,
    });

    return res.status(201).json({
      success: true,
      message: `Successfully uploaded "${file.originalname}" and extracted ${extractedMemories.length} research findings.`,
      document: docRecord,
      memoriesCount: extractedMemories.length,
      memories: extractedMemories,
    });
  } catch (err) {
    console.error('Document Upload & Extraction Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/documents/project/:projectId
 */
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const documents = await Document.find({ projectId }).sort({ createdAt: -1 });
    return res.status(200).json(documents);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
