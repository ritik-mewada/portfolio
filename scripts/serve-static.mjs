// Serves the static export (out/) the way GitHub Pages does, for the tests and Lighthouse:
// /dir redirects to /dir/, /dir/ serves dir/index.html, anything missing gets 404.html with a 404,
// and text is gzipped.
// Usage: node scripts/serve-static.mjs [dir=out] [port=3000]
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { createGzip } from "node:zlib";

const [root = "out", port = "3000"] = process.argv.slice(2);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const isFile = (p) => statSync(p, { throwIfNoEntry: false })?.isFile();
const isDir = (p) => statSync(p, { throwIfNoEntry: false })?.isDirectory();

const compressible = new Set([".html", ".js", ".css", ".json", ".txt", ".xml", ".webmanifest", ".svg"]);

const send = (req, res, status, file) => {
  const headers = { "Content-Type": types[extname(file)] ?? "application/octet-stream" };
  const gzip = compressible.has(extname(file)) && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "");
  if (gzip) headers["Content-Encoding"] = "gzip";
  res.writeHead(status, headers);
  const stream = createReadStream(file);
  (gzip ? stream.pipe(createGzip()) : stream).pipe(res);
};

createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const path = join(root, normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, ""));
  if (isFile(path)) return send(req, res, 200, path);
  if (isDir(path)) {
    if (!url.pathname.endsWith("/")) {
      res.writeHead(301, { Location: `${url.pathname}/${url.search}` });
      return res.end();
    }
    if (isFile(join(path, "index.html"))) return send(req, res, 200, join(path, "index.html"));
  }
  if (isFile(`${path}.html`)) return send(req, res, 200, `${path}.html`);
  send(req, res, 404, join(root, "404.html"));
}).listen(Number(port), () => console.log(`Serving ${root}/ at http://localhost:${port}`));
