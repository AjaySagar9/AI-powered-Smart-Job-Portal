import { Request, Response, NextFunction } from 'express';
import * as resumeService from '../services/resume.service';

export const uploadResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please provide a valid resume file (PDF, DOC, DOCX)' });
    }

    const resume = await resumeService.uploadResume(req.user!.userId, req.file);
    res.status(201).json({ success: true, data: { resume } });
  } catch (error) {
    next(error);
  }
};

export const getCandidateResumes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resumes = await resumeService.getCandidateResumes(req.user!.userId);
    res.status(200).json({ success: true, data: { resumes } });
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await resumeService.deleteResume(req.user!.userId, req.params.id as string);
    res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (error: any) {
    if (error.message.includes('not found') || error.message.includes('unauthorized')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};
