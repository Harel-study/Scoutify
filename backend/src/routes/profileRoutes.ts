import { Router } from 'express';
import { getMe, updateMe, getProfileById, searchProfiles } from '../controllers/profileController';
import { authenticateJWT } from '../middleware/auth';
import upload from '../middleware/upload';

const router = Router();

// Apply JWT authentication to all profile endpoints
router.use(authenticateJWT);

router.get('/me', getMe);
router.put('/me', upload.single('profileImage'), updateMe);
router.get('/search', searchProfiles); // Path '/search' avoids conflicting with '/:id'
router.get('/:id', getProfileById);

export default router;
