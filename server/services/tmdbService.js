import BannedMedia from '../models/BannedMediaModel.js';
import LocalMedia from '../models/LocalMediaModel.js';
import axios from 'axios';

const TMDB_BASE = 'https://api.themoviedb.org/3';

export async function tmdbRequest(path, params = {}) {
  const response = await axios.get(`${TMDB_BASE}${path}`, {
    params: {
      api_key: process.env.TMDB_API_KEY,
      language: 'en-US',
      ...params,
    },
  });

  return response.data;
}

export async function processList(type, fetchFn, page = 1, targetCount = 20) {
  let results = [];
  let currentPage = page;

  const bannedIds = await BannedMedia.find({ type }).distinct('tmdb_id');

  const localItems = await LocalMedia.find({ type }).lean();

  results.push(...localItems);

  while (results.length < targetCount) {
    const tmdbData = await fetchFn(currentPage);

    const pageResults = tmdbData.results.filter(
      (item) => !bannedIds.includes(item.id)
    );

    results.push(...pageResults);

    if (currentPage >= tmdbData.total_pages) break;

    currentPage++;
  }

  return results.slice(0, targetCount);
}
