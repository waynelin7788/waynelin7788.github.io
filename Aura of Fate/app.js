const dataPaths = {
  majorCards: "./assets/data/major-cards.json",
  minorCards: "./assets/data/minor-cards.json",
  majorInterpretations: "./assets/data/major-interpretations.json",
  minorInterpretations: "./assets/data/minor-interpretations.json",
};

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
  single: {
    label: "單張牌",
    positions: ["指引"],
  },
  three: {
    label: "三張牌",
    positions: ["過去", "現在", "未來"],
  },
};

const state = {
  deck: [],
  currentDraw: [],
  currentSpread: "single",
  currentSituation: "love",
  poolRendered: false,
  poolCloseTimer: null,
};

const elements = {
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
  const button = event.target.closest(".choice-button");
  if (!button) return;

  const group = button.dataset.choiceGroup;
  const value = button.dataset.choiceValue;

  if (group === "situation") {
    state.currentSituation = value;
    updateChoiceState(elements.situationButtons, value);
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

function drawReading() {
  if (state.deck.length === 0) return;

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
  elements.spreadZone.innerHTML = "";

  state.currentDraw.forEach((drawn, index) => {
    const node = elements.cardTemplate.content.firstElementChild.cloneNode(true);
    const button = node.querySelector(".card-button");
    const front = node.querySelector(".card-front img");

    node.style.setProperty("--deal-index", index);
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

  elements.readingTitle.textContent = `${situationLabel} · ${spreadLabel}`;
  elements.summaryBox.textContent = buildSummary(situationLabel);
  elements.cardReadings.innerHTML = state.currentDraw.map(renderCardReading).join("");
  elements.readingPanel.hidden = false;
  window.requestAnimationFrame(() => {
    elements.readingPanel.classList.add("is-visible");
  });
  elements.readingPanel.scrollIntoView({ behavior: "smooth", block: "start" });
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
  return `這次以「${situationLabel}」為主題，抽到的牌為：${names}。以下解析根據本地資料庫產生。`;
}

function resetTable() {
  state.currentDraw = [];
  elements.spreadZone.innerHTML = "";
  elements.readingPanel.classList.remove("is-visible");
  elements.readingPanel.hidden = true;
  elements.deckStack.classList.remove("is-shuffling");
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
