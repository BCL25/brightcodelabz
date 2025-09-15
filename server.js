// server.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve everything from project root (so /assets/... and /beta.html work)
app.use((req, res, next) => {
  // prevent stale caching of .txt during edits
  if (/\.(txt)$/i.test(req.url)) res.set("Cache-Control", "no-store");
  next();
});
app.use(express.static(__dirname)); // serves index.html, beta.html, /assets/*, etc.

app.use(express.json());

// Append unknowns to assets/i-dont-know.txt
app.post("/log-unknown", (req, res) => {
  const text = String(req.body?.text || "").trim();
  if (!text) return res.status(400).send("No text");
  const outPath = path.join(__dirname, "assets", "i-dont-know.txt");
  fs.appendFile(outPath, text + "\n", (err) => {
    if (err) return res.status(500).send("Write failed");
    res.send("OK");
  });
});

// Convenience route to open beta directly
app.get("/", (_req, res) => res.redirect("/beta.html"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}  (open /beta.html)`);
});