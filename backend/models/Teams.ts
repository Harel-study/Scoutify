/**
 * @module backend/models/Team
 *
 * Defines the database schema and TypeScript interfaces for teams.
 */

import mongoose, { Schema, Document } from 'mongoose';

/**
 * Represents a team document in the database.
 */
export interface ITeam extends Document {
  /** The team's name */
  name: string;
  /** The team's city */
  city: string;
  /** The team's email */
  email: string;
  /** The team's biography */
  biography?: string;
  /** Indicates if the team is actively recruiting */
  recruiting: boolean;
  /** The date when the team record was created. */
  createdAt: Date;
  /** The date when the team record was last updated. */
  updatedAt: Date;
}

/**
 * Mongoose schema corresponding to the ITeam document interface.
 */
const teamSchema = new Schema<ITeam>({
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
        unique: true, // מומלץ להוסיף ייחודיות לאימייל
        trim: true,
        lowercase: true
    },
    biography: { 
        type: String, 
        required: false, // שדה אופציונלי על פי הטבלה
        trim: true 
    },
    recruiting: { 
        type: Boolean, 
        required: true, 
        default: false // מוגדר כ-default=false בטבלה
    }
}, {
    // מייצר אוטומטית את השדות createdAt ו-updatedAt כפי שנדרש בטבלה
    timestamps: true 
});

// יצירת המודל - השם 'Teams' תואם בדיוק ל-enum של ה-Post ששלחת
const Teams = mongoose.model<ITeam>('Team', teamSchema);

export default Teams;