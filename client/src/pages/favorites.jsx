import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/header.jsx';
import Footer from '@/components/footer.jsx';
import { useAuth } from '@/context/authContext.jsx';

import tmdb from '@/service/tmdbApi.js';

function formatRuntime(runtime) {
  if (!runtime || Number.isNaN(runtime)) return null;
  const h = Math.floor(runtime / 60);
  const m = runtime % 60;
  if (!h) return `${m}m`;
  if (!m) return `${h}h`;
  return `${h}h ${m}m`;
}

async function loadMediaItem(id, type) {
  const isSeries = type === 'series';

  const data = await tmdb.getMediaDetails(id, isSeries);
  if (!data) return null;

  const title = data.title || data.name || 'Untitled';
  const year = (data.release_date || data.first_air_date || '').slice(0, 4);

  // Постер
  const poster = data.poster_path
    ? tmdb.getImageUrl(data.poster_path, 'w342')
    : '/placeholder.png';

  // Формируем meta-информацию
  let meta = null;

  if (isSeries) {
    const s = data.number_of_seasons;
    if (typeof s === 'number') {
      meta = `${s} season${s === 1 ? '' : 's'}`;
    }
  } else {
    if (typeof data.runtime === 'number') {
      meta = formatRuntime(data.runtime);
    }
  }

  // Рейтинг
  let rating = null;
  if (typeof data.vote_average === 'number') {
    const r = data.vote_average.toFixed(1);
    rating = r === '0.0' ? 'N/A' : r;
  }

  return {
    id: data.id,
    title,
    year,
    meta,
    rating,
    poster,
    isSeries,
  };
}

function ListCard({
  id,
  title,
  year,
  meta,
  rating,
  poster,
  isSeries,
  onRemove,
}) {
  const detailPath = isSeries ? `/series/${id}` : `/movies/${id}`;

  return (
    <div className="flex flex-col gap-4 relative">
      <Link to={detailPath}>
        <img
          src={poster}
          alt={title}
          className="w-full h-[273px] object-cover rounded-lg"
        />
      </Link>

      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 text-xs px-2 py-1 bg-black/70 rounded hover:bg-black/90 transition cursor-pointer z-10"
        >
          Remove
        </button>
      )}

      <div className="flex flex-col gap-1">
        <Link to={detailPath}>
          <h3 className="text-white font-semibold text-xl line-clamp-2">
            {title}
          </h3>
        </Link>

        <div className="flex items-end gap-2.5 text-white font-semibold text-[15px]">
          {year && <span>{year}</span>}

          {meta && (
            <>
              <span>•</span>
              <span>{meta.length > 6 ? meta.slice(0, 6) + '...' : meta}</span>
            </>
          )}

          {rating && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.346 8.95142C16.9889 8.37204 16.6422 7.30502 15.7815 7.21413L12.5461 6.87245C12.1912 6.83497 11.8832 6.61116 11.7378 6.28519L10.4136 3.31494C10.0612 2.52454 8.9393 2.52454 8.58691 3.31494L7.26266 6.28519C7.11732 6.61116 6.80927 6.83497 6.45434 6.87245L3.21894 7.21413C2.35832 7.30502 2.01163 8.37204 2.65447 8.95142L5.07101 11.1294C5.33613 11.3684 5.4538 11.7305 5.37978 12.0796L4.70524 15.261C4.52574 16.1076 5.43341 16.7671 6.18308 16.3347L9.00065 14.7098C9.30985 14.5314 9.69064 14.5314 9.99983 14.7098L12.8174 16.3347C13.5671 16.7671 14.4747 16.1076 14.2952 15.261L13.6207 12.0796C13.5467 11.7305 13.6644 11.3684 13.9295 11.1294L16.346 8.95142Z"
                    fill="#F5C519"
                  />
                </svg>
                <span>{rating}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Favorites() {
  const { isAuthenticated, favoriteList, removeFromFavorites } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('movies');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!isAuthenticated) {
          setItems([]);
          setLoading(false);
          return;
        }

        if (!favoriteList || favoriteList.length === 0) {
          setItems([]);
          setLoading(false);
          return;
        }

        const results = await Promise.all(
          favoriteList.map((item) => loadMediaItem(item.id, item.type))
        );

        if (!cancelled) {
          setItems(results.filter(Boolean));
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load favorites', err);
          setError('Failed to load favorites.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, favoriteList]);

  const handleRemove = async (id) => {
    try {
      const type = activeTab === 'movies' ? 'movie' : 'series';
      await removeFromFavorites(id, type);
      setItems((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Failed to remove from favorites', err);
    }
  };

  const movies = items.filter((m) => !m.isSeries);
  const series = items.filter((m) => m.isSeries);
  const visibleItems = activeTab === 'movies' ? movies : series;

  return (
    <div className="min-h-screen bg-[#201E1F] flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-8 lg:px-16 py-12 w-full pt-30">
        <h1 className="text-white font-bold text-[35px] mb-16">My Favorites</h1>

        {/* Tabs */}
        <div className="flex items-start gap-9 justify-center mb-16">
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => setActiveTab('movies')}
              className={`text-[25px] transition ${
                activeTab === 'movies'
                  ? 'text-white font-bold'
                  : 'text-white font-normal cursor-pointer'
              }`}
            >
              Movies
            </button>
            {activeTab === 'movies' && (
              <div className="w-[75px] h-0.5 bg-[#FF4002]" />
            )}
          </div>

          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => setActiveTab('series')}
              className={`text-[25px] transition ${
                activeTab === 'series'
                  ? 'text-white font-bold'
                  : 'text-white font-normal cursor-pointer'
              }`}
            >
              Series
            </button>
            {activeTab === 'series' && (
              <div className="w-[75px] h-0.5 bg-[#FF4002]" />
            )}
          </div>
        </div>

        {/* States */}
        {!isAuthenticated && !loading && (
          <p className="text-sm text-gray-200 mb-8 text-center">
            Please sign in to see your favorites.
          </p>
        )}

        {loading && (
          <p className="text-sm text-gray-200 mb-8 text-center">
            Loading favorites...
          </p>
        )}

        {error && (
          <p className="text-sm text-red-400 mb-8 text-center">{error}</p>
        )}

        {!loading && isAuthenticated && visibleItems.length === 0 && (
          <p className="text-sm text-gray-200 mb-16 text-center">
            No {activeTab === 'movies' ? 'movies' : 'series'} in your favorites
            yet.
          </p>
        )}

        {!loading && visibleItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 mb-16">
            {visibleItems.map((m) => (
              <ListCard key={m.id} {...m} onRemove={() => handleRemove(m.id)} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
