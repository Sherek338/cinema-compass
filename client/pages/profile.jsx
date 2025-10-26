import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MovieCard } from "@/components/moviecard";
import pfp from "@/assets/Ellipse8.svg"

const favourites = [
  {
    title: "Thunderbolts*",
    year: "2025",
    duration: "2h 7m",
    rating: "7.2",
    image: "https://images.theposterdb.com/prod/public/images/posters/optimized/movies/260063/XyohZzpKEGUqgC4EFBxtSBY7okRv88IxEaeow7rY.jpg",
  },
  {
    title: "The Fantastic 4: First Steps",
    year: "2025",
    duration: "1h 55m",
    rating: "7.1",
    image: "https://images.theposterdb.com/prod/public/images/posters/optimized/movies/4498/ALsbFVmdMeLyeWdJd1PnhUG5ya5go4Di97D8gYTR.jpg",
  },
  {
    title: "Man of Steel",
    year: "2013",
    duration: "2h 23m",
    rating: "7.1",
    image: "https://www.themoviedb.org/t/p/original/jydskfZ4y7XgVlFd7aqtj7YZp2B.jpg",
  },
  {
    title: "The Batman",
    year: "2022",
    duration: "2h 56m",
    rating: "7.8",
    image: "https://www.themoviedb.org/t/p/original/gmU7P3FzGFsl2wiSDhx9znZCNub.jpg",
  },
  {
    title: "28 Years Later",
    year: "2025",
    duration: "1h 55m",
    rating: "6.7",
    image: "https://m.media-amazon.com/images/M/MV5BYzQ0YzU3ZWYtODNiYS00YTk1LTlkMmMtNjRkOWI2MWI3Yzk1XkEyXkFqcGc@._V1_.jpg",
  },
];

