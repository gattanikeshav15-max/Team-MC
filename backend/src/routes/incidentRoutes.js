import express from 'express';
import { getIncidents, getIncidentById, createIncident, updateIncident, analyzeIncident } from '../controllers/incidentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getIncidents);
router.post('/', protect, createIncident);
router.get('/:id', getIncidentById);
router.patch('/:id', protect, updateIncident);
router.put('/:id', protect, updateIncident);
router.get('/:id/analysis', protect, analyzeIncident);

export default router;

