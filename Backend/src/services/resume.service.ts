import { prisma } from '../utils/prisma';
import fs from 'fs';
import path from 'path';

export const uploadResume = async (userId: string, file: Express.Multer.File) => {
  let candidateProfile = await prisma.candidateProfile.findUnique({
    where: { userId },
  });

  if (!candidateProfile) {
    candidateProfile = await prisma.candidateProfile.create({
      data: { userId },
    });
  }

  const fileUrl = `/uploads/resumes/${file.filename}`;

  const resume = await prisma.resume.create({
    data: {
      candidateProfileId: candidateProfile.id,
      fileUrl,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    },
  });

  // Update primary resumeUrl on candidate profile if not set
  if (!candidateProfile.resumeUrl) {
    await prisma.candidateProfile.update({
      where: { id: candidateProfile.id },
      data: { resumeUrl: fileUrl },
    });
  }

  return resume;
};

export const getCandidateResumes = async (userId: string) => {
  const candidateProfile = await prisma.candidateProfile.findUnique({
    where: { userId },
    include: {
      resumes: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!candidateProfile) {
    return [];
  }

  return candidateProfile.resumes;
};

export const deleteResume = async (userId: string, resumeId: string) => {
  const candidateProfile = await prisma.candidateProfile.findUnique({
    where: { userId },
  });

  if (!candidateProfile) {
    throw new Error('Candidate profile not found');
  }

  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      candidateProfileId: candidateProfile.id,
    },
  });

  if (!resume) {
    throw new Error('Resume not found or unauthorized');
  }

  // Delete from DB
  await prisma.resume.delete({ where: { id: resumeId } });

  // Delete physical file if exists
  try {
    const filename = path.basename(resume.fileUrl);
    const diskPath = path.join(process.cwd(), 'uploads', 'resumes', filename);
    if (fs.existsSync(diskPath)) {
      fs.unlinkSync(diskPath);
    }
  } catch (err) {
    console.error('Error deleting resume file from disk:', err);
  }

  return true;
};
