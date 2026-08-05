import { Router } from 'express';
import { improvePost } from '../controllers/aiController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJWT);

router.post('/improve-post', improvePost);

export const aiRoutes = router;