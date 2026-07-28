import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { AuthGuard } from '@/layouts/AuthGuard'
import { LandingPage } from '@/features/public/LandingPage'
import { Login } from '@/features/auth/components/Login'

// Lazy loaded pages will go here
const CandidateDashboard = () => <div className="p-10">Candidate Dashboard</div>
const RecruiterDashboard = () => <div className="p-10">Recruiter Dashboard</div>

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        element: <AuthGuard allowedRoles={['CANDIDATE']} />,
        children: [
          {
            path: 'candidate/dashboard',
            element: <CandidateDashboard />,
          },
        ],
      },
      {
        element: <AuthGuard allowedRoles={['RECRUITER']} />,
        children: [
          {
            path: 'recruiter/dashboard',
            element: <RecruiterDashboard />,
          },
        ],
      },
      {
        path: '*',
        element: <div className="p-10">404 Not Found</div>
      }
    ],
  },
])
