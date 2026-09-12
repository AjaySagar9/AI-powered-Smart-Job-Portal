import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const registerCandidate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.registerCandidate(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ success: false, message: error.message, code: 'CONFLICT_ERROR' });
    }
    next(error);
  }
};

export const registerRecruiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.registerRecruiter(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ success: false, message: error.message, code: 'CONFLICT_ERROR' });
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ success: false, message: error.message, code: 'UNAUTHORIZED_ERROR' });
    }
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.logout(req.user!.userId);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(401).json({ success: false, message: error.message, code: 'UNAUTHORIZED_ERROR' });
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req.user!.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', code: 'NOT_FOUND' });
    }
    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.resetPassword(req.body.token, req.body.password);
    res.status(200).json({ success: true, message: result.message });
  } catch (error: any) {
    if (error.message.includes('Invalid or expired')) {
      return res.status(400).json({ success: false, message: error.message, code: 'INVALID_TOKEN' });
    }
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.verifyEmail(req.body.token);
    res.status(200).json({ success: true, message: result.message });
  } catch (error: any) {
    if (error.message.includes('Invalid or expired')) {
      return res.status(400).json({ success: false, message: error.message, code: 'INVALID_TOKEN' });
    }
    next(error);
  }
};

