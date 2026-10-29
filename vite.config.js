import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// Local Vite Dev Middleware for Serverless APIs (/api/send-email, /api/bookings, /api/rooms)
function localApiMiddleware() {
  return {
    name: 'ash-local-api-middleware',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '');
      Object.assign(process.env, env);

      const registerApiRoute = (routePath, modulePath) => {
        server.middlewares.use(routePath, async (req, res) => {
          if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.statusCode = 200;
            res.end();
            return;
          }

          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', async () => {
            try {
              const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
              const query = Object.fromEntries(url.searchParams.entries());

              const handlerModule = await server.ssrLoadModule(modulePath);
              const handler = handlerModule.default;

              let parsedBody = {};
              if (body) {
                try {
                  parsedBody = JSON.parse(body);
                } catch (e) {
                  parsedBody = body;
                }
              }

              const mockReq = {
                method: req.method,
                body: parsedBody,
                query,
                headers: req.headers,
                url: req.url
              };

              const mockRes = {
                statusCode: 200,
                headers: {},
                setHeader(k, v) {
                  this.headers[k] = v;
                  res.setHeader(k, v);
                },
                status(code) {
                  this.statusCode = code;
                  res.statusCode = code;
                  return this;
                },
                json(data) {
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = this.statusCode || 200;
                  res.end(JSON.stringify(data));
                },
                end(data) {
                  res.end(data);
                }
              };

              await handler(mockReq, mockRes);
            } catch (err) {
              console.error(`[Vite Local ${routePath} Error]:`, err);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        });
      };

      registerApiRoute('/api/send-email', '/api/send-email.js');
      registerApiRoute('/api/bookings', '/api/bookings.js');
      registerApiRoute('/api/rooms', '/api/rooms.js');
    }
  };
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    localApiMiddleware()
  ],
  server: {
    port: 5173,
    open: false
  }
});
