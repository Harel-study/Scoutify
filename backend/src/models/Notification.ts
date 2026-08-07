/**
 * @module NotificationModel
 *
 * Defines the Mongoose schema and model for user notifications.
 * Handles the structure for various notification types such as messages,
 * connection requests, and profile interactions.
 */

import { Schema, model, Types } from 'mongoose';

/**
 * Represents the structure of a Notification document in the database.
 */
export interface INotification {
  /** The user who triggered the notification. */
  sender: Types.ObjectId;

  /** The user who will receive the notification. */
  receiver: Types.ObjectId;

  /** The category of the notification event. */
  type:
    | 'message'
    | 'connection_request'
    | 'job_application'
    | 'profile_view'
    | 'post_like'
    | 'post_comment';

  /** The main text content of the notification. */
  content: string;

  /** Optional URL/path related to the notification. */
  sourceLink?: string;

  /** Indicates whether the notification has been read. */
  isRead: boolean;

  /** Automatically managed by Mongoose. */
  createdAt: Date;

  /** Automatically managed by Mongoose. */
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        'message',
        'connection_request',
        'job_application',
        'profile_view',
        'post_like',
        'post_comment',
      ],
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    sourceLink: {
      type: String,
      default: '',
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance optimization on user notification feeds and unread counting
notificationSchema.index({ receiver: 1, createdAt: -1 });
notificationSchema.index({ receiver: 1, isRead: 1 });
/**
 * Mongoose model for notifications.
 */
const Notification = model<INotification>(
  'Notification',
  notificationSchema
);
export default Notification;