import { useEffect, useMemo, useState } from "react";
import Header from "@/components/header.jsx";
import Footer from "@/components/footer.jsx";
import { useAuth } from "@/context/authContext.jsx";
import MediaCard from "@/components/mediacard.jsx";

export default function Profile() {
  const { isAuthenticated, fetchMe, authHeaders } = useAuth();

  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const [favItems, setFavItems] = useState([]);
  const [watchItems, setWatchItems] = useState([]);

  const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        if (!isAuthenticated) {
          setMe(null);
          setFavItems([]);
          setWatchItems([]);
          return;
        }
        const user = await fetchMe();
        if (!cancelled) setMe(user);

        const favIds = user.favoriteList || [];
        const watchIds = user.watchList || [];

        const load = async (ids) =>
          Promise.all(
            ids.map(async (id) => {
              const r = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=en-US`);
              const j = await r.json();
              return {
                id: j.id,
                title: j.title,
                poster: j.poster_path ? `https://image.tmdb.org/t/p/w500${j.poster_path}` : "https://via.placeholder.com/400x600?text=No+Image",
                rating: j.vote_average?.toFixed(1) ?? "N/A",
                year: (j.release_date || "").slice(0, 4) || "—",
                duration: j.runtime ? `${j.runtime} min` : "—",
              };
            })
          );

        const [fav, watch] = await Promise.all([load(favIds), load(watchIds)]);
        if (!cancelled) {
          setFavItems(fav);
          setWatchItems(watch);
        }
      } catch {
        
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, fetchMe, TMDB_KEY]);

  const removeFrom = async (type, movieId) => {
    await fetch(`${API_URL}/api/user/${type}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({ movieId, action: "remove" }),
    });
    if (type === "favorites") setFavItems((p) => p.filter((x) => x.id !== movieId));
    if (type === "watchlist") setWatchItems((p) => p.filter((x) => x.id !== movieId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#201E1F]">
        <div className="w-12 h-12 rounded-full border-4 border-[#FF4002] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="min-h-screen flex flex-col bg-[#201E1F] text-white justify-center items-center gap-4">
        <p className="text-lg">Please log in again.</p>
        <a href="/" className="px-6 py-2 rounded bg-[#FF4002] font-semibold hover:bg-[#ff5722] transition">
          Go Home
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#201E1F] flex flex-col">
      <Header />
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-[70px] py-16">
        <h1 className="text-white font-bold text-[35px] mb-10">My Profile</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="w-full lg:w-[300px] bg-[#2B2A2B] p-6 rounded-xl flex flex-col gap-6 shadow-lg">
            <div>
              <h2 className="text-white font-semibold text-2xl mb-1">{me.username}</h2>
              <p className="text-[#999]">{me.email}</p>
            </div>
            <div>
              <p className="text-white font-medium">Status:</p>
              <p className={`font-semibold ${me.isActivated ? "text-green-400" : "text-yellow-400"}`}>
                {me.isActivated ? "Activated" : "Not Activated"}
              </p>
            </div>
          </aside>

          <section className="flex-1 flex flex-col gap-12">
            <div>
              <h2 className="text-white font-bold text-2xl mb-5">Favorites</h2>
              {favItems.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {favItems.map((m) => (
                    <div key={m.id} className="relative">
                      <MediaCard id={m.id} title={m.title} poster={m.poster} rating={m.rating} year={m.year} duration={m.duration} isSeries={false} />
                      <button onClick={() => removeFrom("favorites", m.id)} className="absolute top-2 right-2 text-xs px-2 py-1 bg-black/60 rounded hover:bg-black/80">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#999]">No favorites yet.</p>
              )}
            </div>

            <div>
              <h2 className="text-white font-bold text-2xl mb-5">Watchlist</h2>
              {watchItems.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {watchItems.map((m) => (
                    <div key={m.id} className="relative">
                      <MediaCard id={m.id} title={m.title} poster={m.poster} rating={m.rating} year={m.year} duration={m.duration} isSeries={false} />
                      <button onClick={() => removeFrom("watchlist", m.id)} className="absolute top-2 right-2 text-xs px-2 py-1 bg-black/60 rounded hover:bg-black/80">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#999]">Your watchlist is empty.</p>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
