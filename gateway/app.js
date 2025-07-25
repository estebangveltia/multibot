import express from 'express';
import axios from 'axios';

const RASA_REST_WEBHOOK = 'http://rasa:5005/webhooks/rest/webhook';
const app = express();

app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON payload',
      detail: err.message,
      raw: req.body
    });
  }
  next();
});

app.post('/webhook/:tenant', async (req, res) => {
  const { tenant } = req.params;
  const { sender, message } = req.body || {};

  if (!sender || !message) {
    return res.status(400).json({ error: "Missing 'sender' or 'message'" });
  }

  const rewritten_sender = `${tenant}__${sender}`;

  try {
    const response = await axios.post(RASA_REST_WEBHOOK, {
      sender: rewritten_sender,
      message,
    }, { timeout: 10000 });
    res.set(response.headers);
    return res.status(response.status).send(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: err.message };
    return res.status(status).json(data);
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Gateway running on port ${PORT}`);
});
