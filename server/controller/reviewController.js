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
    const movieId = Number(req.params.movieId);
    const isSeries = req.params.type === 'series';
    if (!Number.isFinite(movieId)) {
      return res.status(400).json({ message: 'Invalid movie id' });
    }
    const maybeUserId = req.user?.id || null;
    const reviews = await reviewService.getReviewsByMovieId(
      movieId,
      isSeries,
      maybeUserId
    );
    res.status(200).json(reviews);
  } catch (e) {
    next(e);
  }
};

const addReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const movieId = Number(req.body.id);
    const isSeries = req.body.type === 'series';
    console.log(isSeries);
    if (!Number.isFinite(movieId)) {
      return res.status(400).json({ message: 'Invalid movie id' });
    }
    const reviewData = {
      author: req.user?.username || req.user?.email || 'Anonymous',
      review: req.body.review,
      rating: req.body.rating,
      isSeries,
    };
    const review = await reviewService.addReview(userId, movieId, reviewData);
    res.status(201).json(review);
  } catch (e) {
    next(e);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.reviewId;
    const data = {
      review: req.body.review,
      rating: req.body.rating,
    };
    const updated = await reviewService.updateReview(reviewId, userId, data);
    res.status(200).json(updated);
  } catch (e) {
    next(e);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.reviewId;
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
