import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import * as bookmarkController from '../controllers/bookmark.controller';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth, requireRole([Role.CANDIDATE]));

router.post('/:jobId', bookmarkController.toggleBookmark);
router.get('/', bookmarkController.getBookmarkedJobs);

export default router;
