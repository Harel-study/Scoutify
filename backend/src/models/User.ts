import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  username: string;
  email?: string;
  password?: string;
  role: 'player' | 'team' | 'staff';
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String, 
    unique: true, 
    sparse: true,
    lowercase: true, 
    trim: true 
  },
  password: {
    type: String, 
    required: function(this: any) {
      // Password is required only if googleId is not provided
      return !this.googleId;
    }
  },
  role: {
    type: String,
    enum: ['player', 'team', 'staff'],
    required: true
  },
  googleId: {
    type: String,
    sparse: true // Allows multiple null/undefined values while ensuring uniqueness for existing IDs
  }
}, {timestamps: true});
// Pre-save hook to hash password if modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = model<IUser>('User', userSchema);
export default User;