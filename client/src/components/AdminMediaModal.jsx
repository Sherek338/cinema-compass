import { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext.jsx';

const API_BASE = 'http://localhost:3000/api/tmdb';

async function apiRequest(path, params = {}) {
  const queryParams = new URLSearchParams(params);
  const url = `${API_BASE}${path}?${queryParams.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Backend API error: ${response.status}`);
  }

  return response.json();
}

export default function AdminMediaModal() {
  const { adminModalOpen, setAdminModalOpen, apiRequest } = useAuth();

  const [mode, setMode] = useState('local');
  const [form, setForm] = useState({
    title: '',
    type: '',
    tmdb_id: '',
    overview: '',
    backdrop_path: '',
    poster_path: '',
    vote_average: '',
    release_date: '',
    first_air_date: '',
    runtime: '',
    number_of_seasons: '',
    number_of_episodes: '',
    genres: '',
    homepage: '',
    original_language: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    console.log(adminModalOpen);
  }, [adminModalOpen]);

  useEffect(() => {
    if (!adminModalOpen) return;

    const closeEsc = (e) => {
      if (e.key === 'Escape') setAdminModalOpen(false);
    };

    window.addEventListener('keydown', closeEsc);
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', closeEsc);
      document.body.style.overflow = original;
    };
  }, [adminModalOpen, setAdminModalOpen]);

  if (!adminModalOpen) return null;

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate required fields
      if (!form.title || !form.type) {
        setError('Title and Type are required');
        setLoading(false);
        return;
      }

      let endpoint =
        mode === 'local' ? '/api/admin/local' : '/api/admin/banned';

      // Prepare data based on mode
      let payload = {};

      if (mode === 'local') {
        // For local media, send all fields
        payload = {
          type: form.type,
          title: form.title,
          tmdb_id: form.tmdb_id ? Number(form.tmdb_id) : undefined,
          overview: form.overview || undefined,
          backdrop_path: form.backdrop_path || undefined,
          poster_path: form.poster_path || undefined,
          vote_average: form.vote_average
            ? Number(form.vote_average)
            : undefined,
          release_date: form.release_date || undefined,
          first_air_date: form.first_air_date || undefined,
          runtime: form.runtime ? Number(form.runtime) : undefined,
          number_of_seasons: form.number_of_seasons
            ? Number(form.number_of_seasons)
            : undefined,
          number_of_episodes: form.number_of_episodes
            ? Number(form.number_of_episodes)
            : undefined,
          genres: form.genres || undefined,
          homepage: form.homepage || undefined,
          original_language: form.original_language || undefined,
        };

        // Remove undefined fields
        Object.keys(payload).forEach((key) => {
          if (payload[key] === undefined) {
            delete payload[key];
          }
        });
      } else {
        // For banned media, only send required fields
        if (!form.tmdb_id) {
          setError('TMDB ID is required for banned media');
          setLoading(false);
          return;
        }

        payload = {
          tmdb_id: Number(form.tmdb_id),
          type: form.type,
          reason: form.overview || '',
        };
      }

      const resp = await apiRequest(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      setSuccess(
        `${mode === 'local' ? 'Local media' : 'Banned media'} added successfully!`
      );
      setForm({
        title: '',
        type: '',
        tmdb_id: '',
        overview: '',
        backdrop_path: '',
        poster_path: '',
        vote_average: '',
        release_date: '',
        first_air_date: '',
        runtime: '',
        number_of_seasons: '',
        number_of_episodes: '',
        genres: '',
        homepage: '',
        original_language: '',
      });
    } catch (err) {
      setError(err.message || 'Error while adding media');
    } finally {
      setLoading(false);
    }
  };

  const isSeries = form.type === 'tv';

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
      onClick={() => setAdminModalOpen(false)}
    >
      <div
        className="bg-raisin-black rounded-2xl w-full max-w-2xl p-6 relative z-50 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-3 right-3 text-white text-xl cursor-pointer hover:text-white/70"
          onClick={() => setAdminModalOpen(false)}
        >
          ×
        </button>

        <h2 className="text-white text-2xl font-bold mb-4">Add Media</h2>

        <div className="flex mb-6 border-b border-white/10">
          <button
            type="button"
            onClick={() => setMode('local')}
            className={`flex-1 pb-2 text-center text-sm font-semibold cursor-pointer ${
              mode === 'local'
                ? 'text-white border-b-2 border-coquelicot'
                : 'text-white/60'
            }`}
          >
            Add Local Media
          </button>
          <button
            type="button"
            onClick={() => setMode('banned')}
            className={`flex-1 pb-2 text-center text-sm font-semibold cursor-pointer ${
              mode === 'banned'
                ? 'text-white border-b-2 border-coquelicot'
                : 'text-white/60'
            }`}
          >
            Ban Media
          </button>
        </div>

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/70 mb-1">
                Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                required
                className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot"
              />
            </div>

            <div>
              <label className="block text-xs text-white/70 mb-1">Type *</label>
              <select
                name="type"
                value={form.type}
                onChange={onChange}
                required
                className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot cursor-pointer"
              >
                <option value="">Select type</option>
                <option value="movie">Movie</option>
                <option value="tv">TV Series</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/70 mb-1">
              TMDB ID {mode === 'banned' && '*'}
            </label>
            <input
              name="tmdb_id"
              value={form.tmdb_id}
              onChange={onChange}
              type="number"
              required={mode === 'banned'}
              className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot"
            />
          </div>

          {/* Overview / Reason */}
          <div>
            <label className="block text-xs text-white/70 mb-1">
              {mode === 'banned' ? 'Reason for ban (optional)' : 'Overview'}
            </label>
            <textarea
              name="overview"
              value={form.overview}
              onChange={onChange}
              rows={3}
              placeholder={mode === 'banned' ? 'Why is this media banned?' : ''}
              className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot resize-none"
            />
          </div>

          {mode === 'local' && (
            <>
              {/* Images */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/70 mb-1">
                    Poster Path
                  </label>
                  <input
                    name="poster_path"
                    value={form.poster_path}
                    onChange={onChange}
                    placeholder="/path/to/poster.jpg"
                    className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/70 mb-1">
                    Backdrop Path
                  </label>
                  <input
                    name="backdrop_path"
                    value={form.backdrop_path}
                    onChange={onChange}
                    placeholder="/path/to/backdrop.jpg"
                    className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot"
                  />
                </div>
              </div>

              {/* Dates & Rating */}
              <div className="grid grid-cols-3 gap-4">
                {!isSeries && (
                  <div>
                    <label className="block text-xs text-white/70 mb-1">
                      Release Date
                    </label>
                    <input
                      name="release_date"
                      value={form.release_date}
                      onChange={onChange}
                      type="date"
                      className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot"
                    />
                  </div>
                )}

                {isSeries && (
                  <div>
                    <label className="block text-xs text-white/70 mb-1">
                      First Air Date
                    </label>
                    <input
                      name="first_air_date"
                      value={form.first_air_date}
                      onChange={onChange}
                      type="date"
                      className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs text-white/70 mb-1">
                    Vote Average
                  </label>
                  <input
                    name="vote_average"
                    value={form.vote_average}
                    onChange={onChange}
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="0-10"
                    className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/70 mb-1">
                    Language
                  </label>
                  <input
                    name="original_language"
                    value={form.original_language}
                    onChange={onChange}
                    placeholder="en"
                    className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot"
                  />
                </div>
              </div>

              {/* Duration / Seasons */}
              {!isSeries && (
                <div>
                  <label className="block text-xs text-white/70 mb-1">
                    Runtime (minutes)
                  </label>
                  <input
                    name="runtime"
                    value={form.runtime}
                    onChange={onChange}
                    type="number"
                    placeholder="120"
                    className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot"
                  />
                </div>
              )}

              {isSeries && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/70 mb-1">
                      Number of Seasons
                    </label>
                    <input
                      name="number_of_seasons"
                      value={form.number_of_seasons}
                      onChange={onChange}
                      type="number"
                      placeholder="1"
                      className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/70 mb-1">
                      Number of Episodes
                    </label>
                    <input
                      name="number_of_episodes"
                      value={form.number_of_episodes}
                      onChange={onChange}
                      type="number"
                      placeholder="10"
                      className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot"
                    />
                  </div>
                </div>
              )}

              {/* Genres */}
              <div>
                <label className="block text-xs text-white/70 mb-1">
                  Genres (comma separated)
                </label>
                <input
                  name="genres"
                  value={form.genres}
                  onChange={onChange}
                  placeholder="Action, Drama, Thriller"
                  className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot"
                />
              </div>

              {/* Homepage */}
              <div>
                <label className="block text-xs text-white/70 mb-1">
                  Homepage URL
                </label>
                <input
                  name="homepage"
                  value={form.homepage}
                  onChange={onChange}
                  type="url"
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot"
                />
              </div>
            </>
          )}

          {error && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 rounded bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-green-400">{success}</p>
            </div>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-lg bg-coquelicot text-white text-sm font-semibold disabled:opacity-60 cursor-pointer hover:bg-coquelicot/90 transition-colors"
          >
            {loading ? 'Processing...' : 'Add Media'}
          </button>
        </div>
      </div>
    </div>
  );
}
