const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy the Japanese SaveFrom endpoint by default.
const TARGET_URL = process.env.TARGET_URL || 'https://ja.savefrom.net/195kT/';
const targetUrl = new URL(TARGET_URL);

if (!['http:', 'https:'].includes(targetUrl.protocol)) {
  throw new Error('TARGET_URL must use http or https');
}

// Keep the target path in the browser URL so relative links continue to work
// through the proxy. The proxy itself connects to the target origin.
if (!targetUrl.pathname.endsWith('/')) {
  targetUrl.pathname += '/';
}
const TARGET = targetUrl.origin;

app.use(cors());

// Health check (Render / Railway both need this).
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', target: targetUrl.toString() });
});

// Opening the proxy root takes the user to the configured endpoint path on
// this proxy (for example, /195kT/), not directly to the upstream website.
app.get('/', (req, res) => {
  const destination = new URL(targetUrl.toString());
  const requestUrl = new URL(req.originalUrl, 'http://proxy.local');

  // Preserve any query parameters supplied to the proxy root.
  for (const [key, value] of requestUrl.searchParams) {
    destination.searchParams.append(key, value);
  }

  res.redirect(302, `${destination.pathname}${destination.search}`);
});

// Proxy all other paths to the configured upstream origin.
app.use('/', createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  secure: true,
  followRedirects: true,
  on: {
    proxyReq: (proxyReq) => {
      // Prefer Japanese when the upstream chooses a language.
      proxyReq.setHeader('Accept-Language', 'ja,ja-JP;q=0.9,en;q=0.8');
      proxyReq.removeHeader('x-forwarded-for');
      proxyReq.removeHeader('x-real-ip');
    },
    error: (err, req, res) => {
      console.error('Proxy error:', err.message);
      if (!res || res.headersSent) {
        if (res && !res.writableEnded) res.end();
        return;
      }

      res.status(502).json({
        error: 'Bad Gateway',
        message: err.message,
        target: TARGET_URL
      });
    }
  }
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Proxying to: ${targetUrl.toString()}`);
});
