import express from 'express';
import { getMemories, searchMemories, updateMemory, deleteMemory } from '../controllers/memoryController.js';

const router = express.Router();

router.get('/', getMemories);
router.post('/search', searchMemories);
router.patch('/:id', updateMemory);
router.delete('/:id', deleteMemory);

export default router;
