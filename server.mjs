import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(fileURLToPath(new URL('.', import.meta.url)));
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.png':'image/png' };
http.createServer(async (req,res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const name = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const file = path.resolve(root, '.' + name);
    if (!file.startsWith(root + path.sep) || name.includes('/.')) { res.writeHead(403); return res.end(); }
    const body = await readFile(file);
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream'}); res.end(body);
  } catch { res.writeHead(404); res.end('Não encontrado'); }
}).listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('Danny iniciado na porta ' + (process.env.PORT || 3000)));
