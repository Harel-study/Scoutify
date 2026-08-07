/**
 * @module User
 *
 * Mongoose model and interface definition for user management in Scoutify.
 * Handles user authentication (email/password and Google OAuth), role-based categorization
 * (player, team, staff), password hashing via bcrypt, and credential verification.
 */

import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Represents a user document and its associated instance methods.
 */
export interface IUser {
  /** Unique lowercased username used for profile URLs and identity. */
  username: string;
  /** User's primary email address; required when not using Google OAuth. */
  email?: string;
  /** Bcrypt hashed password string; present for email/password credentials. */
  password?: string;
  /** Platform role determining user permissions ('player', 'team', or 'staff'). */
  role: 'player' | 'team' | 'staff';
  /** Google OAuth subject ID for single sign-on users. */
  googleId?: string;
  /** Account creation timestamp (automatically managed by Mongoose). */
  createdAt: Date;
  /** Account last updated timestamp (automatically managed by Mongoose). */
  updatedAt: Date;

  /**
   * Verifies a plaintext password against the stored bcrypt hash.
   *
   * @param  {string}  candidatePassword  The plaintext password to verify.
   * @returns {Promise<boolean>}  True if the candidate password matches the stored hash, false otherwise.
   */
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Mongoose schema defining the database structure, validation rules, and indexes for Users.
 */
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      // Require email for standard registration; allow optional for OAuth profiles missing email
      required: function (this: IUser): boolean {
        return !this.googleId;
      },
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      // Password is only mandatory if user is not authenticating via Google OAuth
      required: function (this: IUser): boolean {
        return !this.googleId;
      },
    },

    role: {
      type: String,
      enum: ['player', 'team', 'staff'],
      required: true,
    },

    googleId: {
      type: String,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for role-based user directory searches and OAuth lookups
userSchema.index({ role: 1 });
userSchema.index({ googleId: 1 }, { sparse: true });

/**
 * Pre-save lifecycle middleware to securely hash plaintext passwords using bcrypt.
 *
 * Checks `isModified('password')` to prevent re-hashing an already hashed password
 * during unrelated document updates.
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});

/**
 * Compares a candidate plaintext password with the user's stored bcrypt hash.
 *
 * Immediately returns false if no password exists on the user document
 * (e.g., OAuth-only accounts).
 *
 * @param  {string}  candidatePassword  The plaintext password provided during authentication.
 * @returns {Promise<boolean>}  Resolves to true if matching, false otherwise.
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(
    candidatePassword,
    this.password
  );
};

/** Compiled Mongoose model for User collection operations. */
const User = model<IUser>('User', userSchema);

export default User;