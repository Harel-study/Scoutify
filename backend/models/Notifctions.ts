import { Schema, model, Types } from 'mongoose';
export interface INotification {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  type:
    | 'message'
    | 'connection_request'
    | 'job_application'
    | 'profile_view'
    | 'post_like';
  content: string;
  sourceLink?: string;
  isRead: boolean;
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
const Notification = model<INotification>('Notification', notificationSchema);
export default Notification;