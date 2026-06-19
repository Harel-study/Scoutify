import mongoose, { Schema, Document, Types } from 'mongoose';

// interface representing a document in MongoDB.
export interface IJob extends Document {
  profileId: Types.ObjectId; // Reference to the user or team who created the job
  profileModel: 'User' | 'Team'; // Identifies which collection profileId belongs to
  title: string;
  description: string;
  city: string;
  jobType: 'Full-Time' | 'Part-Time' | 'Shift-work' | 'Contract' | 'Temporary' | 'Internship';
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema corresponding to the document interface.
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
    // Status: true = Open, false = Closed/Filled
    status: { type: Boolean, default: true },
}, {
    timestamps: true
});

const Job = mongoose.model<IJob>('Job', jobSchema);

export default Job;
