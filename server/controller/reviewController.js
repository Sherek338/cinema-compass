import reviewService from '../services/reviewService.js';

const getReviewsByUserId = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const reviews = await reviewService.getReviewsByUserId(userId);

    res.status(200).json(reviews);
  } catch (e) {
    next(e);
  }
};

const getReviewsByMovieId = async (req, res, next) => {
  try {
    const movieId = req.params.movieId;

    const reviews = await reviewService.getReviewsByMovieId(movieId);

    res.status(200).json(reviews);
  } catch (e) {
    next(e);
  }
};

const addReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const movieId = req.params.movieId;
    const review = {
      author: req.user.username,
      text: req.body.review,
      rating: req.body.rating,
    };

    const response = await reviewService.addReview(userId, movieId, review);

    res.status(201).json(response);
  } catch (e) {
    next(e);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user.id;
    const review = {
      text: req.body.review,
      rating: req.body.rating,
    };

    const response = await reviewService.updateReview(reviewId, userId, review);

    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user.id;

    await reviewService.deleteReview(reviewId, userId);

    res.status(204).send();
  } catch (e) {
    next(e);
  }
};

export default {
  getReviewsByUserId,
  getReviewsByMovieId,
  addReview,
  updateReview,
  deleteReview,
};