import type { Plugin } from 'vite';
import { handleContact, type ContactEnvironment } from './contact';

// Development-only adapter. Vercel runs api/contact.ts in production.
export function contactApi(env: ContactEnvironment): Plugin {
  return {
    name: 'local-contact-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split('?')[0] !== '/api/contact') return next();
        try {
          const chunks: Buffer[] = [];
          let size = 0;
          for await (const chunk of req) {
            size += chunk.length;
            if (size > 16384) {
              res.writeHead(413, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'El mensaje es demasiado grande.' }));
              return;
            }
            chunks.push(Buffer.from(chunk));
          }
          const headers = new Headers();
          for (const [name, value] of Object.entries(req.headers)) {
            if (value) headers.set(name, Array.isArray(value) ? value.join(',') : value);
          }
          const method = req.method ?? 'GET';
          const response = await handleContact(new Request('http://localhost/api/contact', {
            method, headers,
            ...(method !== 'GET' && method !== 'HEAD' ? { body: Buffer.concat(chunks).toString('utf8') } : {}),
          }), env);
          res.writeHead(response.status, Object.fromEntries(response.headers));
          res.end(await response.text());
        } catch {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No se pudo procesar el formulario.' }));
        }
      });
    },
  };
}
