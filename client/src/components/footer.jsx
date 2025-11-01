export function Footer() {
  return (
    <footer className="relative w-full min-h-[242px] mt-20 overflow-hidden">
      <div className="absolute inset-0 bg-coquelicot" />
      <div className="absolute inset-0 bg-linear-to-b from-raisin-black/26 to-coquelicot/26" />
      
      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[70px] h-full flex flex-col justify-between py-8 lg:py-[46px]">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-start gap-8 sm:gap-12 lg:gap-[108px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="112" height="113" viewBox="0 0 112 113" fill="none">
                <g clip-path="url(#clip0_115_137)">
                    <path d="M96.6158 52.4892L112 57.2397L96.683 61.6929C95.105 80.3656 79.4969 95.6779 60.9791 98.0098L56.2452 113L55.7374 112.393L51.0234 98.0049C32.5977 95.72 16.7033 80.1351 15.3941 61.4897L0 57.2397C0.0348452 56.8606 0.375831 56.8606 0.634681 56.7614C5.22927 54.9821 10.5954 54.3403 15.19 52.4198C17.7263 34.156 32.859 19.2402 51.1503 16.6059L56.0037 0L60.8472 16.6084C79.2057 19.1956 94.4604 34.0123 96.6158 52.4892ZM31.5001 81.8871C56.8201 106.886 98.0121 82.8239 89.7289 49.0619C83.9172 25.3735 55.8245 15.176 35.7612 29.2865C18.3908 41.5012 16.4519 67.0358 31.4976 81.8896L31.5001 81.8871Z" fill="#201E1F"/>
                    <path d="M54.9534 29.3136C70.009 28.5999 83.1855 40.7403 84.1362 55.6214C85.6346 79.0446 59.1124 94.0893 39.7409 80.4943C18.0174 65.2514 28.1972 30.58 54.9534 29.3112V29.3136ZM51.3593 36.5151C44.6143 43.4042 56.3746 52.499 61.4346 44.9357C66.0192 38.0837 56.6434 31.1177 51.3593 36.5151ZM39.507 47.8872C31.2163 49.1783 34.096 62.5825 42.7302 59.5195C49.4528 57.1355 46.8842 46.7373 39.507 47.8872ZM70.3774 47.8921C68.3265 48.1845 65.8674 50.4223 65.5189 52.4692C64.1202 60.7115 75.6788 62.8724 77.4435 54.925C78.3768 50.7296 74.504 47.3048 70.3774 47.8897V47.8921ZM54.9335 54.0751C53.1638 54.4765 52.3126 56.3946 52.5764 58.05C53.2908 62.5626 60.6779 61.6309 59.436 56.1815C59.0377 54.4369 56.5239 53.7157 54.936 54.0751H54.9335ZM45.9807 65.7297C39.3701 66.773 39.5244 76.6681 45.1892 77.5478C56.0162 79.2305 54.9733 64.3097 45.9807 65.7297ZM63.9011 65.7272C59.1199 66.54 57.5245 72.8047 60.8572 76.0734C63.4755 78.6407 68.65 78.0162 70.4894 74.7649C73.1227 70.1036 69.0209 64.8574 63.9011 65.7272Z" fill="#201E1F"/>
                </g>
                <defs>
                    <clipPath id="clip0_115_137">
                        <rect width="112" height="113" fill="white"/>
                    </clipPath>
                </defs>
</svg>

            <nav className="flex flex-col gap-2.5">
              <a href="/" className="text-white text-[18px] font-semibold hover:opacity-80 transition-opacity">
                Home
              </a>
              <a href="#" className="text-white text-[18px] font-semibold hover:opacity-80 transition-opacity">
                Movies
              </a>
              <a href="#" className="text-white text-[18px] font-semibold hover:opacity-80 transition-opacity">
                Series
              </a>
              <a href="#" className="text-white text-[18px] font-semibold hover:opacity-80 transition-opacity">
                My watchlist
              </a>
              <a href="#" className="text-white text-[18px] font-semibold hover:opacity-80 transition-opacity">
                Favourites
              </a>
            </nav>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-end gap-3 sm:gap-5 text-white text-sm lg:text-[15px] font-semibold mt-8">
          <a href="#" className="hover:opacity-80 transition-opacity">
            Policy Terms
          </a>
          <span>© CINEMACOMPASS</span>
        </div>
      </div>
    </footer>
  );
}
