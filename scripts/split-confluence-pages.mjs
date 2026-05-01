/**
 * Splits docs/confluence-risk-audit-cohort.md into a parent index and
 * per-section child bodies for Confluence MCP (size-friendly publishes).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcPath = path.join(root, "docs", "confluence-risk-audit-cohort.md");
const outDir = path.join(root, "docs", "confluence-split");

const src = fs.readFileSync(srcPath, "utf8");
const lines = src.split("\n");

const h2Starts = [];
lines.forEach((line, i) => {
  if (line.startsWith("## ")) h2Starts.push(i);
});

function sliceSection(startLine, endLineExclusive) {
  return lines.slice(startLine, endLineExclusive).join("\n").trimEnd() + "\n";
}

// Parent: title (line 0) through end of "## Object types and insight catalog" (before first object ## Auditable entity)
const firstObjectIdx = lines.findIndex(
  (l, i) => l === "## Auditable entity" && i > 0
);
if (firstObjectIdx < 0) throw new Error("Could not find ## Auditable entity");

const indexBody =
  lines.slice(0, firstObjectIdx).join("\n").trimEnd() +
  "\n\n---\n\n## Object insight pages\n\nThe sections below live on **child pages** under this page (one Object Library type or theme per page). Open each child for the full **definition** and **example product insights**.\n";

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "00-index.md"), indexBody, "utf8");

const slug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

for (let s = 0; s < h2Starts.length; s++) {
  const start = h2Starts[s];
  const titleLine = lines[start].slice(3).trim();
  if (start >= firstObjectIdx) {
    const end = s + 1 < h2Starts.length ? h2Starts[s + 1] : lines.length;
    const body = sliceSection(start, end);
    const name = `${String(s + 1).padStart(2, "0")}-${slug(titleLine)}.md`;
    fs.writeFileSync(path.join(outDir, name), body, "utf8");
  }
}

const files = fs.readdirSync(outDir).filter((f) => f.endsWith(".md"));
let total = 0;
for (const f of files.sort()) {
  const p = path.join(outDir, f);
  const b = fs.readFileSync(p, "utf8");
  total += b.length;
  console.log(f, Buffer.byteLength(b, "utf8"));
}
console.log("files", files.length, "total_bytes", total);
