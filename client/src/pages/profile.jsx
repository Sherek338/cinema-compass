import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/header.jsx';
import Footer from '@/components/footer.jsx';
import { useAuth } from '@/context/authContext.jsx';
import tmdb from '@/service/tmdbApi.js';

const API_URL = import.meta.env.VITE_API_URL || '';
const MAX_FIRST_ROW = 3;

function formatRuntime(runtime) {
  if (!runtime || Number.isNaN(runtime)) return null;
  const h = Math.floor(runtime / 60);
  const m = runtime % 60;
  if (!h) return `${m}m`;
  if (!m) return `${h}h`;
  return `${h}h ${m}m`;
}

async function fetchMediaItem(id, type) {
  try {
    const isSeries = type === 'series';

    const data = await tmdb.getMediaDetails(id, isSeries);

    const poster = data.poster_path
      ? tmdb.getImageUrl(data.poster_path, 'w342')
      : '/placeholder.png';

    const seasons =
      isSeries && typeof data.number_of_seasons === 'number'
        ? `${data.number_of_seasons} season${data.number_of_seasons === 1 ? '' : 's'}`
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
      poster,
      isSeries,
      meta: seasons || duration || null,
    };
  } catch (e) {
    console.error('Failed to load TMDB data', e);
    return null;
  }
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
              <span>{meta.length > 6 ? `${meta.slice(0, 6)}...` : meta}</span>
            </>
          )}
          {rating && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 19 19" fill="none">
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

function UserReviewCard({
  review,
  displayName,
  onEdit,
  onDelete,
  deleting,
  stars,
  formatReviewDate,
  getReviewExcerpt,
}) {
  return (
    <div className="w-full max-w-[310px] bg-coquelicot rounded-[20px] p-5">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-white text-[20px] font-semibold mb-1">
              {displayName}
            </h3>
            <div className="flex items-center gap-1.5 text-white text-xs">
              <span className="font-semibold">Posted on:</span>
              <span className="font-normal">
                {formatReviewDate(review.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="19" height="19" viewBox="0 0 19 19">
                <path
                  d="M16.346 8.95142C16.9889 8.37204 16.6422 7.30502 15.7815 7.21413L12.5461 6.87245C12.1912 6.83497 11.8832 6.61116 11.7378 6.28519L10.4136 3.31494C10.0612 2.52454 8.9393 2.52454 8.58691 3.31494L7.26266 6.28519C7.11732 6.61116 6.80927 6.83497 6.45434 6.87245L3.21894 7.21413C2.35832 7.30502 2.01163 8.37204 2.65447 8.95142L5.07101 11.1294C5.33613 11.3684 5.4538 11.7305 5.37978 12.0796L4.70524 15.261C4.52574 16.1076 5.43341 16.7671 6.18308 16.3347L9.00065 14.7098C9.30985 14.5314 9.69064 14.5314 9.99983 14.7098L12.8174 16.3347C13.5671 16.7671 14.4747 16.1076 14.2952 15.261L13.6207 12.0796C13.5467 11.7305 13.6644 11.3684 13.9295 11.1294L16.346 8.95142Z"
                  fill={i < stars ? '#F5C519' : '#CACACA'}
                />
              </svg>
            ))}
          </div>
        </div>

        <p className="text-white text-[15px] leading-relaxed text-justify">
          {getReviewExcerpt(review.review, 200)}
          {review.review?.length > 200 && (
            <span className="text-white/80 text-[13px] font-semibold ml-1">
              ...Read more
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onEdit} className="text-white font-bold italic">
          Edit
        </button>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="text-white font-bold italic disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

export default function Profile() {
  const { isAuthenticated, user, favoriteList, watchList, authHeaders } =
    useAuth();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);

  const [myReviews, setMyReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadLists = async () => {
      try {
        setLoadingLists(true);

        if (!isAuthenticated) {
          setFavorites([]);
          setWatchlist([]);
          return;
        }

        const fav = favoriteList?.length
          ? await Promise.all(
              favoriteList.map((item) => fetchMediaItem(item.id, item.type))
            )
          : [];

        const watch = watchList?.length
          ? await Promise.all(
              watchList.map((item) => fetchMediaItem(item.id, item.type))
            )
          : [];

        if (!cancelled) {
          setFavorites(fav.filter(Boolean));
          setWatchlist(watch.filter(Boolean));
        }
      } catch (error) {
        if (!cancelled) console.error('Failed to load lists', error);
      } finally {
        if (!cancelled) setLoadingLists(false);
      }
    };

    loadLists();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, favoriteList, watchList]);

  useEffect(() => {
    let cancelled = false;

    const loadReviews = async () => {
      try {
        setLoadingReviews(true);

        if (!isAuthenticated) {
          setMyReviews([]);
          return;
        }

        const res = await fetch(`${API_URL}/api/review/user`, {
          method: 'GET',
          credentials: 'include',
          headers: { ...authHeaders },
        });

        if (!res.ok) {
          setMyReviews([]);
          return;
        }

        const data = await res.json();
        let list = Array.isArray(data) ? data : data?.reviews || [];
        list = list.filter(Boolean);

        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (!cancelled) setMyReviews(list);
      } catch (err) {
        if (!cancelled) console.error('Failed to load reviews', err);
        setMyReviews([]);
      } finally {
        if (!cancelled) setLoadingReviews(false);
      }
    };

    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, authHeaders]);

  const displayName =
    user?.username || (user?.email ? user.email.split('@')[0] : 'User');

  const formatReviewDate = (raw) => {
    const d = new Date(raw);
    return Number.isNaN(d)
      ? 'Unknown date'
      : d.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
  };

  const getReviewExcerpt = (text, max = 200) =>
    text?.length > max ? text.slice(0, max).trim() + '...' : text || '';

  const starsForRating = (rating) =>
    Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

  const handleEditReview = (review) => {
    const path = review.isSeries
      ? `/series/${review.movieId}`
      : `/movies/${review.movieId}`;
    navigate(path);
  };

  const handleDeleteReview = async (review) => {
    if (!review || !review.id || deletingReviewId) return;
    try {
      setDeletingReviewId(review.id);
      await fetch(`${API_URL}/api/reviews/${review.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { ...authHeaders },
      });

      setMyReviews((prev) => prev.filter((r) => r.id !== review.id));
    } finally {
      setDeletingReviewId(null);
    }
  };

  const firstRowReviews = myReviews.slice(0, MAX_FIRST_ROW);

  return (
    <div className="min-h-screen bg-raisin-black">
      <Header />

      <main className="pt-[91px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[70px] py-8 md:py-12 lg:py-16">
          <h1 className="text-white text-3xl md:text-[35px] font-bold mb-8 md:mb-12">
            My profile
          </h1>

          {/* Favorites */}
          <section className="mb-12 md:mb-16">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-white text-2xl md:text-[30px] font-bold">
                Favourites
              </h2>
              <Link
                to="/favorites"
                className="text-white hover:text-coquelicot"
              >
                View all
              </Link>
            </div>

            {loadingLists ? (
              <p className="text-gray-200 text-sm">Loading favourites...</p>
            ) : !isAuthenticated ? (
              <p className="text-gray-200 text-sm">
                Please sign in to see your favourites.
              </p>
            ) : favorites.length === 0 ? (
              <p className="text-gray-200 text-sm">
                You do not have any favourites yet.
              </p>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {favorites.map((m) => (
                  <ProfileMovieCard key={m.id} {...m} />
                ))}
              </div>
            )}
          </section>

          {/* Watchlist */}
          <section className="mb-12 md:mb-16">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-white text-2xl md:text-[30px] font-bold">
                My Watchlist
              </h2>
              <Link
                to="/watchlist"
                className="text-white hover:text-coquelicot"
              >
                View all
              </Link>
            </div>

            {loadingLists ? (
              <p className="text-gray-200 text-sm">Loading watchlist...</p>
            ) : !isAuthenticated ? (
              <p className="text-gray-200 text-sm">
                Please sign in to see your watchlist.
              </p>
            ) : watchlist.length === 0 ? (
              <p className="text-gray-200 text-sm">Your watchlist is empty.</p>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {watchlist.map((m) => (
                  <ProfileMovieCard key={m.id} {...m} />
                ))}
              </div>
            )}
          </section>

          {/* Reviews */}
          <section>
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-white text-2xl md:text-[30px] font-bold">
                My Reviews
              </h2>
              {myReviews.length > 0 && (
                <Link
                  to="/my-reviews"
                  className="text-white hover:text-coquelicot"
                >
                  View all
                </Link>
              )}
            </div>

            {!isAuthenticated ? (
              <p className="text-gray-200 text-sm">
                Please sign in to see your reviews.
              </p>
            ) : loadingReviews ? (
              <p className="text-sm text-gray-200">Loading reviews...</p>
            ) : myReviews.length === 0 ? (
              <p className="text-sm text-gray-200">
                You have not written any reviews yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {firstRowReviews.map((review) => (
                  <UserReviewCard
                    key={review.id}
                    review={review}
                    displayName={displayName}
                    stars={starsForRating(review.rating)}
                    onEdit={() => handleEditReview(review)}
                    onDelete={() => handleDeleteReview(review)}
                    deleting={deletingReviewId === review.id}
                    formatReviewDate={formatReviewDate}
                    getReviewExcerpt={getReviewExcerpt}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
