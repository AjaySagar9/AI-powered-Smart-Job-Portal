import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Briefcase, User as UserIcon, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { label: 'Browse Jobs', path: '/login' },
      ];
    }

    switch (role) {
      case 'CANDIDATE':
        return [
          { label: 'Jobs', path: '/candidate' },
          { label: 'Saved Jobs', path: '/candidate/saved-jobs' },
          { label: 'Applications', path: '/candidate/applications' },
          { label: 'Profile', path: '/candidate/profile' },
        ];
      case 'RECRUITER':
        return [
          { label: 'Dashboard', path: '/recruiter' },
          { label: 'Jobs', path: '/recruiter/jobs' },
          { label: 'Applications', path: '/recruiter/applications' },
          { label: 'Company', path: '/recruiter/company' },
        ];
      case 'ADMIN':
        return [
          { label: 'Dashboard', path: '/admin' },
          { label: 'Users', path: '/admin/users' },
          { label: 'Jobs', path: '/admin/jobs' },
          { label: 'Reports', path: '/admin/reports' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-700 transition">
          <Briefcase className="h-6 w-6" />
          <span>JobPortal</span>
        </Link>

        {/* Dynamic Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth Buttons / Profile info */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                <UserIcon className="h-4 w-4 text-slate-500" />
                <span className="font-semibold">{user.name}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-1.5 text-slate-600 hover:text-rose-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign in
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
