/**
 * Produces a single self-contained HTML file (no network) for the Risk & Audit prototype.
 * Run from repo: `npm run build:offline` in dashboard/, or `node scripts/build-offline-html.mjs` with cwd=dashboard.
 *
 * Embeds: built JS (React + Recharts + app), CSS, and aggregate.json (base64) so file:// works without fetch.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dashboardRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(dashboardRoot, "..");
const outHtml = path.join(repoRoot, "docs", "risk-audit-prototype-offline.html");

function readDistIndex() {
  return fs.readFileSync(path.join(dashboardRoot, "dist", "index.html"), "utf8");
}

function extractAssetPaths(html) {
  const script = html.match(/<script[^>]+src="([^"]+)"/);
  const style = html.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/);
  if (!script?.[1]) throw new Error("Could not find script src in dist/index.html");
  if (!style?.[1]) throw new Error("Could not find stylesheet href in dist/index.html");
  return { jsPath: script[1], cssPath: style[1] };
}

function distFile(webPath) {
  const rel = webPath.startsWith("/") ? webPath.slice(1) : webPath;
  return path.join(dashboardRoot, "dist", rel);
}

execSync("npm run build", { cwd: dashboardRoot, stdio: "inherit" });

const distHtml = readDistIndex();
const { jsPath, cssPath } = extractAssetPaths(distHtml);
const js = fs.readFileSync(distFile(jsPath), "utf8");
const css = fs.readFileSync(distFile(cssPath), "utf8");
const aggregateBuf = fs.readFileSync(path.join(dashboardRoot, "public", "aggregate.json"));
const aggregateB64 = aggregateBuf.toString("base64");

const offlineComment = `<!--
  Risk & Audit — synthetic peer benchmark prototype (offline bundle).
  Regenerate: cd dashboard && npm run build:offline
  Open this file directly in a modern browser (Chrome, Edge, Firefox, Safari).

  Contents (same as the Vite prototype):
  - Hero: title, summary, cohort size pills, Object library vs Cohort roadmap toggle
  - Toolbar: synthetic organization picker (disabled in roadmap view) + org context line
  - Object library: horizontal tabs for all Object Library types (auditable entity through request)
  - Per-tab: lens + description; selected-org vs cohort roll-up stats; example Recharts (bar / scatter);
    insight cards; risk tab adds top-risks table when data exists
  - Cohort roadmap: enhancement themes (priority, practitioner value, prompt focus, improvements)
  - Data: embedded aggregate.json (synthetic cohort metrics); no external requests except none.
-->`;

const fontOverride = `
/* Offline: avoid external font requests */
:root {
  --font: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --mono: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace;
}
`;

const offlineStrip = `
  <div class="offline-strip" role="note">
    <strong>Offline bundle</strong> — All UI, charts, and cohort data are embedded in this file (no network).
    Synthetic data only; not production customer data. Regenerate:
    <code>cd dashboard &amp;&amp; npm run build:offline</code>
  </div>`;

const stripCss = `
.offline-strip { font-size: 12px; line-height: 1.45; padding: 8px 14px; background: #11151c; border-bottom: 1px solid #252a34; color: #8b939c; text-align: center; }
.offline-strip code { font-family: var(--mono, ui-monospace, monospace); font-size: 11px; color: #cbd5e1; }
.offline-strip strong { color: #e8eaef; margin-right: 0.35rem; }
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Risk & Audit — Synthetic peer benchmark prototype (offline)</title>
  <style>
${fontOverride}
${stripCss}
${css}
  </style>
</head>
<body>
${offlineComment}
${offlineStrip}
  <div id="root"></div>
  <script id="__AGGREGATE_B64__" type="text/plain">${aggregateB64}</script>
  <script type="module">${js}</script>
</body>
</html>
`;

fs.mkdirSync(path.dirname(outHtml), { recursive: true });
fs.writeFileSync(outHtml, html, "utf8");
const kb = Math.round(fs.statSync(outHtml).size / 1024);
console.log(`Wrote ${outHtml} (${kb} KB)`);
