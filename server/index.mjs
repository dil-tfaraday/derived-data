import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import basicAuth from "express-basic-auth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");
const port = Number.parseInt(String(process.env.PORT || 8080), 10);

const password = process.env.SITE_PASSWORD;
const user = process.env.SITE_USER || "viewer";

if (!password || password.length < 8) {
  console.error(
    "SITE_PASSWORD must be set to a secret of at least 8 characters (use: fly secrets set SITE_PASSWORD=...)"
  );
  process.exit(1);
}

const app = express();

/** Fly health checks — must not require auth */
app.get("/healthz", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send("ok");
});

/** Discourage indexing even if a link leaks */
app.get("/robots.txt", (_req, res) => {
  res.type("text/plain");
  res.send("User-agent: *\nDisallow: /\n");
});

app.use((_req, res, next) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  next();
});

app.use(
  basicAuth({
    users: { [user]: password },
    challenge: true,
    realm: "Derived data prototype",
  })
);

app.use(express.static(distDir, { index: false, maxAge: "1h" }));

app.get("*", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on ${port} (basic auth user: ${user})`);
});
