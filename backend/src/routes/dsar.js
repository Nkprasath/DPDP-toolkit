import express from 'express';
import DsarRequest from '../models/DsarRequest.js';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { principal_identifier, contact, type, details } = req.body;
    if (!principal_identifier || !type) return res.status(400).json({ ok: false, error: 'missing_fields' });

    const dsar = await DsarRequest.create({ principal_identifier, contact, type, details });
    return res.status(201).json({ ok: true, id: dsar._id });
  } catch (err) {
    console.error('POST /api/dsar error', err);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const limit = Math.min(200, parseInt(req.query.limit || '100', 10));
    const docs = await DsarRequest.find().sort({ createdAt: -1 }).limit(limit).lean();
    return res.json({ ok: true, count: docs.length, data: docs });
  } catch (err) {
    console.error('GET /api/dsar error', err);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const dsar = await DsarRequest.findById(req.params.id).lean();
    if (!dsar) return res.status(404).json({ ok: false, error: 'not_found' });
    return res.json({ ok: true, data: dsar });
  } catch (err) {
    console.error('GET /api/dsar/:id error', err);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
});

router.post('/:id/resolve', async (req, res) => {
  try {
    const dsar = await DsarRequest.findById(req.params.id);
    if (!dsar) return res.status(404).json({ ok: false, error: 'not_found' });
    dsar.status = 'resolved';
    dsar.resolvedAt = new Date();
    await dsar.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error('POST /api/dsar/:id/resolve error', err);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
});

export default router;
