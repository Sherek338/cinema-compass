import axios from 'axios';

export async function banMedia(tmdb_id, type, reason = '') {
  const res = await axios.post(
    '/api/admin/banned',
    { tmdb_id, type, reason },
    { withCredentials: true }
  );
  return res.data;
}

export async function unbanMedia(mongoId) {
  const res = await axios.delete(`/api/admin/banned/${mongoId}`, {
    withCredentials: true,
  });
  return res.data;
}

export async function getBannedList() {
  const res = await axios.get('/api/admin/banned', { withCredentials: true });
  return res.data;
}

export async function unbanByTmdb(tmdb_id, type) {
  const list = await getBannedList();
  const item = list.find((x) => x.tmdb_id === tmdb_id && x.type === type);

  if (!item) throw new Error('Not banned');

  return unbanMedia(item._id);
}
