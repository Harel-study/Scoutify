import { Router } from 'express';
import {
  registerUser,
  loginUser,
  googleLogin,
  refresh,
  logout
} from '../controllers/userController';
import { authLimiter } from '../middleware/rateLimiter';
const router = Router();
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/google', authLimiter, googleLogin);
router.post('/refresh', refresh);
router.post('/logout', logout);
export default router;