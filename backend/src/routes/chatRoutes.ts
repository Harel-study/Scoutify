import { Router } from 'express';
import { sendMessage, getMessageHistory, getConversations } from '../controllers/chatController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

// Apply JWT authentication to all chat endpoints
router.use(authenticateJWT);

router.get('/', getConversations);
router.post('/', sendMessage);
router.get('/:userId', getMessageHistory);

export default router;
