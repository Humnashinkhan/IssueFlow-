import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from './Loading';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loading message="Checking session..." />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}