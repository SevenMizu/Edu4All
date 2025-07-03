// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy API calls to Spring Boot
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );

  // Proxy WebSocket calls to Spring Boot
  app.use(
    '/ws',
    createProxyMiddleware({
      target: 'ws://localhost:8080',
      ws: true,
      changeOrigin: true,
    })
  );
};
