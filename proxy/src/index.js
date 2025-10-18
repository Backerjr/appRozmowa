// proxy/src/index.js (Example - Adapt to your actual code)
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 80; // Should match the port exposed by Docker

// --- Make sure you have installed http-proxy-middleware ---
// --- cd proxy && npm install http-proxy-middleware ---

// Proxy API requests to the backend ('app' service)
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://app:3000', // Target the 'app' service name from docker-compose.yml
    changeOrigin: true,
    // No specific WebSocket handling needed for the API in this example
  }),
);

// Proxy other requests (including root '/') to the Vite dev server ('web' service)
app.use(
  '/',
  createProxyMiddleware({
    target: 'http://web:5173', // Target the 'web' service name and Vite port
    changeOrigin: true,
    ws: true, // ***** IMPORTANT: Enable WebSocket proxying for Vite HMR *****
  }),
);

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
