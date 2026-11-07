/* Optional local server: Node.js only. This is not part of website runtime. */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};
http
  .createServer(function (request, response) {
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
    } catch {
      response.writeHead(400);
      response.end("Invalid URL");
      return;
    }
    const filename = path.resolve(
      root,
      "." + (pathname === "/" ? "/index.html" : pathname),
    );
    if (!filename.startsWith(root + path.sep) || /(?:^|\/)\./.test(pathname)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    fs.readFile(filename, function (error, contents) {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      response.writeHead(200, {
        "Content-Type": types[path.extname(filename)] || "text/plain",
      });
      response.end(contents);
    });
  })
  .listen(4173, "127.0.0.1", function () {
    console.log("Ember & Spice: http://127.0.0.1:4173 — press Ctrl+C to stop.");
  });
