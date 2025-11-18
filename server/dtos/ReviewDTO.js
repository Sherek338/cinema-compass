class ReviewDTO {
  constructor(review) {
    this.id = review._id?.toString?.() ?? review._id;
    this.user = review.user;
    this.author = review.author;
    this.review = review.review;
    this.rating = review.rating;
    this.movieId = review.movieId;
    this.isSeries = !!review.isSeries;
    this.createdAt = review.createdAt;
    this.isOwner = false;
  }
}

export default ReviewDTO;
