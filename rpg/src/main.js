const $ = (selector) => document.querySelector(selector);
const CONTENT = window.RPG_CONTENT;

const initialState = () => ({
  stage: "opening",
  stance: null,
  lastBeat: null,
  lastBattleBeat: null,
  chapterChoice: null,
  echoUnderstood: false,
  nextGoal: null,
  chapterTwoRoute: null,
  chapterTwoPhase: null,
  chapterTwoEntryChoice: null,
  chapterTwoInvestigation: null,
  chapterTwoOutcome: null,
  chapterTwoResolution: null,
  chapterTwoChoice: null,
  chapterThreeChoice: null,
  chapterThreePhase: null,
  chapterThreeEntryOutcome: null,
  chapterThreePreviousOutcome: null,
  chapterThreeRidgeChoice: null,
  chapterThreeDoorChoice: null,
  chapterThreeFinaleChoice: null,
  slots: 3,
  actions: [],
  stats: { insight: 0, resonance: 0, grit: 0 },
  trust: { ingvar: 0, freya: 0, fafnira: 0, astrid: 0, grimm: 0, sern: 0 },
  chapterThreeAstridJoined: false,
  chapterThreeGrimmJoined: false,
  chapterThreeJoined: false,
  evac: 0,
  clue: false,
  trained: false,
  battleRound: 0,
  battle: { rescue: 0, stable: 0, threat: 5, guarded: 0 },
  ending: null,
  log: []
});

let state = initialState();
let memorySave = null;

const companionData = [
  { id: "ingvar", name: "英格瓦・龍心", role: "前排護衛｜古龍遺跡", image: "ingvar-cutout.webp" },
  { id: "freya", name: "弗蕾亞・龍脈", role: "治療護佑｜古龍遺跡", image: "freya-cutout.webp" },
  { id: "fafnira", name: "法芙娜・暗瞳", role: "遠程詛咒｜古龍遺跡", image: "fafnira-cutout.webp" },
  { id: "astrid", name: "阿斯特麗德・龍怒", role: "風系斥候｜龍怒逆角", image: "astrid-cutout.webp", unlock: "chapterThreeAstridJoined" },
  { id: "grimm", name: "格里姆・破裂之鱗", role: "近戰突破｜熔岩逆鱗", image: "grimm-cutout.webp", unlock: "chapterThreeGrimmJoined" },
  { id: "sern", name: "瑟恩・遺名", role: "守碑記錄者｜盲星谷", image: "sern-cutout.webp", unlock: "chapterThreeJoined" }
];

const actionData = Object.entries(CONTENT.actions).map(([id, action]) => ({ id, ...action }));
const portraitRoot = "assets/characters/";
const openingScene = "assets/scenes/boundary-village-dusk.webp";
const manualSlotsKey = `${CONTENT.storageKey}:manual-slots-v1`;

function characterForSpeaker(speaker = "") {
  if (speaker.includes("英格瓦")) return companionData[0];
  if (speaker.includes("弗蕾亞")) return companionData[1];
  if (speaker.includes("法芙娜")) return companionData[2];
  if (speaker.includes("阿斯特麗德")) return companionData[3];
  if (speaker.includes("格里姆")) return companionData[4];
  if (speaker.includes("瑟恩")) return companionData[5];
  return null;
}

function storyVisual(paragraphs = []) {
  if (["battle", "decision"].includes(state.stage)) {
    return { background: "assets/scenes/rift-beast.webp", characters: [], name: "裂隙獸", mood: "rift", fullBleed: true };
  }
  if (["chapter2", "chapter2-ended", "chapter3-entry", "chapter3-ready"].includes(state.stage)) {
    const cast = [...new Map(paragraphs
      .filter((item) => typeof item === "object" && item.speaker)
      .map((item) => characterForSpeaker(item.speaker))
      .filter(Boolean)
      .map((person) => [person.id, person])).values()];
    if (!cast.length) cast.push(companionData[0]);
    const name = state.stage.startsWith("chapter3") ? "霜環峽與盲星谷" : "北方舊觀星台";
    return { background: "assets/scenes/northern-observatory.webp", characters: cast, name, mood: `chapter-two-${cast.length}` };
  }
  const cast = [...new Map(paragraphs
    .filter((item) => typeof item === "object" && item.speaker)
    .map((item) => characterForSpeaker(item.speaker))
    .filter(Boolean)
    .map((person) => [person.id, person])).values()];
  if (!cast.length) {
    const fallback = characterForSpeaker(state.lastBeat?.speaker || "")
      || (state.chapterChoice === "evacuate" ? companionData[1] : state.chapterChoice === "answer" ? companionData[2] : companionData[0]);
    cast.push(fallback);
  }
  return { background: openingScene, characters: cast, name: cast[0].name, mood: cast.length > 1 ? `cast-${cast.length}` : cast[0].id };
}

function log(message) {
  recordChronicle({ type: "event", chapter: chapterName(), text: message });
}

