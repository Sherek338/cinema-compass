import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import MediaCard from '@/components/MediaCard.jsx';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const IMG = (p) =>
  p
    ? `https://image.tmdb.org/t/p/w500${p}`
    : 'https://via.placeholder.com/400x600?text=No+Image';

async function tmdb(path, params = {}) {
  const q = new URLSearchParams({
    api_key: API_KEY,
    language: 'en-US',
    ...params,
  });
  const res = await fetch(
    `https://api.themoviedb.org/3${path}?${q.toString()}`
  );
  if (!res.ok) throw new Error('TMDB request failed');
  return res.json();
}

export default function Movies() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { genres } = await tmdb('/genre/movie/list');
        setGenres(genres || []);
      } catch (e) {
        console.error('Failed to load genres', e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const params = { page };

        if (selectedGenres.length) {
          params.with_genres = selectedGenres.join(',');
        }

        const gte =
          yearFrom && /^\d{4}$/.test(yearFrom) ? `${yearFrom}-01-01` : '';
        const lte = yearTo && /^\d{4}$/.test(yearTo) ? `${yearTo}-12-31` : '';
        if (gte) params['primary_release_date.gte'] = gte;
        if (lte) params['primary_release_date.lte'] = lte;

        const data = await tmdb('/discover/movie', {
          sort_by: 'popularity.desc',
          include_adult: 'false',
          include_video: 'false',
          ...params,
        });

        setItems(data.results ?? []);
        setTotalPages(Math.min(data.total_pages ?? 1, 500));
      } catch (e) {
        console.error('Failed to load movies', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, selectedGenres, yearFrom, yearTo]);

  const resetAndApply = () => setPage(1);

  const toggleGenre = (id) => {
    setSelectedGenres((prev) => {
      const next = prev.includes(id)
        ? prev.filter((g) => g !== id)
        : [...prev, id];
      return next;
    });
    setPage(1);
  };

  const genreRows = useMemo(() => {
    const names = genres.map((g) => ({ id: g.id, name: g.name }));
    const rows = [];
    let row = [];
    for (const g of names) {
      row.push(g);
      if (row.length === 3) {
        rows.push(row);
        row = [];
      }
    }
    if (row.length) rows.push(row);
    return rows;
  }, [genres]);

  return (
    <div className="min-h-screen bg-[#201E1F] flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-[70px] py-16 pt-30">
        <h1 className="text-white font-bold text-[35px] mb-12">Movies</h1>

        <div className="flex gap-5 lg:gap-20">
          <aside className="hidden lg:block w-[220px] flex-shrink-0">
            <div className="flex flex-col gap-[30px]">
              <h2 className="text-white font-bold text-xl">Filters</h2>

              <div className="flex flex-col gap-2.5">
                <h3 className="text-white text-lg font-normal">Release date</h3>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-[5px]">
                    <span className="text-[#999] text-[15px] font-normal">
                      from
                    </span>
                    <input
                      value={yearFrom}
                      onChange={(e) => setYearFrom(e.target.value)}
                      onBlur={resetAndApply}
                      inputMode="numeric"
                      placeholder="YYYY"
                      className="w-[72px] h-[28px] rounded-[5px] bg-transparent border border-[#D9D9D9] px-2 text-white text-sm placeholder:text-[#888] focus:outline-none focus:border-[#FF4002]"
                    />
                  </div>
                  <div className="flex items-center gap-[5px]">
                    <span className="text-[#999] text-[15px] font-normal">
                      to
                    </span>
                    <input
                      value={yearTo}
                      onChange={(e) => setYearTo(e.target.value)}
                      onBlur={resetAndApply}
                      inputMode="numeric"
                      placeholder="YYYY"
                      className="w-[72px] h-[28px] rounded-[5px] bg-transparent border border-[#D9D9D9] px-2 text-white text-sm placeholder:text-[#888] focus:outline-none focus:border-[#FF4002]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <h3 className="text-white text-lg font-normal">Genres</h3>
                <div className="w-full h-[23px] rounded-[5px] border border-[#D9D9D9] flex items-center px-2 text-[#999] text-[13px]">
                  Choose below
                </div>

                <div className="flex flex-col gap-[5px]">
                  {genreRows.map((row, idx) => (
                    <div key={idx} className="flex flex-wrap gap-[5px]">
                      {row.map((g) => {
                        const active = selectedGenres.includes(g.id);
                        return (
                          <button
                            key={g.id}
                            onClick={() => toggleGenre(g.id)}
                            className={`px-2.5 py-[3px] rounded-full border text-[15px] transition ${
                              active
                                ? 'border-[#FF4002] text-[#FF4002]'
                                : 'border-[#D9D9D9] text-[#999] hover:border-[#FF4002] hover:text-[#FF4002]'
                            }`}
                          >
                            {g.name}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {(selectedGenres.length > 0 || yearFrom || yearTo) && (
                  <button
                    onClick={() => {
                      setSelectedGenres([]);
                      setYearFrom('');
                      setYearTo('');
                      setPage(1);
                    }}
                    className="mt-2 self-start px-3 py-1 rounded bg-white/10 text-white hover:bg-white/20 text-sm"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col gap-[50px]">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[273px] rounded-lg bg-white/10 animate-pulse"
                  />
                ))}
              </div>
            ) : items.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {items.map((m) => (
                  <MediaCard
                    key={m.id}
                    id={m.id}
                    title={m.title}
                    year={(m.release_date || '').slice(0, 4)}
                    duration={null}
                    rating={m.vote_average ? m.vote_average.toFixed(1) : 'N/A'}
                    poster={IMG(m.poster_path)}
                    type="movie"
                  />
                ))}
              </div>
            ) : (
              <p className="text-[#999]">
                No results found with these filters.
              </p>
            )}

            <div className="flex flex-col items-center gap-2.5 mt-4">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="w-[37px] h-[37px] flex items-center justify-center hover:bg-white/10 rounded transition disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <svg width="37" height="37" viewBox="0 0 37 37" fill="none">
                    <path
                      d="M23.125 10.0209L13.875 19.2709L23.125 28.5209"
                      stroke="#999999"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <span className="text-white font-semibold text-lg">
                  {page} / {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="w-[37px] h-[37px] flex items-center justify-center hover:bg-white/10 rounded transition disabled:opacity-40"
                  aria-label="Next page"
                >
                  <svg width="37" height="37" viewBox="0 0 37 37" fill="none">
                    <path
                      d="M13.875 10.0209L23.125 19.2709L13.875 28.5209"
                      stroke="#999999"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
