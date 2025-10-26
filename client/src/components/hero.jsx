import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

const featuredShows = [
  {
    title: "Stranger Things",
    image: "https://i.pinimg.com/originals/6c/c7/7d/6cc77d46badffd1480a67a87fc568f12.jpg",
    genres: ["Horror", "Fantasy", "Retro"],
    rating: "18+",
    info: "4 seasons",
    score: "8.4",
  },
  {
    title: "Superman",
    image: "https://image.tmdb.org/t/p/original/qbvBtTXQ5Igkld1QEZqYg1DRjZk.jpg",
    genres: ["Action", "Superhero", "Drama"],
    rating: "12+",
    info: "1 movie",
    score: "7.2",
  },
  {
    title: "Weapons",
    image: "https://www.heavenofhorror.com/wp-content/uploads/2025/08/Weapons-2025-horror-movie-review.jpg",
    genres: ["Action", "Thriller", "Drama"],
    rating: "16+",
    info: "2h 8m",
    score: "6.8",
  },
  {
    title: "How to Train Your Dragon",
    image: "https://film-authority.com/wp-content/uploads/2025/06/02-httyd-dm-banner-1900x660-kr-f01-021125-67ac99e0cf3df-1.webp",
    genres: ["Animation", "Adventure", "Fantasy"],
    rating: "PG",
    info: "2h 5m",
    score: "7.8",
  },
  {
    title: "F1",
    image: "https://image.tmdb.org/t/p/original/lkDYN0whyE82mcM20rwtwjbniKF.jpg",
    genres: ["Documentary", "Sports", "Drama"],
    rating: "PG",
    info: "2h 36m",
    score: "7.8",
  },
  {
    title: "Mantis",
    image: "https://images.lifestyleasia.com/wp-content/uploads/sites/3/2025/09/30103505/untitled-design-2025-09-26t170859-776-1600x900.jpeg",
    genres: ["Action", "Adventure", "Comedy"],
    rating: "12+",
    info: "1h 53m",
    score: "5.4",
  },
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredShows.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === featuredShows.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const current = featuredShows[currentIndex];

  return (
    <div className="relative w-full h-[500px] md:h-[700px] lg:h-[824px] overflow-hidden">
      <img
        src={current.image}
        alt={current.title}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
      />
      
      <div className="absolute inset-0 bg-linear-to-t from-raisin-black via-transparent to-transparent" />
      
      <div className="relative h-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[70px] flex flex-col justify-end pb-12 md:pb-20">
        <div className="flex items-start gap-2 mb-3 md:mb-4">
          {current.genres.map((genre, idx) => (
            <span key={idx} className="px-2 md:px-3 py-1 border border-white rounded text-white text-xs md:text-sm">
              {genre}
            </span>
          ))}
        </div>
        
        <h1 className="text-white text-4xl md:text-6xl lg:text-[72px] font-bold leading-tight mb-2">
          {current.title}
        </h1>
        
        <div className="flex items-center gap-2 md:gap-3 text-white text-sm md:text-base lg:text-[18px] mb-4 md:mb-6">
          <span>{current.rating}</span>
          <span>•</span>
          <span>{current.info}</span>
          <span>•</span>
          <span>{current.score}</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <button className="px-4 md:px-6 py-2 md:py-2.5 bg-coquelicot text-white text-sm md:text-base lg:text-[18px] font-semibold rounded hover:bg-coquelicot/90 transition-colors">
            Add to Watchlist
          </button>
          <button className="px-4 md:px-6 py-2 md:py-2.5 border border-white text-white text-sm md:text-base lg:text-[18px] font-semibold rounded hover:bg-white/10 transition-colors">
            View more
          </button>
          <button className="p-2 md:p-2.5 border border-white text-white rounded hover:bg-white/10 transition-colors">
            <Heart className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        <button 
          onClick={goToPrevious}
          className="hidden md:flex absolute bottom-20 left-4 p-2 text-white hover:text-coquelicot hover:bg-white/10 rounded-full transition-colors"
          aria-label="Previous featured show"
        >
          <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8" />
        </button>
        
        <button 
          onClick={goToNext}
          className="hidden md:flex absolute bottom-20 right-4 p-2 text-white hover:text-coquelicot hover:bg-white/10 rounded-full transition-colors"
          aria-label="Next featured show"
        >
          <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8" />
        </button>

        <div className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {featuredShows.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`rounded-full transition-all cursor-pointer ${
                i === currentIndex 
                  ? "bg-white w-2 h-2 md:w-3 md:h-3" 
                  : "bg-white/40 w-1.5 h-1.5 md:w-2 md:h-2 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
