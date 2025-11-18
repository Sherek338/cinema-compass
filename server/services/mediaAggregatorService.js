import localMediaService from './localMediaService.js';
import bannedMediaService from './bannedMediaService.js';

const aggregateMedia = async (tmdbResults = [], mediaType = null) => {
  const bannedList = await bannedMediaService.getAllBanned(
    mediaType ? { media_type: mediaType } : {}
  );
  const bannedIds = new Set(bannedList.map((b) => b.tmdbId));

  const filteredTmdb = tmdbResults.filter((item) => {
    const id = item.id;
    return id && !bannedIds.has(id);
  });

  const localMedia = await localMediaService.getAllLocalMedia(
    mediaType ? { media_type: mediaType } : {}
  );

  const localFormatted = localMedia.map((item) => {
    const formatted = {
      id: item.id,
      title: item.title,
      name: item.title,
      overview: item.overview,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      vote_average: item.vote_average,
      media_type: item.media_type,
      genre_names: item.genre_names || [],
    };

    if (item.media_type === 'movie') {
      formatted.release_date = item.release_date;
      formatted.runtime = item.runtime;
    } else {
      formatted.first_air_date = item.first_air_date;
      formatted.number_of_seasons = item.number_of_seasons;
      formatted.number_of_episodes = item.number_of_episodes;
    }

    return formatted;
  });

  return [...localFormatted, ...filteredTmdb];
};

export default {
  aggregateMedia,
};
