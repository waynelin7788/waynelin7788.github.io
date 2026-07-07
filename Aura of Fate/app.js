const dataPaths = {
  majorCards: "./assets/data/major-cards.json",
  minorCards: "./assets/data/minor-cards.json",
  majorInterpretations: "./assets/data/major-interpretations.json",
  minorInterpretations: "./assets/data/minor-interpretations.json",
};

const aiReadingEndpoint = location.protocol === "file:" ? "http://127.0.0.1:5173/api/reading" : "./api/reading";

const situations = {
  love: "感情",
  work: "工作",
  wealth: "財富",
  health: "健康",
  interpersonal: "人際",
  academic: "學業",
  spirituality: "靈性",
  advice: "建議",
};

const spreads = {
  daily: {
    label: "今日指引",
    positions: ["今日指引"],
  },
  quick: {
    label: "快速問答",
    positions: ["快速問答"],
  },
  timeline: {
    label: "過去 / 現在 / 未來",
    positions: ["過去", "現在", "未來"],
  },
  challenge: {
    label: "現況 / 挑戰 / 建議",
    positions: ["現況", "挑戰", "建議"],
  },
  relationship: {
    label: "感情關係",
    positions: ["你的狀態", "對方狀態", "關係現況", "關係挑戰", "發展建議"],
  },
  career: {
    label: "工作事業",
    positions: ["事業現況", "你的優勢", "主要挑戰", "潛在機會", "下一步行動"],
  },
  choice: {
    label: "二選一抉擇",
    positions: ["選項 A", "A 的發展", "選項 B", "B 的發展", "關鍵影響", "抉擇建議"],
  },
  celticCross: {
    label: "凱爾特十字",
    positions: ["現況", "核心挑戰", "潛意識根源", "近期過去", "顯意識目標", "近期未來", "自我定位", "外在環境", "希望與恐懼", "最終走向"],
  },
};

const situationSignals = {
  love: ["感情", "愛情", "戀愛", "曖昧", "復合", "分手", "伴侶", "交往", "喜歡", "婚姻", "桃花"],
  work: ["工作", "職涯", "職業", "公司", "上司", "主管", "同事", "面試", "轉職", "換工作", "離職", "升遷", "創業"],
  wealth: ["財富", "金錢", "財務", "收入", "薪水", "投資", "存款", "賺錢", "花錢", "債務", "預算"],
  health: ["健康", "身體", "睡眠", "壓力", "疲勞", "生病", "恢復", "運動", "飲食", "療癒"],
  interpersonal: ["人際", "朋友", "家人", "關係", "溝通", "衝突", "合作", "社交", "團隊", "相處"],
  academic: ["學業", "考試", "讀書", "課業", "研究", "論文", "學習", "成績", "升學", "證照"],
  spirituality: ["靈性", "內在", "冥想", "直覺", "夢境", "修行", "能量", "覺察", "生命課題"],
  advice: ["建議", "方向", "選擇", "決定", "該怎麼辦", "如何", "適合嗎", "要不要", "是否"],
};

const state = {
  deck: [],
  currentDraw: [],
  currentSpread: "daily",
  currentSituation: "love",
  currentQuestion: "",
  inferredSituation: null,
  situationManuallySelected: false,
  readingLocked: false,
  aiRequestId: 0,
  lastReadingInput: null,
  poolRendered: false,
  poolCloseTimer: null,
};

const elements = {
  questionInput: document.querySelector("#questionInput"),
  questionContext: document.querySelector("#questionContext"),
  deckStatus: document.querySelector("#deckStatus"),
  situationButtons: document.querySelector("#situationButtons"),
  spreadButtons: document.querySelector("#spreadButtons"),
  drawButton: document.querySelector("#drawButton"),
  resetButton: document.querySelector("#resetButton"),
  deckStack: document.querySelector("#deckStack"),
  spreadZone: document.querySelector("#spreadZone"),
  readingPanel: document.querySelector("#readingPanel"),
  readingTitle: document.querySelector("#readingTitle"),
  summaryBox: document.querySelector("#summaryBox"),
  aiReading: document.querySelector("#aiReading"),
  aiReadingContent: document.querySelector("#aiReadingContent"),
  cardReadings: document.querySelector("#cardReadings"),
  cardTemplate: document.querySelector("#cardTemplate"),
  poolModal: document.querySelector("#poolModal"),
  poolBackdrop: document.querySelector("#poolBackdrop"),
  poolCloseButton: document.querySelector("#poolCloseButton"),
  poolSummary: document.querySelector("#poolSummary"),
  poolGrid: document.querySelector("#poolGrid"),
};

init();

