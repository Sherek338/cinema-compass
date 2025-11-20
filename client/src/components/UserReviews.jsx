import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';

export default function UserReviews({ tmdbId, mediaType }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [text, setText] = useState('');
  const [rating, setRating] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { fetchIsAdmin, user, authHeaders } = useAuth();
  const isAdmin = useRef(false);

  const currentUserId = user?.id;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result = await fetchIsAdmin();
        if (mounted) isAdmin.current = !!result;
      } catch {
        isAdmin.current = false;
      }
    })();
    return () => (mounted = false);
  }, [fetchIsAdmin]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/review/${mediaType}/${tmdbId}`,
          {
            withCredentials: true,
            headers: { ...(authHeaders || {}) },
          }
        );

        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.reviews)
            ? res.data.reviews
            : Array.isArray(res.data?.items)
              ? res.data.items
              : [];

        if (mounted) setReviews(data);
      } catch (err) {
        console.error('Review load error:', err);
        if (mounted) setReviews([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [tmdbId, mediaType, authHeaders]);

  const formatReviewDate = (raw) => {
    const d = new Date(raw);
    return !isNaN(d)
      ? d.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'Unknown date';
  };

  const getReviewExcerpt = (text, max = 200) =>
    text?.length > max ? text.slice(0, max) + '...' : text || '';

  const isOwner = (review) => {
    if (review?.isOwner === true) return true;

    if (!currentUserId) return false;

    const rid =
      review?.user || review?.userId || review?.user_id || review?.owner;
    return rid && String(rid) === String(currentUserId);
  };

  async function handleDelete(id) {
    try {
      await axios.delete(`http://localhost:3000/api/review/${id}`, {
        withCredentials: true,
        headers: { ...(authHeaders || {}) },
      });

      setReviews((prev) => prev.filter((r) => (r._id || r.id) !== id));
    } catch (e) {
      console.error('Delete error:', e);
      alert('Failed to delete review');
    }
  }
  function beginEdit(r) {
    setEditingId(r._id || r.id);
    setText(r.review || '');
    setRating(Number(r.rating) || 1);
  }

  async function submitReview(e) {
    e?.preventDefault?.();
    if (text.length < 10) return alert('Review too short.');

    setSubmitting(true);
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:3000/api/review/${editingId}`,
          { review: text, rating },
          { withCredentials: true, headers: { ...(authHeaders || {}) } }
        );

        setReviews((prev) =>
          prev.map((r) =>
            (r._id || r.id) === editingId ? { ...r, review: text, rating } : r
          )
        );
      } else {
        const res = await axios.post(
          `http://localhost:3000/api/review`,
          { id: tmdbId, type: mediaType, review: text, rating },
          { withCredentials: true, headers: { ...(authHeaders || {}) } }
        );
        const created =
          res.data && typeof res.data === 'object' ? res.data : null;
        setReviews((prev) => (created ? [created, ...prev] : prev));
      }

      setText('');
      setRating(0);
      setEditingId(null);
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="w-full">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-6">
        User Reviews
      </h2>
      {user && (
        <form onSubmit={submitReview} className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-white text-sm">Your rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="cursor-pointer hover:opacity-80"
                >
                  <svg width="19" height="19" viewBox="0 0 19 19">
                    <path
                      d="M16.346 8.95142C16.9889 8.37204 16.6422 7.33156 15.7862 7.27798L12.261 7.05738C11.8903 7.03428 11.5658 6.8091 11.4262 6.46642L10.1043 3.2041C9.77835 2.41007 8.67801 2.41007 8.35211 3.2041L7.03017 6.46642C6.89061 6.8091 6.56612 7.03428 6.19545 7.05738L2.67021 7.27798C1.81419 7.33156 1.46755 8.37204 2.11036 8.95142L4.85397 11.4275C5.13265 11.681 5.25236 12.0567 5.17258 12.4164L4.40378 15.8955C4.21956 16.7169 5.12146 17.3463 5.85162 16.9066L8.84871 15.131C9.17132 14.9381 9.28498 14.9381 9.60759 15.131L12.6047 16.9066C13.3348 17.3463 14.2367 16.7169 14.0525 15.8955L13.2837 12.4164C13.2039 12.0567 13.3236 11.681 13.6023 11.4275L16.346 8.95142Z"
                      fill={s <= rating ? '#F5C519' : '#CACACA'}
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="w-full rounded-md bg-transparent border border-white/30 text-white text-sm p-3 outline-none h-40"
            placeholder="Write your review…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />

          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-md bg-white text-black text-sm font-semibold cursor-pointer hover:opacity-80"
            >
              {editingId ? 'Update review' : 'Post review'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setText('');
                  setRating(1);
                }}
                className="px-4 py-2 rounded-md border border-white/30 text-white text-sm cursor-pointer hover:opacity-80"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {!reviews.length ? (
        <p className="text-white/70">No reviews yet.</p>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((review) => {
          const id = review._id || review.id;
          const owner = isOwner(review);
          const stars = Number(review.rating) || 0;

          return (
            <div key={id} className="w-full bg-coquelicot rounded-[20px] p-5">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white text-[20px] font-semibold mb-1">
                      {review.author || 'Anonymous'}
                    </h3>
                    <div className="flex items-center gap-1.5 text-white text-xs">
                      <span className="font-semibold">Posted on:</span>
                      <span>{formatReviewDate(review.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} width="19" height="19" viewBox="0 0 19 19">
                        <path
                          d="M16.346 8.95142C16.9889 8.37204 16.6422 7.33156 15.7862 7.27798L12.261 7.05738C11.8903 7.03428 11.5658 6.8091 11.4262 6.46642L10.1043 3.2041C9.77835 2.41007 8.67801 2.41007 8.35211 3.2041L7.03017 6.46642C6.89061 6.8091 6.56612 7.03428 6.19545 7.05738L2.67021 7.27798C1.81419 7.33156 1.46755 8.37204 2.11036 8.95142L4.85397 11.4275C5.13265 11.681 5.25236 12.0567 5.17258 12.4164L4.40378 15.8955C4.21956 16.7169 5.12146 17.3463 5.85162 16.9066L8.84871 15.131C9.17132 14.9381 9.28498 14.9381 9.60759 15.131L12.6047 16.9066C13.3348 17.3463 14.2367 16.7169 14.0525 15.8955L13.2837 12.4164C13.2039 12.0567 13.3236 11.681 13.6023 11.4275L16.346 8.95142Z"
                          fill={i <= stars ? '#F5C519' : '#CACACA'}
                        />
                      </svg>
                    ))}
                  </div>
                </div>

                <p className="text-white text-[15px] leading-relaxed text-justify">
                  {getReviewExcerpt(review.review)}
                </p>
              </div>

              <div className="flex items-center justify-between">
                {owner && (
                  <>
                    <button
                      onClick={() => beginEdit(review)}
                      className="text-white font-bold italic hover:opacity-80 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="text-white font-bold italic hover:opacity-80 cursor-pointer"
                    >
                      Delete
                    </button>
                  </>
                )}

                {!owner && isAdmin.current && (
                  <button
                    onClick={() => handleDelete(id)}
                    className="text-white font-bold italic hover:opacity-80 cursor-pointer"
                  >
                    Delete(Admin)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
