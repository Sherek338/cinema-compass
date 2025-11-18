import { Link } from 'react-router-dom';
import { useAuth } from '@/context/authContext.jsx';

export function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="relative w-full min-h-[242px] mt-20 overflow-hidden">
      <div className="absolute inset-0 bg-coquelicot" />
      <div className="absolute inset-0 bg-gradient-to-b from-raisin-black/26 to-coquelicot/26" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[70px] py-8 lg:py-[46px]">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <nav className="flex flex-col gap-2.5">
            <Link
              to="/"
              className="text-white text-[18px] font-semibold hover:opacity-80"
            >
              Home
            </Link>
            <Link
              to="/movies"
              className="text-white text-[18px] font-semibold hover:opacity-80"
            >
              Movies
            </Link>
            <Link
              to="/series"
              className="text-white text-[18px] font-semibold hover:opacity-80"
            >
              Series
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/watchlist"
                  className="text-white text-[18px] font-semibold hover:opacity-80"
                >
                  My Watchlist
                </Link>
                <Link
                  to="/favorites"
                  className="text-white text-[18px] font-semibold hover:opacity-80"
                >
                  Favorites
                </Link>
              </>
            )}
          </nav>
          <div className="text-white text-sm lg:text-[15px] font-semibold mt-8">
            © CINEMACOMPASS
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;