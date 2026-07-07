const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 5173);
const logPath = path.join(root, "server.log");
const envPath = path.join(root, ".env");
const pidPath = path.join(root, "aura-server.pid");
const geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/interactions";
const defaultGeminiModel = "gemini-3.1-flash-lite";
const promptVersion = "ai-reading-prompt-20260707-balanced-v6";

loadLocalEnv();
writePidFile();

function log(message) {
  fs.appendFileSync(logPath, `${new Date().toISOString()} ${message}\n`);
}

function writePidFile() {
  try {
    fs.writeFileSync(pidPath, String(process.pid), "utf8");
  } catch (error) {
    log(`pid write failed: ${error.message}`);
  }
}

process.on("uncaughtException", (error) => {
  log(`uncaughtException: ${error.stack || error.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  log(`unhandledRejection: ${error?.stack || error}`);
  process.exit(1);
});

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

http
  .createServer(async (request, response) => {
    if (request.method === "OPTIONS") {
      sendCorsPreflight(response);
      return;
    }

    if (request.method === "POST" && request.url === "/api/reading") {
      await handleReadingRequest(request, response);
      return;
    }

    if (request.method === "GET" && request.url === "/api/version") {
      sendJson(response, 200, {
        ok: true,
        promptVersion,
        model: process.env.GEMINI_MODEL || defaultGeminiModel,
        pid: process.pid,
      });
      return;
    }

    const url = new URL(request.url, `http://${request.headers.host}`);
    const decodedPath = decodeURIComponent(url.pathname);
    const target = decodedPath === "/" ? "/index.html" : decodedPath;
    const filePath = path.normalize(path.join(root, target));

    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
        "Cache-Control": "no-store",
        ...corsHeaders(),
      });
      response.end(content);
    });
  })
  .listen(port, "127.0.0.1", () => {
    const message = `Aura of Fate is running at http://127.0.0.1:${port}/`;
    log(message);
    console.log(message);
  });

function loadLocalEnv() {
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

async function handleReadingRequest(request, response) {
  try {
    const input = await readJsonBody(request);
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      sendJson(response, 503, {
        ok: false,
        error: "尚未設定 GEMINI_API_KEY。",
      });
      return;
    }

    const result = await requestGeminiReading(apiKey, input);
    sendJson(response, 200, {
      ok: true,
      text: result.text,
      model: result.model,
    });
  } catch (error) {
    log(`reading api error: ${error.stack || error.message}`);
    const publicError = toPublicAiError(error);
    sendJson(response, 500, {
      ok: false,
      error: publicError,
    });
  }
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 200000) {
        request.destroy();
        reject(new Error("Request body is too large."));
      }
    });

    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });

    request.on("error", reject);
  });
}

async function requestGeminiReading(apiKey, readingInput) {
  const model = process.env.GEMINI_MODEL || defaultGeminiModel;
  const cardCount = readingInput?.cards?.length ?? 3;
  const maxOutputTokens = cardCount >= 10 ? 5200 : cardCount >= 5 ? 3600 : 3000;
  const response = await fetch(geminiApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      model,
      system_instruction: buildSystemInstruction(),
      input: buildReadingPrompt(readingInput),
      generation_config: {
        temperature: 0.7,
        max_output_tokens: maxOutputTokens,
        thinking_level: "low",
      },
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || `Gemini API error ${response.status}`;
    throw new Error(message);
  }

  const finishReasons = extractGeminiFinishReasons(payload);
  const text = extractGeminiText(payload);
  if (!text) {
    throw new Error("Gemini did not return text.");
  }

  if (finishReasons.some((reason) => reason === "MAX_TOKENS" || reason === "LENGTH")) {
    log(`reading api truncated: finishReasons=${finishReasons.join(",")}, chars=${text.length}, maxOutputTokens=${maxOutputTokens}`);
    throw new Error("Gemini response was truncated by output token limit.");
  }

  validateCompleteReading(text, readingInput);

  return { text, model };
}

