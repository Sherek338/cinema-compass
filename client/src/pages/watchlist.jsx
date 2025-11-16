import { useEffect, useState } from "react";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import { useAuth } from "@/context/authContext.jsx";
import MediaCard from "@/components/MediaCard.jsx";

export default function Watchlist() {
  const { isAuthenticated, authHeaders, fetchMe } = useAuth();
  const [ids, setIds] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        if (!isAuthenticated) {
          setIds([]);
          setItems([]);
          return;
        }
        const me = await fetchMe();
        const list = me.watchList || [];
        if (!cancelled) setIds(list);
        const details = await Promise.all(
          list.map(async (id) => {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=en-US`);
            const json = await res.json();
            return {
              id: json.id,
              title: json.title,
              poster: json.poster_path ? `https://image.tmdb.org/t/p/w500${json.poster_path}` : "https://via.placeholder.com/400x600?text=No+Image",
              rating: json.vote_average?.toFixed(1) ?? "N/A",
              year: (json.release_date || "").slice(0, 4) || "—",
              duration: json.runtime ? `${json.runtime} min` : "—",
            };
          })
        );
        if (!cancelled) setItems(details);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, fetchMe, TMDB_KEY]);

  const removeOne = async (movieId) => {
    await fetch(`${API_URL}/api/user/watchlist`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({ movieId, action: "remove" }),
    });
    setItems((prev) => prev.filter((x) => x.id !== movieId));
    setIds((prev) => prev.filter((x) => x !== movieId));
  };

  return (
    <div className="min-h-screen bg-[#201E1F] flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-8 lg:px-16 py-12 w-full">
        <h1 className="text-white font-bold text-[35px] mb-10">My Watchlist</h1>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 rounded-full border-4 border-[#FF4002] border-t-transparent animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-[#999]">Your watchlist is empty.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 mb-6">
              {items.map((m) => (
                <div key={m.id} className="relative">
                  <MediaCard id={m.id} title={m.title} poster={m.poster} rating={m.rating} year={m.year} duration={m.duration} isSeries={false} />
                  <button
                    onClick={() => removeOne(m.id)}
                    className="absolute top-2 right-2 text-xs px-2 py-1 bg-black/60 rounded hover:bg-black/80"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-2.5">
              <span className="text-white font-bold text-xl">1</span>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
