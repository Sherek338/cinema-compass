import { useRef, useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Header from '@/components/header.jsx';
import Footer from '@/components/footer.jsx';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/authContext.jsx';
import UserReviews from '@/components/UserReviews.jsx';
import tmdb from '@/service/tmdbApi';

const imageUrl = (path, size = 'w780') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder.png';

export default function MediaDetail() {
  const { id } = useParams();
  const location = useLocation();
  const isSeries = location.pathname.includes('/series');
  const type = isSeries ? 'tv' : 'movie';
  const mediaType = type;

  const {
    isAuthenticated,
    watchList,
    favoriteList,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    apiRequest,
    fetchIsAdmin,
  } = useAuth();

  const isAdminRef = useRef(false);

  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [images, setImages] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isBanned, setIsBanned] = useState(false);
  const [banId, setBanId] = useState(null);
  const [banLoading, setBanLoading] = useState(false);

  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);
  const [fullCastOpen, setFullCastOpen] = useState(false);

  const movieId = Number(id);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        const [d, c, i, rv, rec] = await Promise.all([
          tmdb.getDetails(type, id),
          tmdb.getCredits(type, id),
          tmdb.getImages(type, id),
          tmdb.getReviews(type, id),
          tmdb.getRecommendations(type, id, 1),
        ]);

        if (cancelled) return;

        setDetails(d);
        setCredits(c);
        setImages(i);
        setReviews(rv?.results || []);
        setRecommendations(rec?.results || []);
      } catch (err) {
        console.error('Failed to load media details', err);
        if (!cancelled) setDetails(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, isSeries]);

  useEffect(() => {
    let cancelled = false;

    const loadAdminAndBan = async () => {
      isAdminRef.current = false;
      setIsBanned(false);
      setBanId(null);

      if (!isAuthenticated) return;

      try {
        const adminFlag = await fetchIsAdmin();
        if (cancelled) return;
        isAdminRef.current = !!adminFlag;

        if (!isAdminRef.current) {
          return;
        }

        const list = await apiRequest('/api/admin/banned', { method: 'GET' });
        if (cancelled) return;

        const found = Array.isArray(list)
          ? list.find(
              (x) => Number(x.tmdb_id) === movieId && x.type === mediaType
            )
          : null;

        if (found) {
          setIsBanned(true);
          setBanId(found._id || found.id || null);
        } else {
          setIsBanned(false);
          setBanId(null);
        }
      } catch (err) {
        console.error('Failed to determine admin/ban status', err);
        isAdminRef.current = false;
        setIsBanned(false);
        setBanId(null);
      }
    };

    loadAdminAndBan();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, movieId, mediaType, fetchIsAdmin, apiRequest]);

  const toggleBan = async () => {
    if (!isAdminRef.current) return;

    try {
      setBanLoading(true);

      if (!isBanned) {
        const created = await apiRequest('/api/admin/banned', {
          method: 'POST',
          body: JSON.stringify({ tmdb_id: movieId, type: mediaType }),
        });

        const newId = created?._id ?? created?.id ?? null;
        setIsBanned(true);
        setBanId(newId);
      } else {
        if (!banId) {
          try {
            const list = await apiRequest('/api/admin/banned', {
              method: 'GET',
            });
            const found = Array.isArray(list)
              ? list.find(
                  (x) => Number(x.tmdb_id) === movieId && x.type === mediaType
                )
              : null;
            if (found && found._id) {
              await apiRequest(`/api/admin/banned/${found._id}`, {
                method: 'DELETE',
              });
            } else {
              console.warn('Ban id not found for unban');
            }
          } catch (err) {
            console.error('Unban fallback failed', err);
            throw err;
          }
        } else {
          await apiRequest(`/api/admin/banned/${banId}`, { method: 'DELETE' });
        }

        setIsBanned(false);
        setBanId(null);
      }
    } catch (err) {
      console.error('Ban/Unban error', err);
    } finally {
      setBanLoading(false);
    }
  };

  const inWatchlist =
    isAuthenticated &&
    watchList.some((x) => x.id === movieId && x.type === mediaType);

  const inFavorites =
    isAuthenticated &&
    favoriteList.some((x) => x.id === movieId && x.type === mediaType);

  const [localInWatchlist, setLocalInWatchlist] = useState(inWatchlist);
  const [localInFavorites, setLocalInFavorites] = useState(inFavorites);

  useEffect(() => setLocalInWatchlist(inWatchlist), [inWatchlist]);
  useEffect(() => setLocalInFavorites(inFavorites), [inFavorites]);

  const handleWatchlistClick = async () => {
    if (!isAuthenticated) return;

    if (localInWatchlist) {
      await removeFromWatchlist(movieId, mediaType);
      setLocalInWatchlist(false);
    } else {
      await addToWatchlist(movieId, mediaType);
      setLocalInWatchlist(true);
    }
  };

  const handleFavoritesClick = async () => {
    if (!isAuthenticated) return;

    if (localInFavorites) {
      await removeFromFavorites(movieId, mediaType);
      setLocalInFavorites(false);
    } else {
      await addToFavorites(movieId, mediaType);
      setLocalInFavorites(true);
    }
  };

  const openTrailer = () => {
    if (!details) return;
    const title = details.title || details.name || '';
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      title + ' trailer'
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-raisin-black">
        <div className="w-12 h-12 rounded-full border-4 border-coquelicot border-t-transparent animate-spin" />
      </div>
    );

  if (!details)
    return (
      <div className="flex justify-center items-center min-h-screen bg-raisin-black text-white">
        <p>Content not found.</p>
      </div>
    );

  const {
    title,
    name,
    overview,
    backdrop_path,
    poster_path,
    vote_average,
    release_date,
    first_air_date,
    runtime,
    episode_run_time,
    number_of_seasons,
    number_of_episodes,
    genres = [],
    homepage,
    original_language,
  } = details;

  const displayTitle = title || name;
  const displayYear = (release_date || first_air_date || '').slice(0, 4);

  const minutes = !isSeries
    ? runtime || 0
    : Array.isArray(episode_run_time) && episode_run_time.length > 0
      ? episode_run_time[0]
      : 0;

  const duration =
    minutes > 0
      ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
      : isSeries && number_of_seasons
        ? `${number_of_seasons} season${number_of_seasons > 1 ? 's' : ''}`
        : 'N/A';

  const ratingLabel = vote_average ? vote_average.toFixed(1) : 'N/A';

  const director =
    credits?.crew
      ?.filter((p) => p.job === 'Director')
      .map((p) => p.name)
      .join(', ') || 'N/A';

  const writers =
    credits?.crew
      ?.filter((p) => ['Writer', 'Screenplay', 'Story'].includes(p.job))
      .map((p) => p.name)
      .slice(0, 4)
      .join(', ') || 'N/A';

  const language = original_language?.toUpperCase() || 'N/A';

  const castList = (credits?.cast || []).slice(0, 4);
  const fullCast = credits?.cast || [];
  const reviewList = reviews.slice(0, 4);
  const photoList = (images?.backdrops || []).slice(0, 12);

  const backLink = isSeries ? '/series' : '/movies';

  return (
    <div className="min-h-screen bg-raisin-black">
      <Header />

      <main className="pt-0">
        {/* Background Banner */}
        <div className="relative w-full h-[500px] md:h-[700px] lg:h-[824px] overflow-hidden">
          <img
            src={imageUrl(backdrop_path || poster_path, 'original')}
            alt={displayTitle}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />

          {/* Banner content */}
          <div className="relative h-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[70px] flex flex-col justify-end pb-12 md:pb-20">
            <div className="mb-3 md:mb-4">
              <p className="text-white text-base md:text-lg">
                {displayYear} • {duration} • {isSeries ? 'TV' : 'Movie'}
              </p>
            </div>

            <h1 className="text-white text-5xl md:text-6xl lg:text-[70px] font-bold leading-tight mb-4 md:mb-6">
              {displayTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <button
                onClick={openTrailer}
                className="px-4 md:px-6 py-2 md:py-2.5 bg-coquelicot text-white text-sm md:text-base lg:text-[18px] font-semibold rounded-lg hover:bg-coquelicot/90 transition-colors cursor-pointer"
              >
                Watch trailer
              </button>

              {isAuthenticated && (
                <>
                  {/* WATCHLIST */}
                  <button
                    onClick={handleWatchlistClick}
                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-normal transition-colors cursor-pointer ${
                      localInWatchlist
                        ? 'bg-white text-black'
                        : 'border border-white/80 text-white hover:bg-white/10'
                    }`}
                  >
                    {localInWatchlist
                      ? 'Remove from Watchlist'
                      : 'Add to Watchlist'}
                  </button>

                  {/* FAVORITES */}
                  <button
                    onClick={handleFavoritesClick}
                    className={`p-2.5 border rounded-lg transition-colors cursor-pointer ${
                      localInFavorites
                        ? 'border-coquelicot bg-coquelicot/90 text-white'
                        : 'border-white text-white hover:bg-white/10'
                    }`}
                    aria-label="Toggle favorite"
                  >
                    <Heart
                      className="w-5 h-5 md:w-6 md:h-6"
                      fill={localInFavorites ? 'white' : 'none'}
                    />
                  </button>

                  {/* ADMIN BAN BUTTON */}
                  {isAdminRef.current && (
                    <button
                      onClick={toggleBan}
                      disabled={banLoading}
                      className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-normal transition-colors cursor-pointer ${
                        isBanned
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-yellow-500 text-black hover:bg-yellow-400'
                      }`}
                    >
                      {banLoading
                        ? 'Processing...'
                        : isBanned
                          ? 'Unban'
                          : 'Ban'}
                    </button>
                  )}
                </>
              )}

              {homepage && (
                <a
                  href={homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 md:px-6 py-2 md:py-2.5 border border-white text-white text-sm md:text-base lg:text-[18px] rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Official site
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[70px] py-8 md:py-12 lg:py-16">
          {/* Overview */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-12 md:mb-16">
            <div className="flex-1 max-w-[420px]">
              <h2 className="text-white text-2xl md:text-[30px] font-bold mb-3 md:mb-4">
                Overview
              </h2>
              <p className="text-white text-base md:text-lg font-semibold text-justify leading-relaxed mb-6 md:mb-8">
                {overview || 'No overview available.'}
              </p>

              <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                {genres.map((genre) => (
                  <span
                    key={genre.id ?? genre.name}
                    className="px-3 py-1.5 border border-white rounded-full text-white text-sm md:text-[15px]"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-white text-base md:text-lg">
                  <span className="font-bold">Director:</span> {director}
                </p>
                <p className="text-white text-base md:text-lg">
                  <span className="font-bold">Writers:</span> {writers}
                </p>
                <p className="text-white text-base md:text-lg">
                  <span className="font-bold">Original language:</span>{' '}
                  {language}
                </p>
                <p className="text-white text-base md:text-lg">
                  <span className="font-bold">Score:</span> {ratingLabel}
                </p>
                {isSeries && number_of_episodes && (
                  <p className="text-white text-base md:text-lg">
                    <span className="font-bold">Episodes:</span>{' '}
                    {number_of_episodes}
                  </p>
                )}
              </div>
            </div>

            {/* Cast List */}
            <div className="flex-1 max-w-[310px]">
              <h2 className="text-white text-2xl md:text-[30px] font-bold mb-4 md:mb-6">
                Cast
              </h2>
              <div className="space-y-4">
                {castList.map((actor) => (
                  <div
                    key={actor.id}
                    className="flex items-center gap-4 md:gap-5"
                  >
                    <div className="w-16 h-16 md:w-[90px] md:h-[90px] rounded-full bg-gray-700 overflow-hidden">
                      <img
                        src={imageUrl(actor.profile_path, 'w185')}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-white text-lg md:text-[20px] font-semibold">
                        {actor.name}
                      </h3>
                      <p className="text-white text-base md:text-lg font-semibold">
                        {actor.character}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mb-5">
            <UserReviews
              key={`${movieId}-${mediaType}`}
              tmdbId={movieId}
              mediaType={isSeries ? 'series' : 'movie'}
            />
          </div>

          {/* Photos */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-white text-2xl md:text-[30px] font-bold mb-4 md:mb-6">
              Photos
            </h2>

            {photoList.length === 0 && (
              <p className="text-white/70 text-sm">No photos available.</p>
            )}

            {photoList.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {photoList.slice(0, 5).map((photo, index) => (
                  <button
                    key={photo.file_path}
                    type="button"
                    onClick={() => {
                      setPhotoViewerIndex(index);
                      setPhotoViewerOpen(true);
                    }}
                    className="w-full h-[200px] md:h-[250px] rounded overflow-hidden"
                  >
                    <img
                      src={imageUrl(photo.file_path, 'w780')}
                      alt={`${displayTitle} still ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Recommendations */}
          <section>
            <h2 className="text-white text-2xl md:text-[30px] font-bold mb-4 md:mb-6">
              More like this
            </h2>

            <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 scrollbar-hide">
              {recommendations.slice(0, 8).map((rec) => {
                const recTitle = rec.title || rec.name;
                const recYear = (
                  rec.release_date ||
                  rec.first_air_date ||
                  ''
                ).slice(0, 4);
                const recRating = rec.vote_average
                  ? rec.vote_average.toFixed(1)
                  : 'N/A';

                return (
                  <Link
                    key={rec.id}
                    to={isSeries ? `/series/${rec.id}` : `/movies/${rec.id}`}
                    className="flex-shrink-0 w-[200px] group cursor-pointer"
                  >
                    <img
                      src={imageUrl(rec.poster_path, 'w500')}
                      alt={recTitle}
                      className="w-full h-[273px] object-cover rounded-sm mb-3 transition-transform group-hover:scale-105"
                    />

                    <h3 className="text-white text-lg md:text-[20px] font-semibold mb-1 leading-tight">
                      {recTitle}
                    </h3>

                    <div className="flex items-end gap-2.5 text-white font-semibold text-[15px]">
                      <span>{recYear}</span>
                      <span>•</span>
                      <span>{recRating}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Link
              to={backLink}
              className="mt-6 inline-block text-white/70 hover:text-white transition"
            >
              ← Back to {isSeries ? 'Series' : 'Movies'}
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
