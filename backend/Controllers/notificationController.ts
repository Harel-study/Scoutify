import { Request, Response } from 'express';
import Notification from '../models/Notifctions';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

/**
 * קבלת כל ההתראות של המשתמש המחובר
 */
export const getNotifications = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        message: 'Unauthorized',
      });
      return;
    }

    const notifications = await Notification.find({
      receiver: userId,
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'email role');

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching notifications',
      error,
    });
  }
};

/**
 * סימון התראה בודדת כנקראה
 */
export const markAsRead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        message: 'Unauthorized',
      });
      return;
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        receiver: userId,
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    if (!notification) {
      res.status(404).json({
        message: 'Notification not found',
      });
      return;
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({
      message: 'Error marking notification as read',
      error,
    });
  }
};

/**
 * סימון כל ההתראות כנקראו
 */
export const markAllAsRead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        message: 'Unauthorized',
      });
      return;
    }

    const result = await Notification.updateMany(
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
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error marking notifications as read',
      error,
    });
  }
};