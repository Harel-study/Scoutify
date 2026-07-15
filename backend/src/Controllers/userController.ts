import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
// הרשמת משתמש חדש
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: 'Email, password, and role are required',
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Register error',
      error,
    });
  }
};
// התחברות משתמש
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Login error',
      error,
    });
  }
};
// קבלת פרופיל - זמני עד שנוסיף JWT
export const getProfile = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'get profile - authentication will be added later',
  });
};
// עדכון פרופיל - זמני עד שנוסיף JWT
export const updateProfile = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'update profile - authentication will be added later',
  });
};
// קבלת משתמש לפי ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching user',
      error,
    });
  }
};
// קבלת כל המשתמשים
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching users',
      error,
    });
  }
};
// מחיקת משתמש לפי ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting user',
      error,
    });
  }
};