// Hero.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

import Favorite from '@/assets/Favorite.svg';
import FavoriteFull from '@/assets/FavoriteFull.svg';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const img = (p) =>
  p
    ? `https://image.tmdb.org/t/p/original${p}`
    : 'https://via.placeholder.com/1600x900?text=No+Image';

async function tmdb(path, params = {}) {
  const q = new URLSearchParams({
    api_key: API_KEY,
    language: 'en-US',
    ...params,
  });

  const res = await fetch(
    `https://api.themoviedb.org/3${path}?${q.toString()}`
  );
  if (!res.ok) throw new Error('TMDB error');
  return res.json();
}

export default function Hero({ items }) {
  const [slides, setSlides] = useState(items ?? []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(!items || !items.length);

  useEffect(() => {
    if (items && items.length) {
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const data = await tmdb('/movie/now_playing', {
          page: 1,
          region: 'US',
        });
        if (!mounted) return;
        setSlides((data?.results ?? []).slice(0, 5));
        setLoading(false);
      } catch (e) {
        console.error(e);
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [items]);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const nextIndex = (activeIndex + 1) % slides.length;
    const nextSlide = slides[nextIndex];
    if (!nextSlide) return;
    const preload = new Image();
    preload.src = img(nextSlide.backdrop_path || nextSlide.poster_path);
  }, [activeIndex, slides]);

  const cur = slides && slides.length ? slides[activeIndex] : null;

  const genresText = (cur?.genre_names ?? []).slice(0, 3).map((g, idx) => (
    <span
      key={`${g}-${idx}`}
      className="px-3 py-1 rounded-full bg-white/10 text-white text-sm border border-white/20"
    >
      {g}
    </span>
  ));

  const hasSlides = slides && slides.length > 0;

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
                        {genresText?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {genresText}
                          </div>
                        )}
                        <h2 className="text-white font-bold text-[34px] sm:text-[46px] lg:text-[56px] leading-tight drop-shadow">
                          {item.title || ''}
                        </h2>

                        {(item.release_date ||
                          item.first_air_date ||
                          item.vote_average) && (
                          <div className="inline-flex items-center gap-3 text-white/90 whitespace-nowrap leading-none text-[13px] sm:text-base">
                            {(item.release_date || item.first_air_date) && (
                              <span className="align-middle">
                                {(
                                  item.release_date ||
                                  item.first_air_date ||
                                  ''
                                ).slice(0, 4)}
                              </span>
                            )}

                            {(item.release_date || item.first_air_date) &&
                              typeof item.vote_average === 'number' && (
                                <span
                                  aria-hidden
                                  className="align-middle block h-[4px] w-[4px] rounded-full bg-white/70"
                                />
                              )}

                            {typeof item.vote_average === 'number' && (
                              <span className="inline-flex items-center gap-1 align-middle">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 19 19"
                                  fill="none"
                                  className="translate-y-[1px]"
                                >
                                  <path
                                    d="M16.346 8.95142C16.9889 8.37204 16.6422 7.30502 15.7815 7.21413L12.5461 6.87245C12.1912 6.83497 11.8832 6.61116 11.7378 6.28519L10.4136 3.31494C10.0612 2.52454 8.9393 2.52454 8.58691 3.31494L7.26266 6.28519C7.11732 6.61116 6.80927 6.83497 6.45434 6.87245L3.21894 7.21413C2.35832 7.30502 2.01163 8.37204 2.65447 8.95142L5.07101 11.1294C5.33613 11.3684 5.4538 11.7305 5.37978 12.0796L4.70524 15.261C4.52574 16.1076 5.43341 16.7671 6.18308 16.3347L9.00065 14.7098C9.30985 14.5314 9.69064 14.5314 9.99983 14.7098L12.8174 16.3347C13.5671 16.7671 14.4747 16.1076 14.2952 15.261L13.6207 12.0796C13.5467 11.7305 13.6644 11.3684 13.9295 11.1294L16.346 8.95142Z"
                                    fill="#F5C519"
                                  />
                                </svg>
                                <span className="align-middle">
                                  {typeof item.vote_average === 'number'
                                    ? item.vote_average.toFixed(1)
                                    : ''}
                                </span>
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <button className="px-4 py-2 rounded-lg bg-[#FF4002] text-white font-semibold hover:bg-[#B32F03] cursor-pointer transition">
                            Add to Watchlist
                          </button>

                          <Link
                            to={
                              item.media_type === 'tv'
                                ? `/series/${item.id}`
                                : `/movies/${item.id}`
                            }
                            className="px-4 py-2 rounded-lg bg-transperent border-white border text-white hover:bg-white hover:text-black transition cursor-pointer"
                          >
                            View more
                          </Link>

                          <button className="relative w-8 h-8 cursor-pointer">
                            <img src={Favorite} className="absolute inset-0" />
                            <img
                              src={FavoriteFull}
                              className="absolute inset-0 transition-opacity opacity-0 hover:opacity-100"
                            />
                          </button>
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
                            className={`h-[12px] w-[12px] rounded-full cursor-pointer ${di === activeIndex ? 'bg-white' : 'bg-white/40'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  aria-label="Previous"
                  className="hero-prev absolute left-5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm cursor-pointer z-20 hidden md:block"
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
