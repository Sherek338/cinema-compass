import ReviewModel from '../models/ReviewModel.js';
import ApiError from '../exceptions/ApiError.js';
import ReviewDTO from '../dtos/ReviewDTO.js';
import UserModel from '../models/UserModel.js';

const getReviewsByUserId = async (userId) => {
  if (!userId) {
    throw ApiError.BadRequest('User id is required');
  }

  const reviews = await ReviewModel.find({ user: userId });
  const reviewDTOs = [];
  for (const review of reviews) {
    reviewDTOs.push(new ReviewDTO(review));
  }

  return reviewDTOs;
};

const getReviewsByMovieId = async (movieId) => {
  if (!movieId) {
    throw ApiError.BadRequest('Movie id is required');
  }

  const reviews = await ReviewModel.find({ movieId });
  const reviewDTOs = [];
  for (const review of reviews) {
    reviewDTOs.push(new ReviewDTO(review));
  }

  return reviewDTOs;
};

const addReview = async (userId, movieId, review) => {
  if (!userId || !movieId) {
    throw ApiError.BadRequest('User id and Movie id are required');
  }

  const newReview = await ReviewModel.create({
    user: userId,
    movieId,
    rating: review.rating,
    review: review.text,
    author: review.author,
  });

  const reviewDTO = new ReviewDTO(newReview);

  return reviewDTO;
};

const updateReview = async (reviewId, userId, review) => {
  if (!reviewId) {
    throw ApiError.BadRequest('Review id is required');
  }

  const existingReview = await ReviewModel.findById(reviewId);
  if (!existingReview) {
    throw ApiError.NotFound('Review not found');
  }

  if (!checkReviewOwnership(userId, existingReview)) return;

  existingReview.review = review.text;
  existingReview.rating = review.rating;
  await existingReview.save();

  const reviewDTO = new ReviewDTO(existingReview);

  return reviewDTO;
};

const deleteReview = async (reviewId, userId) => {
  if (!reviewId) {
    throw ApiError.BadRequest('Review id is required');
  }

  const existingReview = await ReviewModel.findById(reviewId);
  if (!existingReview) {
    throw ApiError.NotFound('Review not found');
  }

  if (!checkReviewOwnership(userId, existingReview)) return;

  await ReviewModel.findByIdAndDelete(reviewId);
};

const checkReviewOwnership = (userId, review) => {
  if (review.user.toString() !== userId) {
    throw ApiError.Forbidden(
      'You do not have permission to modify this review'
    );
  }
  return true;
};

export default {
  getReviewsByUserId,
  getReviewsByMovieId,
  addReview,
  updateReview,
  deleteReview,
};