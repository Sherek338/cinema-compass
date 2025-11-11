import { useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import Header from "@/components/header.jsx";
import Footer from "@/components/footer.jsx";
import { useAuth } from "@/context/authContext.jsx";

export default function MediaDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isSeries = location.pathname.includes("/series");

  const { isAuthenticated, authHeaders, fetchMe } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let cancelled = false;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const type = isSeries ? "tv" : "movie";
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=en-US`
        );
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        console.error("Failed to load details:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const loadMembership = async () => {
      try {
        if (!isAuthenticated) {
          setInFavorites(false);
          setInWatchlist(false);
          return;
        }
        const me = await fetchMe();
        const movieId = Number(id);
        setInWatchlist(Boolean(me.watchList?.includes(movieId)));
        setInFavorites(Boolean(me.favoriteList?.includes(movieId)));
      } catch {
        setInFavorites(false);
        setInWatchlist(false);
      }
    };

    fetchDetails();
    loadMembership();

    return () => {
      cancelled = true;
    };
  }, [id, isSeries, API_KEY, isAuthenticated, fetchMe]);

  const handleListChange = async (listType, action) => {
    if (!isAuthenticated) return navigate("/");
    try {
      const res = await fetch(`${API_URL}/api/user/${listType}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ movieId: Number(id), action }),
      });
      if (!res.ok) throw new Error(`Failed to update ${listType}`);
      if (listType === "watchlist") setInWatchlist(action === "add");
      if (listType === "favorites") setInFavorites(action === "add");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#201E1F]">
        <div className="w-12 h-12 rounded-full border-4 border-[#FF4002] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#201E1F] text-white">
        <p>Content not found.</p>
      </div>
    );
  }

  const {
    title,
    name,
    overview,
    poster_path,
    vote_average,
    release_date,
    first_air_date,
    runtime,
    number_of_seasons,
    number_of_episodes,
    genres,
    homepage,
    tagline,
  } = data;

  const displayTitle = title || name;
  const displayYear = (release_date || first_air_date || "").slice(0, 4);
  const backLink = isSeries ? "/series" : "/movies";

  return (
    <div className="min-h-screen bg-[#201E1F] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[70px] py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          <img
            src={
              poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : "https://via.placeholder.com/400x600?text=No+Image"
            }
            alt={displayTitle}
            className="w-full lg:w-[350px] h-auto rounded-xl shadow-lg object-cover"
          />

          <div className="flex flex-col justify-center gap-4">
            <h1 className="text-4xl font-bold">{displayTitle}</h1>
            {tagline && <p className="italic text-[#999]">{tagline}</p>}

            <div className="flex items-center gap-3 text-[#FF4002] font-semibold">
              <svg width="20" height="20" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.346 8.95142C16.9889 8.37204 16.6422 7.30502 15.7815 7.21413L12.5461 6.87245C12.1912 6.83497 11.8832 6.61116 11.7378 6.28519L10.4136 3.31494C10.0612 2.52454 8.9393 2.52454 8.58691 3.31494L7.26266 6.28519C7.11732 6.61116 6.80927 6.83497 6.45434 6.87245L3.21894 7.21413C2.35832 7.30502 2.01163 8.37204 2.65447 8.95142L5.07101 11.1294C5.33613 11.3684 5.4538 11.7305 5.37978 12.0796L4.70524 15.261C4.52574 16.1076 5.43341 16.7671 6.18308 16.3347L9.00065 14.7098C9.30985 14.5314 9.69064 14.5314 9.99983 14.7098L12.8174 16.3347C13.5671 16.7671 14.4747 16.1076 14.2952 15.261L13.6207 12.0796C13.5467 11.7305 13.6644 11.3684 13.9295 11.1294L16.346 8.95142Z" fill="#F5C519"/>
              </svg>
              <span>{vote_average ? vote_average.toFixed(1) : "N/A"}</span>
            </div>

            <div className="text-[#bbb] flex flex-wrap gap-4 text-sm">
              <p><strong>Year:</strong> {displayYear || "N/A"}</p>
              {!isSeries && runtime && <p><strong>Duration:</strong> {runtime} min</p>}
              {isSeries && (
                <>
                  <p><strong>Seasons:</strong> {number_of_seasons || "N/A"}</p>
                  <p><strong>Episodes:</strong> {number_of_episodes || "N/A"}</p>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {genres?.map((g) => (
                <span key={g.id} className="border border-[#FF4002] text-[#FF4002] text-sm px-3 py-[2px] rounded-full">
                  {g.name}
                </span>
              ))}
            </div>

            {isAuthenticated && (
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() => handleListChange("watchlist", inWatchlist ? "remove" : "add")}
                  className={`px-5 py-2 rounded-lg font-semibold transition ${
                    inWatchlist ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-[#FF4002] hover:bg-[#ff5722] text-white"
                  }`}
                >
                  {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                </button>

                <button
                  onClick={() => handleListChange("favorites", inFavorites ? "remove" : "add")}
                  className={`px-5 py-2 rounded-lg font-semibold transition ${
                    inFavorites ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-[#FF4002] hover:bg-[#ff5722] text-white"
                  }`}
                >
                  {inFavorites ? "Remove from Favorites" : "Add to Favorites"}
                </button>
              </div>
            )}

            {homepage && (
              <a
                href={homepage}
                target="_blank"
                className="mt-4 inline-block px-5 py-2 bg-[#FF4002] text-white rounded-lg hover:bg-[#ff5722] transition"
              >
                Visit Official Site
              </a>
            )}

            <Link to={backLink} className="mt-6 inline-block text-[#999] hover:text-white transition">
              ← Back to {isSeries ? "Series" : "Movies"}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
