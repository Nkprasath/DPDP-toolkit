import express from 'express';
import Consent from '../models/Consent.js';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    const ua = req.headers['user-agent'] || null;
    const { principal_identifier, categories, action, consent_text, meta } = req.body;

    if (!action) return res.status(400).json({ ok: false, error: 'missing_action' });

    const consent = new Consent({
      principal_identifier: principal_identifier || null,
      categories: categories || { essential: true, functional: false, analytics: false },
      action,
      consent_text: consent_text || null,
      ip,
      user_agent: ua,
      meta: meta || {}
    });

    await consent.save();
    return res.status(201).json({ ok: true, id: consent._id });
  } catch (err) {
    console.error('POST /api/consent error', err);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const limit = Math.min(200, parseInt(req.query.limit || '100', 10));
    const docs = await Consent.find().sort({ createdAt: -1 }).limit(limit).lean();
    return res.json({ ok: true, count: docs.length, data: docs });
  } catch (err) {
    console.error('GET /api/consent error', err);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
});

export default router;
