/**
 * @module PlayerProfileModel
 *
 * Defines the Mongoose schema and model for player profiles.
 * Encapsulates player-specific attributes such as physical characteristics,
 * field position, and current contract status, linked to a base user account.
 */
import { Schema, model, Types } from 'mongoose';

/**
 * Represents the structure of a Player Profile document in the database.
 *
 * Stores detailed athletic and professional information for users who are registered
 * as players. This data is kept separate from the base User model to organize
 * role-specific fields.
 *
 * @interface
 */
export interface IPlayerProfile {
  /** @type {Types.ObjectId} The unique identifier of the associated User account. */
  userID: Types.ObjectId;
  /** @type {string} The primary role or position the player takes on the field. */
  position: 'Goalkeeper' | 'Center Back' | 'Left-Back' | 'Right-Back' | 'Defensive Midfielder' | 'Central Midfielder' | 'Attacking Midfielder' | 'Left Winger' | 'Right Winger' | 'Striker';
  /** @type {number|undefined} The player's height in centimeters. */
  heightCm?: number;
  /** @type {number|undefined} The player's weight in kilograms. */
  weightKg?: number;
  /** @type {string} The player's dominant foot for playing. */
  preferredFoot: 'Right' | 'Left' | 'Both';
  /** @type {string|undefined} The name of the club or team the player is currently affiliated with. */
  currentTeam?: string;
  /** @type {string} The player's current professional or contractual situation. */
  contractStatus: 'Free-Agent' | 'Under-Contract' | 'Loan' | 'Retired' | 'Transfer Listed' | 'Trial';
  /** @type {boolean} Indicates whether the player is actively seeking new opportunities. */
  isLookingForJob: boolean;
  /** @type {string|undefined} A short biography or personal statement provided by the player. */
  bio?: string;
  /** @type {string|undefined} A URL pointing to the player's profile picture. */
  profileImage?: string;
  /** @type {Date} When the profile was initially created. Automatically managed by Mongoose. */
  createdAt: Date;
  /** @type {Date} When the profile was last modified. Automatically managed by Mongoose. */
  updatedAt: Date;
  /** @type {string|undefined} A URL pointing to the user's uploaded CV file. */
  cvUrl?: string;
  /** @type {string|undefined} The original file name of the user's uploaded CV. */
  cvName?: string;
}
const playerProfileSchema = new Schema<IPlayerProfile>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    position: {
      type: String,
      required: true,
      enum: [
        'Goalkeeper',
        'Center Back',
        'Left-Back',
        'Right-Back',
        'Defensive Midfielder',
        'Central Midfielder',
        'Attacking Midfielder',
        'Left Winger',
        'Right Winger',
        'Striker'
      ],
    },
    heightCm:{
        type: Number,
        min: 100,
        max: 250
      },
    weightKg: {
        type: Number,
        min: 30,
        max: 150
        },
    preferredFoot: {
        type: String,
        enum: ['Left', 'Right', 'Both'],
        required: true
    },
    currentTeam: {
        type: String,
        trim: true,
        default:'',
    },
    contractStatus: {
        type: String,
        enum: ['Free-Agent', 'Under-Contract', 'Loan', 'Retired', 'Transfer Listed', 'Trial'],
        default: 'Free-Agent'
    },
    isLookingForJob: {
      type: Boolean,
      default: true
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500
    },
    profileImage: {
      type: String,
      default: ''
    },
    cvUrl: {
      type: String,
      default: ''
    },
    cvName: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast profile resolution by userID and scouting query filters
playerProfileSchema.index({ userID: 1 }, { unique: true });
playerProfileSchema.index({ position: 1, isLookingForJob: 1 });
playerProfileSchema.index({ contractStatus: 1 });
/**
 * Represents the Mongoose model for interacting with the player profiles collection.
 *
 * Use this model to query, create, or update player-specific data.
 *
 * @class
 */
const PlayerProfile = model<IPlayerProfile>('PlayerProfile', playerProfileSchema);
export default PlayerProfile;