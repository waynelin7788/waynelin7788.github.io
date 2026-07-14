const situations = { love: "感情", work: "工作", wealth: "財運", health: "身心", interpersonal: "人際", academic: "學業", spirituality: "靈性", advice: "綜合建議" };
const spreads = {
  daily: { label: "每日一張", positions: ["今日指引"] }, quick: { label: "快速解答", positions: ["核心訊息"] },
  timeline: { label: "過去／現在／未來", positions: ["過去", "現在", "未來"] }, challenge: { label: "困境與建議", positions: ["困境", "阻力", "建議"] },
  relationship: { label: "關係牌陣", positions: ["你的狀態", "對方狀態", "關係課題", "關係阻力", "行動建議"] },
  career: { label: "職涯牌陣", positions: ["現況", "優勢", "挑戰", "發展方向", "行動建議"] }
};
const state = { deck: [], interpretationsById: new Map(), situation: "love", spread: "daily", question: "", draw: [], locked: false };
const $ = (selector) => document.querySelector(selector);
const elements = { situationButtons: $("#situationButtons"), spreadButtons: $("#spreadButtons"), questionInput: $("#questionInput"), questionContext: $("#questionContext"), drawButton: $("#drawButton"), resetButton: $("#resetButton"), deckStack: $("#deckStack"), spreadZone: $("#spreadZone"), readingPanel: $("#readingPanel"), readingTitle: $("#readingTitle"), summaryBox: $("#summaryBox"), localAnalysis: $("#localAnalysis"), promptOutput: $("#promptOutput"), copyPromptButton: $("#copyPromptButton"), cardReadings: $("#cardReadings"), cardTemplate: $("#cardTemplate"), deckStatus: $("#deckStatus"), poolModal: $("#poolModal"), poolBackdrop: $("#poolBackdrop"), poolCloseButton: $("#poolCloseButton"), poolSummary: $("#poolSummary"), poolGrid: $("#poolGrid"), poolCardDetail: $("#poolCardDetail") };

initialize();
function initialize() {
  const data = window.AURA_DATA;
  if (!data) throw new Error("找不到本機牌卡資料。");
  state.interpretationsById = new Map([...data.majorInterpretations, ...data.minorInterpretations].map(item => [String(item.id), item]));
  state.deck = [...data.majorCards.cards, ...data.minorCards.minor_arcana_cards].map(card => ({ id: card.id, nameZh: card.name_zh, nameEn: card.name_en, type: card.type, imageFile: card.image_file, keywords: card.keywords, coreMeaning: card.core_meaning, visualSymbols: card.visual_symbols || [], interpretation: state.interpretationsById.get(String(card.id)) }));
  renderChoices(); bindEvents();
}
function bindEvents() {
  elements.situationButtons.addEventListener("click", choose); elements.spreadButtons.addEventListener("click", choose);
  elements.questionInput.addEventListener("input", event => { state.question = event.target.value.trim(); updateContext(); });
  elements.drawButton.addEventListener("click", drawReading); elements.resetButton.addEventListener("click", reset); elements.copyPromptButton.addEventListener("click", copyPrompt);
  elements.deckStatus.addEventListener("click", openPool); elements.poolBackdrop.addEventListener("click", closePool); elements.poolCloseButton.addEventListener("click", closePool);
  document.addEventListener("keydown", event => { if (event.key === "Escape") closePool(); });
}
function renderChoices() {
  elements.situationButtons.innerHTML = Object.entries(situations).map(([id, label]) => `<button class="choice-button${id === state.situation ? " is-active" : ""}" data-kind="situation" data-value="${id}" type="button">${label}</button>`).join("");
  elements.spreadButtons.innerHTML = Object.entries(spreads).map(([id, spread]) => `<button class="choice-button${id === state.spread ? " is-active" : ""}" data-kind="spread" data-value="${id}" type="button">${spread.label}</button>`).join("");
}
function choose(event) { if (state.locked) return; const button = event.target.closest("[data-value]"); if (!button) return; state[button.dataset.kind] = button.dataset.value; renderChoices(); updateContext(); }
function updateContext() { elements.questionContext.textContent = state.question ? `問題已記錄：${state.question}` : "本版本僅使用本機牌義，不連線、不使用 AI。"; }
function drawReading() {
  if (state.locked) return; state.locked = true; elements.questionInput.disabled = true; elements.drawButton.disabled = true;
  const shuffled = [...state.deck]; for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
  state.draw = spreads[state.spread].positions.map((position, index) => ({ position, card: shuffled[index], orientation: Math.random() > .5 ? "upright" : "reversed", revealed: false }));
  elements.spreadZone.innerHTML = ""; elements.spreadZone.dataset.spreadId = state.spread; elements.spreadZone.style.setProperty("--spread-count", state.draw.length);
  state.draw.forEach((item, index) => { const node = elements.cardTemplate.content.firstElementChild.cloneNode(true); node.style.setProperty("--deal-index", index); node.querySelector(".position").textContent = item.position; node.querySelector(".name").textContent = "點擊翻牌"; node.querySelector(".orientation").textContent = ""; const image = node.querySelector(".card-front img"); image.src = `./assets/images/cards/${item.card.imageFile}`; image.alt = item.card.nameZh; node.querySelector(".card-button").addEventListener("click", () => reveal(index)); elements.spreadZone.appendChild(node); });
  elements.deckStack.classList.add("is-shuffling");
}
function reveal(index) { const item = state.draw[index]; if (!item || item.revealed) return; item.revealed = true; const node = elements.spreadZone.children[index]; node.querySelector(".card-button").classList.add("is-revealed"); node.classList.add("is-settled"); node.querySelector(".name").textContent = item.card.nameZh; node.querySelector(".orientation").textContent = item.orientation === "upright" ? "正位" : "逆位"; if (state.draw.every(card => card.revealed)) window.setTimeout(renderReading, 250); }
function renderReading() {
  elements.readingTitle.textContent = `${situations[state.situation]}｜${spreads[state.spread].label}`;
  elements.summaryBox.textContent = state.question ? `你的提問：${state.question}` : "靜下心感受這次抽到的訊息。";
  elements.localAnalysis.innerHTML = buildLocalAnalysis();
  elements.promptOutput.value = buildPrompt();
  elements.cardReadings.innerHTML = state.draw.map(item => { const orientation = item.orientation === "upright" ? "正位" : "逆位"; const activeKeywords = item.card.keywords?.[item.orientation] || []; const symbols = item.card.visualSymbols || []; return `<article class="reading-card"><p class="kicker">${escapeHtml(item.position)}・${orientation}</p><h3>${escapeHtml(item.card.nameZh)} <span class="small-note">${escapeHtml(item.card.nameEn || "")}</span></h3><p class="reading-card-type">牌卡類型：${escapeHtml(item.card.type || "")}</p><div class="reading-card-section"><strong>本次主題解析</strong><p>${escapeHtml(localMeaning(item))}</p></div><div class="reading-card-section"><strong>核心牌義</strong><p>${escapeHtml(item.card.coreMeaning || "")}</p></div>${renderTags(`${orientation}關鍵字`, activeKeywords)}${renderTags("牌面象徵", symbols)}</article>`; }).join("");
  elements.readingPanel.hidden = false; requestAnimationFrame(() => elements.readingPanel.classList.add("is-visible")); elements.readingPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}
