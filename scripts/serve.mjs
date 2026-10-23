import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.glb': 'model/gltf-binary', '.mp4': 'video/mp4', '.md': 'text/plain' };
export async function startServer(port = 0) {
  const server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let path = resolve(ROOT, '.' + pathname);
      if (relative(ROOT, path).startsWith('..')) { res.writeHead(403).end(); return; }
      if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
      const bytes = await readFile(path);
      res.writeHead(200, { 'Content-Type': `${types[extname(path)] || 'application/octet-stream'}${/\.(html|css|js|mjs|json|md)$/.test(path) ? '; charset=utf-8' : ''}`, 'Cache-Control': 'no-cache' });
      res.end(bytes);
    } catch { res.writeHead(404).end('Not found'); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  return { server, url: `http://127.0.0.1:${server.address().port}` };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { url } = await startServer(Number(process.env.PORT || 4173));
  console.log(`MUSE + FORM: ${url}`);
}
