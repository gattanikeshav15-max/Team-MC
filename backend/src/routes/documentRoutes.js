import express from 'express';
import multer from 'multer';
import path from 'path';
import Document from '../models/Document.js';
import MemoryExtractionAgent from '../agents/MemoryExtractionAgent.js';
import gridFSService from '../services/gridfsService.js';
import mongoose from 'mongoose';

const router = express.Router();

// Memory storage for cloud-ready streaming into MongoDB GridFS
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB
});

/**
 * POST /api/documents/upload
 * Cloud-ready document upload streaming into MongoDB GridFS
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { projectId, chatId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file provided.' });
    }

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'projectId is mandatory.' });
    }

    const documentId = `DOC-${Date.now().toString(36).toUpperCase()}`;

    // 1. Upload file buffer into MongoDB GridFS
    let gridfsFileId = null;
    try {
      const gridResult = await gridFSService.uploadFile(file.buffer, file.originalname, file.mimetype);
      gridfsFileId = gridResult.fileId;
    } catch (gridErr) {
      console.warn('GridFS upload warning (fallback to memory metadata):', gridErr.message);
    }

    // 2. Create Document metadata record in MongoDB
    const docRecord = await Document.create({
      id: documentId,
      projectId,
      chatId: chatId || '',
      uploadedBy: req.user?.name || 'Researcher',
      originalFilename: file.originalname,
      fileType: file.mimetype || path.extname(file.originalname),
      fileSize: file.size,
      storageType: 'gridfs',
      gridfsFileId,
      storagePath: `gridfs://${gridfsFileId}`,
      processingStatus: 'Processing',
      uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
    });

    // 3. Autonomous Memory Extraction
    const extractedMemories = await MemoryExtractionAgent.extractFromDocument({
      documentId,
      fileBuffer: file.buffer,
      fileType: file.mimetype,
      originalFilename: file.originalname,
      projectId,
      chatId,
    });

    return res.status(201).json({
      success: true,
      message: `Successfully uploaded "${file.originalname}" to MongoDB GridFS and extracted ${extractedMemories.length} findings.`,
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

/**
 * GET /api/documents/chat/:chatId
 */
router.get('/chat/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const documents = await Document.find({ chatId }).sort({ createdAt: -1 });
    return res.status(200).json(documents);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/documents/:id/download
 * Download raw document stream directly from MongoDB GridFS
 */
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findOne({ id });
    if (!doc || !doc.gridfsFileId) {
      return res.status(404).json({ success: false, message: 'Document or GridFS file not found' });
    }

    const buffer = await gridFSService.downloadFile(doc.gridfsFileId);
    res.setHeader('Content-Type', doc.fileType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${doc.originalFilename}"`);
    return res.send(buffer);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
