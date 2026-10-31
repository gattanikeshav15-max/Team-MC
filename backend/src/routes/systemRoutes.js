import express from 'express';
import { getSystems, getSystemById, createSystem, updateSystem, deleteSystem } from '../controllers/systemController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSystems);
router.post('/', protect, createSystem);
router.get('/:id', getSystemById);
router.patch('/:id', protect, updateSystem);
router.put('/:id', protect, updateSystem);
router.delete('/:id', protect, deleteSystem);

export default router;

