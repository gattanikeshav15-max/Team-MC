import express from 'express';
import { getMemories, extractMemory, searchMemories, updateMemory, deleteMemory } from '../controllers/memoryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getMemories);
router.post('/extract', protect, extractMemory);
router.post('/search', searchMemories);
router.patch('/:id', protect, updateMemory);
router.delete('/:id', protect, deleteMemory);

export default router;
