const API_BASE = 'https://cinema-compass.vercel.app/api/tmdb';

async function apiRequest(path, params = {}) {
  const queryParams = new URLSearchParams(params);
  const url = `${API_BASE}${path}?${queryParams.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Backend API error: ${response.status}`);
  }

  return response.json();
}

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
function getImageUrl(path, size = 'original') {
  if (!path) return '/placeholder.png';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

async function getPopularMovies(page = 1) {
  return apiRequest('/movies/popular', { page });
}

async function getNowPlayingMovies(page = 1, region = 'US') {
  return apiRequest('/movies/now_playing', { page, region });
}

async function getMovieDetails(movieId) {
  return apiRequest(`/details/movie/${movieId}`);
}

async function getMovieCredits(movieId) {
  return apiRequest(`/credits/movie/${movieId}`);
}

async function getMovieImages(movieId) {
  return apiRequest(`/images/movie/${movieId}`);
}

async function getMovieReviews(movieId) {
  return apiRequest(`/reviews/movie/${movieId}`);
}

async function getMovieRecommendations(movieId, page = 1) {
  return apiRequest(`/recommendations/movie/${movieId}`, { page });
}

async function discoverMovies(params = {}) {
  return apiRequest('/discover/movies', params);
}

async function getMovieGenres() {
  return apiRequest('/movies/genres');
}

async function getPopularSeries(page = 1) {
  return apiRequest('/series/popular', { page });
}

async function getSeriesDetails(seriesId) {
  return apiRequest(`/details/tv/${seriesId}`);
}

async function getSeriesCredits(seriesId) {
  return apiRequest(`/credits/tv/${seriesId}`);
}

async function getSeriesImages(seriesId) {
  return apiRequest(`/images/tv/${seriesId}`);
}

async function getSeriesReviews(seriesId) {
  return apiRequest(`/reviews/tv/${seriesId}`);
}

async function getSeriesRecommendations(seriesId, page = 1) {
  return apiRequest(`/recommendations/tv/${seriesId}`, { page });
}

async function discoverSeries(params = {}) {
  return apiRequest('/discover/series', params);
}

async function getSeriesGenres() {
  return apiRequest('/series/genres');
}

async function getMediaDetails(id, isSeries = false) {
  return isSeries ? getSeriesDetails(id) : getMovieDetails(id);
}

async function getMediaCredits(id, isSeries = false) {
  return isSeries ? getSeriesCredits(id) : getMovieCredits(id);
}

async function getMediaImages(id, isSeries = false) {
  return isSeries ? getSeriesImages(id) : getMovieImages(id);
}

async function getMediaReviews(id, isSeries = false) {
  return isSeries ? getSeriesReviews(id) : getMovieReviews(id);
}

async function getMediaRecommendations(id, isSeries = false, page = 1) {
  return isSeries
    ? getSeriesRecommendations(id, page)
    : getMovieRecommendations(id, page);
}

async function searchMulti(query, page = 1) {
  return apiRequest('/search', { query, page });
}

async function getDetails(type, id) {
  return apiRequest(`/details/${type}/${id}`);
}

async function getCredits(type, id) {
  return apiRequest(`/credits/${type}/${id}`);
}

async function getImages(type, id) {
  return apiRequest(`/images/${type}/${id}`);
}

async function getReviews(type, id) {
  return apiRequest(`/reviews/${type}/${id}`);
}

async function getRecommendations(type, id, page = 1) {
  return apiRequest(`/recommendations/${type}/${id}`, { page });
}

export default {
  apiRequest,
  getImageUrl,

  getPopularMovies,
  getNowPlayingMovies,
  getMovieDetails,
  getMovieCredits,
  getMovieImages,
  getMovieReviews,
  getMovieRecommendations,
  discoverMovies,
  getMovieGenres,

  getPopularSeries,
  getSeriesDetails,
  getSeriesCredits,
  getSeriesImages,
  getSeriesReviews,
  getSeriesRecommendations,
  discoverSeries,
  getSeriesGenres,

  getMediaDetails,
  getMediaCredits,
  getMediaImages,
  getMediaReviews,
  getMediaRecommendations,

  searchMulti,
  getDetails,
  getCredits,
  getImages,
  getReviews,
  getRecommendations,
};
