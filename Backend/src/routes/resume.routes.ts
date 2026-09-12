import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { resumeUpload } from '../middleware/upload.middleware';
import * as resumeController from '../controllers/resume.controller';
import { Role } from '@prisma/client';

const router = Router();

// Only CANDIDATE can manage personal resumes
router.use(requireAuth, requireRole([Role.CANDIDATE]));

router.post('/upload', resumeUpload.single('resume'), resumeController.uploadResume);
router.get('/', resumeController.getCandidateResumes);
router.delete('/:id', resumeController.deleteResume);

export default router;
