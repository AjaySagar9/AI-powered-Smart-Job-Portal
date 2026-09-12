import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const { user, isAuthenticated, role, loading, setAuth, clearAuth, setLoading } = useAuthStore();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore failure on server logout, clear locally
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  return {
    user,
    isAuthenticated,
    role,
    loading,
    setAuth,
    clearAuth,
    setLoading,
    logout,
  };
};
