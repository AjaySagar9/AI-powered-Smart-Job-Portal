import { z } from 'zod';

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Job title must be at least 3 characters'),
    description: z.string().min(10, 'Job description must be at least 10 characters'),
    location: z.string().optional(),
    employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT']).default('FULL_TIME'),
    workMode: z.enum(['REMOTE', 'HYBRID', 'ONSITE']).default('ONSITE'),
    experienceMin: z.coerce.number().min(0).optional(),
    experienceMax: z.coerce.number().min(0).optional(),
    salaryMin: z.coerce.number().min(0).optional(),
    salaryMax: z.coerce.number().min(0).optional(),
    skills: z.array(z.string()).default([]),
    qualification: z.string().optional(),
    responsibilities: z.array(z.string()).optional().default([]),
    benefits: z.array(z.string()).optional().default([]),
    applicationDeadline: z.string().optional().nullable(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'EXPIRED']).default('DRAFT'),
  }),
});

export const updateJobSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid job ID'),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    location: z.string().optional().nullable(),
    employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT']).optional(),
    workMode: z.enum(['REMOTE', 'HYBRID', 'ONSITE']).optional(),
    experienceMin: z.coerce.number().min(0).optional().nullable(),
    experienceMax: z.coerce.number().min(0).optional().nullable(),
    salaryMin: z.coerce.number().min(0).optional().nullable(),
    salaryMax: z.coerce.number().min(0).optional().nullable(),
    skills: z.array(z.string()).optional(),
    qualification: z.string().optional().nullable(),
    responsibilities: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional(),
    applicationDeadline: z.string().optional().nullable(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'EXPIRED']).optional(),
  }),
});

export const updateJobStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid job ID'),
  }),
  body: z.object({
    status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'EXPIRED']),
  }),
});

export const queryJobSchema = z.object({
  query: z.object({
    keyword: z.string().optional(),
    location: z.string().optional(),
    employmentType: z.string().optional(), // Can be comma-separated or single
    workMode: z.string().optional(),
    experienceMin: z.coerce.number().optional(),
    experienceMax: z.coerce.number().optional(),
    salaryMin: z.coerce.number().optional(),
    salaryMax: z.coerce.number().optional(),
    skills: z.string().optional(), // Comma-separated list
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sort: z.enum(['recent', 'salary_high', 'salary_low']).default('recent'),
  }),
});