async function init() {
  renderChoiceButtons();
  bindEvents();

  try {
    state.deck = await loadDeck();
    elements.deckStatus.textContent = `${state.deck.length} 張牌`;
    elements.deckStatus.disabled = false;
    elements.drawButton.disabled = false;
  } catch (error) {
    elements.deckStatus.textContent = "牌庫載入失敗";
    elements.drawButton.disabled = true;
    console.error(error);
  }
}

function renderChoiceButtons() {
  elements.situationButtons.innerHTML = Object.entries(situations)
    .map(([value, label]) => choiceButtonTemplate("situation", value, label, value === state.currentSituation))
    .join("");

  elements.spreadButtons.innerHTML = Object.entries(spreads)
    .map(([value, spread]) => choiceButtonTemplate("spread", value, spread.label, value === state.currentSpread))
    .join("");
}

function choiceButtonTemplate(group, value, label, isActive) {
  return `
    <button
      class="choice-button${isActive ? " is-active" : ""}"
      type="button"
      data-choice-group="${group}"
      data-choice-value="${value}"
      aria-pressed="${isActive ? "true" : "false"}"
    >${label}</button>
  `;
}

function bindEvents() {
  elements.drawButton.addEventListener("click", drawReading);
  elements.resetButton.addEventListener("click", resetTable);
  elements.questionInput.addEventListener("input", handleQuestionInput);
  elements.situationButtons.addEventListener("click", handleChoiceClick);
  elements.spreadButtons.addEventListener("click", handleChoiceClick);
  elements.deckStatus.addEventListener("click", openCardPool);
  elements.poolBackdrop.addEventListener("click", closeCardPool);
  elements.poolCloseButton.addEventListener("click", closeCardPool);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.poolModal.hidden) {
      closeCardPool();
    }
  });
}

function handleChoiceClick(event) {
  if (state.readingLocked) return;

  const button = event.target.closest(".choice-button");
  if (!button) return;

  const group = button.dataset.choiceGroup;
  const value = button.dataset.choiceValue;

  if (group === "situation") {
    state.currentSituation = value;
    state.situationManuallySelected = true;
    updateChoiceState(elements.situationButtons, value);
    updateQuestionContext();
    if (state.currentDraw.length > 0 && state.currentDraw.every((item) => item.revealed)) {
      renderReading();
    }
    return;
  }

  if (group === "spread") {
    state.currentSpread = value;
    updateChoiceState(elements.spreadButtons, value);
    resetTable();
  }
}

