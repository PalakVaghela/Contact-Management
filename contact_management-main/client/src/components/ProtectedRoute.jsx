
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

// For admin routes
export const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return element;
};

// For non-admin routes
export const ProtectedRouteNonAdmin = ({ element }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role === 'admin') {
    return <Navigate to="/admin-dashboard" />;
  }

  return element;
};