function reset() { state.locked = false; state.draw = []; elements.questionInput.disabled = false; elements.drawButton.disabled = false; elements.questionInput.value = ""; state.question = ""; elements.spreadZone.innerHTML = ""; elements.readingPanel.hidden = true; elements.readingPanel.classList.remove("is-visible"); elements.deckStack.classList.remove("is-shuffling"); updateContext(); }
function localMeaning(item) { const interpretation = item.interpretation || state.interpretationsById.get(String(item.card.id)); return interpretation?.situations?.[state.situation] || interpretation?.situations?.advice || item.card.coreMeaning || "請觀察這張牌的象徵。"; }
function buildLocalAnalysis() { return `<p class="local-reading-note">以下內容由內建牌義資料整理，完全在瀏覽器本機完成。</p>`; }
function renderTags(label, values) { if (!values?.length) return ""; return `<div class="reading-card-section"><strong>${escapeHtml(label)}</strong><div class="tag-row">${values.map(value => `<span class="tag">${escapeHtml(value)}</span>`).join("")}</div></div>`; }
function buildPrompt() { const reading = state.draw.map(item => { const keywords = item.card.keywords?.[item.orientation] || []; return [`位置：${item.position}`, `牌卡：${item.card.nameZh}`, `牌位：${item.orientation === "upright" ? "正位" : "逆位"}`, `關鍵字：${keywords.join("、")}`, `本地牌義：${localMeaning(item)}`].join("\n"); }).join("\n\n"); return `請以溫和、具體且不做絕對預言的方式，解讀以下塔羅抽牌結果。\n\n主題：${situations[state.situation]}\n牌陣：${spreads[state.spread].label}\n提問：${state.question || "未填寫"}\n\n抽牌資料：\n${reading}\n\n請整合牌與牌之間的關聯，提出 2 至 3 點可實行的建議。`; }
async function copyPrompt() { const text = elements.promptOutput.value; try { await navigator.clipboard.writeText(text); } catch { elements.promptOutput.focus(); elements.promptOutput.select(); document.execCommand("copy"); } const original = elements.copyPromptButton.textContent; elements.copyPromptButton.textContent = "已複製"; window.setTimeout(() => { elements.copyPromptButton.textContent = original; }, 1500); }
function openPool() { elements.poolSummary.textContent = `共 ${state.deck.length} 張本機牌卡。`; elements.poolGrid.innerHTML = state.deck.map(card => `<button class="pool-card" type="button" data-id="${card.id}"><img src="./assets/images/cards/${card.imageFile}" alt="${escapeHtml(card.nameZh)}" /><span>${escapeHtml(card.nameZh)}</span></button>`).join(""); elements.poolGrid.onclick = event => { const button = event.target.closest("[data-id]"); if (!button) return; const card = state.deck.find(item => item.id === button.dataset.id); elements.poolCardDetail.innerHTML = `<h3>${escapeHtml(card.nameZh)}</h3><p>${escapeHtml(card.coreMeaning || "")}</p>`; elements.poolCardDetail.hidden = false; }; elements.poolModal.hidden = false; document.body.classList.add("is-modal-open"); requestAnimationFrame(() => elements.poolModal.classList.add("is-open")); }
function closePool() { elements.poolModal.classList.remove("is-open"); elements.poolCardDetail.hidden = true; document.body.classList.remove("is-modal-open"); elements.poolModal.hidden = true; }
function escapeHtml(value) { return String(value || "").replace(/[&<>\"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]); }
