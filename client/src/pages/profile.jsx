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

function ProfileMovieCard({ id, title, year, rating, poster, isSeries, meta }) {
  const detailPath = isSeries ? `/series/${id}` : `/movies/${id}`;

  return (
    <div className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[215px] flex flex-col gap-3">
      <Link to={detailPath}>
        <img
          src={poster}
          alt={title}
          className="w-full h-[240px] sm:h-[260px] md:h-[273px] object-cover rounded-[16px]"
        />
      </Link>
      <div className="flex flex-col gap-1">
        <Link to={detailPath}>
          <h3 className="text-white font-semibold text-[17px] sm:text-[18px] line-clamp-2">
            {title}
          </h3>
        </Link>
        <div className="flex items-end gap-2.5 text-white font-semibold text-[13px] sm:text-[14px]">
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

export default function Profile() {
  const { isAuthenticated, user, favoriteList, watchList } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);

  const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoadingLists(true);

        if (!isAuthenticated) {
          setFavorites([]);
          setWatchlist([]);
          return;
        }

        if (!TMDB_KEY) {
          console.error('Missing VITE_TMDB_API_KEY');
          return;
        }

        const [favRes, watchRes] = await Promise.all([
          favoriteList && favoriteList.length
            ? Promise.all(
                favoriteList.map((item) =>
                  fetchOneTMDB(item.id, item.type, TMDB_KEY, controller.signal)
                )
              )
            : Promise.resolve([]),
          watchList && watchList.length
            ? Promise.all(
                watchList.map((item) =>
                  fetchOneTMDB(item.id, item.type, TMDB_KEY, controller.signal)
                )
              )
            : Promise.resolve([]),
        ]);

        if (cancelled) return;

        setFavorites((favRes || []).filter(Boolean));
        setWatchlist((watchRes || []).filter(Boolean));
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load profile lists', err);
      } finally {
        if (!cancelled) setLoadingLists(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [isAuthenticated, favoriteList, watchList, TMDB_KEY]);

  const displayName =
    user?.username || (user?.email ? user.email.split('@')[0] : 'User');

  const hasFavorites = favorites.length > 0;
  const hasWatchlist = watchlist.length > 0;

  return (
    <div className="min-h-screen bg-raisin-black">
      <Header />

      <main className="pt-[91px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[70px] py-8 md:py-12 lg:py-16">
          <h1 className="text-white text-3xl md:text-[35px] font-bold mb-8 md:mb-12">
            My profile
          </h1>

          <div className="flex items-center gap-4 mb-12 md:mb-20">
            <div className="w-16 h-16 md:w-[71px] md:h-[71px] rounded-full bg-gradient-to-br from-coquelicot to-orange-600 flex items-center justify-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 md:w-10 md:h-10"
              >
                <g clipPath="url(#clip0_profile_avatar)">
                  <path
                    d="M9.80872 15.0659C4.61646 17.1354 0.933595 22.2027 0.933601 28.125C0.933129 28.2487 0.957151 28.3713 1.00428 28.4857C1.05141 28.6001 1.12072 28.7041 1.20821 28.7916C1.2957 28.879 1.39964 28.9483 1.51404 28.9955C1.62844 29.0426 1.75104 29.0666 1.87476 29.0662H28.1248C28.3734 29.0652 28.6115 28.9655 28.7866 28.789C28.9617 28.6125 29.0595 28.3736 29.0586 28.125C29.0586 22.2033 25.3767 17.1358 20.1853 15.0659C18.7497 16.1917 16.9486 16.8713 14.9961 16.8713C13.0432 16.8713 11.243 16.1921 9.80872 15.0659Z"
                    fill="white"
                  />
                  <path
                    d="M14.996 0.941162C10.8649 0.941162 7.50147 4.30467 7.50146 8.43567C7.50147 12.5667 10.8649 15.9375 14.996 15.9375C19.127 15.9375 22.4978 12.5667 22.4978 8.43567C22.4978 4.30467 19.127 0.941162 14.996 0.941162Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_profile_avatar">
                    <rect width="30" height="30" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-white text-xl md:text-[25px] font-normal">
              {isAuthenticated ? displayName : 'Guest'}
            </h2>
          </div>

          <section className="mb-12 md:mb-16">
            <div className="flex items-end justify-between mb-5 md:mb-6">
              <h2 className="text-white text-2xl md:text-[30px] font-bold">
                Favourites
              </h2>
              <Link
                to="/favorites"
                className="text-white text-sm md:text-[18px] hover:text-coquelicot transition-colors"
              >
                View all
              </Link>
            </div>

            {loadingLists ? (
              <p className="text-sm text-gray-200">Loading favourites...</p>
            ) : !isAuthenticated ? (
              <p className="text-sm text-gray-200">
                Please sign in to see your favourites.
              </p>
            ) : !hasFavorites ? (
              <p className="text-sm text-gray-200">
                You do not have any favourites yet.
              </p>
            ) : (
              <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 scrollbar-hide">
                {favorites.map((movie) => (
                  <ProfileMovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    year={movie.year}
                    rating={movie.rating}
                    meta={movie.meta}
                    poster={movie.poster}
                    isSeries={movie.isSeries}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="mb-12 md:mb-16">
            <div className="flex items-end justify-between mb-5 md:mb-6">
              <h2 className="text-white text-2xl md:text-[30px] font-bold">
                My Watchlist
              </h2>
              <Link
                to="/watchlist"
                className="text-white text-sm md:text-[18px] hover:text-coquelicot transition-colors"
              >
                View all
              </Link>
            </div>

            {loadingLists ? (
              <p className="text-sm text-gray-200">Loading watchlist...</p>
            ) : !isAuthenticated ? (
              <p className="text-sm text-gray-200">
                Please sign in to see your watchlist.
              </p>
            ) : !hasWatchlist ? (
              <p className="text-sm text-gray-200">
                You do not have anything in your watchlist yet.
              </p>
            ) : (
              <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 scrollbar-hide">
                {watchlist.map((movie) => (
                  <ProfileMovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    year={movie.year}
                    rating={movie.rating}
                    poster={movie.poster}
                    isSeries={movie.isSeries}
                    meta={movie.meta}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-end justify-between mb-5 md:mb-6">
              <h2 className="text-white text-2xl md:text-[30px] font-bold">
                My Reviews
              </h2>
              <button className="text-white text-sm md:text-[18px] hover:text-coquelicot transition-colors">
                View all
              </button>
            </div>

            <div className="w-full max-w-[310px] bg-coquelicot rounded-[20px] p-5">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white text-[20px] font-semibold mb-1">
                      {isAuthenticated ? displayName : 'User'}
                    </h3>
                    <div className="flex items-center gap-1.5 text-white text-xs">
                      <span className="font-semibold">Posted on:</span>
                      <span className="font-normal">11 Jul 2025</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[...Array(4)].map((_, i) => (
                      <svg
                        key={i}
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.346 8.95142C16.9889 8.37204 16.6422 7.30502 15.7815 7.21413L12.5461 6.87245C12.1912 6.83497 11.8832 6.61116 11.7378 6.28519L10.4136 3.31494C10.0612 2.52454 8.9393 2.52454 8.58691 3.31494L7.26266 6.28519C7.11732 6.61116 6.80927 6.83497 6.45434 6.87245L3.21894 7.21413C2.35832 7.30502 2.01163 8.37204 2.65447 8.95142L5.07101 11.1294C5.33613 11.3684 5.4538 11.7305 5.37978 12.0796L4.70524 15.261C4.52574 16.1076 5.43341 16.7671 6.18308 16.3347L9.00065 14.7098C9.30985 14.5314 9.69064 14.5314 9.99983 14.7098L12.8174 16.3347C13.5671 16.7671 14.4747 16.1076 14.2952 15.261L13.6207 12.0796C13.5467 11.7305 13.6644 11.3684 13.9295 11.1294L16.346 8.95142Z"
                          fill="#F5C519"
                        />
                      </svg>
                    ))}
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 19 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.346 8.95142C16.9889 8.37204 16.6422 7.30502 15.7815 7.21413L12.5461 6.87245C12.1912 6.83497 11.8832 6.61116 11.7378 6.28519L10.4136 3.31494C10.0612 2.52454 8.9393 2.52454 8.58691 3.31494L7.26266 6.28519C7.11732 6.61116 6.80927 6.83497 6.45434 6.87245L3.21894 7.21413C2.35832 7.30502 2.01163 8.37204 2.65447 8.95142L5.07101 11.1294C5.33613 11.3684 5.4538 11.7305 5.37978 12.0796L4.70524 15.261C4.52574 16.1076 5.43341 16.7671 6.18308 16.3347L9.00065 14.7098C9.30985 14.5314 9.69064 14.5314 9.99983 14.7098L12.8174 16.3347C13.5671 16.7671 14.4747 16.1076 14.2952 15.261L13.6207 12.0796C13.5467 11.7305 13.6644 11.3684 13.9295 11.1294L16.346 8.95142Z"
                        fill="#CACACA"
                      />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <p className="text-white text-[15px] font-normal leading-relaxed text-justify">
                    "Just a fun time watching this iteration of Superman. David
                    Corenswet and Rachel Brosnahan were absolutely wonderful
                    together and Nicholas Hoult played a great Lex Luthor.
                    <span className="text-white/80 text-[13px] font-semibold ml-1">
                      ...Read more
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button className="text-white text-[15px] font-bold italic hover:opacity-80 transition-opacity">
                  Edit
                </button>
                <button className="text-white text-[15px] font-bold italic hover:opacity-80 transition-opacity">
                  Delete
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
