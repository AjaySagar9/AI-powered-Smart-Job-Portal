import { Router } from 'express';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.middleware';
import { validateRequest } from '../validators/auth.validator';
import {
  createJobSchema,
  updateJobSchema,
  updateJobStatusSchema,
  queryJobSchema,
} from '../validators/job.validator';
import * as jobController from '../controllers/job.controller';
import { Role } from '@prisma/client';

const router = Router();

// Public / Candidate / Recruiter browsable jobs
router.get('/', optionalAuth, validateRequest(queryJobSchema), jobController.getJobs);

// Recruiter specific listing
router.get(
  '/recruiter/my-jobs',
  requireAuth,
  requireRole([Role.RECRUITER, Role.ADMIN]),
  jobController.getRecruiterJobs
);

// Job details
router.get('/:id', optionalAuth, jobController.getJobById);

// Job creation (Recruiter / Admin only)
router.post(
  '/',
  requireAuth,
  requireRole([Role.RECRUITER, Role.ADMIN]),
  validateRequest(createJobSchema),
  jobController.createJob
);

// Job update (Owner or Admin)
router.put(
  '/:id',
  requireAuth,
  requireRole([Role.RECRUITER, Role.ADMIN]),
  validateRequest(updateJobSchema),
  jobController.updateJob
);

// Job status update (Owner or Admin)
router.patch(
  '/:id/status',
  requireAuth,
  requireRole([Role.RECRUITER, Role.ADMIN]),
  validateRequest(updateJobStatusSchema),
  jobController.updateJobStatus
);

// Job deletion (Owner or Admin)
router.delete(
  '/:id',
  requireAuth,
  requireRole([Role.RECRUITER, Role.ADMIN]),
  jobController.deleteJob
);

export default router;
