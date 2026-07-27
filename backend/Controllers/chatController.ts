/**
 * @module backend/controllers/chatController
 *
 * הלוגיקה העסקית לניהול צ'אט אישי בין משתמשים.
 */

import { Request, Response } from 'express';
import PersonalChat from '../models/PersonalChats';
/**
 * שליחת הודעה חדשה
 * POST /api/chat
 */
export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sender, receiver, content } = req.body;
    if (!sender || !receiver || !content) {
      res.status(400).json({
        message: 'Sender, receiver and content are required',
      });
      return;
    }
    const message = await PersonalChat.create({
      sender,
      receiver,
      content,
    });
    res.status(201).json({
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error sending message',
      error,
    });
  }
};
/**
 * קבלת היסטוריית ההודעות בין שני משתמשים
 * GET /api/chat/:userId
 */
export const getMessageHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    /*
     * זמנית מקבלים את מזהה המשתמש הנוכחי מה-query.
     * לאחר שנשלים את authenticateJWT,
     * ניקח אותו ישירות מה-token.
     */
    const currentUserId = req.query.currentUserId as string;

    if (!currentUserId) {
      res.status(400).json({
        message: 'currentUserId is required',
      });
      return;
    }
    const messages = await PersonalChat.find({
      $or: [
        {
          sender: currentUserId,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: currentUserId,
        },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching message history',
      error,
    });
  }
};
/**
 * קבלת רשימת השיחות של משתמש
 * GET /api/chat
 */
export const getConversations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    /*
     * זמנית מזהה המשתמש מגיע מה-query.
     * בהמשך הוא יגיע מה-JWT.
     */
    const currentUserId = req.query.currentUserId as string;
    if (!currentUserId) {
      res.status(400).json({
        message: 'currentUserId is required',
      });
      return;
    }
    const messages = await PersonalChat.find({
      $or: [
        { sender: currentUserId },
        { receiver: currentUserId },
      ],
    }).sort({ createdAt: -1 });
    /*
     * יצירת רשימת משתמשים ייחודית
     * שהמשתמש הנוכחי ניהל איתם שיחה.
     */
    const conversationUsers = [
      ...new Set(
        messages.map((message) =>
          message.sender === currentUserId
            ? message.receiver
            : message.sender
        )
      ),
    ];

    res.status(200).json({
      conversations: conversationUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching conversations',
      error,
    });
  }
};