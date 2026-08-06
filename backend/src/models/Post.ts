/**
 * @module backend/models/Post
 *
 * Defines the database schema and TypeScript interfaces for user or team posts.
 * Posts can contain text content, optional media attachments, and target roles or locations.
 */

import { Schema, model, Document, Types } from 'mongoose';

/**
 * Represents a media item attached to a post.
 *
 * @interface
 */
export interface IMedia {
  /** @type {string} The URL of the uploaded image, video, or document. */
  url: string;
  /** @type {string} The type of media content. */
  type: 'image' | 'video' | 'document';
}

/**
 * Represents a comment on a post.
 *
 * @interface
 */
export interface IComment {
  /** @type {Types.ObjectId} Reference to the User who made the comment. */
  user: Types.ObjectId;
  /** @type {string} The text content of the comment. */
  text: string;
  /** @type {Date} The date when the comment was created. */
  createdAt: Date;
}

/**
 * Represents a post document in the database.
 *
 * @interface
 */
export interface IPost extends Document {
  /** @type {Types.ObjectId} Reference to the User or Team profile that created the post. */
  profileId: Types.ObjectId;
  /** @type {string} Discriminator field pointing to either the 'User' or 'Team' collection. */
  profileModel: 'User' | 'Team';
  /** @type {string} The main text content of the post. */
  content: string;
  /** @type {IMedia[]|undefined} An optional array of media items attached to the post. */
  media?: IMedia[];
  /** @type {string|undefined} Optional target role or audience for the post. */
  targetRole?: string;
  /** @type {string|undefined} Optional location associated with the post. */
  location?: string;
  /** @type {Types.ObjectId[]} Array of User IDs who have liked this post. */
  likes: Types.ObjectId[];
  /** @type {IComment[]} Array of comments on the post. */
  comments: IComment[];
  /** @type {Date} The date when the post record was created. Automatically managed by Mongoose. */
  createdAt: Date;
  /** @type {Date} The date when the post record was last updated. Automatically managed by Mongoose. */
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
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
}, {
    timestamps: true
});

// Indexes for feed queries and user post lookups
postSchema.index({ createdAt: -1 });
postSchema.index({ profileId: 1, createdAt: -1 });

/**
 * Represents the Mongoose model for interacting with the posts collection.
 *
 * Use this model to query, create, or update post data.
 *
 * @class
 */
const Post = model<IPost>('Post', postSchema);

export default Post;