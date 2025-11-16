import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/authContext.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#201E1F]">
        <div className="w-12 h-12 rounded-full border-4 border-[#FF4002] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
}
