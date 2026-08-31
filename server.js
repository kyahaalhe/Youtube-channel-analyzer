```js
const https = require("https");

const API_KEY = process.env.YOUTUBE_API_KEY;

function youtubeRequest(apiUrl, res) {
  https.get(apiUrl, (apiRes) => {
    let data = "";

    apiRes.on("data", (chunk) => {
      data += chunk;
    });

    apiRes.on("end", () => {
      res.status(apiRes.statusCode || 200);
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send(data);
    });

  }).on("error", (error) => {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  });
}

module.exports = function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const url = new URL(
    req.url,
    "https://" + req.headers.host
  );

  const pathname = url.pathname;
  const params = url.searchParams;

  console.log("Request:", pathname);

  // =========================
  // SEARCH CHANNEL
  // =========================

  if (pathname === "/api/search-channel") {

    const q = params.get("q") || "";

    const apiUrl =
      "https://www.googleapis.com/youtube/v3/search" +
      "?part=snippet" +
      "&type=channel" +
      "&q=" + encodeURIComponent(q) +
      "&maxResults=1" +
      "&key=" + API_KEY;

    return youtubeRequest(apiUrl, res);
  }


  // =========================
  // CHANNEL DETAILS
  // =========================

  if (pathname === "/api/channel-details") {

    const id = params.get("id") || "";

    const apiUrl =
      "https://www.googleapis.com/youtube/v3/channels" +
      "?part=snippet,statistics" +
      "&id=" + encodeURIComponent(id) +
      "&key=" + API_KEY;

    return youtubeRequest(apiUrl, res);
  }


  // =========================
  // CHANNEL VIDEOS
  // =========================

  if (pathname === "/api/channel-videos") {

    const channelId = params.get("channelId") || "";
    const maxResults = params.get("maxResults") || "8";

    const apiUrl =
      "https://www.googleapis.com/youtube/v3/search" +
      "?part=snippet" +
      "&channelId=" + encodeURIComponent(channelId) +
      "&maxResults=" + encodeURIComponent(maxResults) +
      "&order=date" +
      "&type=video" +
      "&key=" + API_KEY;

    return youtubeRequest(apiUrl, res);
  }


  // =========================
  // VIDEO DETAILS
  // =========================

  if (pathname === "/api/video-details") {

    const ids = params.get("ids") || "";

    const apiUrl =
      "https://www.googleapis.com/youtube/v3/videos" +
      "?part=snippet,statistics,contentDetails" +
      "&id=" + encodeURIComponent(ids) +
      "&key=" + API_KEY;

    return youtubeRequest(apiUrl, res);
  }


  // =========================
  // UNKNOWN API
  // =========================

  return res.status(404).json({
    error: "API route not found",
    path: pathname
  });
};
```