function updateChoiceState(container, activeValue) {
  container.querySelectorAll(".choice-button").forEach((button) => {
    const isActive = button.dataset.choiceValue === activeValue;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

async function loadDeck() {
  const source = await loadDataSource();
  const cards = [...source.majorCards.cards, ...source.minorCards.minor_arcana_cards];
  const interpretations = [...source.majorInterpretations, ...source.minorInterpretations];
  const interpretationById = new Map(interpretations.map((item) => [item.id, item]));

  return cards.map((card) => ({
    id: card.id,
    nameEn: card.name_en,
    nameZh: card.name_zh,
    type: card.type,
    keywords: card.keywords,
    coreMeaning: card.core_meaning,
    visualSymbols: card.visual_symbols,
    aiPromptHint: card.ai_prompt_hint,
    imageFile: card.image_file,
    interpretation: interpretationById.get(card.id),
  }));
}

async function loadDataSource() {
  if (location.protocol === "file:" && window.AURA_DATA) {
    return window.AURA_DATA;
  }

  try {
    const [majorCards, minorCards, majorInterpretations, minorInterpretations] = await Promise.all([
      fetchJson(dataPaths.majorCards),
      fetchJson(dataPaths.minorCards),
      fetchJson(dataPaths.majorInterpretations),
      fetchJson(dataPaths.minorInterpretations),
    ]);

    return { majorCards, minorCards, majorInterpretations, minorInterpretations };
  } catch (error) {
    if (window.AURA_DATA) {
      console.warn("Using embedded data fallback.", error);
      return window.AURA_DATA;
    }
    throw error;
  }
}

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }
  return response.json();
}

function handleQuestionInput(event) {
  if (state.readingLocked) {
    event.target.value = state.currentQuestion;
    return;
  }

  const hadQuestion = Boolean(state.currentQuestion);
  state.currentQuestion = event.target.value.trim();
  if (!hadQuestion && state.currentQuestion) {
    state.situationManuallySelected = false;
  }
  state.inferredSituation = inferSituationFromQuestion(state.currentQuestion);

  if (!state.situationManuallySelected && state.inferredSituation) {
    state.currentSituation = state.inferredSituation;
    updateChoiceState(elements.situationButtons, state.currentSituation);
  }

  updateQuestionContext();

  if (state.currentDraw.length > 0 && state.currentDraw.every((item) => item.revealed)) {
    renderReading();
  }
}

function inferSituationFromQuestion(question) {
  const normalized = question.replace(/\s+/g, "");
  if (!normalized) return null;

  const scores = Object.entries(situationSignals).map(([situation, signals]) => {
    const score = signals.reduce((total, signal) => total + (normalized.includes(signal) ? 1 : 0), 0);
    return { situation, score };
  });

  scores.sort((a, b) => b.score - a.score);
  return scores[0]?.score > 0 ? scores[0].situation : "advice";
}

function updateQuestionContext() {
  if (!elements.questionContext) return;

  if (state.readingLocked) {
    elements.questionContext.textContent = "本次抽牌已鎖定問題與情境；按「重新開始」後可修改。";
    elements.questionContext.dataset.tone = "neutral";
    return;
  }

  if (!state.currentQuestion) {
    elements.questionContext.textContent = "可直接抽牌，或先輸入問題。";
    elements.questionContext.dataset.tone = "neutral";
    return;
  }

  if (!state.inferredSituation) {
    elements.questionContext.textContent = "目前會依手動選擇的情境解讀。";
    elements.questionContext.dataset.tone = "neutral";
    return;
  }

  const inferredLabel = situations[state.inferredSituation];
  const currentLabel = situations[state.currentSituation];
  const isConflict = state.situationManuallySelected && state.inferredSituation !== state.currentSituation;

  elements.questionContext.textContent = isConflict
    ? `問題看起來偏向「${inferredLabel}」，目前手動使用「${currentLabel}」。`
    : `已依問題判斷為「${currentLabel}」。`;
  elements.questionContext.dataset.tone = isConflict ? "warning" : "success";
}

function drawReading() {
  if (state.deck.length === 0) return;
  lockReadingSetup();

  const spread = spreads[state.currentSpread];
  const shuffled = shuffle([...state.deck]);
  state.currentDraw = spread.positions.map((position, index) => ({
    position,
    card: shuffled[index],
    orientation: Math.random() > 0.5 ? "upright" : "reversed",
    revealed: false,
  }));

  elements.deckStack.classList.remove("is-shuffling");
  void elements.deckStack.offsetWidth;
  elements.deckStack.classList.add("is-shuffling");

  elements.readingPanel.classList.remove("is-visible");
  elements.readingPanel.hidden = true;
  renderSpread();
}

function renderSpread() {
  elements.spreadZone.style.setProperty("--spread-count", state.currentDraw.length);
  elements.spreadZone.dataset.spreadId = state.currentSpread;
  elements.spreadZone.dataset.spreadSize = String(state.currentDraw.length);
  elements.spreadZone.innerHTML = "";

  state.currentDraw.forEach((drawn, index) => {
    const node = elements.cardTemplate.content.firstElementChild.cloneNode(true);
    const button = node.querySelector(".card-button");
    const front = node.querySelector(".card-front img");

    node.style.setProperty("--deal-index", index);
    node.dataset.cardIndex = String(index);
    front.src = `./assets/images/cards/${drawn.card.imageFile}`;
    front.alt = drawn.card.nameZh;
    node.classList.toggle("is-reversed", drawn.orientation === "reversed");
    node.querySelector(".position").textContent = drawn.position;
    node.querySelector(".name").textContent = "尚未翻牌";
    node.querySelector(".orientation").textContent = "點擊翻開";

    button.addEventListener("click", () => revealCard(index));
    elements.spreadZone.appendChild(node);
  });
}

function revealCard(index) {
  const drawn = state.currentDraw[index];
  if (!drawn || drawn.revealed) return;

  drawn.revealed = true;
  const node = elements.spreadZone.children[index];
  const button = node.querySelector(".card-button");
  button.classList.add("is-revealed");
  node.classList.add("is-settled");
  node.querySelector(".name").textContent = drawn.card.nameZh;
  node.querySelector(".orientation").textContent = orientationLabel(drawn.orientation);

  if (state.currentDraw.every((item) => item.revealed)) {
    window.setTimeout(renderReading, 420);
  }
}

function renderReading() {
  const situationLabel = situations[state.currentSituation];
  const spreadLabel = spreads[state.currentSpread].label;
  const readingInput = buildReadingInput();
  state.lastReadingInput = readingInput;
  window.AURA_LAST_READING_INPUT = readingInput;

  elements.readingTitle.textContent = `${situationLabel} · ${spreadLabel}`;
  elements.summaryBox.textContent = buildSummary(situationLabel);
  elements.cardReadings.innerHTML = state.currentDraw.map(renderCardReading).join("");
  renderAiReading(readingInput);
  elements.readingPanel.hidden = false;
  window.requestAnimationFrame(() => {
    elements.readingPanel.classList.add("is-visible");
  });
  elements.readingPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function renderAiReading(readingInput) {
  if (!elements.aiReading || !elements.aiReadingContent) return;

  const requestId = (state.aiRequestId += 1);
  elements.aiReading.hidden = false;
  elements.aiReading.dataset.state = "loading";
  elements.aiReadingContent.textContent = "正在依照本地牌義生成 AI 解讀...";

  try {
    const response = await fetch(aiReadingEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(readingInput),
    });

    const result = await response.json();
    if (requestId !== state.aiRequestId) return;

    if (!response.ok || !result.ok) {
      throw new Error(result.error || "AI 解讀暫時無法產生。");
    }

    elements.aiReading.dataset.state = "success";
    elements.aiReadingContent.innerHTML = formatAiReading(result.text);
  } catch (error) {
    if (requestId !== state.aiRequestId) return;

    elements.aiReading.dataset.state = "fallback";
    elements.aiReadingContent.textContent = aiFallbackMessage(error);
  }
}

function aiFallbackMessage(error) {
  const message = String(error?.message || "");
  const likelyMissingAiApi =
    error instanceof SyntaxError ||
    /Unexpected token|is not valid JSON|Failed to fetch|NetworkError|API KEY|API key/i.test(message);

  if (likelyMissingAiApi) {
    return "由於未使用 AI API KEY ，所以目前已保留本地資料庫解讀。";
  }

  return `${message} 目前已保留本地資料庫解讀。`;
}

function formatAiReading(text) {
  return escapeHtml(cleanAiMarkdown(text))
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replaceAll("\n", "<br>")}</p>`)
    .join("");
}

function cleanAiMarkdown(text) {
  const cleaned = String(text)
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) =>
      line
        .replace(/^\s{0,3}#{1,6}\s*/, "")
        .replace(/^\s*[-*_]{3,}\s*$/, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/(^|[^*])\*(?!\s)([^*\n]+?)\*(?!\*)/g, "$1$2")
        .replace(/(^|[^_])_(?!\s)([^_\n]+?)_(?!_)/g, "$1$2")
        .trimEnd(),
    )
    .filter((line, index, lines) => !(line === "" && lines[index - 1] === ""))
    .join("\n")
    .trim();

  return cleaned
    .replace(/^\s*(?:你|您)?好[，,。\s]*(?:我是|這裡是)[^\n。]*(?:。|\n)+/u, "")
    .replace(/^\s*(?:很高興|關於你|關於您)[^\n]*(?:。|\n)+/u, "")
    .replace(/牌陣與牌義解讀/g, "牌陣解讀")
    .replace(/逐張牌解讀/g, "牌陣解讀")
    .replace(/^\s*(整體訊息)\s*[:：]?\s*$/gm, "$1\n")
    .replace(/^\s*(牌陣解讀)\s*[:：]?\s*$/gm, "\n\n$1\n")
    .replace(/^\s*(牌陣與牌義解讀)\s*[:：]?\s*$/gm, "\n\n$1\n")
    .replace(/^\s*(逐張牌解讀)\s*[:：]?\s*$/gm, "\n\n$1\n")
    .replace(/^\s*(行動建議)\s*[:：]?\s*$/gm, "\n\n$1\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function renderCardReading(drawn) {
  const { card, orientation, position } = drawn;
  const interpretation = card.interpretation;
  const situationText = interpretation?.situations?.[state.currentSituation] ?? "這張牌目前沒有對應情境解析。";
  const keywords = card.keywords?.[orientation] ?? [];

  return `
    <article class="reading-card">
      <p class="small-note">${position} · ${orientationLabel(orientation)}</p>
      <h3>${escapeHtml(card.nameZh)} <span class="small-note">${escapeHtml(card.nameEn)}</span></h3>
      <div class="tag-row">
        ${keywords.map((keyword) => `<span class="tag">${escapeHtml(keyword)}</span>`).join("")}
      </div>
      <p>${escapeHtml(situationText)}</p>
      <p class="small-note">${escapeHtml(card.coreMeaning)}</p>
    </article>
  `;
}

function buildReadingInput() {
  return {
    question: state.currentQuestion,
    situation: state.currentSituation,
    situationLabel: situations[state.currentSituation],
    inferredSituation: state.inferredSituation,
    inferredSituationLabel: state.inferredSituation ? situations[state.inferredSituation] : null,
    situationSource: state.currentQuestion && !state.situationManuallySelected ? "question" : "manual",
    spreadId: state.currentSpread,
    spreadLabel: spreads[state.currentSpread].label,
    cards: state.currentDraw.map(({ card, orientation, position }) => ({
      id: card.id,
      nameEn: card.nameEn,
      nameZh: card.nameZh,
      type: card.type,
      position,
      orientation,
      orientationLabel: orientationLabel(orientation),
      keywords: card.keywords?.[orientation] ?? [],
      symbols: card.visualSymbols ?? [],
      coreMeaning: card.coreMeaning,
      situationMeaning: card.interpretation?.situations?.[state.currentSituation] ?? "",
      adviceMeaning: card.interpretation?.situations?.advice ?? "",
    })),
  };
}

function openCardPool() {
  if (state.deck.length === 0) return;

  if (!state.poolRendered) {
    renderCardPool();
    state.poolRendered = true;
  }

  window.clearTimeout(state.poolCloseTimer);
  elements.poolModal.hidden = false;
  window.requestAnimationFrame(() => {
    elements.poolModal.classList.add("is-open");
  });
  document.body.classList.add("is-modal-open");
}

function closeCardPool() {
  elements.poolModal.classList.remove("is-open");
  document.body.classList.remove("is-modal-open");
  state.poolCloseTimer = window.setTimeout(() => {
    elements.poolModal.hidden = true;
  }, 180);
}

function renderCardPool() {
  const groups = state.deck.reduce((result, card) => {
    result[card.type] = (result[card.type] || 0) + 1;
    return result;
  }, {});

  elements.poolSummary.textContent = Object.entries(groups)
    .map(([type, count]) => `${typeLabel(type)} ${count}`)
    .join(" · ");

  elements.poolGrid.innerHTML = state.deck.map(poolCardTemplate).join("");
}

function poolCardTemplate(card) {
  return `
    <article class="pool-card" data-card-id="${card.id}">
      <img src="./assets/images/cards/${card.imageFile}" alt="${escapeHtml(card.nameZh)}" loading="lazy" />
      <div class="pool-card-meta">
        <strong>${escapeHtml(card.nameZh)}</strong>
        <span>${escapeHtml(card.nameEn)}</span>
        <small>${typeLabel(card.type)}</small>
      </div>
    </article>
  `;
}

function buildSummary(situationLabel) {
  const names = state.currentDraw
    .map((item) => `${item.position}是${item.card.nameZh}${orientationLabel(item.orientation)}`)
    .join("，");
  const questionText = state.currentQuestion ? `你的問題是「${state.currentQuestion}」。` : "";
  return `${questionText}這次以「${situationLabel}」為主題，抽到的牌為：${names}。以下解析根據本地資料庫產生，並已整理成可交給 AI 的標準資料。`;
}

function resetTable() {
  state.aiRequestId += 1;
  state.currentDraw = [];
  state.readingLocked = false;
  unlockReadingSetup();
  elements.spreadZone.innerHTML = "";
  elements.spreadZone.style.setProperty("--spread-count", 3);
  delete elements.spreadZone.dataset.spreadId;
  delete elements.spreadZone.dataset.spreadSize;
  elements.readingPanel.classList.remove("is-visible");
  elements.readingPanel.hidden = true;
  if (elements.aiReading) {
    elements.aiReading.hidden = true;
    elements.aiReading.dataset.state = "";
  }
  if (elements.aiReadingContent) {
    elements.aiReadingContent.textContent = "";
  }
  elements.deckStack.classList.remove("is-shuffling");
}

function lockReadingSetup() {
  state.readingLocked = true;
  elements.questionInput.disabled = true;
  elements.situationButtons.querySelectorAll(".choice-button").forEach((button) => {
    button.disabled = true;
  });
  elements.spreadButtons.querySelectorAll(".choice-button").forEach((button) => {
    button.disabled = true;
  });
  updateQuestionContext();
}

function unlockReadingSetup() {
  elements.questionInput.disabled = false;
  elements.situationButtons.querySelectorAll(".choice-button").forEach((button) => {
    button.disabled = false;
  });
  elements.spreadButtons.querySelectorAll(".choice-button").forEach((button) => {
    button.disabled = false;
  });
  updateQuestionContext();
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function orientationLabel(orientation) {
  return orientation === "upright" ? "正位" : "逆位";
}

function typeLabel(type) {
  const labels = {
    "Major Arcana": "大阿爾克那",
    Wands: "權杖",
    Cups: "聖杯",
    Swords: "寶劍",
    Pentacles: "星幣",
  };
  return labels[type] ?? type;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
