import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/authContext';
import { Heart } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation } from 'swiper/modules';
import tmdb from '@/service/tmdbApi.js';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

export default function Hero({ items }) {
  const [slides, setSlides] = useState(items ?? []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(!items || !items.length);

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
    if (items && items.length) {
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const data = await tmdb.getNowPlayingMovies(1, 'US');
        if (!mounted) return;
        setSlides((data.results ?? []).slice(0, 5));
      } catch (e) {
        console.error('Failed to fetch now playing movies:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [items]);

  useEffect(() => {
    if (!slides.length) return;
    const nextIndex = (activeIndex + 1) % slides.length;
    const nextSlide = slides[nextIndex];
    if (!nextSlide) return;
    const preload = new Image();
    preload.src = tmdb.getImageUrl(
      nextSlide.backdrop_path || nextSlide.poster_path,
      'original'
    );
  }, [activeIndex, slides]);

  const cur = slides[activeIndex];

  const img = (p) =>
    tmdb.getImageUrl(p, 'original') ??
    'https://placehold.co/1600x900?text=No+Image';

  const hasSlides = slides.length > 0;

  return (
    <section className="relative w-full h-screen">
      {loading && (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <div className="text-white/80">Loading...</div>
        </div>
      )}

      {!loading && !hasSlides && (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <div className="text-white/80">No slides</div>
        </div>
      )}

      {!loading && hasSlides && (
        <Swiper
          modules={[EffectFade, Navigation]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          navigation={{
            nextEl: '.hero-next',
            prevEl: '.hero-prev',
          }}
          loop={true}
          speed={900}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full h-full"
        >
          {slides.map((item, idx) => (
            <SwiperSlide key={item.id ?? idx}>
              <div className="relative w-full h-screen overflow-hidden">
                <img
                  src={img(item.backdrop_path || item.poster_path)}
                  alt={item.title || `slide-${idx}`}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/20" />

                <div className="absolute inset-0">
                  <div className="max-w-[1440px] mx-auto h-full relative">
                    <div className="absolute inset-x-0 bottom-12 lg:bottom-0 lg:top-1/2 lg:left-15 px-4 sm:px-8 lg:px-[70px]">
                      <div className="flex flex-col gap-4 max-w-[820px]">
                        <h2 className="text-white font-bold text-[34px] sm:text-[46px] lg:text-[56px] leading-tight drop-shadow">
                          {item.title || ''}
                        </h2>

                        {(item.release_date || item.vote_average) && (
                          <div className="inline-flex items-center gap-3 text-white/90 whitespace-nowrap leading-none text-[13px] sm:text-base">
                            {item.release_date && (
                              <span>{item.release_date.slice(0, 4)}</span>
                            )}
                            {item.release_date &&
                              typeof item.vote_average === 'number' && (
                                <span
                                  aria-hidden
                                  className="block h-[4px] w-[4px] rounded-full bg-white/70"
                                />
                              )}
                            {typeof item.vote_average === 'number' && (
                              <span className="inline-flex items-center gap-1">
                                ⭐ {item.vote_average.toFixed(1)}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 md:gap-4">
                          {isAuthenticated && item.id && (
                            <button
                              onClick={() =>
                                watchList.some(
                                  (wItem) =>
                                    item.id === wItem.id &&
                                    wItem.type === 'movie'
                                )
                                  ? removeFromWatchlist(item.id, 'movie')
                                  : addToWatchlist(item.id, 'movie')
                              }
                              className={`px-4 md:px-6 py-3 md:py-3 rounded-lg font-normal transition-colors cursor-pointer bg-[#FF4002] ${
                                watchList.some(
                                  (wItem) =>
                                    item.id === wItem.id &&
                                    wItem.type === 'movie'
                                )
                                  ? 'bg-[#FF4002] hover:bg-[#B32F03]'
                                  : 'text-white hover:bg-[#B32F03]'
                              }`}
                            >
                              {watchList.some(
                                (wItem) =>
                                  item.id === wItem.id && wItem.type === 'movie'
                              )
                                ? 'Remove from Watchlist'
                                : 'Add to Watchlist'}
                            </button>
                          )}

                          <Link
                            to={`/movies/${item.id}`}
                            className="px-4 md:px-6 py-2 md:py-2.5 border border-white text-white text-sm md:text-base lg:text-[18px] rounded-lg hover:bg-white hover:text-black transition-colors cursor-pointer"
                          >
                            View more
                          </Link>

                          {isAuthenticated && item.id && (
                            <button
                              onClick={() =>
                                favoriteList.some(
                                  (fItem) =>
                                    item.id === fItem.id &&
                                    fItem.type === 'movie'
                                )
                                  ? removeFromFavorites(item.id, 'movie')
                                  : addToFavorites(item.id, 'movie')
                              }
                              className={`p-2.5 border rounded-lg transition-colors cursor-pointer ${
                                favoriteList.some(
                                  (fItem) =>
                                    item.id === fItem.id &&
                                    fItem.type === 'movie'
                                )
                                  ? 'border-coquelicot bg-coquelicot/90 text-white'
                                  : 'border-white text-white hover:bg-white/10'
                              }`}
                              aria-label="Toggle favorite"
                            >
                              <Heart
                                className="w-5 h-5 md:w-6 md:h-6"
                                fill={
                                  favoriteList.some(
                                    (fItem) =>
                                      item.id === fItem.id &&
                                      fItem.type === 'movie'
                                  )
                                    ? 'white'
                                    : 'none'
                                }
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {slides.length > 1 && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                        {slides.map((_, di) => (
                          <button
                            key={di}
                            aria-label={`Go to slide ${di + 1}`}
                            onClick={() => setActiveIndex(di)}
                            className={`h-[12px] w-[12px] rounded-full cursor-pointer ${
                              di === activeIndex ? 'bg-white' : 'bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  aria-label="Previous"
                  className="hero-prev absolute left-5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm cursor-pointer hidden md:block"
                >
                  <svg width="28" height="28" viewBox="0 0 37 37">
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
                  aria-label="Next"
                  className="hero-next absolute right-5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm cursor-pointer hidden md:block"
                >
                  <svg width="28" height="28" viewBox="0 0 37 37">
                    <path
                      d="M13.875 10.0209L23.125 19.2709L13.875 28.5209"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