function chapterName() {
  if (["chapter3-entry", "chapter3-ready"].includes(state.stage)) return "第三章";
  if (["chapter2", "chapter2-ended"].includes(state.stage)) return "第二章";
  return "第一章";
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function recordChronicle(entry) {
  state.log ??= [];
  if (entry.key && state.log.some((item) => item && typeof item === "object" && item.key === entry.key)) return;
  state.log.push(entry);
  renderLog();
  persistSave();
}

function recordScene(title, paragraphs, context = {}) {
  const lines = paragraphs.map((item) => {
    if (typeof item === "object" && item.speaker) return `${fill(item.speaker, context)}：「${fill(item.text, context)}」`;
    return fill(typeof item === "string" ? item : item.text, context);
  });
  const key = JSON.stringify([chapterName(), title, lines]);
  recordChronicle({ type: "scene", chapter: chapterName(), title: fill(title, context), text: lines.join("\n\n"), key });
}

function recordChoice(title, description, type = "choice") {
  recordChronicle({ type, chapter: chapterName(), title, text: description || "" });
}

function getPath(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

function conditionMatches(condition, context = {}) {
  if (!condition) return true;
  if (condition.all && !condition.all.every((item) => conditionMatches(item, context))) return false;
  if (condition.any && !condition.any.some((item) => conditionMatches(item, context))) return false;
  if (condition.path) {
    const value = Object.hasOwn(context, condition.path) ? context[condition.path] : getPath(state, condition.path);
    if (Object.hasOwn(condition, "equals") && value !== condition.equals) return false;
    if (Object.hasOwn(condition, "gt") && !(value > condition.gt)) return false;
    if (Object.hasOwn(condition, "gte") && !(value >= condition.gte)) return false;
    if (Object.hasOwn(condition, "lt") && !(value < condition.lt)) return false;
    if (Object.hasOwn(condition, "lte") && !(value <= condition.lte)) return false;
  }
  return true;
}

function fill(text, context = {}) {
  return String(text).replace(/\{\{([\w.]+)\}\}/g, (_, path) => {
    const value = Object.hasOwn(context, path) ? context[path] : getPath(state, path);
    return value ?? "";
  });
}

function resolveValue(value, context = {}) {
  const token = typeof value === "string" && value.match(/^\{\{([\w.]+)\}\}$/);
  if (!token) return value;
  const resolved = Object.hasOwn(context, token[1]) ? context[token[1]] : getPath(state, token[1]);
  return resolved ?? value;
}

function applyEffects(effects = [], context = {}) {
  for (const effect of effects) {
    if (effect.when && !conditionMatches(effect.when, context)) continue;
    const current = getPath(state, effect.path);
    if (effect.op === "set") {
      const next = resolveValue(effect.value, context);
      const numeric = typeof current === "number" && typeof next === "string" && next.trim() !== "" ? Number(next) : next;
      setPath(state, effect.path, numeric);
    } else if (effect.op === "inc") {
      let next = Number(current ?? 0) + Number(resolveValue(effect.value, context));
      if (Number.isFinite(effect.min)) next = Math.max(effect.min, next);
      if (Number.isFinite(effect.max)) next = Math.min(effect.max, next);
      setPath(state, effect.path, next);
    }
  }
}

function setPath(object, path, value) {
  const parts = path.split(".");
  const key = parts.pop();
  const parent = parts.reduce((target, part) => target[part] ??= {}, object);
  parent[key] = value;
}

function setStory(title, paragraphs, lead = false, context = {}) {
  const visibleParagraphs = paragraphs.filter((item) => {
    if (typeof item === "string") return true;
    return (!item.when || conditionMatches(item.when, context)) && (!item.unless || !conditionMatches(item.unless, context));
  });
  const blocks = visibleParagraphs.map((item, index) => {
    if (typeof item === "object" && item.speaker) return `<p class="dialogue"><span class="speaker">${fill(item.speaker, context)}</span><span>「${fill(item.text, context)}」</span></p>`;
    const text = typeof item === "string" ? item : item.text;
    const classes = [lead && index === 0 ? "lead" : "", typeof item === "object" && item.aside ? "aside" : ""].filter(Boolean).join(" ");
    return `<p class="${classes}">${fill(text, context)}</p>`;
  }).join("");
  recordScene(title, visibleParagraphs, context);
  const visual = storyVisual(visibleParagraphs);
  const actors = visual.characters.map((person, index) => `<img class="scene-actor actor-${index + 1}" src="${portraitRoot}${person.image}" alt="${person.name}" fetchpriority="high">`).join("");
  $("#story").className = `story-card scene-card scene-${visual.mood}${visual.fullBleed ? " scene-full-bleed" : ""}`;
  const chapterLabel = ["chapter3-entry", "chapter3-ready"].includes(state.stage) ? "第三章・盲星谷" : ["chapter2", "chapter2-ended"].includes(state.stage) ? "第二章・星盤逆轉" : "潰堤前夜";
  const footer = ["chapter3-entry", "chapter3-ready"].includes(state.stage) ? "先前的決定仍在改變這段旅程的代價" : ["chapter2", "chapter2-ended"].includes(state.stage) ? "第一章的選擇仍在改變隊伍能承擔的代價" : "選擇將影響同行者、撤離狀況與界碑命運";
  $("#story").innerHTML = `<div class="scene-stage"><img class="scene-background" src="${visual.background}" alt="${visual.name}" aria-hidden="true"><div class="scene-vignette"></div><div class="scene-cast cast-${visual.characters.length}" aria-label="${visual.characters.map((person) => person.name).join("、")}">${actors}</div></div><div class="story-copy"><div class="scene-kicker"><span></span>${chapterLabel}・劇情場景</div><h2>${fill(title, context)}</h2><div class="story-lines">${blocks}</div><div class="scene-footer"><span class="scene-footer-dot"></span><span>${footer}</span></div></div>`;
}

function renderChoices(items) {
  $("#choices").innerHTML = items.map((item, index) => `<button class="choice-button" data-choice="${index}" data-number="${index + 1}"><strong>${fill(item.title)}</strong><span>${fill(item.description)}</span></button>`).join("");
  $("#choices").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    const item = items[Number(button.dataset.choice)];
    recordChoice(item.title, item.description);
    item.choose();
  }));
}

function renderStats() {
  const stats = [
    ["洞察", state.stats.insight],
    ["共鳴", state.stats.resonance],
    ["堅忍", state.stats.grit]
  ];
  $("#stats").innerHTML = stats.map(([name, value]) => `<div class="stat-row"><span>${name}</span><span class="pip-row">${[1, 2, 3].map((n) => `<i class="pip ${n <= value ? "on" : ""}"></i>`).join("")}</span></div>`).join("");
  $("#companions").innerHTML = companionData.filter((person) => !person.unlock || state[person.unlock]).map((person) => `<div class="companion"><span class="companion-portrait-frame"><img class="companion-portrait" src="${portraitRoot}${person.image}" alt=""></span><div class="companion-info"><div class="companion-top"><span>${person.name}</span><span class="muted">信任</span></div><div class="companion-role">${person.role}</div><div class="trust">${[1, 2, 3].map((n) => `<i class="${n <= (state.trust[person.id] ?? 0) ? "on" : ""}"></i>`).join("")}</div></div></div>`).join("");
  const chapterThreeRecruits = [state.chapterThreeAstridJoined, state.chapterThreeGrimmJoined, state.chapterThreeJoined].filter(Boolean).length;
  $("#partyNote").textContent = state.stage === "opening" ? "尚未會合" : chapterThreeRecruits ? `古龍遺跡小隊・${chapterThreeRecruits}位新成員會合` : "古龍遺跡小隊";
  let stability = null;
  if (state.stage === "actions") stability = Math.max(12, 100 - state.actions.length * 12);
  if (["battle", "decision", "ended", "chapter2", "chapter2-ended", "chapter3-entry", "chapter3-ready"].includes(state.stage)) stability = Math.max(12, Math.min(100, 36 + state.battle.stable * 14 - Math.max(0, state.battle.threat - state.battle.guarded) * 7));
  $("#stabilityValue").textContent = stability === null ? "狀態待確認" : `${stability}%`;
  $("#stabilityMeter").style.width = `${stability ?? 0}%`;
  $("#pressureText").textContent = state.stage === "opening" ? "抵達後才能判斷裂隙狀況。" : state.stage === "actions" ? `剩餘 ${state.slots} 個行動時段。裂隙的震盪正在加劇。` : state.stage === "battle" ? `遭遇第 ${state.battleRound} 回合｜裂隙威脅 ${Math.max(0, state.battle.threat)}` : ["chapter2", "chapter2-ended", "chapter3-entry", "chapter3-ready"].includes(state.stage) ? `接續目標：${state.nextGoal ?? "等待隊伍決定"}` : state.stage === "ended" ? "第一章危機暫告一段落。" : "裂隙獸已突破防線。";
}

