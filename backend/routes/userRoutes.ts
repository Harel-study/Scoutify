import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getUserById,
  getAllUsers,
  deleteUser
} from '../Controllers/userController';

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);
export default router;