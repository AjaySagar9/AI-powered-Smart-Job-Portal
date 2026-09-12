import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { AuthGuard } from '../layouts/AuthGuard';
import { LandingPage } from '../features/public/LandingPage';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';

// Dashboards & Role Page Placeholders for Phase 1
const PlaceholderView = ({ title, desc }: { title: string; desc: string }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
      <p className="text-slate-600 text-sm mb-6">{desc}</p>
      <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-xs font-mono">
        Status: Phase 1 Foundation & Auth Verified. Phase 2 Features (Jobs, Search, Resumes, Applications) will load here.
      </div>
    </div>
  </div>
);

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
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },

      // Candidate Protected Routes
      {
        path: 'candidate',
        element: <AuthGuard allowedRoles={['CANDIDATE']} />,
        children: [
          {
            index: true,
            element: <PlaceholderView title="Candidate Jobs" desc="Browse and filter available jobs matched to your profile." />,
          },
          {
            path: 'saved-jobs',
            element: <PlaceholderView title="Saved Jobs" desc="View and manage your bookmarked jobs." />,
          },
          {
            path: 'applications',
            element: <PlaceholderView title="My Applications" desc="Track the progress and history of your submitted applications." />,
          },
          {
            path: 'profile',
            element: <PlaceholderView title="Candidate Profile & Resumes" desc="Manage your personal details, skills, and uploaded resumes." />,
          },
        ],
      },

      // Recruiter Protected Routes
      {
        path: 'recruiter',
        element: <AuthGuard allowedRoles={['RECRUITER']} />,
        children: [
          {
            index: true,
            element: <PlaceholderView title="Recruiter Dashboard" desc="Overview of your active postings and candidate pipeline." />,
          },
          {
            path: 'jobs',
            element: <PlaceholderView title="Job Postings" desc="Create, edit, publish, and manage job listings." />,
          },
          {
            path: 'applications',
            element: <PlaceholderView title="Applicants Review Board" desc="Review resumes, candidate details, and update hiring stages." />,
          },
          {
            path: 'company',
            element: <PlaceholderView title="Company Profile" desc="Manage your company branding and details." />,
          },
        ],
      },

      // Admin Protected Routes
      {
        path: 'admin',
        element: <AuthGuard allowedRoles={['ADMIN']} />,
        children: [
          {
            index: true,
            element: <PlaceholderView title="Admin Control Center" desc="High-level system metrics and platform health." />,
          },
          {
            path: 'users',
            element: <PlaceholderView title="User Management" desc="Audit, manage, and moderate candidate and recruiter accounts." />,
          },
          {
            path: 'jobs',
            element: <PlaceholderView title="Job Moderation" desc="Audit and moderate all job postings across the portal." />,
          },
          {
            path: 'reports',
            element: <PlaceholderView title="System & Audit Reports" desc="System logs and compliance metrics." />,
          },
        ],
      },

      {
        path: 'unauthorized',
        element: (
          <div className="max-w-md mx-auto my-20 p-8 bg-white border border-rose-200 rounded-xl text-center shadow-xs">
            <h2 className="text-xl font-bold text-rose-600 mb-2">403 Forbidden</h2>
            <p className="text-sm text-slate-600">You do not have the required permissions to view this page.</p>
          </div>
        ),
      },
      {
        path: '*',
        element: (
          <div className="max-w-md mx-auto my-20 p-8 bg-white border border-slate-200 rounded-xl text-center shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-2">404 Not Found</h2>
            <p className="text-sm text-slate-600">The page you requested could not be found.</p>
          </div>
        ),
      },
    ],
  },
]);
