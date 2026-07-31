import type { Request, Response, NextFunction } from 'express';
import { improvePostContent } from '../services/aiService.js';

export const improvePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { content } = req.body;

    if (typeof content !== 'string' || !content.trim()) {
      res.status(400).json({
        success: false,
        message: 'Post content is required',
      });
      return;
    }

    const result = await improvePostContent(content);

    res.status(200).json({
      success: true,
      data: {
        originalContent: content,
        ...result,
      },
    });
  } catch (error) {
    next(error);
  }
};