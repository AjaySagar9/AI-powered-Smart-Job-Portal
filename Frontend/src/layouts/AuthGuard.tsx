import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

interface AuthGuardProps {
  allowedRoles?: string[]
}

export const AuthGuard = ({ allowedRoles }: AuthGuardProps) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to an unauthorized page or appropriate dashboard
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