function chronicleEntries() {
  return state.log
    .map((entry) => typeof entry === "string" ? { type: "event", chapter: "紀錄", text: entry } : entry)
    .filter((entry) => entry.type !== "event");
}

function plainSceneTitle(title = "") {
  return String(title).replace(/^(?:第一章|第二章|第三章入口|第三章)\s*[｜|]\s*/, "").replace(/[。！？!?]+$/, "");
}

function chronicleSectionTitle(entry, chapter, firstScene) {
  if (entry.type !== "scene") return "";
  const title = plainSceneTitle(entry.title);
  if (chapter === "第一章") {
    if (entry.title === CONTENT.opening.title) return "來自天幕的敲擊";
    if (entry.title === CONTENT.battle.introTitle) return "暮色中的裂隙獸";
    if (entry.title?.startsWith("裂隙獸退回碎石後方")) return "界碑前的抉擇";
    if (entry.title?.startsWith("危機暫歇")) return "另一個黎明";
    return "";
  }
  if (chapter === "第二章") {
    if (firstScene) return title;
    // Chapter two's investigation, crisis and aftermath are the four major
    // story beats. Keep their authored titles, while omitting intermediate UI screens.
    if (["石盤背面的刻痕", "名冊上缺少的名字", "回聲留下的空格", "手臂裡的第二個節奏", CONTENT.chapterTwo.crisis.title,
      ...Object.values(CONTENT.chapterTwo.finales).map((item) => item.title)].includes(entry.title)) return title;
    return "";
  }
  if (chapter === "第三章") {
    if (firstScene) return title;
    if (Object.values(CONTENT.chapterTwo.chapterThreeStages).some((item) => item.title === entry.title)) return title;
  }
  return "";
}

function choiceAsProse(entry, index) {
  const title = String(entry.title || "").replace(/[。！？!?]+$/, "");
  const detail = String(entry.text || "").replace(/^[，、。\s]+|[。！？!?]+$/g, "");
  const openings = ["於是，", "接著，", "隨後，", "而這一次，"];
  const verb = entry.type === "action" ? "你" : "你決定";
  return `${openings[index % openings.length]}${verb}${title}${detail ? `，${detail}` : ""}。`;
}

function sectionLabel(count) {
  return ["第一節", "第二節", "第三節", "第四節", "第五節", "第六節"][count - 1] || `第${count}節`;
}

function renderLog() {
  const entries = chronicleEntries();
  let currentChapter = "";
  let sceneSeenInChapter = false;
  let sectionCount = 0;
  let choiceCount = 0;
  let lastSection = "";
  const blocks = [];
  for (const entry of entries) {
    if (entry.chapter !== currentChapter) {
      currentChapter = entry.chapter;
      sceneSeenInChapter = false;
      sectionCount = 0;
      choiceCount = 0;
      lastSection = "";
      const heading = chapterHeading(currentChapter);
      blocks.push(`<li class="chronicle-chapter">${escapeHTML(heading)}</li>`);
    }
    if (entry.type === "scene") {
      const section = chronicleSectionTitle(entry, currentChapter, !sceneSeenInChapter);
      sceneSeenInChapter = true;
      if (section && section !== lastSection) {
        sectionCount += 1;
        lastSection = section;
        blocks.push(`<li class="chronicle-section">${sectionLabel(sectionCount)}　${escapeHTML(section)}</li>`);
      }
      const text = entry.text ? `<p class="chronicle-text">${escapeHTML(entry.text).replace(/\n/g, "<br><br>")}</p>` : "";
      blocks.push(`<li class="chronicle-entry chronicle-scene">${text}</li>`);
    } else {
      blocks.push(`<li class="chronicle-entry chronicle-${entry.type}"><p class="chronicle-text">${escapeHTML(choiceAsProse(entry, choiceCount++))}</p></li>`);
    }
  }
  $("#log").innerHTML = blocks.length ? blocks.join("") : '<li class="empty-note">劇情與選擇會從第一章開始，整理成一段故事。</li>';
}

function chapterHeading(chapter) {
  return ({
    "第一章": "第一章　潰堤前夜",
    "第二章": "第二章　星盤逆轉",
    "第三章": "第三章　盲星谷"
  })[chapter] || chapter;
}

function setStageLabel(label, clock) {
  $("#phaseLabel").textContent = label;
  $("#chapterClock").textContent = clock;
}

function renderOpening() {
  setStageLabel("第一章・潰堤前夜", "序幕");
  setStory(CONTENT.opening.title, CONTENT.opening.paragraphs, true);
  renderChoices(CONTENT.opening.choices.map((choice) => ({ ...choice, choose: () => begin(choice) })));
  renderContinueButton();
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = "";
}

function begin(choice) {
  applyEffects(choice.effects);
  state.stage = "actions";
  state.lastBeat = CONTENT.opening.stanceBeats[choice.id];
  log(choice.journal);
  renderActions();
}

