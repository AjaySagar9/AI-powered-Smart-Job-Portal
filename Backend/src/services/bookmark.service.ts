import { prisma } from '../utils/prisma';

export const toggleBookmark = async (userId: string, jobId: string) => {
  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      jobId_candidateId: {
        jobId,
        candidateId: userId,
      },
    },
  });

  if (existingBookmark) {
    await prisma.bookmark.delete({
      where: { id: existingBookmark.id },
    });
    return { bookmarked: false };
  } else {
    await prisma.bookmark.create({
      data: {
        jobId,
        candidateId: userId,
      },
    });
    return { bookmarked: true };
  }
};

export const getBookmarkedJobs = async (userId: string) => {
  const bookmarks = await prisma.bookmark.findMany({
    where: { candidateId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      job: {
        include: {
          company: true,
        },
      },
    },
  });

  return bookmarks.map((b) => ({
    ...b.job,
    bookmarkedAt: b.createdAt,
    isBookmarked: true,
  }));
};
