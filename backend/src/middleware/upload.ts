import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

// 1. Configure RAM memory storage
const storage = multer.memoryStorage();

// 2. Allowed file MIME types list
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

// 3. Configure upload middleware instance
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
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
 * 4. Wrapper middleware for upload error handling (gracefully intercepts 400 upload errors)
 * 
 * @param uploadFn - Multer upload method, e.g. upload.single('file') or upload.array('files')
 */
export const handleUpload = (uploadFn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    uploadFn(req, res, (err: any) => {
      // If error originated from Multer (e.g. file larger than 10MB)
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
          message: `File upload error: ${err.message}` 
        });
      } 
      // If error originated from fileFilter (unsupported file type)
      else if (err) {
        return res.status(400).json({ 
          message: err.message 
        });
      }
      
      // All checks passed - proceed to controller
      next();
    });
  };
};

export default upload;