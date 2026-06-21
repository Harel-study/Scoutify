/**
 * @module backend/models/PersonalChat
 *
 * Defines the database schema and TypeScript interfaces for personal chats.
 * Tracks senders, receivers, and the main text content of the messages.
 */

import mongoose, { Schema, Document } from 'mongoose';

/**
 * Represents a personal chat document in the database.
 */
export interface IPersonalChat extends Document {
  /** The identifier or name of the sender */
  sender: string;
  /** The identifier or name of the receiver */
  receiver: string;
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
        type: String, 
        required: true, 
        trim: true 
    },
    receiver: { 
        type: String, 
        required: true, 
        trim: true 
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

const PersonalChat = mongoose.model<IPersonalChat>('PersonalChat', personalChatSchema);

export default PersonalChat;