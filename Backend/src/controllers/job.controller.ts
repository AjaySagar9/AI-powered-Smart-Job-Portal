import { Request, Response, NextFunction } from 'express';
import * as jobService from '../services/job.service';

export const createJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.createJob(req.user!.userId, req.body);
    res.status(201).json({ success: true, data: { job } });
  } catch (error: any) {
    if (error.message.includes('not found') || error.message.includes('Only recruiters')) {
      return res.status(403).json({ success: false, message: error.message, code: 'FORBIDDEN' });
    }
    next(error);
  }
};

export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await jobService.getJobs(req.query, req.user?.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.getJobById(req.params.id as string, req.user?.userId);
    res.status(200).json({ success: true, data: { job } });
  } catch (error: any) {
    if (error.message === 'Job not found') {
      return res.status(404).json({ success: false, message: error.message, code: 'NOT_FOUND' });
    }
    next(error);
  }
};

export const updateJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.updateJob(req.params.id as string, req.user!.userId, req.user!.role, req.body);
    res.status(200).json({ success: true, data: { job } });
  } catch (error: any) {
    if (error.message === 'Job not found') {
      return res.status(404).json({ success: false, message: error.message, code: 'NOT_FOUND' });
    }
    if (error.message.includes('Forbidden')) {
      return res.status(403).json({ success: false, message: error.message, code: 'FORBIDDEN' });
    }
    next(error);
  }
};

export const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await jobService.deleteJob(req.params.id as string, req.user!.userId, req.user!.role);
    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Job not found') {
      return res.status(404).json({ success: false, message: error.message, code: 'NOT_FOUND' });
    }
    if (error.message.includes('Forbidden')) {
      return res.status(403).json({ success: false, message: error.message, code: 'FORBIDDEN' });
    }
    next(error);
  }
};

export const updateJobStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.updateJobStatus(
      req.params.id as string,
      req.user!.userId,
      req.user!.role,
      req.body.status
    );
    res.status(200).json({ success: true, data: { job } });
  } catch (error: any) {
    if (error.message === 'Job not found') {
      return res.status(404).json({ success: false, message: error.message, code: 'NOT_FOUND' });
    }
    if (error.message.includes('Forbidden')) {
      return res.status(403).json({ success: false, message: error.message, code: 'FORBIDDEN' });
    }
    next(error);
  }
};

export const getRecruiterJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await jobService.getRecruiterJobs(req.user!.userId, req.query.status as any);
    res.status(200).json({ success: true, data: { jobs } });
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message, code: 'NOT_FOUND' });
    }
    next(error);
  }
};
