import { Search } from "lucide-react";
import logo from "@/assets/logo.svg";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-raisin-black/80 backdrop-blur-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[70px] py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 lg:gap-[51px]">
            <img
              src={logo}
              alt="CinemaCompass Logo"
              className="w-10 h-10 lg:w-[60px] lg:h-[61px]"
            />
            
            <nav className="hidden lg:flex items-center gap-[30px]">
              <a href="/" className="text-white text-[20px] font-normal hover:text-coquelicot transition-colors">
                Home
              </a>
              <a href="/movies" className="text-white text-[20px] font-normal hover:text-coquelicot transition-colors">
                Movies
              </a>
              <a href="#" className="text-white text-[20px] font-normal hover:text-coquelicot transition-colors">
                Series
              </a>
              <a href="#" className="text-white text-[20px] font-normal hover:text-coquelicot transition-colors">
                My watchlist
              </a>
              <a href="#" className="text-white text-[20px] font-normal hover:text-coquelicot transition-colors">
                Favourites
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3 lg:gap-7">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search"
                className="w-48 lg:w-[420px] h-9 px-5 py-2 bg-transparent border border-white rounded-full text-[15px] text-white placeholder:text-[#9B9B9B] focus:outline-none focus:border-coquelicot transition-colors"
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
            </div>

            <button className="md:hidden text-white p-2">
              <Search className="w-5 h-5" />
            </button>

            <a href="/profile" className="flex items-center gap-2 lg:gap-2.5 hover:opacity-80 transition-opacity cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <g clip-path="url(#clip0_55_1708)">
                    <path d="M9.80897 15.0659C4.61671 17.1354 0.933839 22.2027 0.933845 28.125C0.933373 28.2487 0.957395 28.3713 1.00453 28.4857C1.05166 28.6001 1.12096 28.7041 1.20845 28.7916C1.29594 28.879 1.39988 28.9483 1.51428 28.9955C1.62868 29.0426 1.75128 29.0666 1.87501 29.0662H28.125C28.3736 29.0652 28.6117 28.9655 28.7868 28.789C28.9619 28.6125 29.0598 28.3736 29.0588 28.125C29.0588 22.2033 25.377 17.1358 20.1856 15.0659C18.75 16.1917 16.9489 16.8713 14.9963 16.8713C13.0434 16.8713 11.2433 16.1921 9.80897 15.0659Z" fill="white"/>
                    <path d="M14.9965 0.941162C10.8654 0.941162 7.50196 4.30467 7.50195 8.43567C7.50196 12.5667 10.8654 15.9375 14.9965 15.9375C19.1275 15.9375 22.4983 12.5667 22.4983 8.43567C22.4983 4.30467 19.1275 0.941162 14.9965 0.941162Z" fill="white"/>
                </g>
                <defs>
                    <clipPath id="clip0_55_1708">
                        <rect width="30" height="30" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
              <span className="hidden sm:inline text-white text-base lg:text-[18px] font-normal">James</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
