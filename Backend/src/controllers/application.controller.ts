import { Request, Response, NextFunction } from 'express';
import * as applicationService from '../services/application.service';

export const applyToJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const application = await applicationService.applyToJob(req.user!.userId, req.body);
    res.status(201).json({ success: true, data: { application } });
  } catch (error: any) {
    if (
      error.message === 'You have already applied for this job' ||
      error.message.includes('deadline has passed') ||
      error.message.includes('no longer accepting')
    ) {
      return res.status(400).json({ success: false, message: error.message, code: 'APPLICATION_ERROR' });
    }
    if (error.message === 'Job not found') {
      return res.status(404).json({ success: false, message: error.message, code: 'NOT_FOUND' });
    }
    next(error);
  }
};

export const getCandidateApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const applications = await applicationService.getCandidateApplications(req.user!.userId);
    res.status(200).json({ success: true, data: { applications } });
  } catch (error) {
    next(error);
  }
};

export const withdrawApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const application = await applicationService.withdrawApplication(req.user!.userId, req.params.id as string);
    res.status(200).json({ success: true, data: { application }, message: 'Application withdrawn successfully' });
  } catch (error: any) {
    if (error.message === 'Application not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message.includes('Forbidden')) {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const getJobApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const applications = await applicationService.getJobApplications(
      req.user!.userId,
      req.user!.role,
      req.params.jobId as string,
      req.query.status as any
    );
    res.status(200).json({ success: true, data: { applications } });
  } catch (error: any) {
    if (error.message === 'Job not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message.includes('Forbidden')) {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, notes } = req.body;
    const application = await applicationService.updateApplicationStatus(
      req.user!.userId,
      req.user!.role,
      req.params.id as string,
      status,
      notes
    );
    res.status(200).json({ success: true, data: { application } });
  } catch (error: any) {
    if (error.message === 'Application not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message.includes('Forbidden')) {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};
