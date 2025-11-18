import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/authContext.jsx';
import { LogOut, Home, Film, Ban } from 'lucide-react';

export default function AdminLayout({ children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-raisin-black">
      <nav className="bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link
                to="/admin/dashboard"
                className="text-white font-bold text-xl"
              >
                CMS Admin
              </Link>

              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/admin/dashboard"
                  className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition"
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/admin/media"
                  className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition"
                >
                  <Film className="w-4 h-4" />
                  Media
                </Link>
                <Link
                  to="/admin/banned"
                  className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition"
                >
                  <Ban className="w-4 h-4" />
                  Banned
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-white/80 hover:text-white text-sm font-medium transition"
              >
                Back to Site
              </Link>
              <span className="text-white/60 text-sm">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-white/80 hover:text-white p-2 rounded-md transition"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