function renderActions() {
  setStageLabel("第一章・潰堤前夜", `行動時段 ${4 - state.slots} / 3`);
  const sceneTitle = state.actions.length === 0 ? "天色一寸寸暗下來。" : state.actions.length === 1 ? "一陣冷風吹過空下來的村道。" : "村裡的鐘聲忽然停了。";
  const scene = [
    state.actions.length === 0 ? "村口的人們等著你的安排。你知道每多留一會兒，就會少一點準備時間。" : state.actions.length === 1 ? `你們還有 ${state.slots} 個行動時段。遠處的山脊被暮色吞去，界碑上的裂痕已經延伸到第二道刻紋。` : `你們只剩 ${state.slots} 個行動時段。天色沉入山後，界碑上最後一盞巡夜燈被震落在地。`,
    ...(state.lastBeat ? [state.lastBeat.narration, { speaker: state.lastBeat.speaker, text: state.lastBeat.line }] : []),
    "你可以查明裂隙、照顧居民、磨練調律，也可以花時間與同行者並肩。"
  ];
  setStory(sceneTitle, scene);
  const available = actionData.filter((action) => !state.actions.includes(action.id));
  $("#actionArea").innerHTML = `<div class="action-header"><h3>選擇一項行動</h3><span>剩餘 ${state.slots} 次</span></div><div class="action-grid">${available.map((action) => `<button class="action-button" data-action="${action.id}"><strong>${fill(action.title)}</strong><span>${fill(action.body)}</span><span class="cost">${fill(action.tag)}</span></button>`).join("")}</div>`;
  $("#actionArea").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => takeAction(button.dataset.action)));
  $("#choices").innerHTML = "";
  $("#continueArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = "";
  renderStats();
}

function takeAction(id) {
  const action = actionData.find((item) => item.id === id);
  if (!action || state.stage !== "actions") return;
  recordChoice(action.title, action.body, "action");
  state.actions.push(id);
  state.slots -= 1;
  applyEffects(action.effects);
  state.lastBeat = { narration: action.scene[0].text, speaker: action.scene[1].speaker, line: action.scene[1].text };
  log(action.journal);
  renderStats();
  if (state.slots === 0) startBattle();
  else renderActions();
}

function startBattle() {
  state.stage = "battle";
  state.battleRound = 1;
  setStageLabel("第一章・遭遇", "防線突破");
  setStory(CONTENT.battle.introTitle, CONTENT.battle.intro);
  log("裂隙獸突破界碑外圍。遭遇開始。");
  $("#continueArea").innerHTML = "";
  renderBattle();
}

function renderBattle() {
  const round = state.battleRound;
  const strain = Math.max(0, state.battle.threat - state.battle.guarded);
  if (state.lastBattleBeat) {
    setStory(CONTENT.battle.roundTitles[Math.min(round - 1, 2)], [
      state.lastBattleBeat.narration,
      { speaker: state.lastBattleBeat.speaker, text: state.lastBattleBeat.line },
      CONTENT.battle.roundEndLines[Math.min(round - 1, 2)]
    ]);
  } else setStory(CONTENT.battle.introTitle, CONTENT.battle.intro);
  const choices = Object.entries(CONTENT.battle.actions).map(([id, item]) => `<button class="battle-button" data-kind="${id}"><strong>${fill(item.title)}</strong><span>${fill(item.body)}</span></button>`).join("");
  $("#battleArea").innerHTML = `<p class="battle-round">戰鬥回合 ${round} / 3｜當前威脅 ${Math.max(0, strain)}</p><div class="battle-grid">${choices}</div>`;
  $("#battleArea").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => battleAction(button.dataset.kind)));
  $("#choices").innerHTML = "";
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  renderStats();
}

function battleAction(kind) {
  const action = CONTENT.battle.actions[kind];
  if (!action || state.stage !== "battle") return;
  recordChoice(action.title, action.body, "action");
  const before = { ...state.battle };
  applyEffects(action.effects);
  const context = {
    rescuedNow: state.battle.rescue - before.rescue,
    stableNow: state.battle.stable - before.stable,
    threatReduced: before.threat - state.battle.threat
  };
  const narration = kind === "stabilize" ? `${action.narration}${state.stats.resonance >= 2 ? action.narrationTrained : action.narrationUntrained}` : action.narration;
  const trusted = kind === "stabilize" ? state.trust.fafnira > 0 : state.clue;
  state.lastBattleBeat = {
    narration,
    speaker: trusted ? action.speakerTrust || action.speaker : action.speakerDefault || action.speaker,
    line: trusted ? action.lineTrust || action.line : action.lineDefault || action.line,
    journal: fill(action.journal, context)
  };
  log(state.lastBattleBeat.journal);
  if (state.battleRound >= 3) finishBattle();
  else { state.battleRound += 1; renderBattle(); }
}

function finishBattle() {
  state.stage = "decision";
  state.battle.pressure = Math.max(0, state.battle.threat - state.battle.guarded);
  applyEffects(CONTENT.battle.finishEffects);
  log(state.battle.pressure > 0 ? CONTENT.battle.finishJournal.pressured : CONTENT.battle.finishJournal.held);
  renderDecision();
}

function renderDecision() {
  setStageLabel("第一章・決斷", "界碑抉擇");
  const rescued = Math.min(5, state.evac + state.battle.rescue);
  const context = {
    rescued,
    lastBattleNarration: state.lastBattleBeat?.narration ?? "煙塵散開時，所有人的視線都投向界碑。",
    stabilityDescription: state.battle.stable >= 2 ? "界碑的裂紋停止蔓延，微光終於穩定下來。" : "界碑仍在震動，新的裂紋正沿著刻痕往外爬。"
  };
  setStory("裂隙獸退回碎石後方。村道上只剩喘息和落石聲。", CONTENT.battle.aftermath, false, context);
  renderChoices(CONTENT.battle.choices.map((choice) => ({ ...choice, choose: () => conclude(choice.id) })));
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  renderStats();
}

function conclude(choiceId) {
  state.stage = "ended";
  const ending = CONTENT.endings[choiceId];
  const rescued = Math.min(5, state.evac + state.battle.rescue);
  const stability = state.battle.stable;
  const preEffectTrust = { ...state.trust };
  applyEffects(ending.effects, { rescued });
  const sealResult = stability >= 2 ? "先前穩定過的刻紋承住了封印，沒有再次崩裂。" : "封印雖然合上，幾道新裂痕仍留在石面。";
  const evacResult = stability >= 2 ? "此前做過的穩定措施替村子爭取到一段時間。" : "沒有人留在界碑旁，新的裂光正從山後升起。";
  const answerStability = stability >= 2 ? "仍能勉強承受震盪" : "還在不安地顫動";
  const context = { rescued, sealResult, evacResult, answerStability };
  let result;
  if (choiceId === "answer") {
    result = {
      title: state.echoUnderstood ? ending.titleSuccess : ending.titleFailure,
      scene: state.echoUnderstood ? ending.sceneSuccess : ending.sceneFailure,
      reaction: state.echoUnderstood ? ending.reactionSuccess : ending.reactionFailure,
      summary: state.echoUnderstood ? ending.summarySuccess : ending.summaryFailure,
      hook: state.echoUnderstood ? ending.hookSuccess : ending.hookFailure
    };
  } else {
    const reaction = ending.reactions.find((item) => !item.when || conditionMatches(item.when));
    result = { title: ending.title, scene: ending.scene, reaction, summary: ending.summary, hook: ending.hook };
    if (choiceId === "seal" && preEffectTrust.ingvar > 0) result.reaction = ending.reactions[0];
  }
  result.scene = fill(result.scene, context);
  result.summary = fill(result.summary, context);
  result.hook = fill(result.hook, context);
  state.ending = { title: result.title, summary: result.summary, hook: result.hook, scene: result.scene, reaction: result.reaction, rescued, stability };
  renderEnding();
}

