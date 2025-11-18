import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/authContext.jsx';
import AdminLayout from '@/components/admin/AdminLayout.jsx';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminMedia() {
  const { authHeaders } = useAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMedia();
  }, [filter]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const query =
        filter !== 'all'
          ? `?media_type=${filter === 'movies' ? 'movie' : 'tv'}`
          : '';
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/local/media${query}`,
        { headers: authHeaders, credentials: 'include' }
      );
      const data = await res.json();
      setMedia(data || []);
    } catch (err) {
      console.error('Failed to fetch media:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/local/media/${id}`,
        {
          method: 'DELETE',
          headers: authHeaders,
          credentials: 'include',
        }
      );

      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert('Failed to delete media');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred');
    }
  };

  const filteredMedia =
    filter === 'all'
      ? media
      : media.filter((m) =>
          filter === 'movies' ? m.media_type === 'movie' : m.media_type === 'tv'
        );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-3xl font-bold">Local Media</h1>
          <Link
            to="/admin/media/add"
            className="bg-coquelicot text-white px-4 py-2 rounded-lg hover:bg-coquelicot/90 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New
          </Link>
        </div>

        <div className="flex gap-2">
          {['all', 'movies', 'series'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === f
                  ? 'bg-coquelicot text-white'
                  : 'bg-secondary text-white/80 hover:bg-secondary/80'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-white py-8">Loading...</div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center text-muted py-8">
            No local media found. Click "Add New" to create one.
          </div>
        ) : (
          <div className="bg-secondary rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-raisin-black">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white/80 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMedia.map((item) => (
                  <tr key={item.id} className="hover:bg-raisin-black/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                      {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                      {item.vote_average.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                      <Link
                        to={`/admin/media/${item.id}/edit`}
                        className="inline-flex items-center gap-1 text-white/80 hover:text-white transition"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
