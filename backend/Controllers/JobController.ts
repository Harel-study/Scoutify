/**
 * @module backend/controllers/jobController
 * * הלוגיקה העסקית לניהול משרות וגיוסים (CRUD).
 */

import { Request, Response } from 'express';
import Job from '../models/Job'; // ודא שהנתיב למודל מדויק

/**
 * יצירת משרת דרושים חדשה
 * POST /api/jobs
 */
export const createJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const { profileId, profileModel, title, description, city, jobType, status } = req.body;

        // ולידציה בסיסית לשדות חובה
        if (!profileId || !profileModel || !title || !description || !city || !jobType) {
            res.status(400).json({ message: 'נא למלא את כל שדות החובה הנדרשים ליצירת משרה.' });
            return;
        }

        const newJob = new Job({
            profileId,
            profileModel,
            title,
            description,
            city,
            jobType,
            status // אם לא נשלח, ה-default בסכמה הוא true (פתוחה)
        });

        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error: any) {
        res.status(500).json({ message: 'שגיאה בפרסום המשרה', error: error.message });
    }
};
/**
 * קבלת רשימת משרות (כולל סינונים ללוח המשרות)
 * GET /api/jobs
 */
export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { city, jobType, status, profileId } = req.query;
        const filter: any = {};

        // כברירת מחדל, נרצה להציג רק משרות פתוחות (status: true), אלא אם התבקש אחרת במפורש
        if (status !== undefined) {
            filter.status = status === 'true';
        } else {
            filter.status = true; 
        }

        // סינון לפי עיר (חיפוש גמיש)
        if (city) {
            filter.city = { $regex: String(city), $options: 'i' };
        }
        // סינון לפי סוג משרה (Full-Time, Part-Time וכו')
        if (jobType) {
            filter.jobType = String(jobType);
        }
        // סינון לפי מפרסם ספציפי (למשל, כדי להציג לקבוצה את כל המשרות שהיא עצמה פרסמה)
        if (profileId) {
            filter.profileId = String(profileId);
        }
        // שליפת המשרות וביצוע Populate דינמי לפרטי המפרסם
        const jobs = await Job.find(filter)
            .sort({ createdAt: -1 }) // הצגת המשרות החדשות ביותר למעלה
            .populate('profileId');
        res.status(200).json(jobs);
    } catch (error: any) {
        res.status(500).json({ message: 'שגיאה בקבלת רשימת המשרות', error: error.message });
    }
};
/**
 * קבלת פרטי משרה בודדת לפי מזהה (ID)
 * GET /api/jobs/:id
 */
export const getJobById = async (req: Request, res: Response): Promise<void> => {
    try {
        const job = await Job.findById(req.params.id).populate('profileId');
        if (!job) {
            res.status(404).json({ message: 'המשרה לא נמצאה' });
            return;
        }
        res.status(200).json(job);
    } catch (error: any) {
        res.status(500).json({ message: 'שגיאה בקבלת נתוני המשרה', error: error.message });
    }
};
/**
 * עדכון פרטי משרה קיימת (או סגירת משרה על ידי שינוי ה-status)
 * PUT /api/jobs/:id
 */
export const updateJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, city, jobType, status } = req.body;

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            { title, description, city, jobType, status },
            { new: true, runValidators: true }
        ).populate('profileId');

        if (!updatedJob) {
            res.status(404).json({ message: 'המשרה לא נמצאה' });
            return;
        }
        res.status(200).json(updatedJob);
    } catch (error: any) {
        res.status(500).json({ message: 'שגיאה בעדכון המשרה', error: error.message });
    }
};
/**
 * מחיקת משרה מהמערכת
 * DELETE /api/jobs/:id
 */
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        if (!deletedJob) {
            res.status(404).json({ message: 'המשרה לא נמצאה' });
            return;
        }
        res.status(200).json({ message: 'המשרה נמחקה בהצלחה מהמערכת' });
    } catch (error: any) {
        res.status(500).json({ message: 'שגיאה במחיקת המשרה', error: error.message });
    }
};