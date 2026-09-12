import { prisma } from '../utils/prisma';
import { Role, JobStatus, EmploymentType, WorkMode, Prisma } from '@prisma/client';

export const createJob = async (userId: string, data: any) => {
  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    throw new Error('Recruiter profile not found. Only recruiters can create jobs.');
  }

  const {
    title,
    description,
    location,
    employmentType,
    workMode,
    experienceMin,
    experienceMax,
    salaryMin,
    salaryMax,
    skills,
    qualification,
    responsibilities,
    benefits,
    applicationDeadline,
    status = JobStatus.DRAFT,
  } = data;

  const job = await prisma.job.create({
    data: {
      title,
      description,
      location,
      employmentType: employmentType as EmploymentType,
      workMode: workMode as WorkMode,
      experienceMin: experienceMin !== undefined ? Number(experienceMin) : null,
      experienceMax: experienceMax !== undefined ? Number(experienceMax) : null,
      salaryMin: salaryMin !== undefined ? Number(salaryMin) : null,
      salaryMax: salaryMax !== undefined ? Number(salaryMax) : null,
      skills: Array.isArray(skills) ? skills : [],
      qualification,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
      status: status as JobStatus,
      companyId: recruiter.companyId,
      recruiterId: recruiter.id,
    },
    include: {
      company: true,
    },
  });

  return job;
};

export const getJobs = async (query: any, currentUserId?: string) => {
  const {
    keyword,
    location,
    employmentType,
    workMode,
    experienceMin,
    experienceMax,
    salaryMin,
    salaryMax,
    skills,
    page = 1,
    limit = 10,
    sort = 'recent',
    status = JobStatus.PUBLISHED,
  } = query;

  const take = Math.min(Number(limit) || 10, 50);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const where: Prisma.JobWhereInput = {};

  if (status) {
    where.status = status as JobStatus;
  }

  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: 'insensitive' } },
      { description: { contains: keyword, mode: 'insensitive' } },
      { company: { name: { contains: keyword, mode: 'insensitive' } } },
      { skills: { has: keyword } },
    ];
  }

  if (location) {
    where.location = { contains: location, mode: 'insensitive' };
  }

  if (employmentType) {
    const types = typeof employmentType === 'string' ? employmentType.split(',') : [employmentType];
    where.employmentType = { in: types as EmploymentType[] };
  }

  if (workMode) {
    const modes = typeof workMode === 'string' ? workMode.split(',') : [workMode];
    where.workMode = { in: modes as WorkMode[] };
  }

  if (experienceMin !== undefined || experienceMax !== undefined) {
    where.AND = where.AND || [];
    if (experienceMin !== undefined && !isNaN(Number(experienceMin))) {
      (where.AND as Prisma.JobWhereInput[]).push({
        OR: [
          { experienceMin: { gte: Number(experienceMin) } },
          { experienceMin: null },
        ],
      });
    }
    if (experienceMax !== undefined && !isNaN(Number(experienceMax))) {
      (where.AND as Prisma.JobWhereInput[]).push({
        OR: [
          { experienceMax: { lte: Number(experienceMax) } },
          { experienceMax: null },
        ],
      });
    }
  }

  if (salaryMin !== undefined && !isNaN(Number(salaryMin))) {
    where.salaryMin = { gte: Number(salaryMin) };
  }

  if (salaryMax !== undefined && !isNaN(Number(salaryMax))) {
    where.salaryMax = { lte: Number(salaryMax) };
  }

  if (skills) {
    const skillList = typeof skills === 'string' ? skills.split(',').map((s) => s.trim()) : skills;
    where.skills = { hasSome: skillList };
  }

  let orderBy: Prisma.JobOrderByWithRelationInput = { createdAt: 'desc' };
  if (sort === 'salary_high') {
    orderBy = { salaryMax: 'desc' };
  } else if (sort === 'salary_low') {
    orderBy = { salaryMin: 'asc' };
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      take,
      skip,
      orderBy,
      include: {
        company: {
          select: { id: true, name: true, logoUrl: true, location: true },
        },
        _count: {
          select: { applications: true },
        },
        ...(currentUserId
          ? {
              bookmarks: {
                where: { candidateId: currentUserId },
                select: { id: true },
              },
              applications: {
                where: { candidateId: currentUserId },
                select: { id: true, status: true },
              },
            }
          : {}),
      },
    }),
    prisma.job.count({ where }),
  ]);

  const formattedJobs = jobs.map((job: any) => ({
    ...job,
    isBookmarked: currentUserId ? (job.bookmarks?.length || 0) > 0 : false,
    hasApplied: currentUserId ? (job.applications?.length || 0) > 0 : false,
    applicationStatus: currentUserId && job.applications?.length > 0 ? job.applications[0].status : null,
    bookmarks: undefined,
  }));

  return {
    jobs: formattedJobs,
    pagination: {
      total,
      page: Number(page),
      limit: take,
      totalPages: Math.ceil(total / take) || 1,
    },
  };
};

