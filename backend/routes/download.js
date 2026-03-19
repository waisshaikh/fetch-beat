const express = require("express");
const router = express.Router();
const axios = require("axios");

// Extract videoId from any YouTube URL format
function extractVideoId(url) {
  try {
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];
    const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (longMatch) return longMatch[1];
    const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];
    return null;
  } catch {
    return null;
  }
}

router.post("/convert", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "YouTube URL is required" });

  const videoId = extractVideoId(url);
  if (!videoId) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  console.log("Extracted videoId:", videoId);

  try {
    const options = {
      method: "GET",
      url: "https://youtube-media-downloader.p.rapidapi.com/v2/video/details",
      params: { videoId },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "youtube-media-downloader.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    const data = response.data;

    // Log the full audios field to understand its structure
    console.log("audios type:", typeof data.audios);
    console.log("audios value:", JSON.stringify(data.audios, null, 2));
    console.log("videos sample:", JSON.stringify(data.videos?.slice?.(0,2) || data.videos, null, 2));

    if (!data || !data.title) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Handle audios — could be array, object, or nested
    let audioUrl = null;

    if (Array.isArray(data.audios) && data.audios.length > 0) {
      // Standard array
      audioUrl = data.audios[0]?.url || null;
    } else if (data.audios && typeof data.audios === "object") {
      // Could be { items: [...] } or direct object with url
      if (Array.isArray(data.audios.items) && data.audios.items.length > 0) {
        audioUrl = data.audios.items[0]?.url || null;
      } else if (data.audios.url) {
        audioUrl = data.audios.url;
      }
    }

    // Fallback: check videos array for audio-only streams
    if (!audioUrl) {
      const videosArr = Array.isArray(data.videos)
        ? data.videos
        : Array.isArray(data.videos?.items)
        ? data.videos.items
        : [];

      const audioOnly = videosArr.find(
        (v) => v.hasAudio === true && v.hasVideo === false
      );
      if (audioOnly) audioUrl = audioOnly.url;

      // Last resort: first video with audio
      if (!audioUrl) {
        const withAudio = videosArr.find((v) => v.hasAudio === true);
        if (withAudio) audioUrl = withAudio.url;
      }
    }

    console.log("Final audioUrl:", audioUrl ? "FOUND" : "NOT FOUND");

    // Thumbnail
    let thumbnail = null;
    const thumbArr = Array.isArray(data.thumbnails)
      ? data.thumbnails
      : Array.isArray(data.thumbnails?.items)
      ? data.thumbnails.items
      : [];
    if (thumbArr.length > 0) {
      thumbnail = thumbArr[thumbArr.length - 1]?.url || thumbArr[0]?.url;
    }

    res.json({
      title: data.title,
      duration: data.lengthSeconds || 0,
      thumbnail,
      audioUrl,
    });
  } catch (err) {
    console.error("Convert error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to fetch video.",
      detail: err.response?.data || err.message,
    });
  }
});

// Proxy download
router.get("/proxy-download", async (req, res) => {
  const { audioUrl, title } = req.query;
  if (!audioUrl) return res.status(400).json({ error: "No audio URL provided" });

  try {
    const response = await axios.get(decodeURIComponent(audioUrl), {
      responseType: "stream",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://www.youtube.com/",
      },
    });

    const safeTitle = (title || "audio").replace(/[^a-z0-9\s\-_]/gi, "").trim();
    res.setHeader("Content-Disposition", 'attachment; filename="' + safeTitle + '.mp3"');
    res.setHeader("Content-Type", "audio/mpeg");
    response.data.pipe(res);
  } catch (err) {
    console.error("Download error:", err.message);
    res.status(500).json({ error: "Download failed." });
  }
});

module.exports = router;