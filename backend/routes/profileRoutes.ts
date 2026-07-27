import { Router } from 'express';
import {
  getUserById,
  getAllUsers,
  deleteUser
} from '../controllers/profileController';

import { authenticateJWT } from '../middleware/auth';

const router = Router();

// כל ה-routes כאן דורשים משתמש מחובר
router.use(authenticateJWT);

// קבלת כל המשתמשים
router.get('/', getAllUsers);

// קבלת משתמש לפי ID
router.get('/:id', getUserById);

// מחיקת משתמש לפי ID
router.delete('/:id', deleteUser);

export default router;