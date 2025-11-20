import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, Menu } from 'lucide-react';
import { useAuth } from '@/context/authContext.jsx';
import logo from '@/assets/logo.svg';
import UserMenu from '@/components/usermenu.jsx';

export default function Header() {
  const { isAuthenticated, setModalOpen, fetchIsAdmin, setAdminModalOpen } =
    useAuth();
  const isAdmin = useRef(null);

  const [q, setQ] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollThreshold = 100;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollThreshold]);

  useEffect(() => {
    let isMounted = true;

    async function checkAdmin() {
      if (!isAuthenticated) {
        isAdmin.current = false;
        return;
      }

      const result = await fetchIsAdmin();
      if (isMounted) {
        isAdmin.current = result;
      }
    }

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, fetchIsAdmin]);

  const onSubmit = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setMobileOpen(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <>
      <header
        className={`app-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'bg-raisin-black/80 backdrop-blur-sm shadow-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[70px] h-[90px] flex items-center">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-4 lg:gap-[42px] h-full">
              <Link to="/" className="inline-flex items-center h-full">
                <img src={logo} alt="CinemaCompass" className="w-14 h-14" />
              </Link>

              <nav className="hidden md:flex items-center gap-[22px] lg:gap-[28px]">
                <Link
                  to="/"
                  className="nav-link text-white text-[18px] lg:text-[20px] hover:text-coquelicot transition-colors duration-300"
                >
                  Home
                </Link>
                <Link
                  to="/movies"
                  className="nav-link text-white text-[18px] lg:text-[20px] hover:text-coquelicot transition-colors duration-300"
                >
                  Movies
                </Link>
                <Link
                  to="/series"
                  className="nav-link text-white text-[18px] lg:text-[20px] hover:text-coquelicot transition-colors duration-300"
                >
                  Series
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      to="/watchlist"
                      className="nav-link text-white text-[18px] lg:text-[20px] hover:text-coquelicot transition-colors duration-300"
                    >
                      Watchlist
                    </Link>
                    <Link
                      to="/favorites"
                      className="nav-link text-white text-[18px] lg:text-[20px] hover:text-coquelicot transition-colors duration-300"
                    >
                      Favorites
                    </Link>
                    {isAdmin.current && (
                      <button
                        type="button"
                        onClick={() => {
                          console.log('Admin panel');
                          setAdminModalOpen(true);
                        }}
                        className="bg-coquelicot text-white px-4 py-2 rounded-full hover:bg-coquelicot/90 transition cursor-pointer hidden md:block"
                      >
                        Admin Panel
                      </button>
                    )}
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
                  className="w-40 lg:w-[320px] xl:w-[420px] h-10 px-5 bg-transparent border border-white/80 rounded-full text-[15px] text-white placeholder:text-[#9B9B9B] focus:outline-none focus:border-coquelicot transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  aria-label="Submit search"
                >
                  <Search className="w-5 h-5 text-white transition-colors duration-300" />
                </button>
              </form>

              <button
                className="md:hidden p-2 rounded hover:bg-white/10 transition-colors duration-300"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-8 h-8 text-white" />
              </button>

              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="bg-coquelicot text-white px-4 py-2 rounded-full hover:bg-coquelicot/90 transition cursor-pointer hidden md:block"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Shit */}
      <div
        className={`fixed inset-0 z-[60] bg-black/95 overflow-y-auto transition-transform 
        duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="px-4 sm:px-6 h-full flex flex-col">
          <div className="flex items-center justify-between h-[72px]">
            <span className="text-white/80 text-3xl font-semibold">Menu</span>
            <button
              className="p-2 rounded hover:bg-white/10 transition-colors duration-300"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-8 h-8 text-white" />
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
                className="w-full h-21 px-7 bg-transparent border border-white/80 rounded-full text-2xl text-white placeholder:text-[#9B9B9B] focus:outline-none focus:border-coquelicot transition-colors"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                aria-label="Submit search"
              >
                <Search className="w-8 h-8 text-white" />
              </button>
            </div>
          </form>

          <nav className="flex flex-col gap-10 mt-2 flex-grow text-center">
            <Link
              onClick={() => setMobileOpen(false)}
              to="/"
              className="text-white text-3xl hover:text-coquelicot transition-colors"
            >
              Home
            </Link>
            <Link
              onClick={() => setMobileOpen(false)}
              to="/movies"
              className="text-white text-3xl hover:text-coquelicot transition-colors"
            >
              Movies
            </Link>
            <Link
              onClick={() => setMobileOpen(false)}
              to="/series"
              className="text-white text-3xl hover:text-coquelicot transition-colors"
            >
              Series
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  onClick={() => setMobileOpen(false)}
                  to="/watchlist"
                  className="text-white text-3xl hover:text-coquelicot transition-colors"
                >
                  Watchlist
                </Link>
                <Link
                  onClick={() => setMobileOpen(false)}
                  to="/favorites"
                  className="text-white text-3xl hover:text-coquelicot transition-colors"
                >
                  Favorites
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setModalOpen(true);
                }}
                className="mx-auto text-2xl mb-10 self-start bg-coquelicot text-white px-[33px] py-[24px] rounded-full hover:bg-coquelicot/90 transition"
              >
                Login / Register
              </button>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
