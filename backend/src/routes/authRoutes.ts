import { Router } from 'express';
import {
  register,
  login,
  googleLogin,
  refresh,
  logout,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { authLimiter, forgotPasswordLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleLogin);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPassword);

export default router;
