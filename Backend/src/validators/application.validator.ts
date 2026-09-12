import { z } from 'zod';

export const applyJobSchema = z.object({
  body: z.object({
    jobId: z.string().uuid('Invalid job ID'),
    resumeId: z.string().uuid('Invalid resume ID').optional().nullable(),
    coverLetter: z.string().max(2000, 'Cover letter cannot exceed 2000 characters').optional().nullable(),
  }),
});

export const updateApplicationStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid application ID'),
  }),
  body: z.object({
    status: z.enum(['PENDING', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'HIRED']),
    notes: z.string().max(1000).optional().nullable(),
  }),
});
