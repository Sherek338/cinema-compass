class ReviewDTO {
  constructor(review) {
    this.id = review._id;
    this.review = review.review;
    this.rating = review.rating;
    this.movieId = review.movieId;
    this.createdAt = review.createdAt;
    this.author = review.author;
    this.userId = review.user;
  }
}

export default ReviewDTO;
