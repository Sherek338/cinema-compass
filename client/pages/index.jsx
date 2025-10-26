import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { MovieCard } from "@/components/moviecard"

const trendingMovies = [
    {
        title: "Superman",
        year: "2025",
        duration: "2h 9m",
        rating: "7.2",
        image: "https://image.tmdb.org/t/p/original/ombsmhYUqR4qqOLOxAyr5V8hbyv.jpg",
    },
    {
        title: "Weapons",
        year: "2025",
        duration: "2h 8m",
        rating: "6.8",
        image: "https://image.tmdb.org/t/p/original/42klJcqMwFtwzZHxTtmrd6mEYwl.jpg",
    },
    {
        title: "F1",
        year: "2025",
        duration: "2h 36m",
        rating: "7.8",
        image: "https://image.tmdb.org/t/p/original/iGyqJwqAHQjRrChcOCo6Nqgkb0B.jpg",
    },
    {
        title: "Mantis",
        year: "2025",
        duration: "1h 53m",
        rating: "5.4",
        image: "https://image.idntimes.com/post/20250827/1000099269_055b97ae-3be9-4c40-9520-c2374378f49d.jpg",
    },
    {
        title: "KPop Demon Hunters",
        year: "2025",
        duration: "1h 36m",
        rating: "7.6",
        image: "https://image.tmdb.org/t/p/original/jfS5KEfiwsS35ieZvdUdJKkwLlZ.jpg",
    },
    {
        title: "Nobody 2",
        year: "2025",
        duration: "1h 29m",
        rating: "6.3",
        image: "https://image.tmdb.org/t/p/original/svXVRoRSu6zzFtCzkRsjZS7Lqpd.jpg",
    },
    

];

const newReleases = [
    {
        title: "Ballerina",
        year: "2025",
        duration: "2h 4m",
        rating: "6.9",
        image: "https://www.deepfocusreview.com/wp-content/uploads/2025/06/Ballerina-movie-poster.png",
    },
    {
        title: "The Fantastic 4: First Steps",
        year: "2025",
        duration: "1h 55m",
        rating: "7.1",
        image: "https://images.theposterdb.com/prod/public/images/posters/optimized/movies/4498/ALsbFVmdMeLyeWdJd1PnhUG5ya5go4Di97D8gYTR.jpg",
    },
    {
        title: "How to Train Your Dragon",
        year: "2025",
        duration: "2h 4m",
        rating: "6.9",
        image: "https://mlpnk72yciwc.i.optimole.com/cqhiHLc.IIZS~2ef73/w:auto/h:auto/q:75/https://bleedingcool.com/wp-content/uploads/2025/02/HTD_OnlineOOHTag17_RGB_4.jpg",
    },
    {
        title: "Superman",
        year: "2025",
        duration: "2h 9m",
        rating: "7.2",
        image: "https://image.tmdb.org/t/p/original/ombsmhYUqR4qqOLOxAyr5V8hbyv.jpg",
    },
    {
        title: "Demon Slayer: Kimetsu no Yaiba Infinity Castle",
        year: "2025",
        duration: "2h 36m",
        rating: "8.6",
        image: "https://cdn.amkstation.com/wp-content/uploads/2025/03/demon-slayer_-kimetsu-no-yaiba-infinity-castle-theatrical-date-poster-us-768x1085-1.webp",
    },
    {
        title: "The Conjuring: Last Rites",
        year: "2025",
        duration: "2h 15m",
        rating: "6.4",
        image: "https://m.media-amazon.com/images/M/MV5BZjA4Yzc4MDAtZTIzYy00NDMwLWE2NTAtNDUzZWFhZWM2NmNmXkEyXkFqcGc@._V1_.jpg",
    },
];

const topRated = [
    {
    title: "Nobody 2",
    year: "2025",
    duration: "1h 29m",
    rating: "6.3",
    image: "https://image.tmdb.org/t/p/original/svXVRoRSu6zzFtCzkRsjZS7Lqpd.jpg",
    },
    {
        title: "Weapons",
        year: "2025",
        duration: "2h 8m",
        rating: "6.8",
        image: "https://image.tmdb.org/t/p/original/42klJcqMwFtwzZHxTtmrd6mEYwl.jpg",
    },
    {
        title: "Mission: Impossible - The Final Reckoning",
        year: "2025",
        duration: "2h 50m",
        rating: "7.2",
        image: "https://m.media-amazon.com/images/M/MV5BMDJhNDUwOTYtOTYyZi00NzQwLWFiYjMtNzM1MTYxNTQ0YjI5XkEyXkFqcGc@._V1_UY1200_CR165,0,630,1200_AL_.jpg",
    },
    {
        title: "F1",
        year: "2025",
        duration: "2h 36m",
        rating: "7.8",
        image: "https://image.tmdb.org/t/p/original/iGyqJwqAHQjRrChcOCo6Nqgkb0B.jpg",
    },
    {
        title: "Mantis",
        year: "2025",
        duration: "1h 53m",
        rating: "5.4",
        image: "https://image.idntimes.com/post/20250827/1000099269_055b97ae-3be9-4c40-9520-c2374378f49d.jpg",
    },
    {
        title: "How to Train Your Dragon",
        year: "2025",
        duration: "2h 5m",
        rating: "7.8",
        image: "https://mlpnk72yciwc.i.optimole.com/cqhiHLc.IIZS~2ef73/w:auto/h:auto/q:75/https://bleedingcool.com/wp-content/uploads/2025/02/HTD_OnlineOOHTag17_RGB_4.jpg",
    },

];

