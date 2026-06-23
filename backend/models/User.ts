import { Schema, model } from 'mongoose';
interface IUser {
  email: string;
  password: string;
  role: 'player' | 'team' | 'staff';  
}
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['player', 'team', 'staff'],
    required: true
  }
});
const User = model<IUser>('User', userSchema);
export default User;