function renderEnding() {
  const result = state.ending;
  if (!result) return;
  setStageLabel("第一章・尾聲", "危機暫歇");
  const endingParagraphs = [
    result.scene || state.log.slice().reverse().find((entry) => entry.type === "scene")?.text || "裂隙暫時合攏，隊伍得以喘息片刻。",
    ...(result.reaction ? [result.reaction] : []),
    "沒有人立刻說話。你們都知道，這只是一段爭取來的時間；而你所做的決定，將跟著隊伍走向下一座界碑。"
  ];
  setStory("危機暫歇，遠方的天幕仍有裂光。", endingParagraphs);
  $("#choices").innerHTML = "";
  $("#continueArea").innerHTML = "";
  $("#endingArea").innerHTML = `<div class="ending-card"><h2>${escapeHTML(result.title)}</h2><p>${escapeHTML(result.summary)}</p><p class="next-hook">${escapeHTML(result.hook || "前往第二章，追查下一座失去方向的界碑。")}</p><p class="muted">本章記錄：撤離 ${result.rescued ?? Math.min(5, state.evac + state.battle.rescue)} 組居民｜界碑穩定 ${result.stability ?? state.battle.stable}｜調律者：洞察 ${state.stats.insight}・共鳴 ${state.stats.resonance}・堅忍 ${state.stats.grit}</p><div class="ending-actions"><button class="ending-button" id="goChapterTwo">前往第二章</button><button class="quiet-button" id="newRun">開始新週目</button></div></div>`;
  $("#goChapterTwo").addEventListener("click", () => openChapterTwo(readSave()));
  $("#newRun").addEventListener("click", reset);
  persistSave();
  renderStats();
}

function serializableSave() {
  const { log: chronicle, ...snapshot } = state;
  return {
    ...snapshot,
    version: 2,
    savedAt: new Date().toISOString(),
    chronicle
  };
}

function persistSave() {
  memorySave = serializableSave();
  try { localStorage.setItem(CONTENT.storageKey, JSON.stringify(memorySave)); }
  catch { /* Local storage may be unavailable in a restricted browser context. */ }
  renderSaveSlots();
}

function readSave() {
  try { return JSON.parse(localStorage.getItem(CONTENT.storageKey) || "null") ?? memorySave; }
  catch { return memorySave; }
}

function renderContinueButton() {
  const save = readSave();
  const area = $("#continueArea");
  if (!hasStoryProgress(save)) { area.innerHTML = ""; return; }
  area.innerHTML = `<button class="continue-button" type="button"><strong>承接自動存檔</strong><span>${escapeHTML(progressCode(save))}｜${escapeHTML(saveLocation(save))}｜${escapeHTML(formatSaveTime(save.savedAt))}</span></button>`;
  area.querySelector("button").addEventListener("click", () => resumeSnapshot(save));
}

function hasStoryProgress(save) {
  return Boolean(save && save.stage && save.stage !== "opening");
}

function saveLocation(save = state) {
  if (save.chapterTwoPhase?.startsWith("chapter3-") || save.chapterTwoPhase === "chapter3-entry") {
    const stage = save.chapterThreePhase ? CONTENT.chapterTwo.chapterThreeStages[save.chapterThreePhase] : null;
    return `第三章・${stage?.clock || "入口"}`;
  }
  if (["chapter2", "chapter2-ended"].includes(save.stage)) {
    const names = { entry: "章節入口", investigation: "觀星台調查", crisis: "星盤危機", aftermath: "危機餘波" };
    return `第二章・${names[save.chapterTwoPhase] || "星盤逆轉"}`;
  }
  if (save.stage === "actions") return `第一章・行動時段 ${Math.max(1, 4 - (save.slots ?? 3))} / 3`;
  if (save.stage === "battle") return `第一章・戰鬥第 ${save.battleRound || 1} 回合`;
  if (save.stage === "decision") return "第一章・結局抉擇";
  if (save.stage === "ended") return `第一章・${save.ending?.title || "尾聲"}`;
  return "第一章・潰堤前夜";
}

function choiceNumber(choices = [], id) {
  const index = choices.findIndex((choice) => choice.id === id);
  return index < 0 ? 0 : index + 1;
}

function progressCode(save = state) {
  if (save.chapterThreePhase || save.chapterTwoPhase === "chapter3-entry" || save.chapterTwoPhase?.startsWith("chapter3-")) {
    if (save.chapterTwoPhase === "chapter3-entry" && !save.chapterThreePhase) return "3-0-0";
    const phaseNumber = { trail: 1, door: 2, names: 3, finale: 4 }[save.chapterThreePhase] || 0;
    let branchNumber = 0;
    if (save.chapterThreePhase === "trail") {
      branchNumber = choiceNumber(CONTENT.chapterTwo.chapterThree[save.chapterTwoOutcome]?.choices, save.chapterThreeChoice);
    } else if (save.chapterThreePhase === "door") {
      branchNumber = choiceNumber(CONTENT.chapterTwo.chapterThreeStages.trail.choices, save.chapterThreeRidgeChoice);
    } else if (save.chapterThreePhase === "names") {
      branchNumber = choiceNumber(CONTENT.chapterTwo.chapterThreeStages.door.choices, save.chapterThreeDoorChoice);
    } else if (save.chapterThreePhase === "finale") {
      branchNumber = choiceNumber(CONTENT.chapterTwo.chapterThreeStages.names.choices, save.chapterThreeFinaleChoice);
    }
    return `3-${phaseNumber}-${branchNumber}`;
  }
  if (["chapter2", "chapter2-ended"].includes(save.stage)) {
    const phaseNumber = { entry: 1, investigation: 2, crisis: 3, aftermath: 4 }[save.chapterTwoPhase] || 0;
    const route = CONTENT.chapterTwo[save.chapterTwoRoute];
    let branchNumber = 0;
    if (save.chapterTwoPhase === "investigation") branchNumber = choiceNumber(route?.choices, save.chapterTwoEntryChoice);
    else if (save.chapterTwoPhase === "crisis") branchNumber = choiceNumber(CONTENT.chapterTwo.investigation[save.chapterTwoRoute]?.choices, save.chapterTwoInvestigation);
    else if (save.chapterTwoPhase === "aftermath") branchNumber = choiceNumber(CONTENT.chapterTwo.crisis.choices, save.chapterTwoChoice);
    return `2-${phaseNumber}-${branchNumber}`;
  }
  const phaseNumber = { opening: 0, actions: 1, battle: 2, decision: 3, ended: 4 }[save.stage] || 0;
  const battleActions = Object.entries(CONTENT.battle.actions).map(([id, choice]) => ({ id, ...choice }));
  const lastBattleAction = save.stage === "battle"
    ? [...(save.chronicle || save.log || [])].reverse().find((entry) => entry.type === "action" && battleActions.some((choice) => choice.title === entry.title))
    : null;
  const battleActionIndex = battleActions.findIndex((choice) => choice.title === lastBattleAction?.title);
  const branchNumber = save.stage === "actions"
    ? choiceNumber(CONTENT.opening.choices, save.stance)
    : save.stage === "battle" ? (battleActionIndex < 0 ? 0 : battleActionIndex + 1)
      : save.stage === "ended" ? choiceNumber(CONTENT.battle.choices, save.chapterChoice) : 0;
  return `1-${phaseNumber}-${branchNumber}`;
}

