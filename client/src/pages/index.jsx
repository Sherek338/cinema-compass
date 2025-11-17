import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Hero from '@/components/hero.jsx';
import MediaCard from '@/components/mediacard.jsx';

function ScrollableSection({ children }) {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    if (scrollRef.current) {
      setIsDragging(false);
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    if (isDragging && scrollRef.current) {
      setIsDragging(false);
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="flex gap-4 md:gap-5 overflow-x-auto pb-4 scrollbar-hide select-none"
      style={{
        cursor: 'grab',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const { watchList, isAuthenticated } = useAuth();
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const [watchlistDetails, setWatchlistDetails] = useState([]);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);
  const [activeTab, setActiveTab] = useState('movies');

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoadingMovies(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();

        const mapped = (data.results || []).map((m) => ({
          id: m.id,
          title: m.title,
          year: m.release_date ? m.release_date.slice(0, 4) : 'N/A',
          rating: m.vote_average ? m.vote_average.toFixed(1) : 'N/A',
          poster: m.poster_path
            ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
            : '/placeholder.png',
        }));
        setMovies(mapped);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
      } finally {
        setLoadingMovies(false);
      }
    };

    fetchMovies();
  }, [API_KEY]);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoadingSeries(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        const mapped = (data.results || []).map((s) => ({
          id: s.id,
          title: s.name,
          year: s.first_air_date ? s.first_air_date.slice(0, 4) : 'N/A',
          rating: s.vote_average ? s.vote_average.toFixed(1) : 'N/A',
          poster: s.poster_path
            ? `https://image.tmdb.org/t/p/w500${s.poster_path}`
            : 'https://via.placeholder.com/400x600?text=No+Image',
        }));
        setSeries(mapped);
      } catch (err) {
        console.error('Failed to fetch series:', err);
      } finally {
        setLoadingSeries(false);
      }
    };

    fetchSeries();
  }, [API_KEY]);

  useEffect(() => {
    const fetchWatchlistDetails = async () => {
      if (!isAuthenticated || !watchList || watchList.length === 0) {
        setWatchlistDetails([]);
        return;
      }

      try {
        setLoadingWatchlist(true);
        const detailsPromises = watchList.map(async (item) => {
          const endpoint =
            item.type === 'movie'
              ? `https://api.themoviedb.org/3/movie/${item.id}?api_key=${API_KEY}&language=en-US`
              : `https://api.themoviedb.org/3/tv/${item.id}?api_key=${API_KEY}&language=en-US`;

          try {
            const res = await fetch(endpoint);
            const data = await res.json();

            if (item.type === 'movie') {
              return {
                id: data.id,
                title: data.title,
                year: data.release_date ? data.release_date.slice(0, 4) : 'N/A',
                rating: data.vote_average
                  ? data.vote_average.toFixed(1)
                  : 'N/A',
                poster: data.poster_path
                  ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                  : '/placeholder.png',
                isSeries: false,
              };
            } else {
              return {
                id: data.id,
                title: data.name,
                year: data.first_air_date
                  ? data.first_air_date.slice(0, 4)
                  : 'N/A',
                rating: data.vote_average
                  ? data.vote_average.toFixed(1)
                  : 'N/A',
                poster: data.poster_path
                  ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                  : 'https://via.placeholder.com/400x600?text=No+Image',
                isSeries: true,
              };
            }
          } catch (error) {
            console.error(
              `Failed to fetch details for ${item.type} ${item.id}:`,
              error
            );
            return null;
          }
        });

        const details = await Promise.all(detailsPromises);
        setWatchlistDetails(details.filter((item) => item !== null));
      } catch (err) {
        console.error('Failed to fetch watchlist details:', err);
      } finally {
        setLoadingWatchlist(false);
      }
    };

    fetchWatchlistDetails();
  }, [watchList, isAuthenticated, API_KEY]);

  const trendingMovies = movies.slice(0, 10);
  const newReleaseMovies = movies.slice(10, 20);
  const topRatedMovies = [...movies]
    .slice()
    .sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
    .slice(0, 10);

  const trendingSeries = series.slice(0, 10);
  const newReleaseSeries = series.slice(10, 20);
  const topRatedSeries = [...series]
    .slice()
    .sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
    .slice(0, 10);

  const currentWatchlist = watchlistDetails;

  return (
    <div className="min-h-screen bg-raisin-black flex flex-col">
      <Header />

      <main className="flex-1 pt-0">
        <Hero />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[70px] py-10 md:py-12 lg:py-16">
          <div className="flex items-center justify-center gap-6 md:gap-10 mb-12 md:mb-16">
            <button
              onClick={() => setActiveTab('movies')}
              className="flex flex-col items-start gap-[5px] hover:opacity-80 transition-opacity cursor-pointer"
            >
              <h2
                className={`text-xl md:text-[25px] ${
                  activeTab === 'movies'
                    ? 'font-bold text-white'
                    : 'font-normal text-white'
                }`}
              >
                Movies
              </h2>
              {activeTab === 'movies' && (
                <div className="w-full h-[2px] bg-coquelicot" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('series')}
              className="flex flex-col items-start gap-[5px] hover:opacity-80 transition-opacity cursor-pointer"
            >
              <h2
                className={`text-xl md:text-[25px] ${
                  activeTab === 'series'
                    ? 'font-bold text-white'
                    : 'font-normal text-white'
                }`}
              >
                Series
              </h2>
              {activeTab === 'series' && (
                <div className="w-full h-[2px] bg-coquelicot" />
              )}
            </button>
          </div>

          {activeTab === 'movies' ? (
            loadingMovies ? (
              <div className="w-full flex justify-center items-center min-h-[300px]">
                <div className="w-12 h-12 rounded-full border-4 border-coquelicot border-t-transparent animate-spin" />
              </div>
            ) : (
              <>
                <section className="mb-12 md:mb-16">
                  <div className="flex items-end justify-between mb-4 md:mb-6">
                    <h2 className="text-white text-2xl md:text-[30px] font-bold">
                      Trending Now
                    </h2>
                    <Link
                      to="/movies"
                      className="text-white text-sm md:text-[18px] hover:text-coquelicot transition-colors"
                    >
                      View all
                    </Link>
                  </div>
                  <ScrollableSection>
                    {trendingMovies.map((movie) => (
                      <MediaCard
                        key={movie.id}
                        id={movie.id}
                        title={movie.title}
                        year={movie.year}
                        rating={movie.rating}
                        poster={movie.poster}
                        isSeries={false}
                      />
                    ))}
                  </ScrollableSection>
                </section>

                <section className="mb-12 md:mb-16">
                  <div className="flex items-end justify-between mb-4 md:mb-6">
                    <h2 className="text-white text-2xl md:text-[30px] font-bold">
                      New Release
                    </h2>
                    <Link
                      to="/movies"
                      className="text-white text-sm md:text-[18px] hover:text-coquelicot transition-colors"
                    >
                      View all
                    </Link>
                  </div>
                  <ScrollableSection>
                    {newReleaseMovies.map((movie) => (
                      <MediaCard
                        key={movie.id}
                        id={movie.id}
                        title={movie.title}
                        year={movie.year}
                        rating={movie.rating}
                        poster={movie.poster}
                        isSeries={false}
                      />
                    ))}
                  </ScrollableSection>
                </section>

                <section className="mb-12 md:mb-16">
                  <div className="flex items-end justify-between mb-4 md:mb-6">
                    <h2 className="text-white text-2xl md:text-[30px] font-bold">
                      Top Rated
                    </h2>
                    <Link
                      to="/movies"
                      className="text-white text-sm md:text-[18px] hover:text-coquelicot transition-colors"
                    >
                      View all
                    </Link>
                  </div>
                  <ScrollableSection>
                    {topRatedMovies.map((movie) => (
                      <MediaCard
                        key={movie.id}
                        id={movie.id}
                        title={movie.title}
                        year={movie.year}
                        rating={movie.rating}
                        poster={movie.poster}
                        isSeries={false}
                      />
                    ))}
                  </ScrollableSection>
                </section>

                <section>
                  <div className="flex items-end justify-between mb-4 md:mb-6">
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
                  {loadingWatchlist ? (
                    <div className="w-full flex justify-center items-center min-h-[260px]">
                      <div className="w-12 h-12 rounded-full border-4 border-coquelicot border-t-transparent animate-spin" />
                    </div>
                  ) : !isAuthenticated ? (
                    <div className="w-full flex justify-center items-center min-h-[260px]">
                      <p className="text-white text-lg">
                        Please log in to see your watchlist
                      </p>
                    </div>
                  ) : currentWatchlist.length === 0 ? (
                    <div className="w-full flex justify-center items-center min-h-[260px]">
                      <p className="text-white text-lg">
                        Your watchlist is empty
                      </p>
                    </div>
                  ) : (
                    <ScrollableSection>
                      {currentWatchlist.map((item) => (
                        <MediaCard
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          year={item.year}
                          rating={item.rating}
                          poster={item.poster}
                          isSeries={item.isSeries}
                        />
                      ))}

                      <Link
                        to="/watchlist"
                        className="flex-shrink-0 flex items-center justify-center w-[180px] h-[260px] border border-[#3F3F3F] bg-[#343434] rounded-[10px] cursor-pointer hover:border-coquelicot transition-colors group"
                      >
                        <div className="relative w-9 h-9">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-[2px] bg-white group-hover:bg-coquelicot transition-colors" />
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-9 bg-white group-hover:bg-coquelicot transition-colors" />
                        </div>
                      </Link>
                    </ScrollableSection>
                  )}
                </section>
              </>
            )
          ) : loadingSeries ? (
            <div className="w-full flex justify-center items-center min-h-[300px]">
              <div className="w-12 h-12 rounded-full border-4 border-coquelicot border-t-transparent animate-spin" />
            </div>
          ) : (
            <>
              <section className="mb-12 md:mb-16">
                <div className="flex items-end justify-between mb-4 md:mb-6">
                  <h2 className="text-white text-2xl md:text-[30px] font-bold">
                    Trending Now
                  </h2>
                  <Link
                    to="/series"
                    className="text-white text-sm md:text-[18px] hover:text-coquelicot transition-colors"
                  >
                    View all
                  </Link>
                </div>
                <ScrollableSection>
                  {trendingSeries.map((show) => (
                    <MediaCard
                      key={show.id}
                      id={show.id}
                      title={show.title}
                      year={show.year}
                      rating={show.rating}
                      poster={show.poster}
                      isSeries={true}
                    />
                  ))}
                </ScrollableSection>
              </section>

              <section className="mb-12 md:mb-16">
                <div className="flex items-end justify-between mb-4 md:mb-6">
                  <h2 className="text-white text-2xl md:text-[30px] font-bold">
                    New Release
                  </h2>
                  <Link
                    to="/series"
                    className="text-white text-sm md:text-[18px] hover:text-coquelicot transition-colors"
                  >
                    View all
                  </Link>
                </div>
                <ScrollableSection>
                  {newReleaseSeries.map((show) => (
                    <MediaCard
                      key={show.id}
                      id={show.id}
                      title={show.title}
                      year={show.year}
                      rating={show.rating}
                      poster={show.poster}
                      isSeries={true}
                    />
                  ))}
                </ScrollableSection>
              </section>

              <section className="mb-12 md:mb-16">
                <div className="flex items-end justify-between mb-4 md:mb-6">
                  <h2 className="text-white text-2xl md:text-[30px] font-bold">
                    Top Rated
                  </h2>
                  <Link
                    to="/series"
                    className="text-white text-sm md:text-[18px] hover:text-coquelicot transition-colors"
                  >
                    View all
                  </Link>
                </div>
                <ScrollableSection>
                  {topRatedSeries.map((show) => (
                    <MediaCard
                      key={show.id}
                      id={show.id}
                      title={show.title}
                      year={show.year}
                      rating={show.rating}
                      poster={show.poster}
                      isSeries={true}
                    />
                  ))}
                </ScrollableSection>
              </section>

              <section>
                <div className="flex items-end justify-between mb-4 md:mb-6">
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
                {loadingWatchlist ? (
                  <div className="w-full flex justify-center items-center min-h-[260px]">
                    <div className="w-12 h-12 rounded-full border-4 border-coquelicot border-t-transparent animate-spin" />
                  </div>
                ) : !isAuthenticated ? (
                  <div className="w-full flex justify-center items-center min-h-[260px]">
                    <p className="text-white text-lg">
                      Please log in to see your watchlist
                    </p>
                  </div>
                ) : currentWatchlist.length === 0 ? (
                  <div className="w-full flex justify-center items-center min-h-[260px]">
                    <p className="text-white text-lg">
                      Your watchlist is empty
                    </p>
                  </div>
                ) : (
                  <ScrollableSection>
                    {currentWatchlist.map((item) => (
                      <MediaCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        year={item.year}
                        rating={item.rating}
                        poster={item.poster}
                        isSeries={item.isSeries}
                      />
                    ))}

                    <Link
                      to="/watchlist"
                      className="flex-shrink-0 flex items-center justify-center w-[180px] h-[260px] border border-[#3F3F3F] bg-[#343434] rounded-[10px] cursor-pointer hover:border-coquelicot transition-colors group"
                    >
                      <div className="relative w-9 h-9">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-[2px] bg-white group-hover:bg-coquelicot transition-colors" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-9 bg-white group-hover:bg-coquelicot transition-colors" />
                      </div>
                    </Link>
                  </ScrollableSection>
                )}
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
