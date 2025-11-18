import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/authContext.jsx';
import AdminLayout from '@/components/admin/AdminLayout.jsx';

export default function MediaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authHeaders } = useAuth();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    overview: '',
    release_date: '',
    poster_path: '',
    backdrop_path: '',
    vote_average: 0,
    media_type: 'movie',
    runtime: '',
    number_of_seasons: '',
    genre_names: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchMedia();
    }
  }, [id]);

  const fetchMedia = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/local/media/${id}`,
        { headers: authHeaders, credentials: 'include' }
      );
      const data = await res.json();
      setForm({
        title: data.title || '',
        overview: data.overview || '',
        release_date: data.release_date || data.first_air_date || '',
        poster_path: data.poster_path || '',
        backdrop_path: data.backdrop_path || '',
        vote_average: data.vote_average || 0,
        media_type: data.media_type || 'movie',
        runtime: data.runtime || '',
        number_of_seasons: data.number_of_seasons || '',
        genre_names: (data.genre_names || []).join(', '),
      });
    } catch (err) {
      console.error('Failed to fetch media:', err);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        overview: form.overview,
        poster_path:
          form.poster_path || 'https://placehold.co/500x750?text=No+Poster',
        backdrop_path:
          form.backdrop_path ||
          'https://placehold.co/1920x1080?text=No+Backdrop',
        vote_average: parseFloat(form.vote_average) || 0,
        media_type: form.media_type,
        genre_names: form.genre_names
          ? form.genre_names.split(',').map((g) => g.trim())
          : [],
      };

      if (form.media_type === 'movie') {
        payload.release_date = form.release_date || '';
        if (form.runtime) payload.runtime = parseInt(form.runtime);
      } else {
        payload.first_air_date = form.release_date || '';
        if (form.number_of_seasons)
          payload.number_of_seasons = parseInt(form.number_of_seasons);
      }

      const url = isEdit
        ? `${import.meta.env.VITE_API_URL}/api/admin/local/media/${id}`
        : `${import.meta.env.VITE_API_URL}/api/admin/local/media`;

      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Operation failed');
      }

      navigate('/admin/media');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <h1 className="text-white text-3xl font-bold mb-6">
          {isEdit ? 'Edit Media' : 'Add New Media'}
        </h1>

        <form
          onSubmit={onSubmit}
          className="bg-secondary rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="block text-white text-sm mb-2">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-raisin-black text-white border border-border focus:border-coquelicot focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-2">Type *</label>
            <select
              name="media_type"
              value={form.media_type}
              onChange={onChange}
              className="w-full px-4 py-2 rounded-lg bg-raisin-black text-white border border-border focus:border-coquelicot focus:outline-none"
            >
              <option value="movie">Movie</option>
              <option value="tv">TV Show</option>
            </select>
          </div>

          <div>
            <label className="block text-white text-sm mb-2">Overview</label>
            <textarea
              name="overview"
              value={form.overview}
              onChange={onChange}
              rows="4"
              className="w-full px-4 py-2 rounded-lg bg-raisin-black text-white border border-border focus:border-coquelicot focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-2">
              {form.media_type === 'movie' ? 'Release Date' : 'First Air Date'}{' '}
              (YYYY-MM-DD)
            </label>
            <input
              name="release_date"
              value={form.release_date}
              onChange={onChange}
              placeholder="2024-01-01"
              className="w-full px-4 py-2 rounded-lg bg-raisin-black text-white border border-border focus:border-coquelicot focus:outline-none"
            />
          </div>

          {form.media_type === 'movie' && (
            <div>
              <label className="block text-white text-sm mb-2">
                Runtime (minutes)
              </label>
              <input
                name="runtime"
                type="number"
                value={form.runtime}
                onChange={onChange}
                className="w-full px-4 py-2 rounded-lg bg-raisin-black text-white border border-border focus:border-coquelicot focus:outline-none"
              />
            </div>
          )}

          {form.media_type === 'tv' && (
            <div>
              <label className="block text-white text-sm mb-2">
                Number of Seasons
              </label>
              <input
                name="number_of_seasons"
                type="number"
                value={form.number_of_seasons}
                onChange={onChange}
                className="w-full px-4 py-2 rounded-lg bg-raisin-black text-white border border-border focus:border-coquelicot focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-white text-sm mb-2">
              Poster URL (leave empty for placeholder)
            </label>
            <input
              name="poster_path"
              value={form.poster_path}
              onChange={onChange}
              placeholder="https://..."
              className="w-full px-4 py-2 rounded-lg bg-raisin-black text-white border border-border focus:border-coquelicot focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-2">
              Backdrop URL (leave empty for placeholder)
            </label>
            <input
              name="backdrop_path"
              value={form.backdrop_path}
              onChange={onChange}
              placeholder="https://..."
              className="w-full px-4 py-2 rounded-lg bg-raisin-black text-white border border-border focus:border-coquelicot focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-2">
              Rating (0-10)
            </label>
            <input
              name="vote_average"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={form.vote_average}
              onChange={onChange}
              className="w-full px-4 py-2 rounded-lg bg-raisin-black text-white border border-border focus:border-coquelicot focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-2">
              Genres (comma separated)
            </label>
            <input
              name="genre_names"
              value={form.genre_names}
              onChange={onChange}
              placeholder="Action, Drama, Thriller"
              className="w-full px-4 py-2 rounded-lg bg-raisin-black text-white border border-border focus:border-coquelicot focus:outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-coquelicot text-white rounded-lg hover:bg-coquelicot/90 disabled:opacity-50 transition"
            >
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/media')}
              className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/80 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
