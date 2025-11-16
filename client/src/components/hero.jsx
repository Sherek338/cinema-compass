import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/authContext.jsx";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const img = (p) =>
  p
    ? `https://image.tmdb.org/t/p/original${p}`
    : "https://via.placeholder.com/1600x900?text=No+Image";

async function tmdb(path, params = {}) {
  const q = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    ...params,
  });
  const res = await fetch(`https://api.themoviedb.org/3${path}?${q.toString()}`);
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

async function loadHeroData() {
  const [trendMovies, trendTv] = await Promise.all([
    tmdb("/trending/movie/week"),
    tmdb("/trending/tv/week"),
  ]);

  const normalize = (items, media_type) =>
    (items || []).map((item) => ({
      ...item,
      media_type,
      genre_names: item.genre_ids || [],
    }));

  return [
    ...normalize(trendMovies.results, "movie"),
    ...normalize(trendTv.results, "tv"),
  ].filter((x) => x.backdrop_path || x.poster_path);
}

export default function Hero() {
  const [slides, setSlides] = useState([]);
  const [i, setI] = useState(0);
  const [loading, setLoading] = useState(true);

  const {
    isAuthenticated,
    watchList,
    favoriteList,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
  } = useAuth();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        const data = await loadHeroData();
        if (!cancelled) {
          setSlides(data.slice(0, 10));
          setI(0);
        }
      } catch (e) {
        console.error("Failed to load hero data", e);
        if (!cancelled) setSlides([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!slides.length) return;
    const id = setInterval(() => {
      setI((p) => (p + 1) % slides.length);
    }, 12000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (loading || !slides.length) {
    return (
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-raisin-black flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#FF4002] border-t-transparent animate-spin" />
      </section>
    );
  }

  const cur = slides[i];
  const mediaType = cur?.media_type || "movie";
  const title = cur?.title || cur?.name || "";
  const year = (cur?.release_date || cur?.first_air_date || "").slice(0, 4);
  const rating =
    typeof cur?.vote_average === "number" ? cur.vote_average.toFixed(1) : null;
  const to = mediaType === "tv" ? `/series/${cur?.id}` : `/movies/${cur?.id}`;

  const len = Math.max(slides.length || 1, 1);
  const next = () => setI((p) => (p + 1) % len);
  const prev = () => setI((p) => (p - 1 + len) % len);

  const movieId = cur ? Number(cur.id) : null;
  const inWatchlist =
    isAuthenticated && movieId != null && watchList.includes(movieId);
  const inFavorites =
    isAuthenticated && movieId != null && favoriteList.includes(movieId);

  if (!cur) return null;

  return (
    <section className="relative w-full">
      <div className="relative w-full h-[500px] md:h-[700px] lg:h-[824px] overflow-hidden">
        <img
          src={img(cur.backdrop_path || cur.poster_path)}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }}
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div className="absolute inset-0">
        <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-8 lg:px-[70px] flex flex-col justify-end pb-10 md:pb-16">
          <div className="max-w-[820px] space-y-4 md:space-y-5">
            {(year || rating) && (
              <p className="text-white text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                {year && <span>{year}</span>}
                {year && rating && <span> • </span>}
                {rating && (
                  <span className="inline-flex items-center gap-1 align-middle">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 19 19"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M16.3458 8.95142C16.9886 8.37204 16.6419 7.30502 15.7813 7.21413L12.5459 6.87245C12.191 6.83497 11.8829 6.61116 11.7376 6.28519L10.4133 3.31494C10.0609 2.52454 8.93905 2.52454 8.58666 3.31494L7.26241 6.28519C7.11708 6.61116 6.80903 6.83497 6.4541 6.87245L3.2187 7.21413C2.35808 7.30502 2.01139 8.37204 2.65423 8.95142L5.07077 11.1294C5.33589 11.3684 5.45356 11.7305 5.37953 12.0796L4.70499 15.261C4.52549 16.1076 5.43316 16.7671 6.18284 16.3347L9.00041 14.7098C9.3096 14.5314 9.6904 14.5314 9.99959 14.7098L12.8172 16.3347C13.5668 16.7671 14.4745 16.1076 14.295 15.261L13.6205 12.0796C13.5464 11.7305 13.6641 11.3684 13.9292 11.1294L16.3458 8.95142Z"
                        fill="#F5C519"
                      />
                    </svg>
                    <span>{rating}</span>
                  </span>
                )}
              </p>
            )}

            <h1 className="text-white text-5xl md:text-6xl lg:text-[70px] font-bold leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
              {title}
            </h1>

            {/* Buttons row */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-1">
              <Link
                to={to}
                className="px-4 md:px-6 py-2 md:py-2.5 bg-[#FF4002] text-white text-sm md:text-base lg:text-[18px] font-semibold rounded-lg hover:bg-[#ff5a23] transition-colors"
              >
                View more
              </Link>

              {isAuthenticated && movieId != null && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      inWatchlist
                        ? removeFromWatchlist(movieId)
                        : addToWatchlist(movieId)
                    }
                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-sm md:text-base lg:text-[18px] font-normal transition-colors ${
                      inWatchlist
                        ? "bg-white text-black"
                        : "border border-white/80 text-white hover:bg-white/10"
                    }`}
                  >
                    {inWatchlist
                      ? "Remove from Watchlist"
                      : "Add to Watchlist"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      inFavorites
                        ? removeFromFavorites(movieId)
                        : addToFavorites(movieId)
                    }
                    className={`p-2.5 border rounded-lg transition-colors ${
                      inFavorites
                        ? "border-[#FF4002] bg-[#FF4002] text-white"
                        : "border-white text-white hover:bg-white/10"
                    }`}
                    aria-label="Toggle favorite"
                  >
                    <Heart className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* arrows + dots */}
          <div className="flex items-center justify-between mt-10">
            <button
              type="button"
              onClick={prev}
              className="p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors"
              aria-label="Previous slide"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 37 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_198_626)">
                  <path
                    d="M23.125 10.0209L13.875 19.2709L23.125 28.5209"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_198_626">
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

            {slides.length > 1 && (
              <div className="flex items-center gap-2">
                {slides.map((_, di) => (
                  <button
                    key={di}
                    type="button"
                    onClick={() => setI(di)}
                    aria-label={`Go to slide ${di + 1}`}
                    className={`h-[6px] w-[6px] rounded-full ${
                      di === i ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={next}
              className="p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors"
              aria-label="Next slide"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 37 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_198_629)">
                  <path
                    d="M13.875 10.0209L23.125 19.2709L13.875 28.5209"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_198_629">
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
      </div>
    </section>
  );
}