function buildSystemInstruction() {
  return [
    "你是 Aura of Fate 的塔羅解讀 AI。",
    "你只能根據使用者提供的本地牌義資料解讀，不要自行發明未提供的牌義。",
    "語氣溫柔、清楚、有人味，像一位懂塔羅的朋友正在陪玩家整理狀態，不像客服、老師或正式報告。",
    "稱呼玩家時使用「你」，不要使用「您」。",
    "請偏口語化、好理解，句子要短，不要堆疊抽象形容詞、專業術語或華麗比喻。",
    "嚴禁自我介紹；不要說「你好」、「您好」、「我是」、「很高興」、「為你解讀」、「以下」。直接從「整體訊息」開始。",
    "保持專業，但不要宣稱命運絕對或做保證。",
    "請結合玩家問題、占卜情境、牌陣位置、正逆位、關鍵字、象徵、核心牌義與情境牌義。",
    "輸出繁體中文。",
    "結構只包含：整體訊息、牌陣解讀、行動建議。",
    "只有「整體訊息」、「牌陣解讀」、「行動建議」可以作為獨立章節標題；牌位名稱只能放在牌陣解讀的小段落開頭，不要把牌位名稱拆成章節標題。",
    "整體篇幅請依牌數調整：1 到 3 張控制在 750 到 1100 個中文字；5 到 6 張控制在 1100 到 1500 個中文字；10 張控制在 1500 到 1900 個中文字。",
    "整體訊息最多 2 句，保持簡單明瞭。",
    "牌陣解讀是主要價值區，請比本地資料庫更有整合感，不要只是壓縮牌義。",
    "牌陣解讀每張牌請寫成一個小段落，不要只寫一行。",
    "每張牌的解讀長度請依牌數調整：1 到 3 張每張約 120 到 180 個中文字；5 張以上每張約 70 到 120 個中文字。每張都要包含牌義重點、正逆位狀態、牌陣位置意義、和玩家問題的具體關聯。",
    "牌陣解讀必須完整涵蓋 JSON cards 中的每一張牌，不可以中途停止或省略最後幾張。",
    "牌陣解讀要有專業判斷，例如說明這張牌是在支持、提醒、延後、修正或限制玩家的想法，而不只是重述關鍵字。",
    "牌陣解讀可以引用本地建議欄位，但要改寫成符合玩家問題的自然解讀，不要照抄。",
    "可以簡短提到 1 個有用的牌面象徵，但不要把牌面圖像逐項描述成清單。",
    "請使用純文字輸出，不要使用 Markdown 語法；不要使用 #、*、---、粗體、斜體或表格。",
    "行動建議給 2 到 3 點，使用「1.」「2.」「3.」開頭；每點只寫一句短句，保持口語。",
    "行動建議要像日常提醒，不要像標題或口號；不要寫「第一，主動...」「第二，以...為目標」這種正式句。",
    "行動建議不要使用抽象句，例如「重建內心秩序」；請改成具體句，例如「今天先把交通、住宿和預算列出來」。",
    "避免醫療、法律、投資等高風險保證；必要時提醒尋求專業協助。",
  ].join("\n");
}

function buildReadingPrompt(readingInput) {
  return [
    "請根據以下 JSON 產生塔羅解讀。",
    "不要輸出 JSON，請輸出自然、簡短、像聊天一樣的段落。",
    "第一行必須是「整體訊息」，不要在前面加任何問候、自我介紹或開場白。",
    "請使用純文字格式。標題只使用「整體訊息」、「牌陣解讀」、「行動建議」，不要加 Markdown 符號。",
    "請照這個節奏寫：整體訊息用 1 到 2 句先給方向；牌陣解讀依照 JSON cards 的順序與 position 欄位逐張寫成小段落；行動建議用 2 到 3 句很具體的小行動。",
    "牌陣解讀的小段落請用「牌位：牌名正位/逆位...」開頭，例如「下一步行動：聖杯八正位...」。即使牌位名稱含有「建議」兩字，也不要把它獨立成章節標題。",
    "牌陣解讀一定要寫完 JSON cards 裡所有牌位，再進入最後的「行動建議」章節。",
    "如果是 1 張牌陣，牌陣解讀只寫 1 個小段落，聚焦在這張牌對問題的核心提醒；如果是 3 張牌陣，請用三個位置串成一個完整脈絡，不要各說各話；如果是 5 張以上牌陣，請讓每張牌短而準，並在整體訊息與行動建議中整理出主線。",
    "牌陣解讀請兼顧專業與口語，例如：「現況：寶劍國王正位表示你現在很習慣用理性和規劃掌控局面，遇到選擇時會先看條件與風險。放在現況位置，它說明這個旅行念頭不是完全衝動，而是你已經在心裡評估過一段時間。這對目前的問題是加分的，因為旅行如果能被好好安排，就比較不會變成單純逃避壓力。不過這張牌也提醒你，別只用腦袋判斷，也要確認自己是真的想去。」",
    "行動建議請模仿這種語氣：「1. 先不要急著訂票，今天可以先把交通、住宿和預算列出來。」",
    "行動建議也可以像這樣：「2. 如果你只是想逃離疲憊，可以先安排半天的小旅行，看看自己是不是真的需要遠行。」",
    JSON.stringify(readingInput, null, 2),
  ].join("\n\n");
}

