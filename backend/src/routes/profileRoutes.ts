import { Router } from 'express';
import { getMe, updateMe, getProfileById, searchProfiles } from '../Controllers/profileController.js';
import { authenticateJWT } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

// Apply JWT authentication to all profile endpoints
router.use(authenticateJWT);

router.get('/me', getMe);
router.put('/me', upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'cvFile', maxCount: 1 }]), updateMe);
router.get('/search', searchProfiles); // Path '/search' avoids conflicting with '/:id'
router.get('/:id', getProfileById);

export default router;
