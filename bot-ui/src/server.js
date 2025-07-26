import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8084;
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:8000';

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// serve static
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'src/public')));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/message', async (req, res) => {
  try {
    const { tenant, sender, message } = req.body || {};
    if (!tenant || !sender || !message) {
      return res.status(400).json({ error: "tenant, sender y message son obligatorios" });
    }

    const url = `${GATEWAY_URL}/webhook/${encodeURIComponent(tenant)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender, message }),
      timeout: 15000
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }

    res.status(response.status).json({ ok: response.ok, status: response.status, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err?.message || 'unknown error' });
  }
});

app.listen(PORT, () => {
  console.log(`Bot User UI running on http://0.0.0.0:${PORT}`);
  console.log(`Proxying to gateway: ${GATEWAY_URL}`);
});
