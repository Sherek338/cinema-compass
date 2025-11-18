import { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext.jsx';
import AdminLayout from '@/components/admin/AdminLayout.jsx';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminBanned() {
  const { authHeaders } = useAuth();
  const [banned, setBanned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    tmdbId: '',
    media_type: 'movie',
    reason: '',
  });

  useEffect(() => {
    fetchBanned();
  }, []);

  const fetchBanned = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/banned`,
        { headers: authHeaders, credentials: 'include' }
      );
      const data = await res.json();
      setBanned(data || []);
    } catch (err) {
      console.error('Failed to fetch banned list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/banned`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
          credentials: 'include',
          body: JSON.stringify({
            tmdbId: parseInt(form.tmdbId),
            media_type: form.media_type,
            reason: form.reason,
          }),
        }
      );

      if (res.ok) {
        setForm({ tmdbId: '', media_type: 'movie', reason: '' });
        setShowAdd(false);
        fetchBanned();
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to add to banned list');
      }
    } catch (err) {
      console.error('Add error:', err);
      alert('An error occurred');
    }
  };

  const handleRemove = async (tmdbId, media_type) => {
    if (!confirm('Remove this item from banned list?')) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/banned`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
          credentials: 'include',
          body: JSON.stringify({ tmdbId, media_type }),
        }
      );

      if (res.ok) {
        setBanned((prev) =>
          prev.filter(
            (b) => !(b.tmdbId === tmdbId && b.media_type === media_type)
          )
        );
      } else {
        alert('Failed to remove from banned list');
      }
    } catch (err) {
      console.error('Remove error:', err);
      alert('An error occurred');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-3xl font-bold">Banned TMDB Media</h1>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="bg-coquelicot text-white px-4 py-2 rounded-lg hover:bg-coquelicot/90 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {showAdd ? 'Cancel' : 'Add to Banned List'}
          </button>
        </div>

        {showAdd && (
          <div className="bg-secondary rounded-xl p-6">
            <h2 className="text-white text-xl font-semibold mb-4">
              Add TMDB ID to Banned List
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-white text-sm mb-2">
                  TMDB ID *
                </label>
                <input
                  type="number"
                  value={form.tmdbId}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, tmdbId: e.target.value }))
                  }
                  required
                  placeholder="e.g., 550"
                  className="w-full px-4 py-2 rounded-lg bg-raisin-black text-white border border-border focus:border-coquelicot focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white text-sm mb-2">Type *</label>
                <select
                  value={form.media_type}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, media_type: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg bg-raisin-black text-white border border-border focus:border-coquelicot focus:outline-none"
                >
                  <option value="movie">Movie</option>
                  <option value="tv">TV Show</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm mb-2">
                  Reason (optional)
                </label>
                <input
                  value={form.reason}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  placeholder="Why is this banned?"
                  className="w-full px-4 py-2 rounded-lg bg-raisin-black text-white border border-border focus:border-coquelicot focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-coquelicot text-white rounded-lg hover:bg-coquelicot/90 transition"
              >
                Add to Banned List
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center text-white py-8">Loading...</div>
        ) : banned.length === 0 ? (
          <div className="text-center text-muted py-8">
            No banned media. TMDB content will be shown normally.
          </div>
        ) : (
          <div className="bg-secondary rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-raisin-black">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    TMDB ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white/80 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {banned.map((item) => (
                  <tr
                    key={`${item.tmdbId}-${item.media_type}`}
                    className="hover:bg-raisin-black/30"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {item.tmdbId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                      {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      {item.reason || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() =>
                          handleRemove(item.tmdbId, item.media_type)
                        }
                        className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
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
