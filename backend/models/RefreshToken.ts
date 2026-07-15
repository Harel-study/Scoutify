/**
 * @module RefreshTokenModel
 *
 * Defines the Mongoose schema and model for JWT refresh tokens.
 * Used to maintain user sessions and securely issue new access tokens
 * without requiring the user to re-authenticate.
 */
import { Schema, model, Types } from 'mongoose';

/**
 * Represents the structure of a Refresh Token document in the database.
 *
 * @interface
 */
export interface IRefreshToken {
  /** @type {string} The unique, securely generated refresh token string. */
  token: string;
  /** @type {Types.ObjectId} The identifier of the user who owns this token. */
  userId: Types.ObjectId;
  /** @type {Date} The exact date and time when this token becomes invalid. */
  expiresAt: Date;
  /** @type {Date} When the token was created. Automatically managed by Mongoose. */
  createdAt: Date;
  /** @type {Date} When the token was last updated. Automatically managed by Mongoose. */
  updatedAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  token: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

// Create a TTL index to automatically delete expired tokens from MongoDB
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/**
 * Represents the Mongoose model for interacting with the refresh tokens collection.
 *
 * Use this model to store, query, or revoke user refresh tokens.
 *
 * @class
 */
const RefreshToken = model<IRefreshToken>('RefreshToken', refreshTokenSchema);
export default RefreshToken;
