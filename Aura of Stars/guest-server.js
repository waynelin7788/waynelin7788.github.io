import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { calculateStructuralChart } from "../../packages/ziwei-core/src/chart.js";

const directory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(directory, "../..");
const port = Number(process.env.PORT || 3001);
const jsonHeaders = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };

function sendJson(response, status, body) { response.writeHead(status, jsonHeaders); response.end(JSON.stringify(body)); }
async function readJson(request) {
  let text = "";
  for await (const chunk of request) { text += chunk; if (text.length > 100_000) throw new Error("Request too large."); }
  return JSON.parse(text || "{}");
}
function nullableCoordinate(value) { return value === "" || value === null || value === undefined ? null : Number(value); }
function toRawChartInput(profile) {
  return {
    profile_name: String(profile.profileName || "").trim(), person_alias: String(profile.personAlias || "").trim(), gender: profile.gender,
    calendar_type: profile.calendar, birth_date: profile.birthDate, birth_time: profile.birthTime || null,
    time_precision: profile.birthTime ? "exact" : "unknown", birth_timezone: profile.timezone,
    birth_country: "", birth_region: "", birth_city: String(profile.location || "").trim(),
    latitude: nullableCoordinate(profile.latitude), longitude: nullableCoordinate(profile.longitude),
    is_leap_month: false, use_true_solar_time: Boolean(profile.useSolarTime), notes: String(profile.note || "")
  };
}
function calculatePreview(profile) {
  const options = Number.isInteger(profile.targetYear) || Number.isInteger(profile.targetAge) || profile.targetDate || profile.targetTime
    ? { ...(Number.isInteger(profile.targetYear) ? { targetYear: profile.targetYear } : {}), ...(Number.isInteger(profile.targetAge) ? { targetAge: profile.targetAge } : {}), ...(profile.targetDate ? { targetDate: profile.targetDate } : {}), ...(profile.targetTime ? { targetTime: profile.targetTime } : {}) }
    : undefined;
  return calculateStructuralChart(toRawChartInput(profile), options);
}
async function serveFile(response, pathname) {
  if (pathname === "/vendor/html2canvas.min.js") {
    const data = await readFile(join(projectRoot, "node_modules", "html2canvas", "dist", "html2canvas.min.js"));
    response.writeHead(200, { "content-type": "text/javascript; charset=utf-8" }); response.end(data); return;
  }
  const file = pathname === "/" ? "index.html" : pathname.slice(1);
  if (!new Set(["index.html", "app.js", "styles.css"]).has(file)) return sendJson(response, 404, { error: "Not found" });
  let data = await readFile(join(projectRoot, file), "utf8");
  if (file === "index.html") data = data.replace("<head>", "<head><script>window.AURA_GUEST_MODE = true;</script>");
  const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
  response.writeHead(200, { "content-type": `${types[extname(file)]}; charset=utf-8`, "cache-control": "no-store" }); response.end(data);
}

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (request.method === "POST" && url.pathname === "/api/charts/preview") {
      const profile = await readJson(request);
      if (!profile.profileName || !profile.birthDate || !profile.birthTime || !profile.location) return sendJson(response, 400, { error: "命盤資料不完整。" });
      try {
        const result = calculatePreview(profile);
        return sendJson(response, 200, { chart: { status: result.status, engineVersion: result.engine_version, result } });
      } catch (error) {
        const detail = error.validation ? Object.values(error.validation.errors)[0] : null;
        return sendJson(response, 400, { error: detail || "無法計算命盤，請檢查輸入資料。" });
      }
    }
    await serveFile(response, url.pathname);
  } catch (error) { sendJson(response, 500, { error: error.message || "Guest preview service error." }); }
}).listen(port, () => console.log(`Aura guest chart is ready at http://localhost:${port}`));
