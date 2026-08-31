```js
require("dotenv").config();

const https = require("https");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.YOUTUBE_API_KEY;

// YouTube API request
function fetchYoutube(apiUrl) {
  return new Promise((resolve, reject) => {
    https
      .get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
          data += chunk;
        });

        apiRes.on("end", () => {
          resolve({
            status: apiRes.statusCode || 200,
            data: data,
          });
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// Vercel serverless function
module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const pathname = new URL(
    req.url,
    `https://${req.headers.host || "localhost"}`
  ).pathname;

  console.log("Request:", pathname);

  try {
    // =========================
    // SEARCH CHANNEL
    // =========================
    if (pathname === "/api/search-channel") {
      const q = req.query.q || "";

      const apiUrl =
        `https://www.googleapis.com/youtube/v3/search` +
        `?part=snippet` +
        `&type=channel` +
        `&q=${encodeURIComponent(q)}` +
        `&maxResults=1` +
        `&key=${API_KEY}`;

      const result = await fetchYoutube(apiUrl);

      res.setHeader("Content-Type", "application/json");
      return res.status(result.status).send(result.data);
    }

    // =========================
    // CHANNEL DETAILS
    // =========================
    if (pathname === "/api/channel-details") {
      const id = req.query.id || "";

      const apiUrl =
        `https://www.googleapis.com/youtube/v3/channels` +
        `?part=snippet,statistics` +
        `&id=${encodeURIComponent(id)}` +
        `&key=${API_KEY}`;

      const result = await fetchYoutube(apiUrl);

      res.setHeader("Content-Type", "application/json");
      return res.status(result.status).send(result.data);
    }

    // =========================
    // CHANNEL VIDEOS
    // =========================
    if (pathname === "/api/channel-videos") {
      const channelId = req.query.channelId || "";
      const maxResults = req.query.maxResults || "8";

      const apiUrl =
        `https://www.googleapis.com/youtube/v3/search` +
        `?part=snippet` +
        `&channelId=${encodeURIComponent(channelId)}` +
        `&maxResults=${encodeURIComponent(maxResults)}` +
        `&order=date` +
        `&type=video` +
        `&key=${API_KEY}`;

      const result = await fetchYoutube(apiUrl);

      res.setHeader("Content-Type", "application/json");
      return res.status(result.status).send(result.data);
    }

    // =========================
    // VIDEO DETAILS
    // =========================
    if (pathname === "/api/video-details") {
      const ids = req.query.ids || "";

      const apiUrl =
        `https://www.googleapis.com/youtube/v3/videos` +
        `?part=snippet,statistics,contentDetails` +
        `&id=${encodeURIComponent(ids)}` +
        `&key=${API_KEY}`;

      const result = await fetchYoutube(apiUrl);

      res.setHeader("Content-Type", "application/json");
      return res.status(result.status).send(result.data);
    }

    // =========================
    // FRONTEND FILES
    // =========================

    let requestedPath = pathname;

    if (requestedPath === "/") {
      requestedPath = "/index.html";
    }

    const filePath = path.join(
      process.cwd(),
      requestedPath.replace(/^\/+/, "")
    );

    // Security: don't allow files outside project
    const projectRoot = path.resolve(process.cwd());
    const resolvedFile = path.resolve(filePath);

    if (
      resolvedFile !== projectRoot &&
      !resolvedFile.startsWith(projectRoot + path.sep)
    ) {
      return res.status(403).send("Forbidden");
    }

    if (!fs.existsSync(resolvedFile)) {
      return res
        .status(404)
        .send("File nahi mili: " + requestedPath);
    }

    const ext = path.extname(resolvedFile).toLowerCase();

    const mimeTypes = {
      ".html": "text/html; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
      ".webp": "image/webp",
    };

    const contentType =
      mimeTypes[ext] || "application/octet-stream";

    const content = fs.readFileSync(resolvedFile);

    res.setHeader("Content-Type", contentType);
    return res.status(200).send(content);
  } catch (error) {
    console.error("Server Error:", error);

    return res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
};
```