const watchlist = [
  {
    title: "Ballerina",
    year: "2025",
    duration: "2h 4m",
    rating: "6.9",
    image: "https://www.deepfocusreview.com/wp-content/uploads/2025/06/Ballerina-movie-poster.png",
  },
  {
    title: "F1",
    year: "2025",
    duration: "2h 36m",
    rating: "7.8",
    image: "https://image.tmdb.org/t/p/original/iGyqJwqAHQjRrChcOCo6Nqgkb0B.jpg",
    },
];

export default function Index() {
    return (
        <div className="min-h-screen bg-raisin-black">
            <Header />

            <main className="pt-[75px] lg:pt-[91px]">
                <Hero />

                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[70px] py-8 md:py-12 lg-py-16">
                    <div className="flex items-center justify-center gap-6 md:gap-10 mb-12 md:mb-16">
                        <a href="/movies" className="flex flex-col items-start gap-[5px] hover:opacity-80 transition-opacity cursor-pointer">
                            <h2 className="text-white text-xl md:text-[25px] font-bold">Movies</h2>
                            <div className="w-full h-0.5 bg-coquelicot" />
                        </a>
                        <a href="/series" className="text-white text-xl md:text-[25px] font-normal hover:text-coquelicot transition-colors">Series</a>
                    </div>

                    <section className="mb-12 md:mb-16">
                        <div className="flex items-end justify-between mb-4 md:mb-6">
                            <h2 className="text-white text-2xl md:text-[30px] font-bold capitalize"></h2>
                            <a href="#" className="text-white text-sm md:text-[18px] hover:text-coquelicot transition-colors">View all</a>
                        </div>

                        <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 scrollbar-hide">
                            {trendingMovies.map((movie, index) => (
                                <MovieCard key={index} {...movie} />
                            ))}
                        </div>
                    </section>
                    
                    <section className="mb-12 md:mb-16">
                        <div className="flex items-end justify-between mb-4 md:mb-6">
                            <h2 className="text-white text-2xl md:text-[30px] font-bold capitalize">New Release</h2>
                            <a href="#" className="text-white text-sm md:text-[18px] hover:text-coquelicot transition-colors">View all</a>
                        </div> 

                        <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 scrollbar-hide">
                            {newReleases.map((movie, index) => (
                                <MovieCard key={index} {...movie} />
                            ))}
                        </div>
                    </section>
                    
                    <section className="mb-12 md:mb-16">
                        <div className="flex items-end justify-between mb-4 md:mb-6">
                            <h2 className="text-white text-2xl md:text-[30px] font-bold capitalize">Top Rated</h2>
                            <a href="#" className="text-white text-sm md:text-[18px] hover:text-coquelicot transition-colors">View all</a>
                        </div>

                        <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 scrollbar-hide">
                            {topRated.map((movie, index) => (
                                <MovieCard key={index} {...movie} />
                            ))}
                        </div>
                    </section>

                    <section className="mb-12 md:mb-16">
                        <div className="flex items-end justify-between mb-4 md:mb-6">
                            <h2 className="text-white text-2xl md:text-[30px] font-bold capitalize">My watchlist</h2>
                            <a href="#" className="text-white text-sm md:text-[18px] hover:text-coquelicot transition-colors">View all</a>
                        </div>

                        <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 scrollbar-hide">
                            {watchlist.map((movie, index) => (
                                <MovieCard key={index} {...movie} />
                            ))}
                            <div className="shrink-0 flex items-center justify-center w-[200px] h-[273px] border border-[#3F3F3F] bg-[#343434] rounded-sm cursor-pointer hover:border-orange transition-colors group">
                                <div className="relative w-9 h-9">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-0.5 bg-white group-hover:bg-coquelicot transition-colors" />
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-9 bg-white group-hover:bg-coquelicot transition-colors" />
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    )
}