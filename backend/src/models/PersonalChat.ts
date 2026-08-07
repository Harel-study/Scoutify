/**
 * @module backend/models/PersonalChat
 *
 * Defines the database schema and TypeScript interfaces for personal chats.
 * Tracks senders, receivers, and the main text content of the messages.
 */

import { Schema, model, Document, Types } from 'mongoose';

/**
 * Represents a personal chat document in the database.
 */
export interface IPersonalChat extends Document {
  /** The identifier or name of the sender */
  sender: Types.ObjectId;
  /** The identifier or name of the receiver */
  receiver: Types.ObjectId;
  /** The text content of the message */
  content: string;
  /** The date when the message record was created. */
  createdAt: Date;
  /** The date when the message record was last updated. */
  updatedAt: Date;
}

/**
 * Mongoose schema corresponding to the IPersonalChat document interface.
 */
const personalChatSchema = new Schema<IPersonalChat>({
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
    content: { 
        type: String, 
        required: true, 
        trim: true 
    }
}, {
    // מייצר אוטומטית את השדות createdAt ו-updatedAt כפי שנדרש בטבלה
    timestamps: true 
});

// Compound indexes for rapid conversation lookup and user chat history aggregation
personalChatSchema.index({ sender: 1, receiver: 1, createdAt: 1 });
personalChatSchema.index({ receiver: 1, sender: 1, createdAt: 1 });
personalChatSchema.index({ sender: 1, createdAt: -1 });
personalChatSchema.index({ receiver: 1, createdAt: -1 });

const PersonalChat = model<IPersonalChat>('PersonalChat', personalChatSchema);

export default PersonalChat;