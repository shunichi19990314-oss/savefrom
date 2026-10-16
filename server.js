const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 日本語版を最初から表示する
const TARGET = process.env.TARGET_URL || 'https://ja.savefrom.net';

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
    // 日本語を優先するヘッダーを追加
    proxyReq.setHeader('Accept-Language', 'ja,ja-JP;q=0.9,en;q=0.8');
    // 不要なヘッダーを削除
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