const watchlist = [
  {
    title: "The Fantastic 4: First Steps",
    year: "2025",
    duration: "1h 55m",
    rating: "7.1",
    image: "https://images.theposterdb.com/prod/public/images/posters/optimized/movies/4498/ALsbFVmdMeLyeWdJd1PnhUG5ya5go4Di97D8gYTR.jpg",
  },
  {
    title: "KPop Demon Hunters",
    year: "2025",
    duration: "1h 36m",
    rating: "7.6",
    image: "https://image.tmdb.org/t/p/original/jfS5KEfiwsS35ieZvdUdJKkwLlZ.jpg",
  },
  {
    title: "28 Years Later",
    year: "2025",
    duration: "1h 55m",
    rating: "6.7",
    image: "https://m.media-amazon.com/images/M/MV5BYzQ0YzU3ZWYtODNiYS00YTk1LTlkMmMtNjRkOWI2MWI3Yzk1XkEyXkFqcGc@._V1_.jpg",
  },
  {
    title: "The Batman",
    year: "2022",
    duration: "2h 56m",
    rating: "7.8",
    image: "https://www.themoviedb.org/t/p/original/gmU7P3FzGFsl2wiSDhx9znZCNub.jpg",
  },
  {
    title: "Man of Steel",
    year: "2013",
    duration: "2h 23m",
    rating: "7.1",
    image: "https://www.themoviedb.org/t/p/original/jydskfZ4y7XgVlFd7aqtj7YZp2B.jpg",
  },
  {
    title: "Thunderbolts*",
    year: "2025",
    duration: "2h 7m",
    rating: "7.2",
    image: "https://images.theposterdb.com/prod/public/images/posters/optimized/movies/260063/XyohZzpKEGUqgC4EFBxtSBY7okRv88IxEaeow7rY.jpg",
  },
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-raisin-black">
      <Header />
      
      <main className="pt-[91px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[70px] py-8 md:py-12 lg:py-16">
          
          <h1 className="text-white text-3xl md:text-[35px] font-bold mb-8 md:mb-12">
            My profile
          </h1>

          <div className="flex items-center gap-4 mb-12 md:mb-20">
            <div className="w-16 h-16 md:w-[71px] md:h-[71px] rounded-full bg-linear-to-br from-coquelicot to-orange-600 flex items-center justify-center">
              <img src={pfp} alt="User pfp" />
            </div>
            <h2 className="text-white text-xl md:text-[25px] font-normal">James</h2>
          </div>

          <section className="mb-12 md:mb-16">
            <div className="flex items-end justify-between mb-5 md:mb-6">
              <h2 className="text-white text-2xl md:text-[30px] font-bold">Favourites</h2>
              <a href="#" className="text-white text-sm md:text-[18px] hover:text-coquelicot transition-colors">
                View all
              </a>
            </div>
            <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 scrollbar-hide">
              {favourites.map((movie, index) => (
                <MovieCard key={index} {...movie} />
              ))}
            </div>
          </section>

          <section className="mb-12 md:mb-16">
            <div className="flex items-end justify-between mb-5 md:mb-6">
              <h2 className="text-white text-2xl md:text-[30px] font-bold">My Watchlist</h2>
              <a href="#" className="text-white text-sm md:text-[18px] hover:text-coquelicot transition-colors">
                View all
              </a>
            </div>
            <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 scrollbar-hide">
              {watchlist.map((movie, index) => (
                <MovieCard key={index} {...movie} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between mb-5 md:mb-6">
              <h2 className="text-white text-2xl md:text-[30px] font-bold">My Reviews</h2>
              <a href="#" className="text-white text-sm md:text-[18px] hover:text-coquelicot transition-colors">
                View all
              </a>
            </div>
            
            <div className="w-full max-w-[310px] bg-coquelicot rounded-[20px] p-5">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white text-[20px] font-semibold mb-1">James</h3>
                    <div className="flex items-center gap-1.5 text-white text-xs">
                      <span className="font-semibold">Posted on:</span>
                      <span className="font-normal">11 Jul 2025</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-0.5">
                    {[...Array(4)].map((_, i) => (
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none" key={i}>
                            <path d="M16.346 8.95142C16.9889 8.37204 16.6422 7.30502 15.7815 7.21413L12.5461 6.87245C12.1912 6.83497 11.8832 6.61116 11.7378 6.28519L10.4136 3.31494C10.0612 2.52454 8.9393 2.52454 8.58691 3.31494L7.26266 6.28519C7.11732 6.61116 6.80927 6.83497 6.45434 6.87245L3.21894 7.21413C2.35832 7.30502 2.01163 8.37204 2.65447 8.95142L5.07101 11.1294C5.33613 11.3684 5.4538 11.7305 5.37978 12.0796L4.70524 15.261C4.52574 16.1076 5.43341 16.7671 6.18308 16.3347L9.00065 14.7098C9.30985 14.5314 9.69064 14.5314 9.99983 14.7098L12.8174 16.3347C13.5671 16.7671 14.4747 16.1076 14.2952 15.261L13.6207 12.0796C13.5467 11.7305 13.6644 11.3684 13.9295 11.1294L16.346 8.95142Z" fill="#F5C519"/>
                        </svg>
                    ))}
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                        <path d="M16.346 8.95142C16.9889 8.37204 16.6422 7.30502 15.7815 7.21413L12.5461 6.87245C12.1912 6.83497 11.8832 6.61116 11.7378 6.28519L10.4136 3.31494C10.0612 2.52454 8.9393 2.52454 8.58691 3.31494L7.26266 6.28519C7.11732 6.61116 6.80927 6.83497 6.45434 6.87245L3.21894 7.21413C2.35832 7.30502 2.01163 8.37204 2.65447 8.95142L5.07101 11.1294C5.33613 11.3684 5.4538 11.7305 5.37978 12.0796L4.70524 15.261C4.52574 16.1076 5.43341 16.7671 6.18308 16.3347L9.00065 14.7098C9.30985 14.5314 9.69064 14.5314 9.99983 14.7098L12.8174 16.3347C13.5671 16.7671 14.4747 16.1076 14.2952 15.261L13.6207 12.0796C13.5467 11.7305 13.6644 11.3684 13.9295 11.1294L16.346 8.95142Z" fill="#CACACA"/>
                    </svg>
                  </div>
                </div>
                
                <div className="relative">
                  <p className="text-white text-[15px] font-normal leading-relaxed text-justify">
                    "Just a fun time watching this iteration of Superman. David Corenswet and Rachel Brosnahan were absolutely wonderful together and Nicholas Hoult played a great Lex Luthor.
                    <span className="text-white/65 text-[13px] font-semibold ml-1">...Read more</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button className="text-white text-[15px] font-bold italic hover:opacity-80 transition-opacity">
                  Edit
                </button>
                <button className="text-white text-[15px] font-bold italic hover:opacity-80 transition-opacity">
                  Delete
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
