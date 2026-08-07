/**
 * @module backend/models/Team
 *
 * Defines the database schema and TypeScript interfaces for teams.
 */

import { Schema, model, Document, Types } from 'mongoose';

/**
 * Represents a team document in the database.
 *
 * @interface
 */
export interface ITeam extends Document {
  /** @type {Types.ObjectId} The unique identifier of the user who manages this team. */
  userID: Types.ObjectId;
  /** @type {string} The team's official name. */
  name: string;
  /** @type {string} The city where the team is based. */
  city: string;
  /** @type {string} The primary contact email for the team. */
  email: string;
  /** @type {string|undefined} A short description or history of the team. */
  biography?: string;
  /** @type {boolean} Indicates whether the team is actively looking for new players or staff. */
  recruiting: boolean;
  /** @type {Date} When the team record was created. Automatically managed by Mongoose. */
  createdAt: Date;
  /** @type {Date} When the team record was last updated. Automatically managed by Mongoose. */
  updatedAt: Date;
  /** @type {string|undefined} A URL pointing to the team's uploaded CV file. */
  cvUrl?: string;
  /** @type {string|undefined} The original file name of the team's uploaded CV. */
  cvName?: string;
}

/**
 * Mongoose schema corresponding to the ITeam document interface.
 */
const teamSchema = new Schema<ITeam>({
    userID: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    city: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true
    },
    biography: { 
        type: String, 
        required: false,
        trim: true 
    },
    recruiting: { 
        type: Boolean, 
        required: true, 
        default: false
    },
    cvUrl: {
        type: String,
        default: ''
    },
    cvName: {
        type: String,
        default: ''
    }
}, {
    timestamps: true 
});

// Indexes for fast team profile lookup by manager userID and recruiting search
teamSchema.index({ userID: 1 }, { unique: true });
teamSchema.index({ recruiting: 1, city: 1 });

/**
 * Represents the Mongoose model for interacting with the teams collection.
 *
 * Use this model to query, create, or update team data.
 *
 * @class
 */
const Team = model<ITeam>('Team', teamSchema);

export default Team;