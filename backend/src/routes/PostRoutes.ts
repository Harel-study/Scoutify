import { Router } from 'express';
import { createPost, listPosts, deletePost, toggleLikePost } from '../controllers/PostController';
import { authenticateJWT } from '../middleware/auth';
import upload from '../middleware/upload';

const router = Router();

// Apply JWT authentication to all post endpoints
router.use(authenticateJWT);

router.get('/', listPosts);
router.post('/', upload.single('media'), createPost);
router.delete('/:id', deletePost);
router.post('/:id/like', toggleLikePost);

export default router;
