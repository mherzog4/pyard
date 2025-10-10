import express from "express";
import { z } from "zod";
import { search } from "./search.js";
import { addMusicArtist } from "./artists.js";
import { resetArtistsData } from "./data.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello world!");
});

app.post("/reset", (_req, res) => {
  resetArtistsData();
  return res.sendStatus(204);
});

app.get("/search", (req, res) => {
  try {
    const query = String(req.query.query || "").trim();
    const results = search(query);
    return res.status(200).json(results);
  } catch (err) {
    console.error("Error in /search:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const artistSchema = z.object({
  genre: z.string().min(1, "Genre is required"),
  artist: z.string().min(1, "Artist is required"),
});

app.post("/artists", (req, res) => {
  try {
    const parsed = artistSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request body",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { genre, artist } = parsed.data;
    addMusicArtist(genre, artist);
    return res.sendStatus(204);
  } catch (err) {
    console.error("Error in /artists:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
