import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const html = await readFile(resolve(directory, "Aura-of-Stars-offline.html"), "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]);
if (scripts.length !== 2) throw new Error(`Expected two inline scripts, found ${scripts.length}.`);
scripts.forEach((script) => new Function(script));
if (/<(script|link)[^>]+(?:src|href)=/i.test(html)) throw new Error("Offline HTML must not reference external resources.");

globalThis.window = globalThis;
new Function(scripts[0])();
const result = globalThis.AuraOfStarsCore.calculateStructuralChart({
  profile_name: "Offline verification", person_alias: "", gender: "male", calendar_type: "solar",
  birth_date: "1990-01-01", birth_time: "12:00", time_precision: "exact", birth_timezone: "Asia/Taipei",
  birth_country: "", birth_region: "", birth_city: "Taipei", latitude: null, longitude: null,
  is_leap_month: false, use_true_solar_time: false, notes: ""
});
if (result.status !== "core_chart_ready") throw new Error(`Unexpected chart status: ${result.status}`);
console.log(`Offline bundle verified: ${result.status}; inline scripts: ${scripts.length}`);
