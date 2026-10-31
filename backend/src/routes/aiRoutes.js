import express from 'express';
import { chat, getConversations, getConversationById } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', chat);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversationById);

export default router;
