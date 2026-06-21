import { Schema, model } from 'mongoose';

interface IPlayerProfile {
  userID: Schema.Types.ObjectId;
  position: string;
  heightCm?: number;
  weightKg?: number;
  preferredFoot: 'Right' | 'Left' | 'Both';
  currentTeam?: string;
  contractStatus: 'Free-Agent' | 'Under-Contract' | 'Loan' | 'Trial';
  isLookingForJob: boolean;
  bio?: string;
  profileImage?: string;
}
const playersSchema = new Schema<IPlayerProfile>(
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
        trim: true
        default:'',
    },
    contractStatus: {
        type: String,
        enum: ['Free-Agent', 'Under-Contract', 'Loan', 'Retired', 'Transfer Listed', 'Trial'],
        default: 'Free-Agent'
    },
  },
  {
    timestamps: true
  },
);
const PlayerProfile = model<IPlayerProfile>('PlayerProfile', playersSchema);
export default PlayerProfile;