import ReviewModel from '../models/ReviewModel.js';
import ApiError from '../exceptions/ApiError.js';
import ReviewDTO from '../dtos/ReviewDTO.js';
import UserModel from '../models/UserModel.js';

const asDtoList = (docs, currentUserId = null) =>
  docs.map((r) => {
    const dto = new ReviewDTO(r);
    dto.isOwner =
      !!currentUserId &&
      r.user &&
      String(r.user) === String(currentUserId);
    return dto;
  });

const getReviewsByUserId = async (userId) => {
  if (!userId) {
    throw ApiError.BadRequest('User id is required');
  }
  const reviews = await ReviewModel.find({ user: userId }).sort({ createdAt: -1 });
  return asDtoList(reviews, userId);
};

const getReviewsByMovieId = async (movieId, currentUserId = null) => {
  if (!Number.isFinite(movieId)) {
    throw ApiError.BadRequest('Movie id is required');
  }
  const reviews = await ReviewModel.find({ movieId }).sort({ createdAt: -1 });
  return asDtoList(reviews, currentUserId);
};

const addReview = async (userId, movieId, data) => {
  if (!userId) throw ApiError.UnauthorizedError();
  if (!Number.isFinite(movieId)) throw ApiError.BadRequest('Invalid movie id');
  if (!data?.review?.trim()) throw ApiError.BadRequest('Review text is required');

  let authorName = data.author;
  if (!authorName) {
    const u = await UserModel.findById(userId).lean();
    authorName = u?.username || 'Anonymous';
  }

  const created = await ReviewModel.create({
    user: userId,
    author: authorName,
    review: data.review.trim(),
    rating: Number(data.rating) || 0,
    movieId,
  });

  const dto = new ReviewDTO(created);
  dto.isOwner = true;
  return dto;
};

const mustOwn = (review, userId) => {
  if (!review) throw ApiError.NotFound('Review not found');
  if (!review.user || String(review.user) !== String(userId)) {
    throw ApiError.Forbidden('You do not have permission to modify this review');
  }
};

const updateReview = async (reviewId, userId, data) => {
  if (!userId) throw ApiError.UnauthorizedError();
  const review = await ReviewModel.findById(reviewId);
  mustOwn(review, userId);

  if (typeof data.review === 'string') {
    review.review = data.review.trim();
  }
  if (data.rating !== undefined) {
    const v = Number(data.rating);
    if (Number.isNaN(v) || v < 0 || v > 5) {
      throw ApiError.BadRequest('Rating must be between 0 and 5');
    }
    review.rating = v;
  }

  await review.save();
  const dto = new ReviewDTO(review);
  dto.isOwner = true;
  return dto;
};

const deleteReview = async (reviewId, userId) => {
  if (!userId) throw ApiError.UnauthorizedError();
  const review = await ReviewModel.findById(reviewId);
  mustOwn(review, userId);
  await ReviewModel.deleteOne({ _id: reviewId });
  return true;
};

export default {
  getReviewsByUserId,
  getReviewsByMovieId,
  addReview,
  updateReview,
  deleteReview,
};
