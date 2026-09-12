import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword: React.FC = () => {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setErrorMsg(null);
      const res = await authService.forgotPassword(data.email);
      setServerMessage(res.message);
      if (res.resetToken) {
        setDevToken(res.resetToken);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to process request');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-slate-100">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Forgot your password?</h2>
          <p className="text-sm text-slate-600">
            Enter your email and we'll generate a reset link for your account.
          </p>
        </div>

        {serverMessage && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm space-y-2">
            <p>{serverMessage}</p>
            {devToken && (
              <div className="pt-2 border-t border-emerald-200">
                <span className="font-semibold block text-xs uppercase tracking-wider text-emerald-700">Development Token:</span>
                <code className="text-xs bg-white px-2 py-1 rounded border border-emerald-300 block my-1 font-mono break-all">
                  {devToken}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full text-xs"
                  onClick={() => navigate(`/reset-password?token=${devToken}`)}
                >
                  Proceed to Reset Password
                </Button>
              </div>
            )}
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {errorMsg}
          </div>
        )}

        {!serverMessage && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                {...register('email')}
                className="w-full"
              />
              {errors.email && <p className="text-sm text-rose-500">{errors.email.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        )}

        <div className="text-sm text-center">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