function formatSaveTime(value) {
  const date = value ? new Date(value) : null;
  return date && Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat("zh-TW", { dateStyle: "short", timeStyle: "short" }).format(date)
    : "時間未記錄";
}

function readManualSlots() {
  try {
    const slots = JSON.parse(localStorage.getItem(manualSlotsKey) || "[]");
    return Array.isArray(slots) ? slots.slice(0, 3) : [];
  } catch { return []; }
}

function renderSaveSlots() {
  const container = $("#saveSlots");
  if (!container) return;
  const autoSave = memorySave || readSave();
  const autoStatus = $("#autoSaveStatus");
  if (autoStatus) autoStatus.textContent = hasStoryProgress(autoSave)
    ? `自動存檔 ${progressCode(autoSave)}｜${saveLocation(autoSave)}｜${formatSaveTime(autoSave.savedAt)}`
    : "自動存檔會在故事開始後建立。";
  const slots = readManualSlots();
  const canSave = state.stage !== "opening";
  container.innerHTML = [0, 1, 2].map((index) => {
    const slot = slots[index];
    const occupied = Boolean(slot?.snapshot);
    const label = `存檔位 ${index + 1}`;
    const details = occupied
      ? `<p class="save-slot-meta">進度 ${escapeHTML(slot.progress || progressCode(slot.snapshot))}<br>${escapeHTML(slot.location || saveLocation(slot.snapshot))}<br>${escapeHTML(formatSaveTime(slot.savedAt))}</p>`
      : '<p class="save-slot-meta save-slot-empty">空白存檔位</p>';
    return `<div class="save-slot"><div class="save-slot-top"><strong>${label}</strong><span>${occupied ? "已保存" : "空白"}</span></div>${details}<div class="save-slot-actions"><button class="save-slot-button" data-save-slot="${index}" ${canSave ? "" : "disabled"}>${occupied ? "覆蓋" : "存入"}</button><button class="save-slot-button" data-load-slot="${index}" ${occupied ? "" : "disabled"}>讀取</button><button class="save-slot-button delete" data-delete-slot="${index}" ${occupied ? "" : "disabled"}>刪除</button></div></div>`;
  }).join("");
  container.querySelectorAll("[data-save-slot]").forEach((button) => button.addEventListener("click", () => saveManualSlot(Number(button.dataset.saveSlot))));
  container.querySelectorAll("[data-load-slot]").forEach((button) => button.addEventListener("click", () => loadManualSlot(Number(button.dataset.loadSlot))));
  container.querySelectorAll("[data-delete-slot]").forEach((button) => button.addEventListener("click", () => deleteManualSlot(Number(button.dataset.deleteSlot))));
}

function saveManualSlot(index) {
  if (state.stage === "opening") return;
  const slots = readManualSlots();
  if (slots[index]?.snapshot && !window.confirm(`要覆蓋存檔位 ${index + 1} 嗎？`)) return;
  slots[index] = { savedAt: new Date().toISOString(), location: saveLocation(), progress: progressCode(), snapshot: serializableSave() };
  try {
    localStorage.setItem(manualSlotsKey, JSON.stringify(slots));
    renderSaveSlots();
  } catch {
    window.alert("無法保存存檔。請確認瀏覽器儲存空間未滿，或改用同一瀏覽器開啟遊戲。");
  }
}

function loadManualSlot(index) {
  const slot = readManualSlots()[index];
  if (!slot?.snapshot) return;
  if (hasStoryProgress(readSave()) && !window.confirm("讀取後會取代目前的自動續玩進度；三個手動存檔不受影響。仍要讀取嗎？")) return;
  resumeSnapshot(slot.snapshot);
}

function deleteManualSlot(index) {
  const slots = readManualSlots();
  if (!slots[index]?.snapshot || !window.confirm(`要刪除存檔位 ${index + 1} 嗎？`)) return;
  slots[index] = null;
  try {
    localStorage.setItem(manualSlotsKey, JSON.stringify(slots));
    renderSaveSlots();
  } catch { /* The existing slot remains available if storage is restricted. */ }
}

function chapterTwoRouteKey(save) {
  if (save.chapterChoice === "answer") return save.echoUnderstood ? "echo_known" : "echo_unknown";
  return save.chapterChoice;
}

function resumeSnapshot(save) {
  if (!save) return;
  const defaults = initialState();
  state = {
    ...defaults,
    ...save,
    stats: { ...defaults.stats, ...save.stats },
    trust: { ...defaults.trust, ...save.trust },
    battle: { ...defaults.battle, ...save.battle },
    log: Array.isArray(save.chronicle) ? save.chronicle : Array.isArray(save.log) ? save.log : []
  };
  persistSave();
  if (["chapter2", "chapter2-ended", "chapter3-entry", "chapter3-ready"].includes(state.stage)
      || state.chapterTwoPhase?.startsWith("chapter3-") || state.chapterTwoPhase === "chapter3-entry") {
    openChapterTwo(state);
    return;
  }
  if (state.stage === "actions") renderActions();
  else if (state.stage === "battle") renderBattle();
  else if (state.stage === "decision") renderDecision();
  else if (state.stage === "ended") renderEnding();
  else renderOpening();
  persistSave();
  renderStats();
  renderLog();
}

