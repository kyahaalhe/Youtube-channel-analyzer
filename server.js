require('dotenv').config();

const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.YOUTUBE_API_KEY;
const PORT = process.env.PORT || 3000;

function fetchYoutube(apiUrl, res) {
  https.get(apiUrl, (apiRes) => {
    let data = "";
    apiRes.on("data", chunk => data += chunk);
    apiRes.on("end", () => {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      });
      res.end(data);
    });
  }).on("error", (err) => {
    res.writeHead(500, { "Access-Control-Allow-Origin": "*" });
    res.end(JSON.stringify({ error: err.message }));
  });
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;
  const q = parsed.query;

  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*"
    });
    res.end();
    return;
  }

  console.log("Request:", pathname);

  if (pathname === "/api/search-channel") {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(q.q || "")}&maxResults=1&key=${API_KEY}`;
    fetchYoutube(apiUrl, res);

  } else if (pathname === "/api/channel-details") {
    const apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${q.id}&key=${API_KEY}`;
    fetchYoutube(apiUrl, res);

  } else if (pathname === "/api/channel-videos") {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${q.channelId}&maxResults=${q.maxResults || 8}&order=date&type=video&key=${API_KEY}`;
    fetchYoutube(apiUrl, res);

  } else if (pathname === "/api/video-details") {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${q.ids}&key=${API_KEY}`;
    fetchYoutube(apiUrl, res);

  } else {
    let filePath = "." + pathname;
    if (filePath === "./") filePath = "./index.html";

    const ext = path.extname(filePath);
    const mimeTypes = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".ico": "image/x-icon"
    };
    const contentType = mimeTypes[ext] || "text/plain";

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end("File nahi mili: " + filePath);
      } else {
        res.writeHead(200, {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*"
        });
        res.end(content);
      }
    });
  }
});

server.listen(PORT, () => {
  console.log("✅ Server chal raha hai: http://localhost:" + PORT);
  console.log("Band karne ke liye Ctrl+C dabao");
});
