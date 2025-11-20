import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/header.jsx';
import Footer from '@/components/footer.jsx';
import MediaCard from '@/components/mediacard.jsx';

import tmdb from '@/service/tmdbApi';

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => q.trim(), [q]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!query) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);

        const json = await tmdb.searchMulti(query, 1);

        if (cancelled) return;

        const mapped = (json.results || [])
          .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
          .map((r) => {
            const isSeries = r.media_type === 'tv';
            return {
              id: r.id,
              isSeries,
              title: r.title,
              name: r.name,
              poster: r.poster_path
                ? tmdb.getImageUrl(r.poster_path, 'w500')
                : '/placeholder.png',
              rating: r.vote_average ? r.vote_average.toFixed(1) : 'N/A',
              year:
                (r.release_date || r.first_air_date || '').slice(0, 4) || '—',
              duration: !isSeries ? '—' : undefined,
              seasons: isSeries ? '—' : undefined,
            };
          });

        setResults(mapped);
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div className="min-h-screen bg-[#201E1F] flex flex-col">
      <Header />
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-[70px] py-16 pt-30">
        <h1 className="text-white font-bold text-[35px] mb-8">
          Search results
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-12 h-12 rounded-full border-4 border-[#FF4002] border-t-transparent animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <p className="text-[#999]">No results for “{query}”.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {results.map((r) => (
              <MediaCard
                key={`${r.isSeries ? 'tv' : 'movie'}-${r.id}`}
                {...r}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
