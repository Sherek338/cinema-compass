import { Link } from 'react-router-dom';
import { useAuth } from '@/context/authContext.jsx';
import AdminLayout from '@/components/admin/AdminLayout.jsx';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-white text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted mt-2">Welcome back, {user?.username}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admin/media"
            className="bg-secondary p-6 rounded-xl hover:bg-secondary/80 transition border border-border"
          >
            <h2 className="text-white text-xl font-semibold mb-2">
              Manage Media
            </h2>
            <p className="text-muted text-sm">
              View, add, edit, and delete local movies and TV shows
            </p>
          </Link>

          <Link
            to="/admin/banned"
            className="bg-secondary p-6 rounded-xl hover:bg-secondary/80 transition border border-border"
          >
            <h2 className="text-white text-xl font-semibold mb-2">
              Banned List
            </h2>
            <p className="text-muted text-sm">
              Manage TMDB content that should be hidden
            </p>
          </Link>

          <div className="bg-secondary p-6 rounded-xl border border-border opacity-60">
            <h2 className="text-white text-xl font-semibold mb-2">
              Statistics
            </h2>
            <p className="text-muted text-sm">
              View system statistics (coming soon)
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
