import { Schema, model } from 'mongoose';

interface IPlayerProfile {
  userID: Schema.Types.ObjectId;
  position: string;
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
      ]
    }
  },
  {
    timestamps: true
  }
);
const PlayerProfile = model<IPlayerProfile>('PlayerProfile', playersSchema);
export default PlayerProfile;