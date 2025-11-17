import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/header.jsx';
import Footer from '@/components/footer.jsx';
import { useAuth } from '@/context/authContext.jsx';

const TMDB_BASE = 'https://api.themoviedb.org/3';

function formatRuntime(runtime) {
  if (!runtime || Number.isNaN(runtime)) return null;
  const h = Math.floor(runtime / 60);
  const m = runtime % 60;
  if (!h) return `${m}m`;
  if (!m) return `${h}h`;
  return `${h}h ${m}m`;
}

async function fetchOneTMDB(id, type, apiKey, signal) {
  const url = `${TMDB_BASE}/${type === 'movie' ? 'movie' : 'tv'}/${id}?api_key=${apiKey}&language=en-US`;
  let res = await fetch(url, { signal });

  let mediaType = 'movie';

  if (!res.ok) {
    res = await fetch(
      `${TMDB_BASE}/tv/${id}?api_key=${apiKey}&language=en-US`,
      { signal }
    );
    if (!res.ok) return null;
    mediaType = 'tv';
  }

  const data = await res.json();

  const isSeries = type === 'series';
  const seasons =
    isSeries && typeof data.number_of_seasons === 'number'
      ? `${data.number_of_seasons} season${
          data.number_of_seasons === 1 ? '' : 's'
        }`
      : null;

  const duration =
    !isSeries && typeof data.runtime === 'number'
      ? formatRuntime(data.runtime)
      : null;

  return {
    id: data.id,
    title: data.title || data.name || 'Untitled',
    year: (data.release_date || data.first_air_date || '').slice(0, 4),
    rating:
      typeof data.vote_average === 'number'
        ? data.vote_average.toFixed(1) === '0.0'
          ? 'N/A'
          : data.vote_average.toFixed(1)
        : null,
    poster: data.poster_path
      ? `https://image.tmdb.org/t/p/w342${data.poster_path}`
      : '/placeholder.png',
    isSeries,
    meta: seasons || duration || null,
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

  const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

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
          return;
        }

        const results = await Promise.all(
          favoriteList.map((item) =>
            fetchOneTMDB(item.id, item.type, TMDB_KEY, controller.signal)
          )
        );

        if (cancelled) return;

        setItems(results.filter(Boolean));
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load favorites', err);
        setError('Failed to load favorites.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [isAuthenticated, favoriteList, TMDB_KEY]);

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
              <div className="w-[75px] h-0.5 bg-[#FF4002]"></div>
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
              <div className="w-[75px] h-0.5 bg-[#FF4002]"></div>
            )}
          </div>
        </div>

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
              <ListCard
                key={m.id}
                id={m.id}
                title={m.title}
                year={m.year}
                meta={m.meta}
                rating={m.rating}
                poster={m.poster}
                isSeries={m.isSeries}
                onRemove={() => handleRemove(m.id)}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col items-center gap-2.5">
          <div className="flex justify-center items-center gap-2.5">
            <span className="text-white text-center font-bold text-xl">1</span>
          </div>
          <div className="flex items-center">
            <button className="p-2 hover:opacity-70 transition">
              <svg
                width="37"
                height="37"
                viewBox="0 0 37 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_198_626_fav)">
                  <path
                    d="M23.125 10.0209L13.875 19.2709L23.125 28.5209"
                    stroke="#999999"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_198_626_fav">
                    <rect
                      width="37"
                      height="37"
                      fill="white"
                      transform="matrix(0 1 1 0 0 0)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>
            <button className="p-2 hover:opacity-70 transition">
              <svg
                width="37"
                height="37"
                viewBox="0 0 37 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_198_629_fav)">
                  <path
                    d="M13.875 10.0209L23.125 19.2709L13.875 28.5209"
                    stroke="#999999"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_198_629_fav">
                    <rect
                      width="37"
                      height="37"
                      fill="white"
                      transform="matrix(0 1 -1 0 37 0)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
