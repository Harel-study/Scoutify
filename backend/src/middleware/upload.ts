import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

// 1. הגדרת אחסון בזיכרון ה-RAM
const storage = multer.memoryStorage();

// 2. רשימת סוגי הקבצים המורשים
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// 3. הגדרת מנגנון העלאת הקבצים
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // מגבלת 10MB
  },
fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only images, videos, and PDFs are supported.'));
  }
},
});

/**
 * 4. מידלוור מעטפת לטיפול בשגיאות העלאה (עוצר שגיאות 400 בצורה נקייה)
 * 
 * @param uploadFn - מתודת ה-upload של מולטר, למשל: upload.single('file') או upload.array('files')
 */
export const handleUpload = (uploadFn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    uploadFn(req, res, (err: any) => {
      // אם השגיאה מגיעה מ-Multer (למשל: קובץ גדול מ-10MB)
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
          message: `File upload error: ${err.message}` 
        });
      } 
      // אם השגיאה מגיעה מה-fileFilter שלנו (סוג קובץ לא נתמך)
      else if (err) {
        return res.status(400).json({ 
          message: err.message 
        });
      }
      
      // הכל תקין - ממשיכים לקונטרולר
      next();
    });
  };
};

export default upload;