function extractGeminiText(payload) {
  if (typeof payload?.output_text === "string") {
    return payload.output_text.trim();
  }

  if (Array.isArray(payload?.output)) {
    return payload.output
      .flatMap((item) => item?.content || [])
      .map((content) => content?.text || "")
      .join("")
      .trim();
  }

  if (Array.isArray(payload?.candidates)) {
    return payload.candidates
      .flatMap((candidate) => candidate?.content?.parts || [])
      .map((part) => part?.text || "")
      .join("")
      .trim();
  }

  if (Array.isArray(payload?.steps)) {
    return payload.steps
      .flatMap((step) => step.content || [])
      .filter((content) => content.type === "text" && content.text)
      .map((content) => content.text)
      .join("")
      .trim();
  }

  return "";
}

function validateCompleteReading(text, readingInput) {
  const cards = Array.isArray(readingInput?.cards) ? readingInput.cards : [];
  const missingPositions = cards
    .map((card) => card?.position)
    .filter(Boolean)
    .filter((position) => !text.includes(`${position}：`) && !text.includes(`${position}:`));

  const missingCardNames = cards
    .map((card) => card?.nameZh)
    .filter(Boolean)
    .filter((name) => !text.includes(name));

  const hasActionAdvice = /(?:^|\n)\s*行動建議\s*[:：]?\s*(?:\n|$)/u.test(text);
  const endsAbruptly = /[，、：:「（(]$/u.test(text.trim());

  if (missingPositions.length > 0 || missingCardNames.length > 0 || !hasActionAdvice || endsAbruptly) {
    log(
      [
        "reading api incomplete:",
        `missingPositions=${missingPositions.join("|") || "none"}`,
        `missingCardNames=${missingCardNames.join("|") || "none"}`,
        `hasActionAdvice=${hasActionAdvice}`,
        `endsAbruptly=${endsAbruptly}`,
        `chars=${text.length}`,
      ].join(" "),
    );
    throw new Error("Gemini response was incomplete.");
  }
}

function extractGeminiFinishReasons(payload) {
  const reasons = [];

  if (Array.isArray(payload?.candidates)) {
    reasons.push(...payload.candidates.map((candidate) => candidate?.finishReason).filter(Boolean));
  }

  if (Array.isArray(payload?.steps)) {
    reasons.push(...payload.steps.map((step) => step?.finish_reason || step?.finishReason).filter(Boolean));
  }

  if (payload?.finish_reason) {
    reasons.push(payload.finish_reason);
  }

  if (payload?.finishReason) {
    reasons.push(payload.finishReason);
  }

  if (Array.isArray(payload?.output)) {
    reasons.push(...payload.output.map((item) => item?.finish_reason || item?.finishReason).filter(Boolean));
  }

  return reasons;
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...corsHeaders(),
  });
  response.end(JSON.stringify(payload));
}

function toPublicAiError(error) {
  const message = String(error?.message || "");
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("not enough quota") || lowerMessage.includes("quota")) {
    return "Google AI API 配額不足，請稍後再試或檢查 API 專案配額。";
  }

  if (lowerMessage.includes("high demand") || lowerMessage.includes("try again later")) {
    return "Google AI 模型目前需求較高，請稍後再試。";
  }

  if (lowerMessage.includes("truncated") || lowerMessage.includes("token limit")) {
    return "AI 解讀超過輸出上限而中斷，請重新抽牌或稍後再試。";
  }

  if (lowerMessage.includes("incomplete")) {
    return "AI 解讀回覆不完整，請重新抽牌或稍後再試。";
  }

  if (lowerMessage.includes("api key") || lowerMessage.includes("permission")) {
    return "Google API Key 無法使用，請檢查 .env 設定與 API 權限。";
  }

  return "AI 解讀服務暫時無法使用。";
}

function sendCorsPreflight(response) {
  response.writeHead(204, {
    ...corsHeaders(),
    "Access-Control-Max-Age": "86400",
  });
  response.end();
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
