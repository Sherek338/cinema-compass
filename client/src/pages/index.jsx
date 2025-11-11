import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero.jsx";
import MediaCard from "@/components/MediaCard";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingSeries, setLoadingSeries] = useState(true);
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
          year: m.release_date ? m.release_date.slice(0, 4) : "N/A",
          rating: m.vote_average ? m.vote_average.toFixed(1) : "N/A",
          poster: m.poster_path
            ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
            : "https://via.placeholder.com/400x600?text=No+Image"
        }));
        setMovies(mapped);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
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
          year: s.first_air_date ? s.first_air_date.slice(0, 4) : "N/A",
          rating: s.vote_average ? s.vote_average.toFixed(1) : "N/A",
          poster: s.poster_path
            ? `https://image.tmdb.org/t/p/w500${s.poster_path}`
            : "https://via.placeholder.com/400x600?text=No+Image"
        }));
        setSeries(mapped);
      } catch (err) {
        console.error("Failed to fetch series:", err);
      } finally {
        setLoadingSeries(false);
      }
    };
    fetchSeries();
  }, [API_KEY]);

  return (
    <div className="min-h-screen bg-[#201E1F] flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <Hero />

        <section className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-[70px] py-16">
          <h1 className="text-white font-bold text-[35px] mb-12">Popular Movies</h1>

          {loadingMovies ? (
            <div className="w-full flex justify-center items-center min-h-[300px]">
              <div className="w-12 h-12 rounded-full border-4 border-[#FF4002] border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {movies.slice(0, 10).map((movie) => (
                <MediaCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  year={movie.year}
                  rating={movie.rating}
                  poster={movie.poster}
                  type="movie"
                />
              ))}
            </div>
          )}
        </section>

        <section className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-[70px] pb-16">
          <h1 className="text-white font-bold text-[35px] mb-12">Popular Series</h1>

          {loadingSeries ? (
            <div className="w-full flex justify-center items-center min-h-[300px]">
              <div className="w-12 h-12 rounded-full border-4 border-[#FF4002] border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {series.slice(0, 10).map((show) => (
                <MediaCard
                  key={show.id}
                  id={show.id}
                  title={show.title}
                  year={show.year}
                  rating={show.rating}
                  poster={show.poster}
                  type="series"
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
