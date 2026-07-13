import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const root = resolve(directory, "../..");
const read = (path) => readFile(resolve(root, path), "utf8");
const stripModuleSyntax = (source) => source
  .replace(/^import[^;]+;\r?\n/gm, "")
  .replace(/\bexport\s+(?=(const|function|class)\b)/g, "");

const [html, css, app, time, contracts, chart] = await Promise.all([
  read("index.html"), read("styles.css"), read("app.js"),
  read("packages/ziwei-core/src/time.js"), read("packages/ziwei-core/src/contracts.js"), read("packages/ziwei-core/src/chart.js")
]);
const browserContracts = stripModuleSyntax(contracts).replace(/\bTIME_PATTERN\b/g, "RAW_TIME_PATTERN");
const core = `window.AURA_GUEST_MODE = true;\nwindow.AURA_OFFLINE_MODE = true;\nfunction createHmac() { throw new Error("Fingerprinting is unavailable in the offline preview."); }\n${stripModuleSyntax(time)}\n${browserContracts}\n${stripModuleSyntax(chart)}\nwindow.AuraOfStarsCore = { calculateStructuralChart };`;
const offlineHtml = html
  .replace('<link rel="stylesheet" href="styles.css" />', `<style>${css}</style>`)
  .replace('  <script src="/vendor/html2canvas.min.js"></script>\n  <script src="app.js"></script>', `  <script>${core}</script>\n  <script>${app}</script>`);

await writeFile(resolve(directory, "Aura-of-Stars-offline.html"), offlineHtml, "utf8");
