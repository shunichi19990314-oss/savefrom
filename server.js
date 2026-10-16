const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Target Cloudflare Worker
const TARGET = process.env.TARGET_URL || 'https://savefrom.shunichi-0314.workers.dev';

app.use(cors());

// Health check (Render / Railway both need this)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', target: TARGET });
});

// Proxy all other requests
app.use('/', createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  secure: true,
  followRedirects: true,
  onProxyReq: (proxyReq, req, res) => {
    // Optional: remove some headers if needed
    proxyReq.removeHeader('x-forwarded-for');
    proxyReq.removeHeader('x-real-ip');
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(502).json({
      error: 'Bad Gateway',
      message: err.message,
      target: TARGET
    });
  }
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Proxying to: ${TARGET}`);
});
