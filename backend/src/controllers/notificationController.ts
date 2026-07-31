/**
 * @module Controllers/notificationController
 *
 * Handles the retrieval and state management of user notifications.
 * Allows users to fetch their notifications and mark them as read.
 */

import { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../middleware/auth.js';
import Notification from '../models/Notification.js';

/**
 * Retrieves all notifications for the authenticated user.
 */
export const getNotifications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { id } = req.user;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid user ID',
      });
    }

    const userId = new Types.ObjectId(id);

    const notifications = await Notification.find({
      receiver: userId,
    })
      .populate('sender', 'username email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      notifications,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Marks a specific notification as read.
 */
export const markAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { id } = req.user;
    const notificationId = String(req.params.id);

    if (
      !Types.ObjectId.isValid(id) ||
      !Types.ObjectId.isValid(notificationId)
    ) {
      return res.status(400).json({
        message: 'Invalid ID',
      });
    }

    const userId = new Types.ObjectId(id);
    const notifId = new Types.ObjectId(notificationId);

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notifId,
        receiver: userId,
      },
      {
        $set: {
          isRead: true,
        },
      },
      {
        new: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      message: 'Notification marked as read',
      notification,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Marks all unread notifications for the authenticated user as read.
 */
export const markAllAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { id } = req.user;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid user ID',
      });
    }

    const userId = new Types.ObjectId(id);

    await Notification.updateMany(
      {
        receiver: userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      message: 'All notifications marked as read',
    });
  } catch (err) {
    next(err);
  }
};