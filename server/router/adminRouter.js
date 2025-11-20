import express from 'express';
import BannedMedia from '../models/BannedMediaModel.js';
import LocalMedia from '../models/LocalMediaModel.js';

const router = express.Router();

router.get('/banned', async (req, res) => {
  const items = await BannedMedia.find().lean();
  res.json(items);
});

router.post('/banned', async (req, res) => {
  try {
    const { tmdb_id, type, reason } = req.body;
    if (!tmdb_id || !type) {
      return res.status(400).json({ error: 'tmdb_id and type is mandatory' });
    }

    const exists = await BannedMedia.findOne({ tmdb_id, type });
    if (exists) return res.status(409).json({ error: 'Have already banned' });

    const item = await BannedMedia.create({
      tmdb_id,
      type,
      reason: reason || '',
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/banned/:mongoId', async (req, res) => {
  try {
    const deleted = await BannedMedia.findByIdAndDelete(req.params.mongoId);
    if (!deleted) return res.status(404).json({ error: 'Not found' });

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Invalid MongoDB ID' });
  }
});

router.get('/local', async (req, res) => {
  const items = await LocalMedia.find().lean();
  res.json(items);
});

router.post('/local', async (req, res) => {
  try {
    const { type, title } = req.body;

    if (!type || !title) {
      return res.status(400).json({ error: 'type and title is mandatory' });
    }

    const item = await LocalMedia.create(req.body);

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/local/:mongoId', async (req, res) => {
  try {
    const deleted = await LocalMedia.findByIdAndDelete(req.params.mongoId);
    if (!deleted) return res.status(404).json({ error: 'Not found' });

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Invalid MongoDB ID' });
  }
});

export default router;
