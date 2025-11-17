import { useEffect, useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import MediaCard from '@/components/mediacard';

const genres = [
  'Drama',
  'Sci-Fi',
  'Crime',
  'Fantasy',
  'Action',
  'Adventure',
  'Comedy',
  'Thriller',
  'Mystery',
  'Horror',
  'Historical',
  'Family',
  'Animation',
  'Superhero',
  'War',
  'Western',
  'Documentary',
];

export default function Series() {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&page=${page}`
        );
        const data = await res.json();
        const mapped = (data.results || []).map((tv) => ({
          id: tv.id,
          title: tv.name,
          year: tv.first_air_date ? tv.first_air_date.slice(0, 4) : 'N/A',
          rating: tv.vote_average ? tv.vote_average.toFixed(1) : 'N/A',
          poster: tv.poster_path
            ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
            : 'https://via.placeholder.com/400x600?text=No+Image',
        }));
        setTvShows(mapped);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error('Failed to fetch series:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, [API_KEY, page]);

  const allSeries = tvShows.slice(0, 20);

  return (
    <div className="min-h-screen bg-[#201E1F] flex flex-col">
      <Header />
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-[70px] py-16 pt-30">
        <h1 className="text-white font-bold text-[35px] mb-12">Series</h1>
        <div className="flex gap-5 lg:gap-20">
          <aside className="hidden lg:block w-[200px] flex-shrink-0">
            <div className="flex flex-col gap-[30px]">
              <h2 className="text-white font-bold text-xl">Filters</h2>
              <div className="flex flex-col gap-2.5">
                <h3 className="text-white text-lg font-normal">Release date</h3>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-[5px]">
                    <span className="text-[#999] text-[15px] font-normal">
                      from
                    </span>
                    <div className="w-[61px] h-[23px] rounded-[5px] bg-[#D9D9D9]"></div>
                  </div>
                  <div className="flex items-center gap-[5px]">
                    <span className="text-[#999] text-[15px] font-normal">
                      to
                    </span>
                    <div className="w-[61px] h-[23px] rounded-[5px] bg-[#D9D9D9]"></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <h3 className="text-white text-lg font-normal">Genres</h3>
                <div className="w-full h-[23px] rounded-[5px] border border-[#D9D9D9]"></div>
                <div className="flex flex-col gap-[5px]">
                  {[
                    genres.slice(0, 2),
                    genres.slice(2, 4),
                    genres.slice(4, 6),
                    genres.slice(6, 8),
                    genres.slice(8, 11),
                    genres.slice(11, 14),
                    genres.slice(14),
                  ].map((row, idx) => (
                    <div key={idx} className="flex flex-wrap gap-[5px]">
                      {row.map((genre) => (
                        <button
                          key={genre}
                          className="px-2.5 py-[3px] rounded-full border border-[#D9D9D9] text-[#999] text-[15px] font-normal hover:border-[#FF4002] hover:text-[#FF4002] transition"
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col gap-[50px]">
            {loading ? (
              <div className="w-full flex justify-center items-center min-h-[300px]">
                <div className="w-12 h-12 rounded-full border-4 border-[#FF4002] border-t-transparent animate-spin" />
              </div>
            ) : (
              [0, 5, 10, 15].map((offset, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
                >
                  {allSeries.slice(offset, offset + 5).map((show, index) => (
                    <MediaCard
                      key={`${i}-${index}`}
                      id={show.id}
                      title={show.title}
                      year={show.year}
                      rating={show.rating}
                      poster={show.poster}
                      isSeries={true}
                      type="series"
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
