```js
const https = require("https");

const API_KEY = process.env.YOUTUBE_API_KEY;

function fetchYoutube(apiUrl) {
  return new Promise((resolve, reject) => {
    https.get(apiUrl, (apiRes) => {
      let data = "";

      apiRes.on("data", (chunk) => {
        data += chunk;
      });

      apiRes.on("end", () => {
        resolve({
          status: apiRes.statusCode || 200,
          data: data
        });
      });

    }).on("error", (error) => {
      reject(error);
    });
  });
}

module.exports = async (req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const url = new URL(
    req.url,
    "https://" + (req.headers.host || "localhost")
  );

  const pathname = url.pathname;
  const params = url.searchParams;

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


    return res.status(404).json({
      error: "API route not found",
      path: pathname
    });

  } catch (error) {

    console.error("FUNCTION ERROR:", error);

    return res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
};
```
