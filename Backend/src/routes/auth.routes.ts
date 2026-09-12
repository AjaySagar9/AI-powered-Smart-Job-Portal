import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import {
  validateRequest,
  registerCandidateSchema,
  registerRecruiterSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../validators/auth.validator';
import { requireAuth } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// Apply rate limiting to sensitive authentication endpoints
router.use(authRateLimiter);

router.post('/register', validateRequest(registerCandidateSchema), authController.registerCandidate);
router.post('/register-recruiter', validateRequest(registerRecruiterSchema), authController.registerRecruiter);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh', validateRequest(refreshSchema), authController.refresh);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);
router.post('/verify-email', validateRequest(verifyEmailSchema), authController.verifyEmail);

// Protected routes
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.getMe);

export default router;
