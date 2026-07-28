import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Sparkles, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { loginApi } from '../api/authApi'
import { setCredentials } from '@/store/slices/authSlice'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      // Decode JWT or use returned user data to populate Redux
      // For scaffolding, we mock the user payload decoding
      dispatch(
        setCredentials({
          user: { id: '1', email: 'user@example.com', role: data.role },
          token: data.accessToken,
        })
      )
      toast.success('Successfully logged in!')
      
      // Redirect based on role
      if (data.role === 'CANDIDATE') {
        navigate('/candidate/dashboard')
      } else {
        navigate('/recruiter/dashboard')
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to login')
    },
  })

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background blobs for premium feel */}
      <div className="absolute top-1/4 -left-10 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-violet-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl relative z-10 ring-1 ring-white/5"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h2>
          <p className="text-muted-foreground mt-2 text-sm">Sign in to your AI Career Copilot</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              {...register('email')}
              className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              {...register('password')}
              className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20" 
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Create an account
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
