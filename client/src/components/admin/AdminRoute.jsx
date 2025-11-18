import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/authContext.jsx';

export default function AdminRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-raisin-black">
        <div className="w-12 h-12 rounded-full border-4 border-coquelicot border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
