import { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext.jsx';

export default function MyReviews() {
  const { apiRequest } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      setError('');
      setLoading(true);
      try {
        const res = await apiRequest('/api/reviews/user', { method: 'GET' });
        if (mounted) {
          if (!Array.isArray(res)) throw new Error('Unexpected response');
          setReviews(res);
        }
      } catch (e) {
        if (mounted) {
          setError(e.message || 'Failed to load your reviews');
          setReviews([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [apiRequest]);

  if (loading) return <div className="text-white/70 text-sm">Loading…</div>;
  if (error) return <div className="text-red-400 text-sm">{error}</div>;

  return (
    <div className="w-full">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4">My reviews</h2>
      {reviews.length === 0 ? (
        <div className="text-white/70 text-sm">No reviews yet.</div>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-lg border border-white/15 p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="text-white text-sm font-semibold">
                  {r.author || 'Me'}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg
                      key={s}
                      width="16"
                      height="16"
                      viewBox="0 0 19 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.346 8.95142C16.9889 8.37204 16.6422 7.33156 15.7862 7.27798L12.261 7.05738C11.8903 7.03428 11.5658 6.8091 11.4262 6.46642L10.1043 3.2041C9.77835 2.41007 8.67801 2.41007 8.35211 3.2041L7.03017 6.46642C6.89061 6.8091 6.56612 7.03428 6.19545 7.05738L2.67021 7.27798C1.81419 7.33156 1.46755 8.37204 2.11036 8.95142L4.85397 11.4275C5.13265 11.681 5.25236 12.0567 5.17258 12.4164L4.40378 15.8955C4.21956 16.7169 5.12146 17.3463 5.85162 16.9066L8.84871 15.131C9.17132 14.9381 9.28498 14.9381 9.60759 15.131L12.6047 16.9066C13.3348 17.3463 14.2367 16.7169 14.0525 15.8955L13.2837 12.4164C13.2039 12.0567 13.3236 11.681 13.6023 11.4275L16.346 8.95142Z"
                        fill={s <= (Number(r.rating) || 0) ? '#F5C519' : '#CACACA'}
                      />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-white text-sm whitespace-pre-wrap">{r.review}</p>
              <div className="text-white/60 text-xs mt-1">Movie ID: {r.movieId}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
