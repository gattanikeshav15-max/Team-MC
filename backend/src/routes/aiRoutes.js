import express from 'express';
import { chat, getProjectChats, createChat, getConversationById } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', chat);
router.post('/chats', createChat);
router.get('/projects/:projectId/chats', getProjectChats);
router.get('/conversations/:id', getConversationById);

export default router;