function openChapterTwo(save) {
  if (!save?.chapterChoice) return;
  state = { ...initialState(), ...save, stage: "chapter2", chapterTwoRoute: chapterTwoRouteKey(save), slots: 0 };
  if (Array.isArray(save.chronicle)) state.log = save.chronicle;
  else if (Array.isArray(save.log)) state.log = save.log;
  if (state.chapterTwoPhase === "chapter3-entry" || (state.chapterTwoPhase === "chapter3-ready" && !state.chapterThreePhase)) {
    openChapterThreeEntrance();
    return;
  }
  if (state.chapterTwoPhase?.startsWith("chapter3-") && state.chapterThreePhase) {
    state.chapterThreeAstridJoined = true;
    state.chapterThreeGrimmJoined = true;
    state.trust.astrid = Math.max(state.trust.astrid ?? 0, 1);
    state.trust.grimm = Math.max(state.trust.grimm ?? 0, 1);
    renderChapterThreePhase(state.chapterThreePhase);
    return;
  }
  if (state.chapterTwoPhase === "aftermath") {
    renderChapterTwoAftermath(state.chapterTwoOutcome);
    return;
  }
  if (state.chapterTwoPhase === "investigation") {
    renderChapterTwoInvestigation();
    return;
  }
  const route = CONTENT.chapterTwo[state.chapterTwoRoute];
  if (state.chapterTwoPhase === "crisis") {
    renderChapterTwoCrisis();
  } else {
    state.chapterTwoPhase = "entry";
    setStageLabel("第二章・承接", "觀星台・清晨");
    setStory(route.title, route.paragraphs);
    renderChoices(route.choices.map((choice) => ({ ...choice, choose: () => resolveChapterTwo(choice) })));
  }
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = "";
  renderStats();
}

function renderChapterTwoInvestigation() {
  const route = CONTENT.chapterTwo.investigation[state.chapterTwoRoute];
  const entry = CONTENT.chapterTwo[state.chapterTwoRoute].choices.find((choice) => choice.id === state.chapterTwoEntryChoice);
  state.stage = "chapter2";
  state.chapterTwoPhase = "investigation";
  setStageLabel("第二章・調查", "觀星台・線索");
  setStory(route.title, [entry?.outcome, ...route.paragraphs].filter(Boolean));
  renderChoices(route.choices.map((choice) => ({ ...choice, choose: () => resolveChapterTwo(choice) })));
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = "";
  renderStats();
}

function renderChapterTwoCrisis() {
  const investigation = CONTENT.chapterTwo.investigation[state.chapterTwoRoute].choices.find((choice) => choice.id === state.chapterTwoInvestigation);
  state.stage = "chapter2";
  state.chapterTwoPhase = "crisis";
  setStageLabel("第二章・危機", "星盤逆轉");
  setStory(CONTENT.chapterTwo.crisis.title, [investigation?.outcome, ...CONTENT.chapterTwo.crisis.paragraphs].filter(Boolean));
  renderChoices(CONTENT.chapterTwo.crisis.choices.map((item) => ({ ...item, choose: () => resolveChapterTwo(item) })));
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = "";
  renderStats();
}

function renderChapterTwoAftermath(outcome) {
  const finale = CONTENT.chapterTwo.finales[outcome];
  state.stage = "chapter2";
  state.chapterTwoPhase = "aftermath";
  setStageLabel("第二章・餘波", "天亮以前");
  setStory(finale.title, [...finale.paragraphs, finale.summary, "觀星台的巡守已經找回部分方位，但每一條路都要有人承擔留下來的工作。天色很快就會亮，你們得決定隊伍下一步怎麼走。"]);
  const choices = CONTENT.chapterTwo.aftermathChoices[outcome];
  renderChoices(choices.map((choice) => ({ ...choice, choose: () => resolveChapterTwo(choice) })));
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = "";
  renderStats();
}

function openChapterThreeEntrance() {
  const chapter = CONTENT.chapterTwo.chapterThree[state.chapterTwoOutcome];
  state.stage = "chapter3-entry";
  state.chapterTwoPhase = "chapter3-entry";
  state.chapterThreeAstridJoined = true;
  state.trust.astrid = Math.max(state.trust.astrid ?? 0, 1);
  setStageLabel("第三章・序幕", "霜環峽／盲星谷");
  setStory(chapter.title, chapter.paragraphs);
  renderChoices(chapter.choices.map((choice) => ({
    title: choice.title,
    description: choice.description,
    choose: () => beginChapterThree(choice)
  })));
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = "";
  renderStats();
}

function beginChapterThree(choice) {
  state.chapterThreeChoice = choice.id;
  state.chapterThreeEntryOutcome = choice.outcome;
  state.chapterThreePreviousOutcome = choice.outcome;
  state.nextGoal = choice.nextGoal;
  renderChapterThreePhase("trail", choice.outcome);
  persistSave();
  renderStats();
}

function renderChapterThreePhase(phase = state.chapterThreePhase, previousOutcome = state.chapterThreePreviousOutcome) {
  state.stage = "chapter3-ready";
  state.chapterThreePhase = phase;
  state.chapterTwoPhase = `chapter3-${phase}`;
  if (phase === "trail") {
    state.chapterThreeGrimmJoined = true;
    state.trust.grimm = Math.max(state.trust.grimm ?? 0, 1);
  }
  if (phase === "finale") {
    renderChapterThreeFinale(previousOutcome);
    return;
  }
  const chapter = CONTENT.chapterTwo.chapterThreeStages[phase];
  if (!chapter) return;
  const phaseLabel = phase === "trail" ? "霜環峽" : phase === "door" ? "古關石門" : "盲星谷";
  setStageLabel(`第三章・${phaseLabel}`, chapter.clock);
  setStory(chapter.title, [previousOutcome, ...chapter.paragraphs].filter(Boolean));
  renderChoices(chapter.choices.map((choice) => ({ ...choice, choose: () => resolveChapterThree(choice) })));
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = "";
  renderStats();
}

