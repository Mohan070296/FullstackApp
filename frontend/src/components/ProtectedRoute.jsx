import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
