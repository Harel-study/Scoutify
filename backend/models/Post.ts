/**
 * @module backend/models/Post
 *
 * Defines the database schema and TypeScript interfaces for user or team posts.
 * Posts can contain text content, optional media attachments, and target roles or locations.
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * Represents a media item attached to a post.
 */
export interface IMedia {
  /** The URL of the uploaded image, video, or document. */
  url: string;
  /** The type of media content. */
  type: 'image' | 'video' | 'document';
}

/**
 * Represents a post document in the database.
 */
export interface IPost extends Document {
  /** Reference to the User or Team profile that created the post. */
  profileId: Types.ObjectId;
  /** Discriminator field pointing to either the 'User' or 'Team' collection. */
  profileModel: 'User' | 'Team';
  /** The main text content of the post. */
  content: string;
  /** An optional array of media items attached to the post. */
  media?: IMedia[];
  /** Optional target role or audience for the post. */
  targetRole?: string;
  /** Optional location associated with the post. */
  location?: string;
  /** The date when the post record was created. */
  createdAt: Date;
  /** The date when the post record was last updated. */
  updatedAt: Date;
}

/**
 * Mongoose schema corresponding to the IPost document interface.
 */
const postSchema = new Schema<IPost>({
    profileId: { type: Schema.Types.ObjectId, required: true, refPath: 'profileModel' },
    profileModel: { type: String, required: true, enum: ['User', 'Team'] },
    content: { type: String, required: true, trim: true },
    media: { 
      type: [{ 
        url: { type: String, required: true }, 
        type: { type: String, enum: ['image', 'video', 'document'], required: true } 
      }], 
      required: false,
      default: []
    },
    targetRole: { type: String, required: false, trim: true },
    location: { type: String, required: false, trim: true },
}, {
    timestamps: true
});

const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;