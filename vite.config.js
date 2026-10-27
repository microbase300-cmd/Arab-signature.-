import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// Local Vite Dev Middleware for Serverless /api/send-email
function localApiMiddleware() {
  return {
    name: 'ash-local-api-middleware',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '');
      Object.assign(process.env, env);

      server.middlewares.use('/api/send-email', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.statusCode = 200;
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            // Import the serverless handler dynamically
            const handlerModule = await server.ssrLoadModule('/api/send-email.js');
            const handler = handlerModule.default;

            const parsedBody = body ? JSON.parse(body) : {};
            const mockReq = {
              method: 'POST',
              body: parsedBody,
              headers: req.headers
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
            console.error('[Vite Local Send-Email Error]:', err);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      });
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
