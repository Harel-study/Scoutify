import { Request, Response } from 'express';
import User from '../models/User.ts';
export const registerUser = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'register user' });
};
export const loginUser = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'login user' });
};
export const getProfile = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'get profile' });
};
export const updateProfile = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'update profile' });
};
export const getUserById = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'get user by id' });
};
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  res.status(200).json(users);
};
export const deleteUser = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'delete user' });
};