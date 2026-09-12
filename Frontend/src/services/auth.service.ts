import { api } from '../lib/axios';
import type { AuthResponse, ApiResponse, User } from '../types';

export const authService = {
  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data.data!;
  },

  registerCandidate: async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data!;
  },

  registerRecruiter: async (data: { name: string; email: string; password: string; companyName: string }): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register-recruiter', data);
    return res.data.data!;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return res.data.data!.user;
  },

  forgotPassword: async (email: string): Promise<{ message: string; resetToken?: string }> => {
    const res = await api.post<ApiResponse<{ message: string; resetToken?: string }>>('/auth/forgot-password', { email });
    return res.data.data!;
  },

  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const res = await api.post<ApiResponse<{ message: string }>>('/auth/reset-password', { token, password });
    return res.data.data || { message: res.data.message || 'Password reset successful' };
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const res = await api.post<ApiResponse<{ message: string }>>('/auth/verify-email', { token });
    return res.data.data || { message: res.data.message || 'Email verified successfully' };
  },
};
