```js
require("dotenv").config();

const https = require("https");

const API_KEY = process.env.YOUTUBE_API_KEY;

function fetchYoutube(apiUrl) {
  return new Promise(function (resolve, reject) {
    https
      .get(apiUrl, function (apiRes) {
        let data = "";

        apiRes.on("data", function (chunk) {
          data += chunk;
        });

        apiRes.on("end", function () {
          resolve({
            status: apiRes.statusCode || 200,
            data: data
          });
        });
      })
      .on("error", function (err) {
        reject(err);
      });
  });
}

module.exports = async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "*"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const pathname = req.url.split("?")[0];
  const queryString = req.url.split("?")[1] || "";

  const params = new URLSearchParams(queryString);

  console.log("Request:", pathname);

  try {
    // SEARCH CHANNEL
    if (pathname === "/api/search-channel") {
      const q = params.get("q") || "";

      const apiUrl =
        "https://www.googleapis.com/youtube/v3/search" +
        "?part=snippet" +
        "&type=channel" +
        "&q=" + encodeURIComponent(q) +
        "&maxResults=1" +
        "&key=" + API_KEY;

      const result = await fetchYoutube(apiUrl);

      res.setHeader("Content-Type", "application/json");
      return res.status(result.status).send(result.data);
    }

    // CHANNEL DETAILS
    if (pathname === "/api/channel-details") {
      const id = params.get("id") || "";

      const apiUrl =
        "https://www.googleapis.com/youtube/v3/channels" +
        "?part=snippet,statistics" +
        "&id=" + encodeURIComponent(id) +
        "&key=" + API_KEY;

      const result = await fetchYoutube(apiUrl);

      res.setHeader("Content-Type", "application/json");
      return res.status(result.status).send(result.data);
    }

    // CHANNEL VIDEOS
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

      const result = await fetchYoutube(apiUrl);

      res.setHeader("Content-Type", "application/json");
      return res.status(result.status).send(result.data);
    }

    // VIDEO DETAILS
    if (pathname === "/api/video-details") {
      const ids = params.get("ids") || "";

      const apiUrl =
        "https://www.googleapis.com/youtube/v3/videos" +
        "?part=snippet,statistics,contentDetails" +
        "&id=" + encodeURIComponent(ids) +
        "&key=" + API_KEY;

      const result = await fetchYoutube(apiUrl);

      res.setHeader("Content-Type", "application/json");
      return res.status(result.status).send(result.data);
    }

    return res.status(404).send("API route not found");
  } catch (error) {
    console.error("Server Error:", error);

    return res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
};
```
