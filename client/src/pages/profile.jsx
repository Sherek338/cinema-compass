import { useEffect, useState } from 'react';
import Header from '@/components/header.jsx';
import Footer from '@/components/footer.jsx';
import { useAuth } from '@/context/authContext.jsx';
import MediaCard from '@/components/mediacard.jsx';

export default function Profile() {
  const { isAuthenticated, user, updateFavorites, updateWatchlist } = useAuth();

  const [favItems, setFavItems] = useState([]);
  const [watchItems, setWatchItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (!isAuthenticated || !user) {
        setFavItems([]);
        setWatchItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const favIds = user.favoriteList || [];
        const watchIds = user.watchList || [];

        const loadMovies = async (ids) => {
          if (ids.length === 0) return [];

          return Promise.all(
            ids.map(async (id) => {
              const r = await fetch(
                `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=en-US`
              );
              const j = await r.json();
              return {
                id: j.id,
                title: j.title,
                poster: j.poster_path
                  ? `https://image.tmdb.org/t/p/w500${j.poster_path}`
                  : 'https://via.placeholder.com/400x600?text=No+Image',
                rating: j.vote_average?.toFixed(1) ?? 'N/A',
                year: (j.release_date || '').slice(0, 4) || '—',
                duration: j.runtime ? `${j.runtime} min` : '—',
              };
            })
          );
        };

        const [fav, watch] = await Promise.all([
          loadMovies(favIds),
          loadMovies(watchIds),
        ]);

        if (!cancelled) {
          setFavItems(fav);
          setWatchItems(watch);
        }
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user, TMDB_KEY]);

  const removeFromFavorites = async (movieId) => {
    try {
      await updateFavorites(movieId, 'remove');
      setFavItems((p) => p.filter((x) => x.id !== movieId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      await updateWatchlist(movieId, 'remove');
      setWatchItems((p) => p.filter((x) => x.id !== movieId));
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#201E1F]">
        <div className="w-12 h-12 rounded-full border-4 border-[#FF4002] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#201E1F] text-white justify-center items-center gap-4">
        <p className="text-lg">Please log in again.</p>
        <a
          href="/"
          className="px-6 py-2 rounded bg-[#FF4002] font-semibold hover:bg-[#ff5722] transition"
        >
          Go Home
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#201E1F] flex flex-col">
      <Header />
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-[70px] py-16 pt-30">
        <h1 className="text-white font-bold text-[35px] mb-10">My Profile</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="w-full lg:w-[300px] bg-[#2B2A2B] p-6 rounded-xl flex flex-col gap-6 shadow-lg">
            <div>
              <h2 className="text-white font-semibold text-2xl mb-1">
                {user.username}
              </h2>
              <p className="text-[#999]">{user.email}</p>
            </div>
            <div>
              <p className="text-white font-medium">Status:</p>
              <p
                className={`font-semibold ${user.isActivated ? 'text-green-400' : 'text-yellow-400'}`}
              >
                {user.isActivated ? 'Activated' : 'Not Activated'}
              </p>
            </div>
            <div>
              <p className="text-white font-medium">Favorites:</p>
              <p className="text-[#999]">
                {user.favoriteList?.length || 0} movies
              </p>
            </div>
            <div>
              <p className="text-white font-medium">Watchlist:</p>
              <p className="text-[#999]">
                {user.watchList?.length || 0} movies
              </p>
            </div>
          </aside>

          <section className="flex-1 flex flex-col gap-12">
            <div>
              <h2 className="text-white font-bold text-2xl mb-5">Favorites</h2>
              {favItems.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {favItems.map((m) => (
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
                        onClick={() => removeFromFavorites(m.id)}
                        className="absolute top-2 right-2 text-xs px-2 py-1 bg-black/60 rounded hover:bg-black/80"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#999]">No favorites yet.</p>
              )}
            </div>

            <div>
              <h2 className="text-white font-bold text-2xl mb-5">Watchlist</h2>
              {watchItems.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {watchItems.map((m) => (
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
                        onClick={() => removeFromWatchlist(m.id)}
                        className="absolute top-2 right-2 text-xs px-2 py-1 bg-black/60 rounded hover:bg-black/80"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#999]">Your watchlist is empty.</p>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
