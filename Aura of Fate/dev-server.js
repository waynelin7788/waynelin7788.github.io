const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 5173);
const logPath = path.join(root, "server.log");

function log(message) {
  fs.appendFileSync(logPath, `${new Date().toISOString()} ${message}\n`);
}

process.on("uncaughtException", (error) => {
  log(`uncaughtException: ${error.stack || error.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  log(`unhandledRejection: ${error?.stack || error}`);
  process.exit(1);
});

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

http
  .createServer((request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const decodedPath = decodeURIComponent(url.pathname);
    const target = decodedPath === "/" ? "/index.html" : decodedPath;
    const filePath = path.normalize(path.join(root, target));

    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      response.end(content);
    });
  })
  .listen(port, "127.0.0.1", () => {
    const message = `Aura of Fate is running at http://127.0.0.1:${port}/`;
    log(message);
    console.log(message);
  });
