import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/context/authContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function UserReviews({
  movieId,
  canWrite = false,
  isSeries = false,
  title,
}) {
  const { authHeaders, isAuthenticated, user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const [text, setText] = useState('');
  const [rating, setRating] = useState(1);

  const formRef = useRef(null);

  const movieIdNumber = useMemo(() => Number(movieId), [movieId]);
  const starValue = Math.max(0, Math.min(5, Number(rating) || 0));

  const currentUserId = String(user?.id || user?._id || '');
  const currentUsername = user?.username || '';
  const currentEmailName = user?.email ? user.email.split('@')[0] : '';

  const isOwnerLocal = (r) => {
    const uid = String(r.userId || r.user || r.user_id || '');
    const author = (r.author || '').trim();
    return (
      r.isOwner === true ||
      (uid && currentUserId && uid === currentUserId) ||
      (!!currentUsername && author === currentUsername) ||
      (!!currentEmailName && author === currentEmailName)
    );
  };

  const formatReviewDate = (raw) => {
    if (!raw) return 'Unknown date';
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return 'Unknown date';
    return d.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getReviewExcerpt = (text, max = 200) => {
    if (!text) return '';
    if (text.length <= max) return text;
    return `${text.slice(0, max).trim()}...`;
  };

  async function safeJson(res) {
    try {
      return await res.json();
    } catch {
      return [];
    }
  }
  async function safeText(res) {
    try {
      return await res.text();
    } catch {
      return '';
    }
  }

  async function load() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/review/${isSeries ? 'series' : 'movie'}/${movieIdNumber}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            ...(Object.keys(authHeaders || {}).length ? authHeaders : {}),
          },
        }
      );
      if (!res.ok) {
        const msg = await safeText(res);
        throw new Error(msg || `HTTP ${res.status}`);
      }
      const data = await safeJson(res);
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (Number.isFinite(movieIdNumber)) {
      load();
    } else {
      setReviews([]);
      setLoading(false);
    }
  }, [movieIdNumber, isAuthenticated]);

  async function submitReview(e) {
    e?.preventDefault?.();
    if (!canWrite) return;
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        review: text,
        rating: Number(rating),
        id: movieIdNumber,
        type: isSeries ? 'series' : 'movie',
      };

      const res = editingId
        ? await fetch(`${API_URL}/api/review/${editingId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify(payload),
          })
        : await fetch(`${API_URL}/api/review/`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const msg = await safeText(res);
        throw new Error(msg || `HTTP ${res.status}`);
      }

      setText('');
      setRating(0);
      setEditingId(null);
      await load();
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (e) {
      setError(e.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  }

  async function removeReview(id) {
    if (!id) return;
    setDeletingId(id);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/review/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { ...authHeaders },
      });
      if (!res.ok && res.status !== 204) {
        const msg = await safeText(res);
        throw new Error(msg || `HTTP ${res.status}`);
      }
      await load();
    } catch (e) {
      setError(e.message || 'Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  }

  function beginEdit(r) {
    setEditingId(r.id || r._id);
    setText(r.review);
    setRating(r.rating);
    setTimeout(
      () =>
        formRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        }),
      0
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl md:text-2xl font-bold">
          User reviews
        </h2>
        {title ? (
          <span className="text-white/70 text-sm">
            {isSeries ? 'Series' : 'Movie'}: {title}
          </span>
        ) : null}
      </div>

      {error ? <div className="mb-4 text-sm text-red-400">{error}</div> : null}

      {canWrite ? (
        <form ref={formRef} onSubmit={submitReview} className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-white text-sm">Your rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  aria-label={`Rate ${s}`}
                  className="p-0 m-0 cursor-pointer"
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.346 8.95142C16.9889 8.37204 16.6422 7.33156 15.7862 7.27798L12.261 7.05738C11.8903 7.03428 11.5658 6.8091 11.4262 6.46642L10.1043 3.2041C9.77835 2.41007 8.67801 2.41007 8.35211 3.2041L7.03017 6.46642C6.89061 6.8091 6.56612 7.03428 6.19545 7.05738L2.67021 7.27798C1.81419 7.33156 1.46755 8.37204 2.11036 8.95142L4.85397 11.4275C5.13265 11.681 5.25236 12.0567 5.17258 12.4164L4.40378 15.8955C4.21956 16.7169 5.12146 17.3463 5.85162 16.9066L8.84871 15.131C9.17132 14.9381 9.28498 14.9381 9.60759 15.131L12.6047 16.9066C13.3348 17.3463 14.2367 16.7169 14.0525 15.8955L13.2837 12.4164C13.2039 12.0567 13.3236 11.681 13.6023 11.4275L16.346 8.95142Z"
                      fill={s <= starValue ? '#F5C519' : '#CACACA'}
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="w-full rounded-md bg-transparent border border-white/30 text-white text-sm p-3 outline-none h-40"
            placeholder="Write your review (10–1000 characters)…"
            minLength={10}
            maxLength={1000}
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />

          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-md bg-white text-black text-sm font-semibold disabled:opacity-60 hover:opacity-80 transition cursor-pointer"
            >
              {editingId ? 'Update review' : 'Post review'}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setText('');
                  setRating(0);
                }}
                className="px-4 py-2 rounded-md border border-white/30 text-white text-sm"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      ) : null}

      {loading ? (
        <div className="text-white/70 text-sm">Loading…</div>
      ) : reviews.length === 0 ? (
        <div className="text-white/70 text-sm">No reviews yet.</div>
      ) : (
        <ul className="space-y-4 grid grid-cols-4 gap-4">
          {reviews.map((r) => {
            const owner = canWrite && isOwnerLocal(r);
            return (
              <div
                className="w-full max-w-[310px] bg-coquelicot rounded-[20px] p-5"
                key={r.id}
              >
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white text-[20px] font-semibold mb-1">
                        {r.author}
                      </h3>
                      <div className="flex items-center gap-1.5 text-white text-xs">
                        <span className="font-semibold">Posted on:</span>
                        <span className="font-normal">
                          {formatReviewDate(r.createdAt)}
                        </span>
                      </div>
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
                            fill={
                              s <= (Number(r.rating) || 0)
                                ? '#F5C519'
                                : '#CACACA'
                            }
                          />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <p className="text-white text-[15px] font-normal leading-relaxed text-justify">
                      {getReviewExcerpt(r.review, 200)}
                      {r.review && r.review.length > 200 && (
                        <span className="text-white/80 text-[13px] font-semibold ml-1">
                          ...Read more
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {owner && (
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => beginEdit(r)}
                      className="text-white text-[15px] font-bold italic hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === (r.id || r._id)}
                      onClick={() => removeReview(r.id || r._id)}
                      className="text-white text-[15px] font-bold italic hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer"
                    >
                      {deletingId === (r.id || r._id) ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
}
