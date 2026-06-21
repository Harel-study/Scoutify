/**
 * @module backend/models/Job
 *
 * Defines the database schema and TypeScript interface for job postings.
 * Jobs can be posted by either individual Users or Teams.
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * Represents a job posting document in the database.
 */
export interface IJob extends Document {
  /** Reference to the User or Team profile that created the job posting. */
  profileId: Types.ObjectId;
  /** Discriminator field pointing to either the 'User' or 'Team' collection. */
  profileModel: 'User' | 'Team';
  /** The title of the job position. */
  title: string;
  /** Detailed description of the job role and requirements. */
  description: string;
  /** The city where the job is located. */
  city: string;
  /** The employment type classification. */
  jobType: 'Full-Time' | 'Part-Time' | 'Shift-work' | 'Contract' | 'Temporary' | 'Internship';
  /** The status of the posting: true if open/active, false if closed/filled. */
  status: boolean;
  /** The date when the job record was created. */
  createdAt: Date;
  /** The date when the job record was last updated. */
  updatedAt: Date;
}

/**
 * Mongoose schema corresponding to the IJob document interface.
 */
const jobSchema = new Schema<IJob>({
    profileId: { type: Schema.Types.ObjectId, required: true, refPath: 'profileModel' },
    profileModel: { type: String, required: true, enum: ['User', 'Team'] },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    jobType: { 
      type: String, 
      enum: ['Full-Time', 'Part-Time', 'Shift-work', 'Contract', 'Temporary', 'Internship'], 
      required: true 
    },
    status: { type: Boolean, default: true },
}, {
    timestamps: true
});

const Job = mongoose.model<IJob>('Job', jobSchema);

export default Job;
