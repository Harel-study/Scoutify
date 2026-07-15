/**
 * @module NotificationModel
 *
 * Defines the Mongoose schema and model for user notifications.
 * Handles the structure for various notification types such as messages,
 * connection requests, and profile interactions.
 */
import { Schema, model } from 'mongoose';

/**
 * Represents the structure of a Notification document in the database.
 *
 * Encapsulates the core fields required to display a notification to a user,
 * including who triggered it, what type of event occurred, and a link to
 * the relevant content.
 *
 * @interface
 */
interface INotification {
  /** @type {Schema.Types.ObjectId} The user who triggered the notification. */
  sender: Schema.Types.ObjectId;
  /** @type {Schema.Types.ObjectId} The user who will receive the notification. */
  receiver: Schema.Types.ObjectId;
  /** @type {string} The category of the notification event. */
  type:
    | 'message'
    | 'connection_request'
    | 'job_application'
    | 'profile_view'
    | 'post_like';
  /** @type {string} The main text content or message of the notification. */
  content: string;
  /** @type {string|undefined} An optional URL or path to navigate to when the notification is clicked. */
  sourceLink?: string;
  /** @type {boolean} Indicates whether the user has viewed this notification. */
  isRead: boolean;
  /** @type {Date} When the notification was created. Automatically managed by Mongoose. */
  createdAt: Date;
  /** @type {Date} When the notification was last updated. Automatically managed by Mongoose. */
  updatedAt: Date;
}
const notificationSchema = new Schema<INotification>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: [
        'message',
        'connection_request',
        'job_application',
        'profile_view',
        'post_like'
      ]
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    sourceLink: {
      type: String,
      default: ''
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);
/**
 * Represents the Mongoose model for interacting with the notifications collection.
 *
 * Use this model to query, create, or update user notifications.
 *
 * @class
 */
const Notification = model<INotification>('Notification', notificationSchema);
export default Notification;