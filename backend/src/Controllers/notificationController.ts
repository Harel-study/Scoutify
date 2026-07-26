/**
 * @module Controllers/notificationController
 *
 * Handles the retrieval and state management of user notifications.
 * Allows users to fetch their notifications and mark them as read.
 */
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import Notification from '../models/Notification';

/**
 * Retrieves all notifications for the authenticated user.
 *
 * Populates the sender's basic information and sorts the results
 * in descending chronological order (newest first).
 *
 * @param {AuthenticatedRequest} req - The Express request object containing the user's ID.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when notifications are retrieved or passes errors to next().
 */
export const getNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.user;

    const notifications = await Notification.find({ receiver: id })
      .populate('sender', 'username email role')
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (err) {
    next(err);
  }
};

/**
 * Marks a specific notification as read.
 *
 * Verifies that the notification belongs to the authenticated user
 * before updating its state.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing the notification ID in params.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when the notification is updated or passes errors to next().
 */
export const markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.user;

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, receiver: id },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (err) {
    next(err);
  }
};

/**
 * Marks all unread notifications for the authenticated user as read.
 *
 * Performs a bulk update operation for efficiency.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing the user's ID.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when all notifications are updated or passes errors to next().
 */
export const markAllAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.user;

    await Notification.updateMany(
      { receiver: id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};
