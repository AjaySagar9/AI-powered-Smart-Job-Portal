import { Request, Response, NextFunction } from 'express';
import * as bookmarkService from '../services/bookmark.service';

export const toggleBookmark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bookmarkService.toggleBookmark(req.user!.userId, req.params.jobId as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getBookmarkedJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await bookmarkService.getBookmarkedJobs(req.user!.userId);
    res.status(200).json({ success: true, data: { jobs } });
  } catch (error) {
    next(error);
  }
};
