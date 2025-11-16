import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, X, Menu } from "lucide-react";
import { useAuth } from "@/context/authContext.jsx";
import logo from "@/assets/logo.svg";
import UserMenu from "@/components/usermenu.jsx";

export default function Header() {
  const { isAuthenticated, setModalOpen, fetchMe } = useAuth();
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setMobileOpen(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <header className="app-header fixed top-0 left-0 right-0 z-50 bg-[#0c0c0c]/92 backdrop-blur">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[70px]">
        <div className="row justify-between gap-4 w-full">
          <div className="flex items-center gap-4 lg:gap-[42px]">
            <Link to="/" className="inline-flex items-center">
              <img
                src={logo}
                alt="CinemaCompass"
                className="w-9 h-9 lg:w-[56px] lg:h-[56px]"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-[22px] lg:gap-[28px]">
              <Link to="/" className="nav-link text-white text-[18px] lg:text-[20px] hover:text-coquelicot">Home</Link>
              <Link to="/movies" className="nav-link text-white text-[18px] lg:text-[20px] hover:text-coquelicot">Movies</Link>
              <Link to="/series" className="nav-link text-white text-[18px] lg:text-[20px] hover:text-coquelicot">Series</Link>
              {isAuthenticated && (
                <>
                  <Link to="/watchlist" className="nav-link text-white text-[18px] lg:text-[20px] hover:text-coquelicot">Watchlist</Link>
                  <Link to="/favorites" className="nav-link text-white text-[18px] lg:text-[20px] hover:text-coquelicot">Favorites</Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <form onSubmit={onSubmit} className="relative hidden md:block">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="text"
                placeholder="Search"
                className="w-48 lg:w-[420px] h-10 px-5 bg-transparent border border-white/80 rounded-full text-[15px] text-white placeholder:text-[#9B9B9B] focus:outline-none focus:border-coquelicot transition-colors"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-white" />
              </button>
            </form>

            <button
              className="md:hidden p-2 rounded hover:bg-white/10 transition"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>

            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="bg-coquelicot text-white px-4 py-2 rounded-full hover:bg-coquelicot/90 transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-black/90">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[70px] h-full flex flex-col">
            <div className="flex items-center justify-between h-[64px]">
              <span className="text-white/80">Menu</span>
              <button
                className="p-2 rounded hover:bg-white/10 transition"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="flex items-center gap-2 mb-6">
              <div className="relative flex-1">
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  type="text"
                  placeholder="Search"
                  className="w-full h-11 px-4 bg-transparent border border-white/80 rounded-full text-[15px] text-white placeholder:text-[#9B9B9B] focus:outline-none focus:border-coquelicot transition-colors"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-white" />
                </button>
              </div>
            </form>

            <nav className="flex flex-col gap-4 mt-2">
              <Link onClick={() => setMobileOpen(false)} to="/" className="text-white text-2xl">Home</Link>
              <Link onClick={() => setMobileOpen(false)} to="/movies" className="text-white text-2xl">Movies</Link>
              <Link onClick={() => setMobileOpen(false)} to="/series" className="text-white text-2xl">Series</Link>
              {isAuthenticated && (
                <>
                  <Link onClick={() => setMobileOpen(false)} to="/watchlist" className="text-white text-2xl">Watchlist</Link>
                  <Link onClick={() => setMobileOpen(false)} to="/favorites" className="text-white text-2xl">Favorites</Link>
                </>
              )}
            </nav>

            {!isAuthenticated && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setModalOpen(true);
                }}
                className="mt-auto mb-8 self-start bg-coquelicot text-white px-5 py-2.5 rounded-full hover:bg-coquelicot/90 transition"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
