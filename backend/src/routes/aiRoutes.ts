import { Router } from 'express';
import { improvePost } from '../controllers/aiController.js';

const router = Router();

router.post('/improve-post', improvePost);

export const aiRoutes = router;