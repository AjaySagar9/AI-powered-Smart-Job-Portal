import { prisma } from '../utils/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '@prisma/client';

import { randomUUID } from 'crypto';

const generateTokens = (userId: string, role: Role) => {
  const jti = randomUUID();
  const accessToken = jwt.sign({ userId, role, jti }, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId, role, jti: `${jti}-ref` }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const registerCandidate = async (data: any) => {
  const { name, email, password } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: Role.CANDIDATE,
      candidateProfile: {
        create: {},
      },
    },
  });

  const tokens = generateTokens(user.id, user.role);

  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens };
};

export const registerRecruiter = async (data: any) => {
  const { name, email, password, companyName } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Handle company creation or find existing
  let company = await prisma.company.findFirst({ where: { name: companyName } });
  if (!company) {
    company = await prisma.company.create({ data: { name: companyName } });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: Role.RECRUITER,
      recruiterProfile: {
        create: {
          companyId: company.id,
        },
      },
    },
  });

  const tokens = generateTokens(user.id, user.role);

  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens };
};

export const login = async (data: any) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const tokens = generateTokens(user.id, user.role);

  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens };
};

export const logout = async (userId: string) => {
  // Option 1: In a real app we might delete specific token from req, 
  // but here we just clear all for simplicity or expect frontend to drop them
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
  return true;
};

export const refresh = async (refreshTokenStr: string) => {
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenStr },
    include: { user: true },
  });

  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }

  try {
    jwt.verify(refreshTokenStr, env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }

  // Issue new tokens
  const tokens = generateTokens(tokenRecord.userId, tokenRecord.user.role);

  // Rotate token
  await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: tokenRecord.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return tokens;
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  return user;
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // For security, don't reveal if user exists
    return { message: 'If an account exists with this email, a reset token has been generated.' };
  }

  // Delete existing tokens for this user
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    message: 'If an account exists with this email, a reset token has been generated.',
    resetToken: token, // Returned for dev testing & direct UI usage
  };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    throw new Error('Invalid or expired password reset token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.delete({
      where: { id: tokenRecord.id },
    }),
    prisma.refreshToken.deleteMany({
      where: { userId: tokenRecord.userId },
    }),
  ]);

  return { message: 'Password has been reset successfully. Please login with your new password.' };
};

export const verifyEmail = async (token: string) => {
  const tokenRecord = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    throw new Error('Invalid or expired verification token');
  }

  await prisma.emailVerificationToken.delete({
    where: { id: tokenRecord.id },
  });

  return { message: 'Email has been verified successfully.' };
};

