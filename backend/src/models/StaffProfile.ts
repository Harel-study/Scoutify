/**
 * @module StaffProfileModel
 *
 * Defines the Mongoose schema and model for staff profiles.
 * Stores professional details for users operating as team staff members
 * (e.g., coaches, managers, medical staff) separate from standard user data.
 */
import { Schema, model, Types } from 'mongoose';

/**
 * Represents the structure of a Staff Profile document in the database.
 *
 * @interface
 */
export interface IStaffProfile {
  /** @type {Types.ObjectId} The unique identifier of the associated User account. */
  userID: Types.ObjectId;
  /** @type {string} A title or description of the staff member's specific role. */
  roleDescription: string;
  /** @type {number|undefined} Total years of professional experience in their field. */
  experienceYears?: number;
  /** @type {string[]|undefined} A list of professional certifications or qualifications. */
  certifications?: string[];
  /** @type {string|undefined} The name of the team or club the staff member currently works for. */
  currentTeam?: string;
  /** @type {boolean} Indicates whether the staff member is actively seeking new employment. */
  isLookingForJob: boolean;
  /** @type {string|undefined} A short professional biography or summary. */
  bio?: string;
  /** @type {string|undefined} A URL pointing to the staff member's profile picture. */
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

const staffProfileSchema = new Schema<IStaffProfile>({
  userID: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  roleDescription: { type: String, required: true, trim: true },
  experienceYears: { type: Number, min: 0, max: 80 },
  certifications: { type: [String], default: [] },
  currentTeam: { type: String, trim: true, default: '' },
  isLookingForJob: { type: Boolean, default: true },
  bio: { type: String, trim: true, maxlength: 500 },
  profileImage: { type: String, default: '' },
  cvUrl: { type: String, default: '' },
  cvName: { type: String, default: '' }
}, { timestamps: true });

// Indexes for fast profile lookups by userID and job-seeking status
staffProfileSchema.index({ userID: 1 }, { unique: true });
staffProfileSchema.index({ isLookingForJob: 1 });

/**
 * Represents the Mongoose model for interacting with the staff profiles collection.
 *
 * Use this model to query, create, or update staff-specific data.
 *
 * @class
 */
const StaffProfile = model<IStaffProfile>('StaffProfile', staffProfileSchema);
export default StaffProfile;
