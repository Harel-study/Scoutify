/**
 * @module Controllers/chatController
 *
 * Manages personal messaging between users.
 * Handles dispatching messages, querying message histories, and compiling
 * conversation overviews containing the latest messages and partner details.
 */
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import PersonalChat, { IPersonalChat } from '../models/PersonalChat.js';
import User from '../models/User.js';
import PlayerProfile from '../models/PlayerProfile.js';
import Team from '../models/Team.js';
import StaffProfile from '../models/StaffProfile.js';
import Notification from '../models/Notification.js';
import { chatSchema } from '../validation/joiSchemas.js';
import socketService from '../services/socketService.js';

/**
 * Dispatches a direct message to another user.
 *
 * Validates the chat payload, ensures the recipient exists, saves the message
 * to the database, and creates a notification for the recipient.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing the message payload and sender details.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when the message is sent or passes errors to next().
 */
export const sendMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.user;

    const { error, value } = chatSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { receiverId, content } = value;

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Recipient user not found' });
    }

    // Create Chat Message
    const chat = new PersonalChat({
      sender: id,
      receiver: receiverId,
      content
    });

    await chat.save();

    // Create Notification
    const notification = new Notification({
      sender: id,
      receiver: receiverId,
      type: 'message',
      content: `New message: "${content.length > 40 ? content.substring(0, 37) + '...' : content}"`,
      sourceLink: '/messages'
    });
    await notification.save();

    // Emit real-time events via WebSockets
    socketService.emitToUser(receiverId, 'newMessage', chat);
    socketService.emitToUser(receiverId, 'newNotification', notification);

    res.status(201).json({ message: 'Message sent successfully', chat });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves the complete message history between the authenticated user and a specified partner.
 *
 * Sorts the conversation chronologically so messages can be displayed in order.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing the partner user ID in params.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when the message history is retrieved or passes errors to next().
 */
export const getMessageHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.user;
    const { userId } = req.params;

    const messages = await PersonalChat.find({
      $or: [
        { sender: id, receiver: userId },
        { sender: userId, receiver: id }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    next(err);
  }
};

/**
 * Compiles a list of active conversations for the authenticated user.
 *
 * Resolves all unique chat partners, looks up their corresponding role-based profiles
 * (Player, Team, Staff) to extract display names and avatars, and pairs each partner
 * with the most recent message exchanged.
 *
 * @param {AuthenticatedRequest} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when the conversation list is retrieved or passes errors to next().
 */
export const getConversations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.user;

    // Fetch all chats involving this user
    const chats = await PersonalChat.find({
      $or: [{ sender: id }, { receiver: id }]
    }).sort({ createdAt: -1 });

    // Track unique conversation partners
    const partnerIds = new Set<string>();
    chats.forEach(chat => {
      if (chat.sender.toString() !== id) partnerIds.add(chat.sender.toString());
      if (chat.receiver.toString() !== id) partnerIds.add(chat.receiver.toString());
    });

    // Resolve user structures and corresponding profiles
    const partners = await User.find({ _id: { $in: Array.from(partnerIds) } }).select('username email role');
    const conversationList = [];

    for (const partner of partners) {
      let profile: any = null;
      let displayName = partner.username || partner.email;
      let avatar = '';

      if (partner.role === 'player') {
        profile = await PlayerProfile.findOne({ userID: partner._id }).select('profileImage position');
        if (profile) {
          avatar = profile.profileImage || '';
          displayName = `Athlete (${profile.position})`;
        }
      } else if (partner.role === 'team') {
        profile = await Team.findOne({ userID: partner._id }).select('name city');
        if (profile) {
          displayName = profile.name;
        }
      } else if (partner.role === 'staff') {
        profile = await StaffProfile.findOne({ userID: partner._id }).select('profileImage roleDescription');
        if (profile) {
          avatar = profile.profileImage || '';
          displayName = `${profile.roleDescription} (Staff)`;
        }
      }

      // Get last message between user and this partner
      const lastMessage = chats.find(c =>
        (c.sender.toString() === partner._id.toString() && c.receiver.toString() === id) ||
        (c.receiver.toString() === partner._id.toString() && c.sender.toString() === id)
      );

      conversationList.push({
        userId: partner._id,
        username: partner.username,
        email: partner.email,
        role: partner.role,
        displayName,
        avatar,
        lastMessage
      });
    }

    res.status(200).json({ conversations: conversationList });
  } catch (err) {
    next(err);
  }
};
