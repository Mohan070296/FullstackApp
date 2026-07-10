import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import LoadingSpinner from './LoadingSpinner';
import ProtectedRoute from './ProtectedRoute';

export default function AdminRoute({ children }) {
  const { user, loading } = useAppSelector((s) => s.auth);

  if (loading) return <LoadingSpinner />;

  return (
    <ProtectedRoute>
      {user?.role === 'ADMIN' ? children : <Navigate to="/" replace />}
    </ProtectedRoute>
  );
}
