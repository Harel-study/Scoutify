/**
 * @module Controllers/postController
 *
 * Handles creation, retrieval, deletion, and interaction (liking) of social posts.
 * Manages media uploads to Cloudinary and dispatching notifications for likes.
 */
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import Post, { IMedia } from '../models/Post.js';
import Team from '../models/Team.js';
import Notification from '../models/Notification.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { postSchema, commentSchema } from '../validation/joiSchemas.js';
import socketService from '../services/socketService.js';

/**
 * Creates a new social feed post.
 *
 * Handles optional media uploads via Cloudinary, determines the correct
 * profile association (User or Team) based on the requester's role, and
 * returns the newly created, fully populated post.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing user data, body, and optionally a file.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when the post is created or passes errors to next().
 */
export const createPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id, role } = req.user;

    const { error, value } = postSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { content, targetRole, location } = value;

    let profileId = id;
    let profileModel: 'User' | 'Team' = 'User';

    if (role === 'team') {
      const team = await Team.findOne({ userID: id });
      if (!team) {
        return res.status(400).json({ message: 'Team profile not found' });
      }
      profileId = team._id.toString();
      profileModel = 'Team';
    }

    const media: IMedia[] = [];

    // Handle file upload to Cloudinary if present
    if (req.file) {
      const secureUrl = await uploadToCloudinary(req.file.buffer, 'posts');
      let type: 'image' | 'video' | 'document' = 'image';
      
      if (req.file.mimetype.startsWith('video/')) {
        type = 'video';
      } else if (req.file.mimetype === 'application/pdf') {
        type = 'document';
      }

      media.push({ url: secureUrl, type });
    }

    const post = new Post({
      profileId,
      profileModel,
      content,
      media,
      targetRole,
      location,
      likes: []
    });

    await post.save();

    const populatedPost = await post.populate({
      path: 'profileId',
      populate: { path: 'userID', select: 'username email role', strictPopulate: false }
    });

    res.status(201).json({ message: 'Post created successfully', post: populatedPost });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves a paginated list of social feed posts.
 *
 * Sorts posts chronologically (newest first) and populates the associated
 * creator profiles.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing pagination query parameters (page, limit).
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when posts are retrieved or passes errors to next().
 */
export const listPosts = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const page = parseInt(req.query.page as string) || 1;

    const posts = await Post.find()
      .populate({ path: 'profileId', populate: { path: 'userID', select: 'username email role', strictPopulate: false } })
      .populate({ path: 'comments.user', select: 'username email role profileImage', strictPopulate: false })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
};

/**
 * Determines whether the requesting user owns the specified post.
 *
 * Checks ownership either directly for user profiles or indirectly
 * by checking the associated team profile.
 *
 * @param {any} reqUser - The authenticated user object from the request.
 * @param {any} post - The post document to check ownership against.
 * @returns {Promise<boolean>} True if the user owns the post, false otherwise.
 */
const checkPostOwnership = async (reqUser: any, post: any): Promise<boolean> => {
  if (post.profileModel === 'User') {
    return post.profileId.toString() === reqUser.id;
  } else if (post.profileModel === 'Team') {
    const team = await Team.findById(post.profileId);
    return team ? team.userID.toString() === reqUser.id : false;
  }
  return false;
};

/**
 * Deletes an existing social post.
 *
 * Requires ownership verification before the post can be removed from the database.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing the post ID.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when the post is deleted or passes errors to next().
 */
export const deletePost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isOwner = await checkPostOwnership(req.user, post);
    if (!isOwner) {
      return res.status(403).json({ message: 'You do not have permission to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * Toggles a like on a specified post for the authenticated user.
 *
 * Adds the user's ID to the post's likes array if not present, or removes it
 * if they have already liked it. Triggers a notification to the post owner
 * when a new like is added (unless they are liking their own post).
 *
 * @param {AuthenticatedRequest} req - The Express request object containing the post ID.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when the like is toggled or passes errors to next().
 */
export const toggleLikePost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.user;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const likeIndex = post.likes.indexOf(id as any);
    let liked = false;

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(id as any);
      liked = true;
    }

    await post.save();

    // Trigger Notification for the post owner if it's a new like and not liking their own post
    if (liked) {
      let receiverId: string | null = null;
      if (post.profileModel === 'User') {
        receiverId = post.profileId.toString();
      } else if (post.profileModel === 'Team') {
        const team = await Team.findById(post.profileId);
        if (team) receiverId = team.userID.toString();
      }

      if (receiverId && receiverId !== id) {
        const notification = new Notification({
          sender: id,
          receiver: receiverId,
          type: 'post_like',
          content: 'Someone liked your post',
          sourceLink: `/feed`
        });
        await notification.save();
        socketService.emitToUser(receiverId, 'newNotification', notification);
      }
    }

    res.status(200).json({ message: liked ? 'Post liked' : 'Post unliked', likesCount: post.likes.length, liked, likes: post.likes });
  } catch (err) {
    next(err);
  }
};

/**
 * Adds a comment to a specified post.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing the post ID and comment text.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const addComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.user;

    const { error, value } = commentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = {
      user: id as any,
      text: value.text,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    // Populate user details for the new comment
    await post.populate({
      path: 'comments.user',
      select: 'username email role profileImage',
      strictPopulate: false
    });

    // Notify the post owner
    let receiverId: string | null = null;
    if (post.profileModel === 'User') {
      receiverId = post.profileId.toString();
    } else if (post.profileModel === 'Team') {
      const team = await Team.findById(post.profileId);
      if (team) receiverId = team.userID.toString();
    }

    if (receiverId && receiverId !== id) {
      const notification = new Notification({
        sender: id,
        receiver: receiverId,
        type: 'post_comment', // You might need to add this to the Notification model enum if it exists
        content: 'Someone commented on your post',
        sourceLink: `/feed`
      });
      await notification.save();
      socketService.emitToUser(receiverId, 'newNotification', notification);
    }

    res.status(201).json({ message: 'Comment added successfully', post });
  } catch (err) {
    next(err);
  }
};
