import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Header from '@/components/header.jsx';
import Footer from '@/components/footer.jsx';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/authContext.jsx';

const imageUrl = (path, size = 'w780') =>
  path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : 'https://via.placeholder.com/400x600?text=No+Image';

export default function MediaDetail() {
  const { id } = useParams();
  const location = useLocation();
  const isSeries = location.pathname.includes('/series');

  const {
    isAuthenticated,
    watchList,
    favoriteList,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
  } = useAuth();

  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [images, setImages] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReview, setActiveReview] = useState(null);
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);
  const [fullCastOpen, setFullCastOpen] = useState(false);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    let cancelled = false;
    const type = isSeries ? 'tv' : 'movie';

    const fetchAll = async () => {
      try {
        setLoading(true);

        const [dRes, cRes, iRes, rRes, recRes] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=en-US`
          ),
          fetch(
            `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${API_KEY}&language=en-US`
          ),
          fetch(
            `https://api.themoviedb.org/3/${type}/${id}/images?api_key=${API_KEY}`
          ),
          fetch(
            `https://api.themoviedb.org/3/${type}/${id}/reviews?api_key=${API_KEY}&language=en-US`
          ),
          fetch(
            `https://api.themoviedb.org/3/${type}/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`
          ),
        ]);

        const [d, c, i, rv, rec] = await Promise.all([
          dRes.json(),
          cRes.json(),
          iRes.json(),
          rRes.json(),
          recRes.json(),
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

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, [id, isSeries, API_KEY]);

  useEffect(() => {
    const anyModalOpen = photoViewerOpen || !!activeReview || fullCastOpen;
    if (!anyModalOpen) return;

    const totalPhotos = images?.backdrops?.length || 0;

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setActiveReview(null);
        setPhotoViewerOpen(false);
        setFullCastOpen(false);
        return;
      }
      if (!photoViewerOpen || totalPhotos === 0) return;
      if (e.key === 'ArrowRight') {
        setPhotoViewerIndex((i) => Math.min(totalPhotos - 1, i + 1));
      } else if (e.key === 'ArrowLeft') {
        setPhotoViewerIndex((i) => Math.max(0, i - 1));
      }
    };

    window.addEventListener('keydown', handleKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [photoViewerOpen, activeReview, fullCastOpen, images]);

  const movieId = Number(id);
  const inWatchlist = isAuthenticated && movieId && watchList.includes(movieId);
  const inFavorites =
    isAuthenticated && movieId && favoriteList.includes(movieId);

  const openPhotoViewer = (index) => {
    setPhotoViewerIndex(index);
    setPhotoViewerOpen(true);
  };

  const closePhotoViewer = () => {
    setPhotoViewerOpen(false);
  };

  const openTrailer = () => {
    if (!details) return;
    const title = details.title || details.name || '';
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      title + ' trailer'
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-raisin-black">
        <div className="w-12 h-12 rounded-full border-4 border-coquelicot border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-raisin-black text-white">
        <p>Content not found.</p>
      </div>
    );
  }

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
  const recList = recommendations.slice(0, 6);

  const backLink = isSeries ? '/series' : '/movies';

  return (
    <div className="min-h-screen bg-raisin-black">
      <Header />

      <main className="pt-0">
        <div className="relative w-full h-[500px] md:h-[700px] lg:h-[824px] overflow-hidden">
          <img
            src={imageUrl(backdrop_path || poster_path, 'original')}
            alt={displayTitle}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />

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

              {isAuthenticated && movieId && (
                <>
                  <button
                    onClick={() =>
                      inWatchlist
                        ? removeFromWatchlist(movieId)
                        : addToWatchlist(movieId)
                    }
                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-normal transition-colors cursor-pointer ${
                      inWatchlist
                        ? 'bg-white text-black'
                        : 'border border-white/80 text-white hover:bg-white/10'
                    }`}
                  >
                    {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  </button>

                  <button
                    onClick={() =>
                      inFavorites
                        ? removeFromFavorites(movieId)
                        : addToFavorites(movieId)
                    }
                    className={`p-2.5 border rounded-lg transition-colors cursor-pointer ${
                      inFavorites
                        ? 'border-coquelicot bg-coquelicot/90 text-white'
                        : 'border-white text-white hover:bg-white/10'
                    }`}
                    aria-label="Toggle favorite"
                  >
                    <Heart className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
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

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[70px] py-8 md:py-12 lg:py-16">
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

            <div className="flex-1 max-w-[310px]">
              <h2 className="text-white text-2xl md:text-[30px] font-bold mb-4 md:mb-6">
                Cast
              </h2>
              <div className="space-y-4">
                {castList.length === 0 && (
                  <p className="text-white/70 text-sm">
                    No cast information available.
                  </p>
                )}
                {castList.map((actor) => (
                  <div
                    key={actor.id}
                    className="flex items-center gap-4 md:gap-5"
                  >
                    <div className="w-16 h-16 md:w-[90px] md:h-[90px] rounded-full bg-gray-700 flex-shrink-0 overflow-hidden">
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
              {fullCast.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFullCastOpen(true)}
                  className="mt-4 text-white text-base md:text-lg font-semibold hover:text-coquelicot transition-colors underline"
                >
                  View full cast
                </button>
              )}
            </div>
          </div>

          <section className="mb-12 md:mb-16">
            <h2 className="text-white text-2xl md:text-[30px] font-bold mb-4 md:mb-6">
              Reviews
            </h2>
            {reviewList.length === 0 && (
              <p className="text-white/70 text-sm">No reviews yet.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-4">
              {reviewList.map((review) => {
                const rawRating = review.author_details?.rating ?? 0;
                const starRating = Math.max(
                  0,
                  Math.min(5, Math.round(rawRating / 2))
                );
                const content = review.content || '';
                const short = content.slice(0, 220);
                const showReadMore = content.length > 220;

                return (
                  <div
                    key={review.id}
                    className="bg-coquelicot rounded-[20px] p-4 md:p-5 flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {review.author_details?.avatar_path && (
                          <img
                            src={
                              review.author_details.avatar_path.startsWith(
                                'http'
                              )
                                ? review.author_details.avatar_path.replace(
                                    /^\/+/,
                                    ''
                                  )
                                : imageUrl(
                                    review.author_details.avatar_path,
                                    'w185'
                                  )
                            }
                            alt={review.author || 'Avatar'}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h3 className="text-white text-lg md:text-[20px] font-semibold">
                            {review.author || 'Anonymous'}
                          </h3>
                          <p className="text-white text-xs">
                            <span className="font-semibold">Posted on:</span>{' '}
                            {review.created_at
                              ? new Date(review.created_at).toLocaleDateString()
                              : 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            width="19"
                            height="19"
                            viewBox="0 0 19 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.3458 8.95142C16.9886 8.37204 16.6419 7.30502 15.7813 7.21413L12.5459 6.87245C12.191 6.83497 11.8829 6.61116 11.7376 6.28519L10.4133 3.31494C10.0609 2.52454 8.93905 2.52454 8.58666 3.31494L7.26241 6.28519C7.11708 6.61116 6.80903 6.83497 6.4541 6.87245L3.2187 7.21413C2.35808 7.30502 2.01139 8.37204 2.65423 8.95142L5.07077 11.1294C5.33589 11.3684 5.45356 11.7305 5.37953 12.0796L4.70499 15.261C4.52549 16.1076 5.43316 16.7671 6.18284 16.3347L9.00041 14.7098C9.3096 14.5314 9.6904 14.5314 9.99959 14.7098L12.8172 16.3347C13.5668 16.7671 14.4745 16.1076 14.295 15.261L13.6205 12.0796C13.5464 11.7305 13.6641 11.3684 13.9292 11.1294L16.3458 8.95142Z"
                              fill={i < starRating ? '#F5C519' : '#CACACA'}
                            />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="text-white text-sm md:text-[15px] text-justify flex-1">
                      {short}
                      {showReadMore && (
                        <button
                          type="button"
                          onClick={() => setActiveReview(review)}
                          className="text-white/80 text-xs md:text-[13px] font-semibold ml-1 underline"
                        >
                          Read more
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

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
                    onClick={() => openPhotoViewer(index)}
                    className="w-full h-[200px] md:h-[250px] rounded overflow-hidden"
                  >
                    <img
                      src={imageUrl(photo.file_path, 'w780')}
                      alt={`${displayTitle} still ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {photoList.length > 5 && (
                  <button
                    type="button"
                    onClick={() => openPhotoViewer(5)}
                    className="relative w-full h-[200px] md:h-[250px] rounded overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={imageUrl(photoList[5].file_path, 'w780')}
                      alt={`${displayTitle} more photos`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <p className="text-white text-base md:text-lg font-bold">
                        + {Math.max(0, photoList.length - 5)} photos
                      </p>
                    </div>
                  </button>
                )}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-white text-2xl md:text-[30px] font-bold mb-4 md:mb-6">
              More like this
            </h2>
            {recList.length === 0 && (
              <p className="text-white/70 text-sm">No recommendations yet.</p>
            )}
            <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 scrollbar-hide">
              {recList.map((rec) => {
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
                    <div className="flex items-center gap-2 text-white text-sm md:text-[15px] font-semibold">
                      <span>{recYear}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 19 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.3458 8.95142C16.9886 8.37204 16.6419 7.30502 15.7813 7.21413L12.5459 6.87245C12.191 6.83497 11.8829 6.61116 11.7376 6.28519L10.4133 3.31494C10.0609 2.52454 8.93905 2.52454 8.58666 3.31494L7.26241 6.28519C7.11708 6.61116 6.80903 6.83497 6.4541 6.87245L3.2187 7.21413C2.35808 7.30502 2.01139 8.37204 2.65423 8.95142L5.07077 11.1294C5.33589 11.3684 5.45356 11.7305 5.37953 12.0796L4.70499 15.261C4.52549 16.1076 5.43316 16.7671 6.18284 16.3347L9.00041 14.7098C9.3096 14.5314 9.6904 14.5314 9.99959 14.7098L12.8172 16.3347C13.5668 16.7671 14.4745 16.1076 14.295 15.261L13.6205 12.0796C13.5464 11.7305 13.6641 11.3684 13.9292 11.1294L16.3458 8.95142Z"
                            fill="#F5C519"
                          />
                        </svg>
                        <span>{recRating}</span>
                      </div>
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

      {photoViewerOpen && photoList.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={closePhotoViewer}
        >
          <div
            className="max-w-5xl w-full px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closePhotoViewer}
              className="absolute top-6 right-6 text-white text-2xl"
            >
              ×
            </button>
            <img
              src={imageUrl(photoList[photoViewerIndex].file_path, 'original')}
              alt={`${displayTitle} still full`}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="flex items-center justify-between mt-4 text-white">
              <button
                type="button"
                disabled={photoViewerIndex === 0}
                onClick={() => setPhotoViewerIndex((i) => Math.max(0, i - 1))}
                className="px-3 py-1 rounded border border-white/40 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-sm">
                {photoViewerIndex + 1} / {photoList.length}
              </span>
              <button
                type="button"
                disabled={photoViewerIndex === photoList.length - 1}
                onClick={() =>
                  setPhotoViewerIndex((i) =>
                    Math.min(photoList.length - 1, i + 1)
                  )
                }
                className="px-3 py-1 rounded border border-white/40 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {activeReview && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveReview(null)}
        >
          <div
            className="bg-raisin-black p-6 rounded-xl max-w-xl w-full text-white relative max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-xl"
              onClick={() => setActiveReview(null)}
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-2">
              {activeReview.author || 'Anonymous'}
            </h2>

            <p className="text-sm mb-3 opacity-70">
              {activeReview.created_at
                ? new Date(activeReview.created_at).toLocaleDateString()
                : 'Unknown date'}
            </p>

            <div className="text-base leading-relaxed whitespace-pre-wrap">
              {activeReview.content}
            </div>
          </div>
        </div>
      )}

      {fullCastOpen && fullCast.length > 0 && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setFullCastOpen(false)}
        >
          <div
            className="bg-raisin-black p-6 rounded-xl max-w-2xl w-full text-white relative max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-xl"
              onClick={() => setFullCastOpen(false)}
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-4">Full cast</h2>

            <div className="space-y-3">
              {fullCast.map((actor) => (
                <div
                  key={actor.cast_id || actor.credit_id || actor.id}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                    <img
                      src={imageUrl(actor.profile_path, 'w185')}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{actor.name}</p>
                    <p className="text-xs text-white/70">
                      {actor.character || 'Unknown role'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
