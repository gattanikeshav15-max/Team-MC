import express from 'express';
import { getMaintenanceLogs, createMaintenanceLog } from '../controllers/maintenanceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getMaintenanceLogs);
router.post('/', protect, createMaintenanceLog);

export default router;

