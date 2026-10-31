import express from 'express';
import { getComponents, getComponentById, createComponent, updateComponent, deleteComponent } from '../controllers/componentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getComponents);
router.post('/', protect, createComponent);
router.get('/:id', getComponentById);
router.patch('/:id', protect, updateComponent);
router.put('/:id', protect, updateComponent);
router.delete('/:id', protect, deleteComponent);

export default router;