export const getJobById = async (id: string, currentUserId?: string) => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: true,
      recruiter: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      _count: {
        select: { applications: true },
      },
      ...(currentUserId
        ? {
            bookmarks: {
              where: { candidateId: currentUserId },
              select: { id: true },
            },
            applications: {
              where: { candidateId: currentUserId },
              select: { id: true, status: true, createdAt: true },
            },
          }
        : {}),
    },
  });

  if (!job) {
    throw new Error('Job not found');
  }

  const isBookmarked = currentUserId ? ((job as any).bookmarks?.length || 0) > 0 : false;
  const userApplication = currentUserId && (job as any).applications?.length > 0 ? (job as any).applications[0] : null;

  return {
    ...job,
    isBookmarked,
    hasApplied: !!userApplication,
    application: userApplication,
    bookmarks: undefined,
  };
};

export const updateJob = async (id: string, userId: string, userRole: Role, data: any) => {
  const existingJob = await prisma.job.findUnique({
    where: { id },
    include: { recruiter: true },
  });

  if (!existingJob) {
    throw new Error('Job not found');
  }

  if (userRole !== Role.ADMIN && existingJob.recruiter.userId !== userId) {
    throw new Error('Forbidden: You can only edit your own jobs');
  }

  const {
    title,
    description,
    location,
    employmentType,
    workMode,
    experienceMin,
    experienceMax,
    salaryMin,
    salaryMax,
    skills,
    qualification,
    responsibilities,
    benefits,
    applicationDeadline,
    status,
  } = data;

  const updatedJob = await prisma.job.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(location !== undefined && { location }),
      ...(employmentType && { employmentType: employmentType as EmploymentType }),
      ...(workMode && { workMode: workMode as WorkMode }),
      ...(experienceMin !== undefined && { experienceMin: experienceMin ? Number(experienceMin) : null }),
      ...(experienceMax !== undefined && { experienceMax: experienceMax ? Number(experienceMax) : null }),
      ...(salaryMin !== undefined && { salaryMin: salaryMin ? Number(salaryMin) : null }),
      ...(salaryMax !== undefined && { salaryMax: salaryMax ? Number(salaryMax) : null }),
      ...(skills && { skills: Array.isArray(skills) ? skills : [] }),
      ...(qualification !== undefined && { qualification }),
      ...(responsibilities && { responsibilities: Array.isArray(responsibilities) ? responsibilities : [] }),
      ...(benefits && { benefits: Array.isArray(benefits) ? benefits : [] }),
      ...(applicationDeadline !== undefined && {
        applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
      }),
      ...(status && { status: status as JobStatus }),
    },
    include: { company: true },
  });

  return updatedJob;
};

export const deleteJob = async (id: string, userId: string, userRole: Role) => {
  const existingJob = await prisma.job.findUnique({
    where: { id },
    include: { recruiter: true },
  });

  if (!existingJob) {
    throw new Error('Job not found');
  }

  if (userRole !== Role.ADMIN && existingJob.recruiter.userId !== userId) {
    throw new Error('Forbidden: You can only delete your own jobs');
  }

  await prisma.job.delete({ where: { id } });
  return true;
};

export const updateJobStatus = async (id: string, userId: string, userRole: Role, status: JobStatus) => {
  const existingJob = await prisma.job.findUnique({
    where: { id },
    include: { recruiter: true },
  });

  if (!existingJob) {
    throw new Error('Job not found');
  }

  if (userRole !== Role.ADMIN && existingJob.recruiter.userId !== userId) {
    throw new Error('Forbidden: You can only update your own jobs');
  }

  const updatedJob = await prisma.job.update({
    where: { id },
    data: { status },
    include: { company: true },
  });

  return updatedJob;
};

export const getRecruiterJobs = async (userId: string, status?: JobStatus) => {
  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    throw new Error('Recruiter profile not found');
  }

  const jobs = await prisma.job.findMany({
    where: {
      recruiterId: recruiter.id,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: {
      company: true,
      _count: {
        select: { applications: true },
      },
    },
  });

  return jobs;
};
