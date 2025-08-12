import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './db.js';
import consentRoutes from './routes/consent.js';
import dsarRoutes from './routes/dsar.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));

// health
app.get('/_health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// routes
app.use('/api/consent', consentRoutes);
app.use('/api/dsar', dsarRoutes);

// connect db then start server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Failed to connect DB - exiting', err);
  process.exit(1);
});
