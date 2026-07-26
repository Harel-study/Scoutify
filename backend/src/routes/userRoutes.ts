import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getUserById,
  getAllUsers,
  deleteUser
} from '../Controllers/profileController';
const router = express.Router();
/**
 * הרשמת משתמש חדש
 */
router.post('/register', registerUser);
/**
 * התחברות משתמש
 */
router.post('/login', loginUser);
/**
 * קבלת כל המשתמשים
 */
router.get('/', getAllUsers);
/**
 * קבלת פרופיל משתמש לפי ID
 */
router.get('/profile/:id', getProfile);
/**
 * עדכון פרופיל משתמש לפי ID
 */
router.put('/profile/:id', updateProfile);
/**
 * קבלת משתמש לפי ID
 */
router.get('/:id', getUserById);
/**
 * מחיקת משתמש לפי ID
 */
router.delete('/:id', deleteUser);
export default router;