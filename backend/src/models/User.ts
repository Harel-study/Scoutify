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

  comparePassword(candidatePassword: string): Promise<boolean>;
}

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
      required: function (this: IUser): boolean {
      return !this.googleId;
  }
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

/**
 * Hash password before saving
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
 * Compare candidate password with stored hash
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
const User = model<IUser>('User', userSchema);
export default User;