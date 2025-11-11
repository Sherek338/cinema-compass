import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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
  if (!res.ok) throw new Error("TMDB error");
  return res.json();
}

export default function Hero({ items }) {
  const [slides, setSlides] = useState(items ?? []);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (items && items.length) return;
    (async () => {
      try {
        const data = await tmdb("/movie/now_playing", { page: 1, region: "US" });
        setSlides((data?.results ?? []).slice(0, 5));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [items]);

  const cur = slides[i] ?? null;

  const genresText = useMemo(() => {
    return (cur?.genre_names ?? [])
      .slice(0, 3)
      .map((g, idx) => (
        <span
          key={`${g}-${idx}`}
          className="px-3 py-1 rounded-full bg-white/10 text-white text-sm border border-white/20"
        >
          {g}
        </span>
      ));
  }, [cur]);

  const mediaType = cur?.media_type || "movie";
  const title = cur?.title || cur?.name || "";
  const year = (cur?.release_date || cur?.first_air_date || "").slice(0, 4);
  const rating =
    typeof cur?.vote_average === "number" ? cur.vote_average.toFixed(1) : null;
  const to = mediaType === "tv" ? `/series/${cur?.id}` : `/movie/${cur?.id}`;

  const len = Math.max(slides.length || 1, 1);
  const next = () => setI((p) => (p + 1) % len);
  const prev = () => setI((p) => (p - 1 + len) % len);

  if (!cur) return null;

  return (
    <section className="relative w-full">
      <div className="relative w-full h-[460px] sm:h-[580px] lg:h-[720px] overflow-hidden">
        <img
          src={img(cur.backdrop_path || cur.poster_path)}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/20" />
      </div>

      <div className="absolute inset-0">
        <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-8 lg:px-[70px] relative">
          <div className="absolute inset-x-0 bottom-8 sm:bottom-10 lg:bottom-12">
            <div className="flex flex-col gap-4 max-w-[820px]">
              {genresText?.length > 0 && (
                <div className="flex flex-wrap gap-2">{genresText}</div>
              )}

              <h2 className="text-white font-bold text-[34px] sm:text-[46px] lg:text-[56px] leading-tight drop-shadow">
                {title}
              </h2>

              {(year || rating) && (
                <div className="inline-flex items-center gap-3 text-white/90 whitespace-nowrap leading-none text-[13px] sm:text-base">
                  {year && <span className="align-middle">{year}</span>}

                  {year && rating && (
                    <span
                      aria-hidden
                      className="align-middle block h-[4px] w-[4px] rounded-full bg-white/70"
                    />
                  )}

                  {rating && (
                    <span className="inline-flex items-center gap-1 align-middle">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 19 19"
                        fill="none"
                        className="translate-y-[1px]"
                        aria-hidden="true"
                      >
                        <path
                          d="M16.346 8.95142C16.9889 8.37204 16.6422 7.30502 15.7815 7.21413L12.5461 6.87245C12.1912 6.83497 11.8832 6.61116 11.7378 6.28519L10.4136 3.31494C10.0612 2.52454 8.9393 2.52454 8.58691 3.31494L7.26266 6.28519C7.11732 6.61116 6.80927 6.83497 6.45434 6.87245L3.21894 7.21413C2.35832 7.30502 2.01163 8.37204 2.65447 8.95142L5.07101 11.1294C5.33613 11.3684 5.4538 11.7305 5.37978 12.0796L4.70524 15.261C4.52574 16.1076 5.43341 16.7671 6.18308 16.3347L9.00065 14.7098C9.30985 14.5314 9.69064 14.5314 9.99983 14.7098L12.8174 16.3347C13.5671 16.7671 14.4747 16.1076 14.2952 15.261L13.6207 12.0796C13.5467 11.7305 13.6644 11.3684 13.9295 11.1294L16.346 8.95142Z"
                          fill="#F5C519"
                        />
                      </svg>
                      <span className="align-middle">{rating}</span>
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3">
                <Link
                  to={to}
                  className="px-4 py-2 rounded-lg bg-[#FF4002] text-white font-semibold hover:bg-[#ff5722] transition"
                >
                  View more
                </Link>
                <button className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition">
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm"
          >
            <svg width="28" height="28" viewBox="0 0 37 37" fill="none" aria-hidden="true">
              <path
                d="M23.125 10.0209L13.875 19.2709L23.125 28.5209"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm"
          >
            <svg width="28" height="28" viewBox="0 0 37 37" fill="none" aria-hidden="true">
              <path
                d="M13.875 10.0209L23.125 19.2709L13.875 28.5209"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {slides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              {Array.from({ length: slides.length }).map((_, di) => (
                <button
                  key={di}
                  onClick={() => setI(di)}
                  aria-label={`Go to slide ${di + 1}`}
                  className={`h-[6px] w-[6px] rounded-full ${
                    di === i ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
