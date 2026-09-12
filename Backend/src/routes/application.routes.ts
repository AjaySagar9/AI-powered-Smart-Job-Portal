import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validateRequest } from '../validators/auth.validator';
import {
  applyJobSchema,
  updateApplicationStatusSchema,
} from '../validators/application.validator';
import * as applicationController from '../controllers/application.controller';
import { Role } from '@prisma/client';

const router = Router();

// Candidate: Apply to job
router.post(
  '/',
  requireAuth,
  requireRole([Role.CANDIDATE]),
  validateRequest(applyJobSchema),
  applicationController.applyToJob
);

// Candidate: View own applications
router.get(
  '/my-applications',
  requireAuth,
  requireRole([Role.CANDIDATE]),
  applicationController.getCandidateApplications
);

// Candidate: Withdraw application
router.patch(
  '/:id/withdraw',
  requireAuth,
  requireRole([Role.CANDIDATE]),
  applicationController.withdrawApplication
);

// Recruiter: View applicants for a specific job
router.get(
  '/job/:jobId',
  requireAuth,
  requireRole([Role.RECRUITER, Role.ADMIN]),
  applicationController.getJobApplications
);

// Recruiter: Update applicant status & notes
router.patch(
  '/:id/status',
  requireAuth,
  requireRole([Role.RECRUITER, Role.ADMIN]),
  validateRequest(updateApplicationStatusSchema),
  applicationController.updateApplicationStatus
);

export default router;
