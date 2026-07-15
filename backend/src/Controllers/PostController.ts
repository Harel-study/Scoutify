/**
 * @module backend/controllers/postController
 * * הלוגיקה העסקית לניהול פוסטים (CRUD) עם תמיכה ביוצרים דינמיים (User/Team).
 */

import { Request, Response } from 'express';
import Post from '../models/Post'; // ודא שהנתיב למודל מדויק

/**
 * יצירת פוסט חדש (על ידי משתמש או קבוצה)
 * POST /api/posts
 */
export const createPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { profileId, profileModel, content, media, targetRole, location } = req.body;

        // ולידציה בסיסית לשדות חובה
        if (!profileId || !profileModel || !content) {
            res.status(400).json({ message: 'נא לספק את כל שדות החובה: profileId, profileModel, content' });
            return;
        }

        const newPost = new Post({
            profileId,
            profileModel,
            content,
            media,
            targetRole,
            location
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error: any) {
        res.status(500).json({ message: 'שגיאה ביצירת הפוסט', error: error.message });
    }
};

/**
 * קבלת כל הפוסטים (כולל סינונים מתקדמים ללוח דרושים/פיד)
 * GET /api/posts
 */
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { targetRole, location, profileModel, profileId } = req.query;
        const filter: any = {};

        // סינון לפי תפקיד יעד (למשל: "שוער", "מאמן כושר")
        if (targetRole) {
            filter.targetRole = { $regex: String(targetRole), $options: 'i' }; // חיפוש גמיש (Case-insensitive)
        }

        // סינון לפי מיקום/עיר
        if (location) {
            filter.location = { $regex: String(location), $options: 'i' };
        }

        // סינון לפי סוג היוצר (רק פוסטים של קבוצות או רק של משתמשים)
        if (profileModel) {
            filter.profileModel = String(profileModel);
        }

        // סינון פוסטים של יוצר ספציפי (למשל לצורך הצגה בפרופיל שלו)
        if (profileId) {
            filter.profileId = String(profileId);
        }

        // שליפת הפוסטים וביצוע Populate אוטומטי לפי ה-refPath הדינמי
        const posts = await Post.find(filter)
            .sort({ createdAt: -1 }) // הפיד יציג קודם כל את הפוסטים החדשים ביותר
            .populate('profileId');  // מונגוס ידע לבד אם לפנות ל-User או ל-Team בזכות ה-refPath

        res.status(200).json(posts);
    } catch (error: any) {
        res.status(500).json({ message: 'שגיאה בקבלת הפוסטים', error: error.message });
    }
};

/**
 * קבלת פוסט בודד לפי מזהה
 * GET /api/posts/:id
 */
export const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await Post.findById(req.params.id).populate('profileId');
        if (!post) {
            res.status(404).json({ message: 'הפוסט לא נמצא' });
            return;
        }
        res.status(200).json(post);
    } catch (error: any) {
        res.status(500).json({ message: 'שגיאה בקבלת הפוסט', error: error.message });
    }
};

/**
 * עדכון פוסט קיים
 * PUT /api/posts/:id
 */
export const updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { content, media, targetRole, location } = req.body;

        // הערה: אנחנו לא מאפשרים לעדכן את ה-profileId או profileModel לאחר שהפוסט נוצר מטעמי אבטחה
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { content, media, targetRole, location },
            { new: true, runValidators: true }
        ).populate('profileId');

        if (!updatedPost) {
            res.status(404).json({ message: 'הפוסט לא נמצא' });
            return;
        }

        res.status(200).json(updatedPost);
    } catch (error: any) {
        res.status(500).json({ message: 'שגיאה בעדכון הפוסט', error: error.message });
    }
};

/**
 * מחיקת פוסט מהמערכת
 * DELETE /api/posts/:id
 */
export const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            res.status(404).json({ message: 'הפוסט לא נמצא' });
            return;
        }
        res.status(200).json({ message: 'הפוסט נמחק בהצלחה' });
    } catch (error: any) {
        res.status(500).json({ message: 'שגיאה במחיקת הפוסט', error: error.message });
    }
};