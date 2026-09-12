import { prisma } from '../utils/prisma';
import { ApplicationStatus, Role } from '@prisma/client';

export const applyToJob = async (
  userId: string,
  data: { jobId: string; resumeId?: string | null; coverLetter?: string | null }
) => {
  const { jobId, resumeId, coverLetter } = data;

  // 1. Check job
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new Error('Job not found');
  }

  if (job.status !== 'PUBLISHED') {
    throw new Error('This job is no longer accepting applications');
  }

  if (job.applicationDeadline && new Date(job.applicationDeadline) < new Date()) {
    throw new Error('The application deadline for this job has passed');
  }

  // 2. Check for duplicate application
  const existingApp = await prisma.application.findUnique({
    where: {
      jobId_candidateId: {
        jobId,
        candidateId: userId,
      },
    },
  });

  if (existingApp) {
    throw new Error('You have already applied for this job');
  }

  // 3. Check resume if provided
  if (resumeId) {
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        candidateProfile: { userId },
      },
    });

    if (!resume) {
      throw new Error('Selected resume not found or does not belong to you');
    }
  }

  // 4. Create application & history transactionally
  const application = await prisma.$transaction(async (tx) => {
    const app = await tx.application.create({
      data: {
        jobId,
        candidateId: userId,
        resumeId: resumeId || null,
        coverLetter,
        status: ApplicationStatus.PENDING,
      },
      include: {
        job: {
          include: { company: true },
        },
        resume: true,
      },
    });

    await tx.applicationStatusHistory.create({
      data: {
        applicationId: app.id,
        status: ApplicationStatus.PENDING,
        notes: 'Application submitted',
      },
    });

    return app;
  });

  return application;
};

export const getCandidateApplications = async (userId: string) => {
  const applications = await prisma.application.findMany({
    where: { candidateId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      job: {
        include: {
          company: true,
        },
      },
      resume: true,
      statusHistory: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return applications;
};

export const withdrawApplication = async (userId: string, applicationId: string) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new Error('Application not found');
  }

  if (application.candidateId !== userId) {
    throw new Error('Forbidden: You can only withdraw your own applications');
  }

  if (application.status === ApplicationStatus.WITHDRAWN) {
    throw new Error('Application is already withdrawn');
  }

  const updated = await prisma.$transaction(async (tx) => {
    const app = await tx.application.update({
      where: { id: applicationId },
      data: { status: ApplicationStatus.WITHDRAWN },
    });

    await tx.applicationStatusHistory.create({
      data: {
        applicationId,
        status: ApplicationStatus.WITHDRAWN,
        notes: 'Withdrawn by candidate',
      },
    });

    return app;
  });

  return updated;
};

export const getJobApplications = async (
  userId: string,
  userRole: Role,
  jobId: string,
  status?: ApplicationStatus
) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { recruiter: true },
  });

  if (!job) {
    throw new Error('Job not found');
  }

  if (userRole !== Role.ADMIN && job.recruiter.userId !== userId) {
    throw new Error('Forbidden: You can only view applications for your own jobs');
  }

  const applications = await prisma.application.findMany({
    where: {
      jobId,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: {
      candidate: {
        select: {
          id: true,
          name: true,
          email: true,
          candidateProfile: {
            select: {
              headline: true,
              bio: true,
              skills: true,
              experienceYears: true,
              resumeUrl: true,
            },
          },
        },
      },
      resume: true,
      statusHistory: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return applications;
};

export const updateApplicationStatus = async (
  userId: string,
  userRole: Role,
  applicationId: string,
  newStatus: ApplicationStatus,
  notes?: string | null
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        include: { recruiter: true },
      },
    },
  });

  if (!application) {
    throw new Error('Application not found');
  }

  if (userRole !== Role.ADMIN && application.job.recruiter.userId !== userId) {
    throw new Error('Forbidden: You can only update applications for your own jobs');
  }

  const updated = await prisma.$transaction(async (tx) => {
    const app = await tx.application.update({
      where: { id: applicationId },
      data: {
        status: newStatus,
        notes: notes !== undefined ? notes : application.notes,
      },
      include: {
        resume: true,
        candidate: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    await tx.applicationStatusHistory.create({
      data: {
        applicationId,
        status: newStatus,
        notes: notes || `Status changed to ${newStatus}`,
      },
    });

    return app;
  });

  return updated;
};
