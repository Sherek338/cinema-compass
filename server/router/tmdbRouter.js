import express from 'express';
import { tmdbRequest, processList } from '../services/tmdbService.js';

const router = express.Router();

router.get('/details/:type/:id', async (req, res) => {
  try {
    const data = await tmdbRequest(`/${req.params.type}/${req.params.id}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/credits/:type/:id', async (req, res) => {
  try {
    const data = await tmdbRequest(
      `/${req.params.type}/${req.params.id}/credits`
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/images/:type/:id', async (req, res) => {
  try {
    const data = await tmdbRequest(
      `/${req.params.type}/${req.params.id}/images`,
      {
        include_image_language: 'en,null',
      }
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/reviews/:type/:id', async (req, res) => {
  try {
    const data = await tmdbRequest(
      `/${req.params.type}/${req.params.id}/reviews`
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/recommendations/:type/:id', async (req, res) => {
  try {
    const page = Number(req.query.page || 1);

    const data = await processList(
      req.params.type,
      (p) =>
        tmdbRequest(`/${req.params.type}/${req.params.id}/recommendations`, {
          page: p,
        }),
      page,
      20
    );

    res.json({ results: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/movies/popular', async (req, res) => {
  try {
    const page = Number(req.query.page || 1);

    const movies = await processList(
      'movie',
      (p) => tmdbRequest('/movie/popular', { page: p }),
      page,
      20
    );

    res.json({ results: movies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/movies/now_playing', async (req, res) => {
  try {
    const page = Number(req.query.page || 1);

    const movies = await processList(
      'movie',
      (p) =>
        tmdbRequest('/movie/now_playing', {
          page: p,
          region: req.query.region || 'US',
        }),
      page,
      20
    );

    res.json({ results: movies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/movies/genres', async (req, res) => {
  try {
    const data = await tmdbRequest('/genre/movie/list');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/discover/movies', async (req, res) => {
  try {
    const movies = await processList(
      'movie',
      (p) =>
        tmdbRequest('/discover/movie', {
          sort_by: 'popularity.desc',
          include_adult: 'false',
          include_video: 'false',
          page: p,
          ...req.query,
        }),
      Number(req.query.page || 1),
      20
    );

    res.json({ results: movies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/series/popular', async (req, res) => {
  try {
    const page = Number(req.query.page || 1);

    const series = await processList(
      'tv',
      (p) => tmdbRequest('/tv/popular', { page: p }),
      page,
      20
    );

    res.json({ results: series });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/series/genres', async (req, res) => {
  try {
    const data = await tmdbRequest('/genre/tv/list');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/discover/series', async (req, res) => {
  try {
    const series = await processList(
      'tv',
      (p) =>
        tmdbRequest('/discover/tv', {
          sort_by: 'popularity.desc',
          include_adult: 'false',
          include_null_first_air_dates: 'false',
          page: p,
          ...req.query,
        }),
      Number(req.query.page || 1),
      20
    );

    res.json({ results: series });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const page = Number(req.query.page || 1);

    const results = await processList(
      'movie',
      (p) =>
        tmdbRequest('/search/multi', {
          query: req.query.query,
          page: p,
          include_adult: 'false',
        }),
      page,
      20
    );

    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
