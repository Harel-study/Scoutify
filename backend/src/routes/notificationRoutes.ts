import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

// Apply JWT authentication to all notification endpoints
router.use(authenticateJWT);

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

export default router;