function resolveChapterThree(choice) {
  applyEffects(choice.effects);
  state.chapterThreePreviousOutcome = choice.outcome;
  if (state.chapterThreePhase === "trail") {
    state.chapterThreeRidgeChoice = choice.id;
    const ally = choice.id === "follow_ruts" ? "grimm" : "astrid";
    state.trust[ally] = Math.min(3, (state.trust[ally] ?? 0) + 1);
    state.nextGoal = "確認石門後的敲擊來源";
    renderChapterThreePhase("door", choice.outcome);
  } else if (state.chapterThreePhase === "door") {
    state.chapterThreeDoorChoice = choice.id;
    const ally = choice.id === "break_seal" ? "grimm" : "astrid";
    state.trust[ally] = Math.min(3, (state.trust[ally] ?? 0) + 1);
    state.nextGoal = "辨認盲星谷界碑上的名字";
    renderChapterThreePhase("names", choice.outcome);
  } else if (state.chapterThreePhase === "names") {
    state.chapterThreeFinaleChoice = choice.id;
    state.nextGoal = "循著新星圖追查下一座界碑";
    renderChapterThreePhase("finale", choice.outcome);
  }
  persistSave();
  renderStats();
}

function renderChapterThreeFinale(previousOutcome = state.chapterThreePreviousOutcome) {
  const finale = CONTENT.chapterTwo.chapterThreeStages.finales[state.chapterThreeFinaleChoice];
  if (!finale) return;
  state.chapterThreeJoined = true;
  state.trust.sern = Math.max(state.trust.sern ?? 0, state.chapterThreeFinaleChoice === "offer_name" ? 2 : 1);
  setStageLabel("第三章・尾聲", "盲星谷・回聲");
  setStory(`第三章｜${finale.title}`, [previousOutcome, ...finale.paragraphs].filter(Boolean));
  $("#choices").innerHTML = "";
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = `<div class="ending-card"><h2>${escapeHTML(finale.title)}</h2><p>${escapeHTML(finale.summary)}</p><p class="next-hook">${escapeHTML(finale.hook)}</p><div class="ending-actions"><button class="ending-button" id="reopenChapterThreeFinale">重新查看尾聲</button><button class="quiet-button" id="newRun">開始新週目</button></div></div>`;
  $("#reopenChapterThreeFinale").addEventListener("click", () => renderChapterThreePhase("finale"));
  $("#newRun").addEventListener("click", reset);
  persistSave();
  renderStats();
}

function resolveChapterTwo(choice) {
  if (state.chapterTwoPhase === "entry") {
    applyEffects(choice.effects);
    state.chapterTwoEntryChoice = choice.id;
    log(choice.outcome);
    state.chapterTwoPhase = "investigation";
    renderChapterTwoInvestigation();
    persistSave();
    return;
  }
  if (state.chapterTwoPhase === "investigation") {
    applyEffects(choice.effects);
    state.chapterTwoInvestigation = choice.id;
    log(choice.outcome);
    state.chapterTwoPhase = "crisis";
    renderChapterTwoCrisis();
    persistSave();
    return;
  }
  if (state.chapterTwoPhase === "crisis") {
    applyEffects(choice.effects);
    state.chapterTwoChoice = choice.id;
    state.chapterTwoOutcome = choice.id;
    state.chapterTwoPhase = "aftermath";
    log(choice.outcome);
    renderChapterTwoAftermath(choice.id);
    persistSave();
    return;
  }
  if (state.chapterTwoPhase === "aftermath") {
    applyEffects(choice.effects);
    state.chapterTwoPhase = "chapter3-entry";
    log(`隊伍決定：${choice.title}。`);
    openChapterThreeEntrance();
    persistSave();
  }
}

function reset() {
  if (hasStoryProgress(readSave()) && !window.confirm("重新開始會重設自動續玩進度；三個手動存檔會保留。要重新開始嗎？")) return;
  try { localStorage.removeItem(CONTENT.storageKey); } catch { /* Ignore restricted storage. */ }
  memorySave = null;
  state = initialState();
  $("#log").innerHTML = "";
  renderOpening();
  renderStats();
  renderLog();
  renderSaveSlots();
}

function downloadStoryLog() {
  const entries = chronicleEntries();
  const lines = ["星幽啟示錄：元素潰堤", "", "當蒼穹的裂縫再次甦醒，沉睡三千年的回聲，終於傳到了凡人的耳中。", ""];
  let currentChapter = "";
  let sceneSeenInChapter = false;
  let sectionCount = 0;
  let choiceCount = 0;
  let lastSection = "";
  for (const entry of entries) {
    if (entry.chapter !== currentChapter) {
      currentChapter = entry.chapter;
      sceneSeenInChapter = false;
      sectionCount = 0;
      choiceCount = 0;
      lastSection = "";
      lines.push("## " + chapterHeading(currentChapter), "");
    }
    if (entry.type === "scene") {
      const section = chronicleSectionTitle(entry, currentChapter, !sceneSeenInChapter);
      sceneSeenInChapter = true;
      if (section && section !== lastSection) {
        sectionCount += 1;
        lastSection = section;
        lines.push(`### ${sectionLabel(sectionCount)}　${section}`, "");
      }
      lines.push(entry.text || "", "");
    } else {
      lines.push(choiceAsProse(entry, choiceCount++), "");
    }
  }
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "星幽啟示錄-故事紀錄-" + new Date().toISOString().slice(0, 10) + ".txt";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function initTextSizeControls() {
  const key = `${CONTENT.storageKey}:readerScale`;
  let scale = 1.1;
  try {
    const saved = Number(localStorage.getItem(key));
    if (Number.isFinite(saved) && saved >= 0.9 && saved <= 1.4) scale = saved;
  } catch { /* Keep the default when storage is unavailable. */ }
  const apply = () => {
    document.documentElement.style.setProperty("--reader-scale", scale);
    $("#textScaleValue").textContent = `文字 ${Math.round(scale * 100)}%`;
    try { localStorage.setItem(key, String(scale)); } catch { /* The in-page setting still works. */ }
  };
  $("#fontSmaller").addEventListener("click", () => { scale = Math.max(0.9, Math.round((scale - 0.1) * 10) / 10); apply(); });
  $("#fontLarger").addEventListener("click", () => { scale = Math.min(1.4, Math.round((scale + 0.1) * 10) / 10); apply(); });
  apply();
}

$("#restart").addEventListener("click", reset);
$("#exportLog").addEventListener("click", downloadStoryLog);
const savedRecord = readSave();
if (Array.isArray(savedRecord?.chronicle)) state.log = savedRecord.chronicle;
else if (Array.isArray(savedRecord?.log)) state.log = savedRecord.log;
initTextSizeControls();
renderOpening();
renderStats();
renderLog();
renderSaveSlots();
