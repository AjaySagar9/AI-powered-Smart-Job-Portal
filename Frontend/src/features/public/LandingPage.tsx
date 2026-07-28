import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background selection:bg-primary/30">
      {/* Animated Background Gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground">AI Job Portal</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-full shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center sm:pt-40 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-medium rounded-full bg-secondary/50 text-secondary-foreground border border-border backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Introducing AI Career Copilot</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl text-foreground"
        >
          Your Career, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">
            Supercharged by AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mt-8 text-lg sm:text-xl text-muted-foreground"
        >
          Join the next generation of job seekers and elite recruiters. Get instant ATS feedback, personalized skill gap analysis, and tailored job matches.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10"
        >
          <Link to="/register" className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-primary-foreground bg-foreground rounded-full hover:bg-foreground/90 transition-all shadow-xl hover:shadow-2xl">
            Start for free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/demo" className="flex items-center gap-2 px-8 py-4 text-base font-medium text-foreground bg-background border border-border rounded-full hover:bg-secondary transition-all">
            View AI Demo
          </Link>
        </motion.div>

        {/* Dashboard Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative w-full mt-20"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10 h-full w-full pointer-events-none" />
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-2 shadow-2xl overflow-hidden ring-1 ring-white/10">
            <div className="rounded-lg bg-background border border-border h-[400px] w-full flex items-center justify-center text-muted-foreground relative overflow-hidden">
                {/* Minimalist Dashboard Skeleton */}
                <div className="absolute top-4 left-4 right-4 flex gap-4">
                  <div className="w-64 h-32 bg-secondary rounded-lg animate-pulse" />
                  <div className="w-64 h-32 bg-secondary rounded-lg animate-pulse delay-75" />
                  <div className="flex-1 h-32 bg-secondary rounded-lg animate-pulse delay-150" />
                </div>
                <div className="absolute top-40 left-4 right-4 flex gap-4">
                  <div className="flex-1 h-64 bg-secondary rounded-lg animate-pulse delay-200" />
                  <div className="w-80 h-64 bg-secondary rounded-lg animate-pulse delay-300" />
                </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
