import express from 'express';
import { chat, getConversations, getConversationById, submitFeedback } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/chat', protect, chat);
router.get('/conversations', protect, getConversations);
router.get('/conversations/:id', protect, getConversationById);
router.post('/feedback', protect, submitFeedback);

export default router;
