import { useEffect, useState } from 'react';
import Header from '@/components/header.jsx';
import Footer from '@/components/footer.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import MediaCard from '@/components/mediacard.jsx';

export default function Favorites() {
  const { isAuthenticated, user, updateFavorites } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    let cancelled = false;

    const loadFavorites = async () => {
      if (!isAuthenticated || !user) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const favoriteIds = user.favoriteList || [];

        if (favoriteIds.length === 0) {
          setItems([]);
          setLoading(false);
          return;
        }

        const details = await Promise.all(
          favoriteIds.map(async (id) => {
            const res = await fetch(
              `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=en-US`
            );

            if (!res.ok) throw new Error(`Failed to fetch movie ${id}`);

            const json = await res.json();
            return {
              id: json.id,
              title: json.title,
              poster: json.poster_path
                ? `https://image.tmdb.org/t/p/w500${json.poster_path}`
                : 'https://via.placeholder.com/400x600?text=No+Image',
              rating: json.vote_average?.toFixed(1) ?? 'N/A',
              year: (json.release_date || '').slice(0, 4) || '—',
              duration: json.runtime ? `${json.runtime} min` : '—',
            };
          })
        );

        if (!cancelled) {
          setItems(details);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load favorites:', err);
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user, TMDB_KEY]);

  const handleRemove = async (movieId) => {
    try {
      await updateFavorites(movieId, 'remove');
      setItems((prev) => prev.filter((x) => x.id !== movieId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      alert('Failed to remove from favorites. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#201E1F] flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-8 lg:px-16 py-12 w-full">
        <h1 className="text-white font-bold text-[35px] mb-10">My Favorites</h1>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 rounded-full border-4 border-[#FF4002] border-t-transparent animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#FF4002] text-white rounded hover:bg-[#ff5722]"
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="text-[#999]">No favorites yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 mb-6">
            {items.map((m) => (
              <div key={m.id} className="relative">
                <MediaCard
                  id={m.id}
                  title={m.title}
                  poster={m.poster}
                  rating={m.rating}
                  year={m.year}
                  duration={m.duration}
                  isSeries={false}
                />
                <button
                  onClick={() => handleRemove(m.id)}
                  className="absolute top-2 right-2 text-xs px-2 py-1 bg-black/60 rounded hover:bg-black/80 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
