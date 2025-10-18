
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start(){
  const app = express();
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'custom' });
  app.use(vite.middlewares);
  app.use('*', async (req, res, next) => {
    try {
      let template = `
<!doctype html>
<html>
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Polyglot Web</title></head>
  <body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body>
</html>`;
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) { vite.ssrFixStacktrace(e); next(e); }
  });
  app.listen(3000, ()=> console.log('Web dev on http://localhost:3000'));
}
start();
