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
  chapterFourPhase: null,
  chapterFourPreviousOutcome: null,
  chapterFourApproachChoice: null,
  chapterFourGateChoice: null,
  chapterFourArchiveChoice: null,
  chapterFourCoreChoice: null,
  chapterFourComplete: false,
  chapterFivePhase: null,
  chapterFivePreviousOutcome: null,
  chapterFiveHarborChoice: null,
  chapterFiveCrossingChoice: null,
  chapterFiveLighthouseChoice: null,
  chapterFiveLensChoice: null,
  chapterFiveComplete: false,
  undercityRoutePhase: null,
  undercityRouteEntryOutcome: null,
  undercityRoutePreviousOutcome: null,
  undercityRouteAwaitingNext: false,
  undercityRouteNextPhase: null,
  undercityRouteTrust: 0,
  undercityRouteCivilians: 0,
  undercityRouteEvidence: 0,
  undercityRouteEnding: null,
  chapterSixPhase: null,
  chapterSixPreviousOutcome: null,
  chapterSixApproachChoice: null,
  chapterSixDispatchChoice: null,
  chapterSixTruthChoice: null,
  chapterSixCovenantChoice: null,
  chapterSixSideMissionReturned: false,
  chapterSixComplete: false,
  chapterSevenPhase: null,
  chapterSevenPreviousOutcome: null,
  chapterSevenApproachChoice: null,
  chapterSevenThresholdChoice: null,
  chapterSevenMemoryChoice: null,
  chapterSevenHeartChoice: null,
  chapterSevenComplete: false,
  chapterEightPhase: null,
  chapterEightPreviousOutcome: null,
  chapterEightReturnChoice: null,
  chapterEightRefugeChoice: null,
  chapterEightCovenantChoice: null,
  chapterEightRiftChoice: null,
  chapterEightComplete: false,
  chapterNinePhase: null,
  chapterNinePreviousOutcome: null,
  chapterNineGatheringChoice: null,
  chapterNineTestimonyChoice: null,
  chapterNineEncounterChoice: null,
  chapterNineWitnessChoice: null,
  chapterNineRitualChoice: null,
  chapterNineThresholdChoice: null,
  chapterNineComplete: false,
  chapterTenPhase: null,
  chapterTenPreviousOutcome: null,
  chapterTenArrivalChoice: null,
  chapterTenLifelineChoice: null,
  chapterTenBeastsChoice: null,
  chapterTenReckoningChoice: null,
  chapterTenNameChoice: null,
  chapterTenMethodChoice: null,
  chapterTenCoreChoice: null,
  chapterTenCoreBaseline: null,
  chapterTenComplete: false,
  slots: 3,
  actions: [],
  stats: { insight: 0, resonance: 0, grit: 0 },
  trust: { ingvar: 0, freya: 0, fafnira: 0, astrid: 0, grimm: 0, sern: 0, eilan: 0 },
  chapterThreeAstridJoined: false,
  chapterThreeGrimmJoined: false,
  chapterThreeJoined: false,
  chapterFiveEilanJoined: false,
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
let preserveStoredSaveDuringBoot = false;

const companionData = [
  { id: "ingvar", name: "英格瓦・龍心", role: "前排護衛｜古龍遺跡", image: "ingvar-cutout.webp" },
  { id: "freya", name: "弗蕾亞・龍脈", role: "治療護佑｜古龍遺跡", image: "freya-cutout.webp" },
  { id: "fafnira", name: "法芙娜・暗瞳", role: "遠程詛咒｜古龍遺跡", image: "fafnira-cutout.webp" },
  { id: "astrid", name: "阿斯特麗德・龍怒", role: "風系斥候｜龍怒逆角", image: "astrid-cutout.webp", unlock: "chapterThreeAstridJoined" },
  { id: "grimm", name: "格里姆・破裂之鱗", role: "近戰突破｜熔岩逆鱗", image: "grimm-cutout.webp", unlock: "chapterThreeGrimmJoined" },
  { id: "sern", name: "瑟恩・遺名", role: "守碑記錄者｜盲星谷", image: "sern-cutout.webp", unlock: "chapterThreeJoined" },
  { id: "eilan", name: "燈守・伊蘭", role: "導航與古鏡｜無星渡口", image: "eilan-cutout.webp", unlock: "chapterFiveEilanJoined" }
];
const starEaterCharacter = { id: "star-eater", name: "星噬者", role: "被遺忘的第一位守護者", image: "star-eater-cutout.webp" };
const asterosCharacter = { id: "asteros", name: "阿斯忒洛斯", role: "真名顯現・第一守護者", image: "asteros-true-form.png" };
const watcherCharacter = { id: "watcher", name: "守望者", role: "盟約保管者", image: "watcher-cutout.png" };

const actionData = Object.entries(CONTENT.actions).map(([id, action]) => ({ id, ...action }));
const portraitRoot = "assets/characters/";
const openingScene = "assets/scenes/boundary-village-dusk.webp";
const manualSlotsKey = `${CONTENT.storageKey}:manual-slots-v1`;

function characterForSpeaker(speaker = "") {
  if (speaker.includes("星噬者")) return starEaterCharacter;
  if (speaker.includes("守望者")) return watcherCharacter;
  if (speaker.includes("伊蘭")) return companionData[6];
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
  if (state.stage === "chapter4-ready") {
    const cast = [...new Map(paragraphs
      .filter((item) => typeof item === "object" && item.speaker)
      .map((item) => characterForSpeaker(item.speaker))
      .filter(Boolean)
      .map((person) => [person.id, person])).values()];
    if (!cast.length) cast.push(companionData[5]);
    const backgrounds = {
      approach: "chapter-four-approach.webp",
      gate: "chapter-four-gate.webp",
      archive: "chapter-four-archive.webp",
      core: "chapter-four-core.webp",
      finale: "chapter-four-core.webp",
      failureEntry: "chapter-four-failure-entry.webp",
      failureRings: "chapter-four-failure-rings.webp",
      failureBridge: "chapter-four-failure-bridge.webp",
      failureAnchor: "chapter-four-failure-vanish.webp",
      failureFinale: "chapter-four-failure-ending.webp"
    };
    return { background: `assets/scenes/${backgrounds[state.chapterFourPhase] || backgrounds.approach}`, characters: cast, name: "倒懸之城・維洛斯", mood: `chapter-four-${cast.length}` };
  }
  if (state.stage === "chapter5-ready") {
    const failurePhase = String(state.chapterFivePhase || "").startsWith("failure");
    const cast = [...new Map(paragraphs
      .filter((item) => typeof item === "object" && item.speaker)
      .map((item) => characterForSpeaker(item.speaker))
      .filter(Boolean)
      .map((person) => [person.id, person])).values()];
    if (!cast.length) cast.push(failurePhase ? starEaterCharacter : companionData[5]);
    const backgrounds = {
      harbor: "chapter-five-harbor.webp",
      undercity: "chapter-five-crossing.webp",
      crossing: "chapter-five-crossing.webp",
      lighthouse: "chapter-five-lighthouse.webp",
      lens: "chapter-five-lens.webp",
      finale: "chapter-five-lens.webp",
      failureEntry: "chapter-five-failure-entry.webp",
      failureCrossing: "chapter-five-failure-crossing.webp",
      failureEcho: "chapter-five-failure-echo.webp",
      failureHarbor: "chapter-five-failure-harbor.webp",
      failureFinale: "chapter-five-failure-ending.webp"
    };
    return { background: `assets/scenes/${backgrounds[state.chapterFivePhase] || backgrounds.harbor}`, characters: cast, name: "無星渡口・沉星潮", mood: `chapter-five-${cast.length}` };
  }
  if (state.stage === "undercity-route-ready") {
    const isAsterosEnding = state.undercityRoutePhase === "finale" && state.undercityRouteEnding === "shared_stars";
    const cast = isAsterosEnding ? [asterosCharacter] : [...new Map(paragraphs
      .filter((item) => typeof item === "object" && item.speaker)
      .map((item) => characterForSpeaker(item.speaker))
      .filter(Boolean)
      .map((person) => [person.id, person])).values()];
    if (!cast.length) cast.push(companionData[5]);
    const endings = {
      tide_network: "undercity-ending-tide-network.webp",
      new_sea: "undercity-ending-new-sea.webp",
      tide_gate: "undercity-ending-tide-gate.webp",
      names_returned: "undercity-ending-names-returned.webp",
      name_kept: "undercity-ending-names-returned.webp",
      shared_stars: "undercity-ending-shared-stars.png"
    };
    const backgrounds = {
      six: "chapter-five-crossing.webp",
      seven: "undercity-old-station.webp",
      eight: "undercity-submerged-archive.webp",
      nine: "undercity-tide-council.webp",
      ten: "undercity-tide-heart.webp",
      name_return: "undercity-name-corridor.webp",
      "ending-choice": "undercity-tide-heart.webp",
      finale: endings[state.undercityRouteEnding] || "undercity-tide-heart.webp"
    };
    return { background: `assets/scenes/${backgrounds[state.undercityRoutePhase] || backgrounds.six}`, characters: cast, name: "失星航路篇", mood: isAsterosEnding ? "undercity-true-name" : `undercity-route-${cast.length}` };
  }
  if (state.stage === "chapter6-ready") {
    const cast = [...new Map(paragraphs
      .filter((item) => typeof item === "object" && item.speaker)
      .map((item) => characterForSpeaker(item.speaker))
      .filter(Boolean)
      .map((person) => [person.id, person])).values()];
    if (!cast.length) cast.push(companionData[5]);
    const backgrounds = {
      arrival: "chapter-six-arrival.webp",
      split: "chapter-six-split.webp",
      revelation: "chapter-six-covenant.webp",
      heart: "chapter-six-heart.webp",
      finale: "chapter-six-heart.webp"
    };
    return { background: `assets/scenes/${backgrounds[state.chapterSixPhase] || backgrounds.arrival}`, characters: cast, name: "七約聖所", mood: `chapter-six-${cast.length}` };
  }
  if (state.stage === "chapter7-ready") {
    const cast = [...new Map(paragraphs
      .filter((item) => typeof item === "object" && item.speaker)
      .map((item) => characterForSpeaker(item.speaker))
      .filter(Boolean)
      .map((person) => [person.id, person])).values()];
    if (!cast.length) cast.push(companionData[5]);
    const backgrounds = {
      arrival: "chapter-seven-arrival.webp",
      threshold: "chapter-seven-threshold.webp",
      memory: "chapter-seven-memory.webp",
      heart: "chapter-seven-heart.webp",
      finale: "chapter-seven-heart.webp"
    };
    return { background: `assets/scenes/${backgrounds[state.chapterSevenPhase] || backgrounds.arrival}`, characters: cast, name: "沉眠星群", mood: `chapter-seven-${cast.length}` };
  }
  if (state.stage === "chapter8-ready") {
    const failurePhase = String(state.chapterEightPhase || "").startsWith("failure");
    const cast = [...new Map(paragraphs
      .filter((item) => typeof item === "object" && item.speaker)
      .map((item) => characterForSpeaker(item.speaker))
      .filter(Boolean)
      .map((person) => [person.id, person])).values()];
    if (!cast.length) cast.push(failurePhase ? starEaterCharacter : companionData[5]);
    const backgrounds = {
      return: "chapter-eight-return.webp",
      refuge: "chapter-eight-refuge.webp",
      covenant: "chapter-eight-covenant.webp",
      rift: "chapter-eight-rift.webp",
      finale: "chapter-eight-rift.webp",
      failureEntry: "chapter-eight-failure-entry.webp",
      failureDescent: "chapter-eight-failure-descent.webp",
      failureAnchor: "chapter-eight-failure-anchor.webp",
      failureName: "chapter-eight-failure-name.webp",
      failureFinale: "chapter-eight-failure-ending.webp"
    };
    return { background: `assets/scenes/${backgrounds[state.chapterEightPhase] || backgrounds.return}`, characters: cast, name: "裂星前夜", mood: `chapter-eight-${cast.length}` };
  }
  if (state.stage === "chapter9-ready") {
    const cast = [...new Map(paragraphs
      .filter((item) => typeof item === "object" && item.speaker)
      .map((item) => characterForSpeaker(item.speaker))
      .filter(Boolean)
      .map((person) => [person.id, person])).values()];
    if (!cast.length) cast.push(companionData[0]);
    const backgrounds = {
      gathering: "chapter-nine-gathering.webp",
      testimony: "chapter-nine-testimony.webp",
      encounter: "chapter-nine-encounter.webp",
      witnesses: "chapter-nine-witnesses.webp",
      ritual: "chapter-nine-ritual.webp",
      threshold: "chapter-nine-threshold.webp",
      finale: "chapter-nine-threshold.webp"
    };
    return { background: `assets/scenes/${backgrounds[state.chapterNinePhase] || backgrounds.gathering}`, characters: cast, name: "七席將明", mood: `chapter-nine-${cast.length}` };
  }
  if (state.stage === "chapter10-ready") {
    const cast = [...new Map(paragraphs
      .filter((item) => typeof item === "object" && item.speaker)
      .map((item) => characterForSpeaker(item.speaker))
      .filter(Boolean)
      .map((person) => [person.id, person])).values()];
    const isFinale = state.chapterTenPhase === "finale";
    if (!cast.length && !isFinale) cast.push(companionData[0]);
    const backgrounds = {
      arrival: "chapter-ten-arrival.webp",
      lifelines: "chapter-ten-lifelines.webp",
      beasts: "chapter-ten-beasts.webp",
      reckoning: "chapter-ten-reckoning.webp",
      name: "chapter-ten-name.webp",
      method: "chapter-ten-method.webp",
      core: "chapter-ten-core.webp",
      finale: "chapter-ten-core.webp"
    };
    const finaleBackgrounds = {
      shared_return: "chapter-ten-ending-shared-return.webp",
      guard_together: "chapter-ten-ending-guard-together.webp",
      release_elements: "chapter-ten-ending-release-elements.webp",
      rewind_first_break: "chapter-ten-ending-rewind.webp"
    };
    const finaleNames = {
      shared_return: "共同承擔的黎明",
      guard_together: "門後仍有回聲",
      release_elements: "洪流之後的新大地",
      rewind_first_break: "沒有人記得的守護"
    };
    const background = isFinale
      ? finaleBackgrounds[state.chapterTenCoreChoice] || backgrounds.finale
      : backgrounds[state.chapterTenPhase] || backgrounds.arrival;
    return { background: `assets/scenes/${background}`, characters: cast, name: finaleNames[state.chapterTenCoreChoice] || "萬象歸潮", mood: `chapter-ten-${cast.length}` };
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
  if (state.stage === "undercity-route-ready") {
    if (state.undercityRoutePhase === "ending-choice") return "失星航路篇・最終抉擇";
    return CONTENT.undercityRoute.stages[state.undercityRoutePhase]?.chapter || "失星航路篇・結局";
  }
  if (state.stage === "chapter10-ready") return "第十章";
  if (state.stage === "chapter9-ready") return "第九章";
  if (state.stage === "chapter8-ready") return "第八章";
  if (state.stage === "chapter7-ready") return "第七章";
  if (state.stage === "chapter6-ready") return "第六章";
  if (state.stage === "chapter5-ready") return "第五章";
  if (state.stage === "chapter4-ready") return "第四章";
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
  const chapterLabel = state.stage === "undercity-route-ready" ? `失星航路篇・${chapterName()}` : state.stage === "chapter10-ready" ? "第十章・萬象歸潮" : state.stage === "chapter9-ready" ? "第九章・七席將明" : state.stage === "chapter8-ready" ? "第八章・裂星前夜" : state.stage === "chapter7-ready" ? "第七章・沉眠星群" : state.stage === "chapter6-ready" ? "第六章・七約殘響" : state.stage === "chapter5-ready" ? "第五章・無星渡口" : state.stage === "chapter4-ready" ? "第四章・倒懸之城" : ["chapter3-entry", "chapter3-ready"].includes(state.stage) ? "第三章・盲星谷" : ["chapter2", "chapter2-ended"].includes(state.stage) ? "第二章・星盤逆轉" : "潰堤前夜";
  const footer = state.stage === "undercity-route-ready" ? "星圖之外的選擇，將決定維洛斯與洪流的未來" : state.stage === "chapter10-ready" ? "每個名字都將親自走到故事的結局" : state.stage === "chapter9-ready" ? "七者將共同走向元素潰堤的源頭" : state.stage === "chapter8-ready" ? "所有被遺忘的名字，都將在大結局前得到回應" : state.stage === "chapter7-ready" ? "每位星獸都有權選擇自己的名字與盟約" : state.stage === "chapter6-ready" ? "同伴分頭尋找真相；每條線索都會改變最後的抉擇" : state.stage === "chapter5-ready" ? "沉星潮追逐記憶；隊伍必須決定如何回答" : state.stage === "chapter4-ready" ? "全員已集結；每個決定都將改變維洛斯的命運" : ["chapter3-entry", "chapter3-ready"].includes(state.stage) ? "先前的決定仍在改變這段旅程的代價" : ["chapter2", "chapter2-ended"].includes(state.stage) ? "第一章的選擇仍在改變隊伍能承擔的代價" : "選擇將影響同行者、撤離狀況與界碑命運";
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

function canUnlockUndercityTrueNameEnding() {
  return state.undercityRouteEvidence >= 2
    && state.undercityRouteTrust >= 3
    && state.undercityRouteCivilians >= 3;
}

function renderStats() {
  const stats = [
    ["洞察", state.stats.insight],
    ["共鳴", state.stats.resonance],
    ["堅忍", state.stats.grit]
  ];
  $("#stats").innerHTML = stats.map(([name, value]) => `<div class="stat-row"><span>${name}</span><span class="pip-row">${[1, 2, 3].map((n) => `<i class="pip ${n <= value ? "on" : ""}"></i>`).join("")}</span></div>`).join("");
  $("#companions").innerHTML = companionData.filter((person) => !person.unlock || state[person.unlock]).map((person) => {
    const onSideMission = state.stage === "chapter6-ready" && state.chapterSixPhase === "revelation" && !state.chapterSixSideMissionReturned
      && ((state.chapterSixDispatchChoice === "anchor_team" && ["astrid", "grimm"].includes(person.id))
        || (state.chapterSixDispatchChoice === "archive_team" && ["fafnira", "sern"].includes(person.id)));
    return `<div class="companion"><span class="companion-portrait-frame"><img class="companion-portrait" src="${portraitRoot}${person.image}" alt=""></span><div class="companion-info"><div class="companion-top"><span>${person.name}</span><span class="muted">信任</span></div><div class="companion-role">${person.role}${onSideMission ? "｜旁支任務中" : ""}</div><div class="trust">${[1, 2, 3].map((n) => `<i class="${n <= (state.trust[person.id] ?? 0) ? "on" : ""}"></i>`).join("")}</div></div></div>`;
  }).join("");
  const chapterThreeRecruits = [state.chapterThreeAstridJoined, state.chapterThreeGrimmJoined, state.chapterThreeJoined].filter(Boolean).length;
  const newPartyNote = [chapterThreeRecruits ? `古龍遺跡小隊・${chapterThreeRecruits}位新成員會合` : "古龍遺跡小隊", state.chapterFiveEilanJoined ? "燈守伊蘭同行" : ""].filter(Boolean).join("・");
  $("#partyNote").textContent = state.stage === "opening" ? "尚未會合" : newPartyNote;
  let stability = null;
  if (state.stage === "actions") stability = Math.max(12, 100 - state.actions.length * 12);
  if (["battle", "decision", "ended", "chapter2", "chapter2-ended", "chapter3-entry", "chapter3-ready", "chapter4-ready", "chapter5-ready", "chapter6-ready", "chapter7-ready", "chapter8-ready", "chapter9-ready", "chapter10-ready", "undercity-route-ready"].includes(state.stage)) stability = Math.max(12, Math.min(100, 36 + state.battle.stable * 14 - Math.max(0, state.battle.threat - state.battle.guarded) * 7));
  $("#stabilityValue").textContent = stability === null ? "狀態待確認" : `${stability}%`;
  $("#stabilityMeter").style.width = `${stability ?? 0}%`;
  $("#pressureText").textContent = state.stage === "opening" ? "抵達後才能判斷裂隙狀況。" : state.stage === "actions" ? `剩餘 ${state.slots} 個行動時段。裂隙的震盪正在加劇。` : state.stage === "battle" ? `遭遇第 ${state.battleRound} 回合｜裂隙威脅 ${Math.max(0, state.battle.threat)}` : ["chapter2", "chapter2-ended", "chapter3-entry", "chapter3-ready", "chapter4-ready", "chapter5-ready", "chapter6-ready", "chapter7-ready", "chapter8-ready", "chapter9-ready", "chapter10-ready", "undercity-route-ready"].includes(state.stage) ? `接續目標：${state.nextGoal ?? "等待隊伍決定"}` : state.stage === "ended" ? "第一章危機暫告一段落。" : "裂隙獸已突破防線。";
}

function chronicleEntries() {
  return state.log
    .map((entry) => typeof entry === "string" ? { type: "event", chapter: "紀錄", text: entry } : entry)
    .filter((entry) => entry.type !== "event");
}

function plainSceneTitle(title = "") {
  return String(title).replace(/^(?:第一章|第二章|第三章入口|第三章|第四章|第五章|第六章|第七章|第八章|第九章|第十章)\s*[｜|]\s*/, "").replace(/[。！？!?]+$/, "");
}

function chronicleSectionTitle(entry, chapter, firstScene) {
  if (entry.type !== "scene") return "";
  const title = plainSceneTitle(entry.title);
  const routeStage = Object.values(CONTENT.undercityRoute.stages).find((item) => item.chapter === chapter && title === item.title);
  if (routeStage) {
    if (firstScene || title === routeStage.title) return routeStage.title;
    return "";
  }
  if (chapter === "失星航路篇・結局") {
    if (firstScene) return title.split("｜").at(-1);
    if (Object.values(CONTENT.undercityRoute.endings).some((item) => entry.title === `失星航路篇｜${item.title}`)) return title.split("｜").at(-1);
    return "";
  }
  if (chapter === "失星航路篇・最終抉擇") return firstScene ? title : "";
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
  if (chapter === "第四章") {
    if (firstScene) return title;
    if (Object.values(CONTENT.chapterFour.stages).some((item) => item.title === entry.title)) return title;
    if (Object.values(CONTENT.chapterFour.failureStages).some((item) => item.title === entry.title)) return title;
    if (Object.values(CONTENT.chapterFour.finales).some((item) => entry.title === `第四章｜${item.title}`)) return title;
    if (Object.values(CONTENT.chapterFour.failureFinales).some((item) => entry.title === `第四章｜${item.title}`)) return title;
  }
  if (chapter === "第五章") {
    if (firstScene) return title;
    if (Object.values(CONTENT.chapterFive.stages).some((item) => item.title === entry.title)) return title;
    if (Object.values(CONTENT.chapterFive.failureStages).some((item) => item.title === entry.title)) return title;
    if (Object.values(CONTENT.chapterFive.finales).some((item) => entry.title === `第五章｜${item.title}`)) return title;
    if (Object.values(CONTENT.chapterFive.failureFinales).some((item) => entry.title === `第五章｜${item.title}`)) return title;
  }
  if (chapter === "第六章") {
    if (firstScene) return title;
    if (Object.values(CONTENT.chapterSix.stages).some((item) => item.title === entry.title)) return title;
    if (Object.values(CONTENT.chapterSix.finales).some((item) => entry.title === `第六章｜${item.title}`)) return title;
  }
  if (chapter === "第七章") {
    if (firstScene) return title;
    if (Object.values(CONTENT.chapterSeven.stages).some((item) => item.title === entry.title)) return title;
    if (Object.values(CONTENT.chapterSeven.finales).some((item) => entry.title === `第七章｜${item.title}`)) return title;
  }
  if (chapter === "第八章") {
    if (firstScene) return title;
    if (Object.values(CONTENT.chapterEight.stages).some((item) => item.title === entry.title)) return title;
    if (Object.values(CONTENT.chapterEight.failureStages).some((item) => item.title === entry.title)) return title;
    if (Object.values(CONTENT.chapterEight.finales).some((item) => entry.title === `第八章｜${item.title}`)) return title;
    if (Object.values(CONTENT.chapterEight.failureFinales).some((item) => entry.title === `第八章｜${item.title}`)) return title;
  }
  if (chapter === "第九章") {
    if (firstScene) return title;
    if (Object.values(CONTENT.chapterNine.stages).some((item) => item.title === entry.title)) return title;
    if (Object.values(CONTENT.chapterNine.finales).some((item) => entry.title === `第九章｜${item.title}`)) return title;
  }
  if (chapter === "第十章") {
    if (firstScene) return title;
    if (Object.values(CONTENT.chapterTen.stages).some((item) => item.title === entry.title)) return title;
    if (Object.values(CONTENT.chapterTen.finales).some((item) => entry.title === `第十章｜${item.title}`)) return title;
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
    "第三章": "第三章　盲星谷",
    "第四章": "第四章　倒懸之城",
    "第五章": "第五章　無星渡口",
    "第六章": "第六章　七約殘響",
    "第六章・失星航路": "第六章　失星航路",
    "第七章・無席之庭": "第七章　無席之庭",
    "第八章・潮下檔案": "第八章　潮下檔案",
    "第九章・潮汐議盟": "第九章　潮汐議盟",
    "第十章・無星洪流": "第十章　無星洪流",
    "失星航路篇・最終抉擇": "第十章　潮汐之心",
    "失星航路篇・結局": "失星航路篇　新結局",
    "第七章": "第七章　沉眠星群",
    "第八章": "第八章　裂星前夜",
    "第九章": "第九章　七席將明",
    "第十章": "第十章　萬象歸潮"
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
  if (preserveStoredSaveDuringBoot) return;
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
  if (save.chapterTwoPhase?.startsWith("chapter10-") || save.stage === "chapter10-ready") {
    const phase = save.chapterTenPhase;
    return `第十章・${phase === "finale" ? "尾聲" : CONTENT.chapterTen.stages[phase]?.clock || "萬象歸潮"}`;
  }
  if (save.stage === "undercity-route-ready") {
    if (save.undercityRoutePhase === "ending-choice") return "第十章・潮汐之心・最後抉擇";
    if (save.undercityRoutePhase === "name_return") return "第十章・名字歸還抉擇";
    if (save.undercityRoutePhase === "transition") return "失星航路篇・章間提示";
    if (save.undercityRoutePhase === "finale") return `失星航路篇・${CONTENT.undercityRoute.endings[save.undercityRouteEnding]?.title || "結局"}`;
    const stage = CONTENT.undercityRoute.stages[save.undercityRoutePhase];
    return `${stage?.chapter || "失星航路篇"}・${stage?.clock || "未記錄"}`;
  }
  if (save.chapterTwoPhase?.startsWith("chapter9-") || save.stage === "chapter9-ready") {
    const phase = save.chapterNinePhase;
    return `第九章・${phase === "finale" ? "尾聲" : CONTENT.chapterNine.stages[phase]?.clock || "七席將明"}`;
  }
  if (save.chapterTwoPhase?.startsWith("chapter8-") || save.stage === "chapter8-ready") {
    const phase = save.chapterEightPhase;
    if (phase === "failureFinale") return `第八章・${CONTENT.chapterEight.failureFinales[save.chapterEightRiftChoice]?.title || "失敗結局"}`;
    return `第八章・${phase === "finale" ? "尾聲" : CONTENT.chapterEight.stages[phase]?.clock || CONTENT.chapterEight.failureStages[phase]?.clock || "裂星前夜"}`;
  }
  if (save.chapterTwoPhase?.startsWith("chapter7-") || save.stage === "chapter7-ready") {
    const phase = save.chapterSevenPhase;
    return `第七章・${phase === "finale" ? "尾聲" : CONTENT.chapterSeven.stages[phase]?.clock || "沉眠星群"}`;
  }
  if (save.chapterTwoPhase?.startsWith("chapter6-") || save.stage === "chapter6-ready") {
    const phase = save.chapterSixPhase;
    return `第六章・${phase === "finale" ? "尾聲" : CONTENT.chapterSix.stages[phase]?.clock || "七約聖所"}`;
  }
  if (save.chapterTwoPhase?.startsWith("chapter5-") || save.stage === "chapter5-ready") {
    const phase = save.chapterFivePhase;
    if (phase === "failureFinale") return `第五章・${CONTENT.chapterFive.failureFinales[save.chapterFiveLensChoice]?.title || "失敗結局"}`;
    return `第五章・${phase === "finale" ? "尾聲" : CONTENT.chapterFive.stages[phase]?.clock || CONTENT.chapterFive.failureStages[phase]?.clock || "無星渡口"}`;
  }
  if (save.chapterTwoPhase?.startsWith("chapter4-") || save.stage === "chapter4-ready") {
    const stages = CONTENT.chapterFour.stages;
    const phase = save.chapterFourPhase;
    if (phase === "failureFinale") return `第四章・${CONTENT.chapterFour.failureFinales[save.chapterFourCoreChoice]?.title || "失敗結局"}`;
    return `第四章・${phase === "finale" ? "尾聲" : stages[phase]?.clock || CONTENT.chapterFour.failureStages[phase]?.clock || "倒懸之城"}`;
  }
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
  if (save.stage === "undercity-route-ready") {
    const phase = { six: 1, seven: 2, eight: 3, nine: 4, ten: 5, name_return: 6, "ending-choice": 7, finale: 8 }[save.undercityRoutePhase] || 0;
    const choices = ["ending-choice", "finale"].includes(save.undercityRoutePhase)
      ? Object.keys(CONTENT.undercityRoute.endings).filter((id) => save.undercityRoutePhase === "finale" || id !== "names_returned").map((id) => ({ id }))
      : CONTENT.undercityRoute.stages[save.undercityRoutePhase]?.choices;
    const branch = choiceNumber(choices, ["ending-choice", "finale"].includes(save.undercityRoutePhase) ? save.undercityRouteEnding : save[`undercityRouteChoice${save.undercityRoutePhase}`]);
    return `失星-${phase}-${branch}`;
  }
  if (save.chapterTenPhase || save.chapterTwoPhase?.startsWith("chapter10-")) {
    const phaseNumber = { arrival: 1, lifelines: 2, beasts: 3, reckoning: 4, name: 5, method: 6, core: 7, finale: 8 }[save.chapterTenPhase] || 0;
    const branchNumber = {
      arrival: 0,
      lifelines: choiceNumber(CONTENT.chapterTen.stages.arrival.choices, save.chapterTenArrivalChoice),
      beasts: choiceNumber(CONTENT.chapterTen.stages.lifelines.choices, save.chapterTenLifelineChoice),
      reckoning: choiceNumber(CONTENT.chapterTen.stages.beasts.choices, save.chapterTenBeastsChoice),
      name: choiceNumber(CONTENT.chapterTen.stages.reckoning.choices, save.chapterTenReckoningChoice),
      method: choiceNumber(CONTENT.chapterTen.stages.name.choices, save.chapterTenNameChoice),
      core: choiceNumber(CONTENT.chapterTen.stages.method.choices, save.chapterTenMethodChoice),
      finale: choiceNumber(CONTENT.chapterTen.stages.core.choices, save.chapterTenCoreChoice)
    }[save.chapterTenPhase] || 0;
    return `10-${phaseNumber}-${branchNumber}`;
  }
  if (save.chapterNinePhase || save.chapterTwoPhase?.startsWith("chapter9-")) {
    const phaseNumber = { gathering: 1, testimony: 2, encounter: 3, witnesses: 4, ritual: 5, threshold: 6, finale: 7 }[save.chapterNinePhase] || 0;
    const branchNumber = {
      gathering: 0,
      testimony: choiceNumber(CONTENT.chapterNine.stages.gathering.choices, save.chapterNineGatheringChoice),
      encounter: choiceNumber(CONTENT.chapterNine.stages.testimony.choices, save.chapterNineTestimonyChoice),
      witnesses: choiceNumber(CONTENT.chapterNine.stages.encounter.choices, save.chapterNineEncounterChoice),
      ritual: choiceNumber(CONTENT.chapterNine.stages.witnesses.choices, save.chapterNineWitnessChoice),
      threshold: choiceNumber(CONTENT.chapterNine.stages.ritual.choices, save.chapterNineRitualChoice),
      finale: choiceNumber(CONTENT.chapterNine.stages.threshold.choices, save.chapterNineThresholdChoice)
    }[save.chapterNinePhase] || 0;
    return `9-${phaseNumber}-${branchNumber}`;
  }
  if (save.chapterEightPhase || save.chapterTwoPhase?.startsWith("chapter8-")) {
    const phaseNumber = { return: 1, refuge: 2, covenant: 3, rift: 4, finale: 5, failureEntry: 6, failureDescent: 7, failureAnchor: 8, failureName: 9, failureFinale: 10 }[save.chapterEightPhase] || 0;
    const branchNumber = {
      return: 0,
      refuge: choiceNumber(CONTENT.chapterEight.stages.return.choices, save.chapterEightReturnChoice),
      covenant: choiceNumber(CONTENT.chapterEight.stages.refuge.choices, save.chapterEightRefugeChoice),
      rift: choiceNumber(CONTENT.chapterEight.stages.covenant.choices, save.chapterEightCovenantChoice),
      finale: choiceNumber(CONTENT.chapterEight.stages.rift.choices, save.chapterEightRiftChoice),
      failureEntry: choiceNumber(CONTENT.chapterEight.stages.rift.choices, save.chapterEightRiftChoice),
      failureDescent: save.chapterEightFailureEntryChoice ? 1 : 0,
      failureAnchor: save.chapterEightFailureDescentChoice ? 1 : 0,
      failureName: save.chapterEightFailureAnchorChoice ? 1 : 0,
      failureFinale: save.chapterEightFailureNameChoice ? 1 : 0
    }[save.chapterEightPhase] || 0;
    return `8-${phaseNumber}-${branchNumber}`;
  }
  if (save.chapterSevenPhase || save.chapterTwoPhase?.startsWith("chapter7-")) {
    const phaseNumber = { arrival: 1, threshold: 2, memory: 3, heart: 4, finale: 5 }[save.chapterSevenPhase] || 0;
    const branchNumber = {
      arrival: 0,
      threshold: choiceNumber(CONTENT.chapterSeven.stages.arrival.choices, save.chapterSevenApproachChoice),
      memory: choiceNumber(CONTENT.chapterSeven.stages.threshold.choices, save.chapterSevenThresholdChoice),
      heart: choiceNumber(CONTENT.chapterSeven.stages.memory.choices, save.chapterSevenMemoryChoice),
      finale: choiceNumber(CONTENT.chapterSeven.stages.heart.choices, save.chapterSevenHeartChoice)
    }[save.chapterSevenPhase] || 0;
    return `7-${phaseNumber}-${branchNumber}`;
  }
  if (save.chapterSixPhase || save.chapterTwoPhase?.startsWith("chapter6-")) {
    const phaseNumber = { arrival: 1, split: 2, revelation: 3, heart: 4, finale: 5 }[save.chapterSixPhase] || 0;
    const branchNumber = {
      arrival: 0,
      split: choiceNumber(CONTENT.chapterSix.stages.arrival.choices, save.chapterSixApproachChoice),
      revelation: choiceNumber(CONTENT.chapterSix.stages.split.choices, save.chapterSixDispatchChoice),
      heart: choiceNumber(CONTENT.chapterSix.stages.revelation.choices, save.chapterSixTruthChoice),
      finale: choiceNumber(CONTENT.chapterSix.stages.heart.choices, save.chapterSixCovenantChoice)
    }[save.chapterSixPhase] || 0;
    return `6-${phaseNumber}-${branchNumber}`;
  }
  if (save.chapterFivePhase || save.chapterTwoPhase?.startsWith("chapter5-")) {
    const phaseNumber = { harbor: 1, undercity: 2, crossing: 3, lighthouse: 4, lens: 5, finale: 6, failureEntry: 7, failureCrossing: 8, failureEcho: 9, failureHarbor: 10, failureFinale: 11 }[save.chapterFivePhase] || 0;
    const branchNumber = {
      harbor: 0,
      undercity: choiceNumber(CONTENT.chapterFive.stages.undercity.choices, save.chapterFiveUndercityChoice),
      crossing: choiceNumber(CONTENT.chapterFive.stages.harbor.choices, save.chapterFiveHarborChoice),
      lighthouse: choiceNumber(CONTENT.chapterFive.stages.crossing.choices, save.chapterFiveCrossingChoice),
      lens: choiceNumber(CONTENT.chapterFive.stages.lighthouse.choices, save.chapterFiveLighthouseChoice),
      finale: choiceNumber(CONTENT.chapterFive.stages.lens.choices, save.chapterFiveLensChoice),
      failureEntry: choiceNumber(CONTENT.chapterFive.stages.lens.choices, save.chapterFiveLensChoice),
      failureCrossing: save.chapterFiveFailureEntryChoice ? 1 : 0,
      failureEcho: save.chapterFiveFailureCrossingChoice ? 1 : 0,
      failureHarbor: save.chapterFiveFailureEchoChoice ? 1 : 0,
      failureFinale: save.chapterFiveFailureHarborChoice ? 1 : 0
    }[save.chapterFivePhase] || 0;
    return `5-${phaseNumber}-${branchNumber}`;
  }
  if (save.chapterFourPhase || save.chapterTwoPhase?.startsWith("chapter4-")) {
    const phaseNumber = { approach: 1, gate: 2, archive: 3, core: 4, finale: 5, failureEntry: 6, failureRings: 7, failureBridge: 8, failureAnchor: 9, failureFinale: 10 }[save.chapterFourPhase] || 0;
    const branchNumber = {
      approach: 0,
      gate: choiceNumber(CONTENT.chapterFour.stages.approach.choices, save.chapterFourApproachChoice),
      archive: choiceNumber(CONTENT.chapterFour.stages.gate.choices, save.chapterFourGateChoice),
      core: choiceNumber(CONTENT.chapterFour.stages.archive.choices, save.chapterFourArchiveChoice),
      finale: choiceNumber(CONTENT.chapterFour.stages.core.choices, save.chapterFourCoreChoice),
      failureEntry: choiceNumber(CONTENT.chapterFour.stages.core.choices, save.chapterFourCoreChoice),
      failureRings: save.chapterFourFailureEntryChoice ? 1 : 0,
      failureBridge: save.chapterFourFailureRingsChoice ? 1 : 0,
      failureAnchor: save.chapterFourFailureBridgeChoice ? 1 : 0,
      failureFinale: save.chapterFourFailureAnchorChoice ? 1 : 0
    }[save.chapterFourPhase] || 0;
    return `4-${phaseNumber}-${branchNumber}`;
  }
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
  // Refresh from the loaded snapshot before rendering its current scene. If that
  // scene is already in the chronicle, recordChronicle deduplicates it and will
  // not otherwise trigger a render, leaving the previous run visible.
  renderLog();
  persistSave();
  if (state.stage === "undercity-route-ready") {
    renderUndercityRoute(state.undercityRoutePhase || "six", state.undercityRoutePreviousOutcome);
    return;
  }
  if (state.stage === "chapter10-ready" || state.chapterTwoPhase?.startsWith("chapter10-")) {
    openChapterTen(state);
    return;
  }
  if (state.stage === "chapter9-ready" || state.chapterTwoPhase?.startsWith("chapter9-")) {
    openChapterNine(state);
    return;
  }
  if (state.stage === "chapter8-ready" || state.chapterTwoPhase?.startsWith("chapter8-")) {
    openChapterEight(state);
    return;
  }
  if (state.stage === "chapter7-ready" || state.chapterTwoPhase?.startsWith("chapter7-")) {
    openChapterSeven(state);
    return;
  }
  if (state.stage === "chapter6-ready" || state.chapterTwoPhase?.startsWith("chapter6-")) {
    openChapterSix(state);
    return;
  }
  if (state.stage === "chapter5-ready" || state.chapterTwoPhase?.startsWith("chapter5-")) {
    openChapterFive(state);
    return;
  }
  if (state.stage === "chapter4-ready" || state.chapterTwoPhase?.startsWith("chapter4-")) {
    openChapterFour(state);
    return;
  }
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
  $("#endingArea").innerHTML = `<div class="ending-card"><h2>${escapeHTML(finale.title)}</h2><p>${escapeHTML(finale.summary)}</p><p class="next-hook">${escapeHTML(finale.hook)}</p><div class="ending-actions"><button class="ending-button" id="goChapterFour">前往第四章</button><button class="quiet-button" id="reopenChapterThreeFinale">重新查看尾聲</button><button class="quiet-button" id="newRun">開始新週目</button></div></div>`;
  $("#goChapterFour").addEventListener("click", beginChapterFour);
  $("#reopenChapterThreeFinale").addEventListener("click", () => renderChapterThreePhase("finale"));
  $("#newRun").addEventListener("click", reset);
  persistSave();
  renderStats();
}

function beginChapterFour() {
  state.chapterFourPhase = "approach";
  state.chapterFourPreviousOutcome = state.chapterThreePreviousOutcome;
  state.nextGoal = "抵達倒懸之城維洛斯，找出它被抹去的原因";
  state.chapterFourComplete = false;
  renderChapterFourPhase("approach", state.chapterFourPreviousOutcome);
  persistSave();
}

function openChapterFour(save = state) {
  state = { ...initialState(), ...save, stage: "chapter4-ready", slots: 0,
    stats: { ...initialState().stats, ...save.stats }, trust: { ...initialState().trust, ...save.trust },
    battle: { ...initialState().battle, ...save.battle },
    log: Array.isArray(save.chronicle) ? save.chronicle : Array.isArray(save.log) ? save.log : [] };
  state.chapterThreeAstridJoined = true;
  state.chapterThreeGrimmJoined = true;
  state.chapterThreeJoined = true;
  renderChapterFourPhase(state.chapterFourPhase || "approach", state.chapterFourPreviousOutcome);
}

function renderChapterFourPhase(phase = state.chapterFourPhase, previousOutcome = state.chapterFourPreviousOutcome) {
  state.stage = "chapter4-ready";
  state.chapterFourPhase = phase;
  state.chapterTwoPhase = `chapter4-${phase}`;
  if (phase === "finale") {
    renderChapterFourFinale(previousOutcome);
    return;
  }
  if (phase === "failureFinale") {
    renderChapterFourFailureFinale(previousOutcome);
    return;
  }
  const chapter = CONTENT.chapterFour.stages[phase] || CONTENT.chapterFour.failureStages[phase];
  if (!chapter) return;
  const label = { approach: "雲海之路", gate: "三環城門", archive: "檔案廳", core: "城市核心", failureEntry: "核心失序", failureRings: "撤離城門", failureBridge: "最後座標", failureAnchor: "星圖之外" }[phase];
  setStageLabel(`第四章・${label}`, chapter.clock);
  setStory(chapter.title, [previousOutcome, ...chapter.paragraphs].filter(Boolean));
  renderChoices(chapter.choices.map((choice) => ({ ...choice, choose: () => resolveChapterFour(choice) })));
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = "";
  renderStats();
  persistSave();
}

function resolveChapterFour(choice) {
  state.chapterFourPreviousOutcome = choice.outcome;
  if (state.chapterFourPhase === "failureEntry") {
    state.chapterFourFailureEntryChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterFourPhase("failureRings", choice.outcome);
  } else if (state.chapterFourPhase === "failureRings") {
    state.chapterFourFailureRingsChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterFourPhase("failureBridge", choice.outcome);
  } else if (state.chapterFourPhase === "failureBridge") {
    state.chapterFourFailureBridgeChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterFourPhase("failureAnchor", choice.outcome);
  } else if (state.chapterFourPhase === "failureAnchor") {
    state.chapterFourFailureAnchorChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterFourPhase("failureFinale", choice.outcome);
  } else if (state.chapterFourPhase === "approach") {
    state.chapterFourApproachChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterFourPhase("gate", choice.outcome);
  } else if (state.chapterFourPhase === "gate") {
    state.chapterFourGateChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterFourPhase("archive", choice.outcome);
  } else if (state.chapterFourPhase === "archive") {
    state.chapterFourArchiveChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterFourPhase("core", choice.outcome);
  } else if (state.chapterFourPhase === "core") {
    state.chapterFourCoreChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterFourPhase(choice.id === "split_core" ? "failureEntry" : "finale", choice.outcome);
  }
  applyEffects(choice.effects);
  persistSave();
  renderStats();
}

function renderChapterFourFailureFinale(previousOutcome = state.chapterFourPreviousOutcome) {
  const finale = CONTENT.chapterFour.failureFinales[state.chapterFourCoreChoice];
  if (!finale) return;
  state.chapterFourComplete = true;
  setStageLabel("第四章・失敗結局", "倒懸之城・星圖之外");
  setStory(`第四章｜${finale.title}`, [previousOutcome, ...finale.paragraphs].filter(Boolean));
  $("#choices").innerHTML = "";
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = `<div class="ending-card"><h2>${escapeHTML(finale.title)}</h2><p>${escapeHTML(finale.summary)}</p><p class="next-hook">${escapeHTML(finale.hook)}</p><div class="ending-actions"><button class="quiet-button" id="reopenChapterFourFailureFinale">重新查看結局</button><button class="quiet-button" id="newRun">開始新週目</button></div></div>`;
  $("#reopenChapterFourFailureFinale").addEventListener("click", () => renderChapterFourPhase("failureFinale"));
  $("#newRun").addEventListener("click", reset);
  persistSave();
  renderStats();
}

function renderChapterFourFinale(previousOutcome = state.chapterFourPreviousOutcome) {
  const finale = CONTENT.chapterFour.finales[state.chapterFourCoreChoice];
  if (!finale) return;
  state.chapterFourComplete = true;
  setStageLabel("第四章・尾聲", "倒懸之城・維洛斯");
  setStory(`第四章｜${finale.title}`, [previousOutcome, ...finale.paragraphs].filter(Boolean));
  $("#choices").innerHTML = "";
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = `<div class="ending-card"><h2>${escapeHTML(finale.title)}</h2><p>${escapeHTML(finale.summary)}</p><p class="next-hook">${escapeHTML(finale.hook)}</p><div class="ending-actions"><button class="ending-button" id="goChapterFive">前往第五章</button><button class="quiet-button" id="reopenChapterFourFinale">重新查看尾聲</button><button class="quiet-button" id="newRun">開始新週目</button></div></div>`;
  $("#goChapterFive").addEventListener("click", beginChapterFive);
  $("#reopenChapterFourFinale").addEventListener("click", () => renderChapterFourPhase("finale"));
  $("#newRun").addEventListener("click", reset);
  persistSave();
  renderStats();
}

function beginChapterFive() {
  state.chapterFivePhase = "harbor";
  state.chapterFiveEilanJoined = true;
  state.chapterFivePreviousOutcome = state.chapterFourPreviousOutcome;
  state.nextGoal = "在沉星潮吞沒更多界碑前，抵達無星渡口的古燈塔";
  state.chapterFiveComplete = false;
  renderChapterFivePhase("harbor", state.chapterFivePreviousOutcome);
  persistSave();
}

function openChapterFive(save = state) {
  state = { ...initialState(), ...save, stage: "chapter5-ready", slots: 0,
    stats: { ...initialState().stats, ...save.stats }, trust: { ...initialState().trust, ...save.trust },
    battle: { ...initialState().battle, ...save.battle },
    log: Array.isArray(save.chronicle) ? save.chronicle : Array.isArray(save.log) ? save.log : [] };
  state.chapterThreeAstridJoined = true;
  state.chapterThreeGrimmJoined = true;
  state.chapterThreeJoined = true;
  state.chapterFiveEilanJoined = true;
  renderChapterFivePhase(state.chapterFivePhase || "harbor", state.chapterFivePreviousOutcome);
}

function renderChapterFivePhase(phase = state.chapterFivePhase, previousOutcome = state.chapterFivePreviousOutcome) {
  state.stage = "chapter5-ready";
  state.chapterFivePhase = phase;
  state.chapterTwoPhase = `chapter5-${phase}`;
  if (phase === "finale") {
    renderChapterFiveFinale(previousOutcome);
    return;
  }
  if (phase === "failureFinale") {
    renderChapterFiveFailureFinale(previousOutcome);
    return;
  }
  const chapter = CONTENT.chapterFive.stages[phase] || CONTENT.chapterFive.failureStages[phase];
  if (!chapter) return;
  const label = { harbor: "沉星潮", undercity: "城底撤離道", crossing: "沉沒航道", lighthouse: "守燈室", lens: "古鏡", failureEntry: "鏡心過載", failureCrossing: "外海航路", failureEcho: "回聲交會處", failureHarbor: "沉星後的岸邊" }[phase];
  setStageLabel(`第五章・${label || chapter.title}`, chapter.clock);
  const storyTitle = phase === "harbor" ? `第五章｜${chapter.title}` : chapter.title;
  setStory(storyTitle, [...(phase === "harbor" ? [] : [previousOutcome]), ...chapter.paragraphs].filter(Boolean));
  renderChoices(chapter.choices.map((choice) => ({ ...choice, choose: () => resolveChapterFive(choice) })));
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = "";
  renderStats();
  persistSave();
}

function resolveChapterFive(choice) {
  state.chapterFivePreviousOutcome = choice.outcome;
  if (state.chapterFivePhase === "failureEntry") {
    state.chapterFiveFailureEntryChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterFivePhase("failureCrossing", choice.outcome);
  } else if (state.chapterFivePhase === "failureCrossing") {
    state.chapterFiveFailureCrossingChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterFivePhase("failureEcho", choice.outcome);
  } else if (state.chapterFivePhase === "failureEcho") {
    state.chapterFiveFailureEchoChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterFivePhase("failureHarbor", choice.outcome);
  } else if (state.chapterFivePhase === "failureHarbor") {
    state.chapterFiveFailureHarborChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterFivePhase("failureFinale", choice.outcome);
  } else if (state.chapterFivePhase === "harbor") {
    state.chapterFiveHarborChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    const phase = state.chapterFourCoreChoice === "sever_path" ? "undercity" : "crossing";
    renderChapterFivePhase(phase, choice.outcome);
  } else if (state.chapterFivePhase === "undercity") {
    state.chapterFiveUndercityChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterFivePhase("crossing", choice.outcome);
  } else if (state.chapterFivePhase === "crossing") {
    state.chapterFiveCrossingChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterFivePhase("lighthouse", choice.outcome);
  } else if (state.chapterFivePhase === "lighthouse") {
    state.chapterFiveLighthouseChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterFivePhase("lens", choice.outcome);
  } else if (state.chapterFivePhase === "lens") {
    state.chapterFiveLensChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterFivePhase(choice.id === "mirror_overload" ? "failureEntry" : "finale", choice.outcome);
  }
  applyEffects(choice.effects);
  persistSave();
  renderStats();
}

function renderChapterFiveFinale(previousOutcome = state.chapterFivePreviousOutcome) {
  const finale = CONTENT.chapterFive.finales[state.chapterFiveLensChoice];
  if (!finale) return;
  state.chapterFiveComplete = true;
  state.chapterFiveEilanJoined = state.chapterFiveLensChoice === "answer_name";
  setStageLabel("第五章・尾聲", "無星渡口・燈塔");
  setStory(`第五章｜${finale.title}`, [previousOutcome, ...finale.paragraphs].filter(Boolean));
  $("#choices").innerHTML = "";
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  const startsUndercityRoute = state.chapterFourCoreChoice === "sever_path";
  $("#endingArea").innerHTML = `<div class="ending-card"><h2>${escapeHTML(finale.title)}</h2><p>${escapeHTML(finale.summary)}</p><p class="next-hook">${escapeHTML(finale.hook)}</p><div class="ending-actions"><button class="ending-button" id="goChapterSix">${startsUndercityRoute ? "進入第六章・失星航路篇" : "前往第六章・七約殘響"}</button><button class="quiet-button" id="reopenChapterFiveFinale">重新查看尾聲</button><button class="quiet-button" id="newRun">開始新週目</button></div></div>`;
  $("#goChapterSix").addEventListener("click", startsUndercityRoute ? beginUndercityRoute : beginChapterSix);
  $("#reopenChapterFiveFinale").addEventListener("click", () => renderChapterFivePhase("finale"));
  $("#newRun").addEventListener("click", reset);
  persistSave();
  renderStats();
}

function renderChapterFiveFailureFinale(previousOutcome = state.chapterFivePreviousOutcome) {
  const finale = CONTENT.chapterFive.failureFinales[state.chapterFiveLensChoice];
  if (!finale) return;
  state.chapterFiveComplete = true;
  state.chapterFiveEilanJoined = true;
  setStageLabel("第五章・失敗結局", "無星渡口・沉星後的岸邊");
  setStory(`第五章｜${finale.title}`, [previousOutcome, ...finale.paragraphs].filter(Boolean));
  $("#choices").innerHTML = "";
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = `<div class="ending-card"><h2>${escapeHTML(finale.title)}</h2><p>${escapeHTML(finale.summary)}</p><p class="next-hook">${escapeHTML(finale.hook)}</p><div class="ending-actions"><button class="ending-button" id="reopenChapterFiveFailureFinale">重新查看失敗結局</button><button class="quiet-button" id="newRun">開始新週目</button></div></div>`;
  $("#reopenChapterFiveFailureFinale").addEventListener("click", () => renderChapterFivePhase("failureFinale"));
  $("#newRun").addEventListener("click", reset);
  persistSave();
  renderStats();
}

function beginUndercityRoute() {
  state.undercityRoutePhase = "six";
  state.undercityRouteEntryOutcome = null;
  state.undercityRoutePreviousOutcome = null;
  state.undercityRouteAwaitingNext = false;
  state.undercityRouteNextPhase = null;
  state.undercityRouteTrust = 0;
  state.undercityRouteCivilians = state.chapterFiveUndercityChoice === "guide_residents" ? 1 : 0;
  state.undercityRouteEvidence = state.chapterFiveUndercityChoice === "recover_beacon" ? 1 : 0;
  state.undercityRouteEnding = null;
  state.nextGoal = "沿星圖之外的潮路尋找被刪去的民用盟約";
  renderUndercityRoute("six", state.undercityRoutePreviousOutcome);
}

function renderUndercityRoute(phase = state.undercityRoutePhase, previousOutcome = state.undercityRoutePreviousOutcome) {
  const route = CONTENT.undercityRoute;
  const previousPhase = state.undercityRoutePhase;
  if (phase !== previousPhase && !["finale", "ending-choice"].includes(phase)) {
    state.undercityRouteEntryOutcome = previousOutcome || null;
  }
  state.stage = "undercity-route-ready";
  state.undercityRoutePhase = phase;
  state.chapterTwoPhase = `undercity-${phase}`;
  if (phase === "finale") {
    const ending = route.endings[state.undercityRouteEnding];
    if (!ending) return;
    setStageLabel("失星航路篇・新結局", "維洛斯外海・尾聲");
    const consequences = [];
    if (state.undercityRouteCivilians >= 3) consequences.push("居民在旅途中累積的互助網絡，讓更多人能參與重建與航標維護。");
    if (state.undercityRouteEvidence >= 3) consequences.push("完整證據保存下來，後來者能追查盟約如何改變，避免歷史再次被刪去。");
    if (state.undercityRouteTrust >= 3) consequences.push("幾次公開協商建立起信任，居民、星獸與兩位守護者仍願意共同維持彼此的聯絡。");
    if (!consequences.length) consequences.push("隊伍保存下來的有限線索，成為下一代重新理解這段旅程的起點。");
    setStory(`失星航路篇｜${ending.title}`, [...(previousOutcome ? [previousOutcome] : []), ...ending.paragraphs, ...consequences]);
    $("#choices").innerHTML = "";
    $("#continueArea").innerHTML = "";
    $("#actionArea").innerHTML = "";
    $("#battleArea").innerHTML = "";
    $("#endingArea").innerHTML = `<div class="ending-card"><h2>${escapeHTML(ending.title)}</h2><p>${escapeHTML(ending.summary)}</p><p class="next-hook">失星航路篇專屬結局</p><div class="ending-actions"><button class="ending-button" id="reopenUndercityEnding">重新選擇結局</button><button class="quiet-button" id="newRun">開始新週目</button></div></div>`;
    $("#reopenUndercityEnding").addEventListener("click", () => {
      renderUndercityRoute("ending-choice", state.undercityRoutePreviousOutcome);
    });
    $("#newRun").addEventListener("click", reset);
    persistSave();
    renderStats();
    return;
  }
  if (phase === "ending-choice") {
    setStageLabel("第十章・最後抉擇", "維洛斯外海・潮汐之心");
    const trueNameUnlocked = canUnlockUndercityTrueNameEnding();
    setStory("潮汐之心的最後歸路", [
      ...(previousOutcome ? [previousOutcome] : []),
      "潮汐之心只剩一次脈動。各地回覆已經抵達：有人願意接通航標，有人準備遷徙，也有人願意輪替守住潮門。星噬者與守望者都把選擇權交還給居民。",
      "你可以把洪流分散到各地航標、打開通往新海岸的潮門，或讓兩位守護者自願守門。每條路都會留下不同的生活與代價。",
      ...(trueNameUnlocked ? ["航標拓印、沿岸口述與星噬者的記憶在潮心深處同時共鳴，一段被抹去的真名終於有機會得到本人確認。"] : [])
    ]);
    renderChoices(Object.entries(route.endings).filter(([id]) => id !== "names_returned" && (id !== "shared_stars" || trueNameUnlocked)).map(([id, ending]) => ({
      id,
      title: ending.title,
      description: ending.choiceDescription,
      choose: () => resolveUndercityEnding(id)
    })));
    $("#continueArea").innerHTML = "";
    $("#actionArea").innerHTML = "";
    $("#battleArea").innerHTML = "";
    $("#endingArea").innerHTML = "";
    renderStats();
    persistSave();
    return;
  }
  const scene = route.stages[phase];
  if (!scene) return;
  setStageLabel(phase === "name_return" ? "第十章・名字歸還抉擇" : scene.chapter, scene.clock);
  const chapterNumber = scene.chapter.split("・")[0];
  const storyTitle = `${chapterNumber}｜${scene.title}`;
  setStory(storyTitle, [...(state.undercityRouteEntryOutcome ? [state.undercityRouteEntryOutcome] : []), ...scene.paragraphs]);
  if (state.undercityRouteAwaitingNext) {
    const nextPhase = state.undercityRouteNextPhase;
    const nextScene = route.stages[nextPhase];
    const enteringFinalChoice = nextPhase === "ending-choice";
    const enteringNameEnding = nextPhase === "name_return";
    const nextTitle = enteringFinalChoice ? "第十章・潮汐之心的最後抉擇"
      : enteringNameEnding ? "第十章・名字歸還抉擇"
        : nextScene?.chapter || "下一章";
    const nextStep = enteringFinalChoice ? "進入最終抉擇，決定潮汐洪流的去向" : `進入${nextTitle}`;
    const buttonText = enteringFinalChoice ? "進入第十章・最後抉擇" : `進入${nextTitle}`;
    renderChoices([]);
    $("#continueArea").innerHTML = "";
    $("#actionArea").innerHTML = "";
    $("#battleArea").innerHTML = "";
    $("#endingArea").innerHTML = `<div class="ending-card"><h2>${escapeHTML(nextTitle)}</h2><p>${escapeHTML(previousOutcome || "這一段航程暫告一段落。")}</p><p class="next-hook">下一步：${escapeHTML(nextStep)}。</p><div class="ending-actions"><button class="ending-button" id="continueUndercityRoute">${escapeHTML(buttonText)}</button></div></div>`;
    $("#continueUndercityRoute").addEventListener("click", () => {
      const destination = state.undercityRouteNextPhase;
      state.undercityRouteAwaitingNext = false;
      state.undercityRouteNextPhase = null;
      state.nextGoal = destination === "ending-choice" ? "選擇洪流的最終去向" : route.stages[destination]?.chapter;
      renderUndercityRoute(destination, state.undercityRoutePreviousOutcome);
    });
    renderStats();
    persistSave();
    return;
  }
  const availableChoices = phase === "name_return"
    ? scene.choices.filter((choice) => choice.id !== "share_tide_name" || canUnlockUndercityTrueNameEnding())
    : scene.choices;
  renderChoices(availableChoices.map((choice) => ({ ...choice, choose: () => resolveUndercityRoute(choice) })));
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = "";
  renderStats();
  persistSave();
}

function resolveUndercityRoute(choice) {
  const phase = state.undercityRoutePhase;
  state.undercityRoutePreviousOutcome = choice.outcome;
  state[`undercityRouteChoice${phase}`] = choice.id;
  applyEffects(choice.effects);
  if (phase === "name_return") {
    resolveUndercityEnding(choice.endingId || "names_returned");
    return;
  }
  const next = { six: "seven", seven: "eight", eight: "nine", nine: "ten" }[phase];
  state.undercityRouteNextPhase = next || (phase === "ten" ? (choice.id === "enter_name_current" ? "name_return" : "ending-choice") : null);
  if (!state.undercityRouteNextPhase) return;
  if (phase === "ten" && choice.id === "enter_name_current") {
    state.undercityRouteAwaitingNext = false;
    state.undercityRouteNextPhase = null;
    state.nextGoal = "陪星噬者走進失名回廊，選擇如何面對牠的名字";
    renderUndercityRoute("name_return", choice.outcome);
    return;
  }
  state.undercityRouteAwaitingNext = true;
  state.nextGoal = phase === "ten" ? "讓沿岸聚落聽見三種方案，再決定洪流與守護者的去向" : CONTENT.undercityRoute.stages[next].chapter;
  renderUndercityRoute(phase, choice.outcome);
}

function resolveUndercityEnding(endingId) {
  const ending = CONTENT.undercityRoute.endings[endingId];
  if (!ending) return;
  state.undercityRouteEnding = endingId;
  state.nextGoal = "見證維洛斯與星圖之外的世界如何走向新的未來";
  renderUndercityRoute("finale", ending.choiceOutcome);
}

function beginChapterSix() {
  state.chapterSixPhase = "arrival";
  state.chapterSixPreviousOutcome = state.chapterFivePreviousOutcome;
  state.nextGoal = "抵達七約聖所，找出星噬者與第七席的關係";
  state.chapterSixComplete = false;
  renderChapterSixPhase("arrival", state.chapterSixPreviousOutcome);
  persistSave();
}

function openChapterSix(save = state) {
  state = { ...initialState(), ...save, stage: "chapter6-ready", slots: 0,
    stats: { ...initialState().stats, ...save.stats }, trust: { ...initialState().trust, ...save.trust },
    battle: { ...initialState().battle, ...save.battle },
    log: Array.isArray(save.chronicle) ? save.chronicle : Array.isArray(save.log) ? save.log : [] };
  state.chapterThreeAstridJoined = true;
  state.chapterThreeGrimmJoined = true;
  state.chapterThreeJoined = true;
  state.chapterFiveEilanJoined = state.chapterFiveLensChoice === "answer_name";
  renderChapterSixPhase(state.chapterSixPhase || "arrival", state.chapterSixPreviousOutcome);
}

function renderChapterSixPhase(phase = state.chapterSixPhase, previousOutcome = state.chapterSixPreviousOutcome) {
  state.stage = "chapter6-ready";
  state.chapterSixPhase = phase;
  state.chapterTwoPhase = `chapter6-${phase}`;
  if (phase === "finale") {
    renderChapterSixFinale(previousOutcome);
    return;
  }
  const chapter = CONTENT.chapterSix.stages[phase];
  if (!chapter) return;
  const label = { arrival: "七約聖所", split: "分隊任務", revelation: "盟約真相", heart: "第七席" }[phase];
  setStageLabel(`第六章・${label}`, chapter.clock);
  const storyTitle = phase === "arrival" ? `第六章｜${chapter.title}` : chapter.title;
  setStory(storyTitle, [...(phase === "arrival" ? [] : [previousOutcome]), ...chapter.paragraphs].filter(Boolean));
  renderChoices(chapter.choices.map((choice) => ({ ...choice, choose: () => resolveChapterSix(choice) })));
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = "";
  renderStats();
  persistSave();
}

function resolveChapterSix(choice) {
  state.chapterSixPreviousOutcome = choice.outcome;
  if (state.chapterSixPhase === "arrival") {
    state.chapterSixApproachChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterSixPhase("split", choice.outcome);
  } else if (state.chapterSixPhase === "split") {
    state.chapterSixDispatchChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterSixPhase("revelation", choice.outcome);
  } else if (state.chapterSixPhase === "revelation") {
    state.chapterSixTruthChoice = choice.id;
    state.chapterSixSideMissionReturned = true;
    state.nextGoal = choice.nextGoal;
    renderChapterSixPhase("heart", choice.outcome);
  } else if (state.chapterSixPhase === "heart") {
    state.chapterSixCovenantChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterSixPhase("finale", choice.outcome);
  }
  applyEffects(choice.effects);
  persistSave();
  renderStats();
}

function renderChapterSixFinale(previousOutcome = state.chapterSixPreviousOutcome) {
  const finale = CONTENT.chapterSix.finales[state.chapterSixCovenantChoice];
  if (!finale) return;
  state.chapterSixComplete = true;
  setStageLabel("第六章・尾聲", "七約聖所・共同誓言");
  setStory(`第六章｜${finale.title}`, [previousOutcome, ...finale.paragraphs].filter(Boolean));
  $("#choices").innerHTML = "";
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = `<div class="ending-card"><h2>${escapeHTML(finale.title)}</h2><p>${escapeHTML(finale.summary)}</p><p class="next-hook">${escapeHTML(finale.hook)}</p><div class="ending-actions"><button class="ending-button" id="goChapterSeven">前往第七章</button><button class="quiet-button" id="reopenChapterSixFinale">重新查看尾聲</button><button class="quiet-button" id="newRun">開始新週目</button></div></div>`;
  $("#goChapterSeven").addEventListener("click", beginChapterSeven);
  $("#reopenChapterSixFinale").addEventListener("click", () => renderChapterSixPhase("finale"));
  $("#newRun").addEventListener("click", reset);
  persistSave();
  renderStats();
}

function beginChapterSeven() {
  state.chapterSevenPhase = "arrival";
  state.chapterSevenPreviousOutcome = state.chapterSixPreviousOutcome;
  state.nextGoal = "找到沉睡星獸，查明歸名之印真正的用途";
  state.chapterSevenComplete = false;
  renderChapterSevenPhase("arrival", state.chapterSevenPreviousOutcome);
  persistSave();
}

function openChapterSeven(save = state) {
  const defaults = initialState();
  state = { ...defaults, ...save, stage: "chapter7-ready", slots: 0,
    stats: { ...defaults.stats, ...save.stats }, trust: { ...defaults.trust, ...save.trust },
    battle: { ...defaults.battle, ...save.battle },
    log: Array.isArray(save.chronicle) ? save.chronicle : Array.isArray(save.log) ? save.log : [] };
  state.chapterThreeAstridJoined = true;
  state.chapterThreeGrimmJoined = true;
  state.chapterThreeJoined = true;
  state.chapterFiveEilanJoined = state.chapterFiveLensChoice === "answer_name";
  renderChapterSevenPhase(state.chapterSevenPhase || "arrival", state.chapterSevenPreviousOutcome);
}

function renderChapterSevenPhase(phase = state.chapterSevenPhase, previousOutcome = state.chapterSevenPreviousOutcome) {
  state.stage = "chapter7-ready";
  state.chapterSevenPhase = phase;
  state.chapterTwoPhase = `chapter7-${phase}`;
  if (phase === "finale") {
    renderChapterSevenFinale(previousOutcome);
    return;
  }
  const chapter = CONTENT.chapterSeven.stages[phase];
  if (!chapter) return;
  const labels = { arrival: "沉眠星群", threshold: "夢門", memory: "記憶之庭", heart: "星獸心室" };
  setStageLabel(`第七章・${labels[phase]}`, chapter.clock);
  const storyTitle = phase === "arrival" ? `第七章｜${chapter.title}` : chapter.title;
  setStory(storyTitle, [...(phase === "arrival" ? [] : [previousOutcome]), ...chapter.paragraphs].filter(Boolean));
  renderChoices(chapter.choices.map((choice) => ({ ...choice, choose: () => resolveChapterSeven(choice) })));
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = "";
  renderStats();
  persistSave();
}

function resolveChapterSeven(choice) {
  state.chapterSevenPreviousOutcome = choice.outcome;
  if (state.chapterSevenPhase === "arrival") {
    state.chapterSevenApproachChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterSevenPhase("threshold", choice.outcome);
  } else if (state.chapterSevenPhase === "threshold") {
    state.chapterSevenThresholdChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterSevenPhase("memory", choice.outcome);
  } else if (state.chapterSevenPhase === "memory") {
    state.chapterSevenMemoryChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterSevenPhase("heart", choice.outcome);
  } else if (state.chapterSevenPhase === "heart") {
    state.chapterSevenHeartChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterSevenPhase("finale", choice.outcome);
  }
  applyEffects(choice.effects);
  persistSave();
  renderStats();
}

function renderChapterSevenFinale(previousOutcome = state.chapterSevenPreviousOutcome) {
  const finale = CONTENT.chapterSeven.finales[state.chapterSevenHeartChoice];
  if (!finale) return;
  state.chapterSevenComplete = true;
  setStageLabel("第七章・尾聲", "沉眠星群・歸名之印");
  setStory(`第七章｜${finale.title}`, [previousOutcome, ...finale.paragraphs].filter(Boolean));
  $("#choices").innerHTML = "";
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = `<div class="ending-card"><h2>${escapeHTML(finale.title)}</h2><p>${escapeHTML(finale.summary)}</p><p class="next-hook">${escapeHTML(finale.hook)}</p><div class="ending-actions"><button class="ending-button" id="goChapterEight">前往第八章</button><button class="quiet-button" id="reopenChapterSevenFinale">重新查看尾聲</button><button class="quiet-button" id="newRun">開始新週目</button></div></div>`;
  $("#goChapterEight").addEventListener("click", beginChapterEight);
  $("#reopenChapterSevenFinale").addEventListener("click", () => renderChapterSevenPhase("finale"));
  $("#newRun").addEventListener("click", reset);
  persistSave();
  renderStats();
}

function beginChapterEight() {
  state.chapterEightPhase = "return";
  state.chapterEightPreviousOutcome = state.chapterSevenPreviousOutcome;
  state.nextGoal = "迎接兩支旁支任務小隊歸來，匯合星噬者的線索";
  state.chapterEightComplete = false;
  renderChapterEightPhase("return", state.chapterEightPreviousOutcome);
  persistSave();
}

function openChapterEight(save = state) {
  const defaults = initialState();
  state = { ...defaults, ...save, stage: "chapter8-ready", slots: 0,
    stats: { ...defaults.stats, ...save.stats }, trust: { ...defaults.trust, ...save.trust },
    battle: { ...defaults.battle, ...save.battle },
    log: Array.isArray(save.chronicle) ? save.chronicle : Array.isArray(save.log) ? save.log : [] };
  state.chapterThreeAstridJoined = true;
  state.chapterThreeGrimmJoined = true;
  state.chapterThreeJoined = true;
  state.chapterFiveEilanJoined = state.chapterFiveLensChoice === "answer_name";
  renderChapterEightPhase(state.chapterEightPhase || "return", state.chapterEightPreviousOutcome);
}

function renderChapterEightPhase(phase = state.chapterEightPhase, previousOutcome = state.chapterEightPreviousOutcome) {
  state.stage = "chapter8-ready";
  state.chapterEightPhase = phase;
  state.chapterTwoPhase = `chapter8-${phase}`;
  if (phase === "finale") {
    renderChapterEightFinale(previousOutcome);
    return;
  }
  if (phase === "failureFinale") {
    renderChapterEightFailureFinale(previousOutcome);
    return;
  }
  const chapter = CONTENT.chapterEight.stages[phase] || CONTENT.chapterEight.failureStages[phase];
  if (!chapter) return;
  const labels = { return: "歸航港", refuge: "共夢廊道", covenant: "盟約原址", rift: "星海裂口", failureEntry: "裂口門前", failureDescent: "裂口內側", failureAnchor: "主鏈核心", failureName: "無名星門" };
  setStageLabel(`第八章・${labels[phase] || chapter.title}`, chapter.clock);
  const storyTitle = phase === "return" ? `第八章｜${chapter.title}` : chapter.title;
  setStory(storyTitle, [...(phase === "return" ? [] : [previousOutcome]), ...chapter.paragraphs].filter(Boolean));
  renderChoices(chapter.choices.map((choice) => ({ ...choice, choose: () => resolveChapterEight(choice) })));
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = "";
  renderStats();
  persistSave();
}

function resolveChapterEight(choice) {
  state.chapterEightPreviousOutcome = choice.outcome;
  if (state.chapterEightPhase === "failureEntry") {
    state.chapterEightFailureEntryChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterEightPhase("failureDescent", choice.outcome);
  } else if (state.chapterEightPhase === "failureDescent") {
    state.chapterEightFailureDescentChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterEightPhase("failureAnchor", choice.outcome);
  } else if (state.chapterEightPhase === "failureAnchor") {
    state.chapterEightFailureAnchorChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterEightPhase("failureName", choice.outcome);
  } else if (state.chapterEightPhase === "failureName") {
    state.chapterEightFailureNameChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterEightPhase("failureFinale", choice.outcome);
  } else if (state.chapterEightPhase === "return") {
    state.chapterEightReturnChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterEightPhase("refuge", choice.outcome);
  } else if (state.chapterEightPhase === "refuge") {
    state.chapterEightRefugeChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterEightPhase("covenant", choice.outcome);
  } else if (state.chapterEightPhase === "covenant") {
    state.chapterEightCovenantChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterEightPhase("rift", choice.outcome);
  } else if (state.chapterEightPhase === "rift") {
    state.chapterEightRiftChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterEightPhase(choice.id === "solo_anchor" ? "failureEntry" : "finale", choice.outcome);
  }
  applyEffects(choice.effects);
  persistSave();
  renderStats();
}

function renderChapterEightFinale(previousOutcome = state.chapterEightPreviousOutcome) {
  const finale = CONTENT.chapterEight.finales[state.chapterEightRiftChoice];
  if (!finale) return;
  state.chapterEightComplete = true;
  setStageLabel("第八章・尾聲", "星海裂口・大結局前夜");
  setStory(`第八章｜${finale.title}`, [previousOutcome, ...finale.paragraphs].filter(Boolean));
  $("#choices").innerHTML = "";
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = `<div class="ending-card"><h2>${escapeHTML(finale.title)}</h2><p>${escapeHTML(finale.summary)}</p><p class="next-hook">${escapeHTML(finale.hook)}</p><div class="ending-actions"><button class="ending-button" id="goChapterNine">前往第九章</button><button class="quiet-button" id="reopenChapterEightFinale">重新查看尾聲</button><button class="quiet-button" id="newRun">開始新週目</button></div></div>`;
  $("#goChapterNine").addEventListener("click", beginChapterNine);
  $("#reopenChapterEightFinale").addEventListener("click", () => renderChapterEightPhase("finale"));
  $("#newRun").addEventListener("click", reset);
  persistSave();
  renderStats();
}

function renderChapterEightFailureFinale(previousOutcome = state.chapterEightPreviousOutcome) {
  const finale = CONTENT.chapterEight.failureFinales[state.chapterEightRiftChoice];
  if (!finale) return;
  state.chapterEightComplete = true;
  setStageLabel("第八章・失敗結局", "無名星門・最後的黎明");
  setStory(`第八章｜${finale.title}`, [previousOutcome, ...finale.paragraphs].filter(Boolean));
  $("#choices").innerHTML = "";
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = `<div class="ending-card"><h2>${escapeHTML(finale.title)}</h2><p>${escapeHTML(finale.summary)}</p><p class="next-hook">${escapeHTML(finale.hook)}</p><div class="ending-actions"><button class="ending-button" id="reopenChapterEightFailureFinale">重新查看失敗結局</button><button class="quiet-button" id="newRun">開始新週目</button></div></div>`;
  $("#reopenChapterEightFailureFinale").addEventListener("click", () => renderChapterEightPhase("failureFinale"));
  $("#newRun").addEventListener("click", reset);
  persistSave();
  renderStats();
}

function beginChapterNine() {
  state.chapterNinePhase = "gathering";
  state.chapterNinePreviousOutcome = state.chapterEightPreviousOutcome;
  state.nextGoal = "召集六位星獸，並釐清守望者與星噬者的舊盟約";
  state.chapterNineComplete = false;
  renderChapterNinePhase("gathering", state.chapterNinePreviousOutcome);
  persistSave();
}

function openChapterNine(save = state) {
  const defaults = initialState();
  state = { ...defaults, ...save, stage: "chapter9-ready", slots: 0,
    stats: { ...defaults.stats, ...save.stats }, trust: { ...defaults.trust, ...save.trust },
    battle: { ...defaults.battle, ...save.battle },
    log: Array.isArray(save.chronicle) ? save.chronicle : Array.isArray(save.log) ? save.log : [] };
  state.chapterThreeAstridJoined = true;
  state.chapterThreeGrimmJoined = true;
  state.chapterThreeJoined = true;
  state.chapterFiveEilanJoined = state.chapterFiveLensChoice === "answer_name";
  renderChapterNinePhase(state.chapterNinePhase || "gathering", state.chapterNinePreviousOutcome);
}

function renderChapterNinePhase(phase = state.chapterNinePhase, previousOutcome = state.chapterNinePreviousOutcome) {
  state.stage = "chapter9-ready";
  state.chapterNinePhase = phase;
  state.chapterTwoPhase = `chapter9-${phase}`;
  if (phase === "finale") {
    renderChapterNineFinale(previousOutcome);
    return;
  }
  const chapter = CONTENT.chapterNine.stages[phase];
  if (!chapter) return;
  const labels = { gathering: "星獸集會", testimony: "記憶裁庭", encounter: "裂隙內側", witnesses: "回聲長廊", ritual: "七席環庭", threshold: "最後星門" };
  setStageLabel(`第九章・${labels[phase]}`, chapter.clock);
  const storyTitle = phase === "gathering" ? `第九章｜${chapter.title}` : chapter.title;
  setStory(storyTitle, [...(phase === "gathering" ? [] : [previousOutcome]), ...chapter.paragraphs].filter(Boolean));
  renderChoices(chapter.choices.map((choice) => ({ ...choice, choose: () => resolveChapterNine(choice) })));
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = "";
  renderStats();
  persistSave();
}

function resolveChapterNine(choice) {
  state.chapterNinePreviousOutcome = choice.outcome;
  if (state.chapterNinePhase === "gathering") {
    state.chapterNineGatheringChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterNinePhase("testimony", choice.outcome);
  } else if (state.chapterNinePhase === "testimony") {
    state.chapterNineTestimonyChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterNinePhase("encounter", choice.outcome);
  } else if (state.chapterNinePhase === "encounter") {
    state.chapterNineEncounterChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterNinePhase("witnesses", choice.outcome);
  } else if (state.chapterNinePhase === "witnesses") {
    state.chapterNineWitnessChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterNinePhase("ritual", choice.outcome);
  } else if (state.chapterNinePhase === "ritual") {
    state.chapterNineRitualChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterNinePhase("threshold", choice.outcome);
  } else if (state.chapterNinePhase === "threshold") {
    state.chapterNineThresholdChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterNinePhase("finale", choice.outcome);
  }
  applyEffects(choice.effects);
  persistSave();
  renderStats();
}

function renderChapterNineFinale(previousOutcome = state.chapterNinePreviousOutcome) {
  const finale = CONTENT.chapterNine.finales[state.chapterNineThresholdChoice];
  if (!finale) return;
  state.chapterNineComplete = true;
  setStageLabel("第九章・尾聲", "最後星門・大結局入口");
  setStory(`第九章｜${finale.title}`, [previousOutcome, ...finale.paragraphs].filter(Boolean));
  $("#choices").innerHTML = "";
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = `<div class="ending-card"><h2>${escapeHTML(finale.title)}</h2><p>${escapeHTML(finale.summary)}</p><p class="next-hook">${escapeHTML(finale.hook)}</p><div class="ending-actions"><button class="ending-button" id="goChapterTen">進入大結局</button><button class="quiet-button" id="reopenChapterNineFinale">重新查看尾聲</button><button class="quiet-button" id="newRun">開始新週目</button></div></div>`;
  $("#goChapterTen").addEventListener("click", beginChapterTen);
  $("#reopenChapterNineFinale").addEventListener("click", () => renderChapterNinePhase("finale"));
  $("#newRun").addEventListener("click", reset);
  persistSave();
  renderStats();
}

function beginChapterTen() {
  state.chapterTenPhase = "arrival";
  state.chapterTenPreviousOutcome = state.chapterNinePreviousOutcome;
  state.nextGoal = "抵達元素洪流源頭，決定世界與七者的未來";
  state.chapterTenComplete = false;
  renderChapterTenPhase("arrival", state.chapterTenPreviousOutcome);
  persistSave();
}

function openChapterTen(save = state) {
  const defaults = initialState();
  state = { ...defaults, ...save, stage: "chapter10-ready", slots: 0,
    stats: { ...defaults.stats, ...save.stats }, trust: { ...defaults.trust, ...save.trust },
    battle: { ...defaults.battle, ...save.battle },
    log: Array.isArray(save.chronicle) ? save.chronicle : Array.isArray(save.log) ? save.log : [] };
  state.chapterThreeAstridJoined = true;
  state.chapterThreeGrimmJoined = true;
  state.chapterThreeJoined = true;
  state.chapterFiveEilanJoined = state.chapterFiveLensChoice === "answer_name";
  renderChapterTenPhase(state.chapterTenPhase || "arrival", state.chapterTenPreviousOutcome);
}

function renderChapterTenPhase(phase = state.chapterTenPhase, previousOutcome = state.chapterTenPreviousOutcome) {
  state.stage = "chapter10-ready";
  state.chapterTenPhase = phase;
  state.chapterTwoPhase = `chapter10-${phase}`;
  if (phase === "finale") {
    renderChapterTenFinale(previousOutcome);
    return;
  }
  const chapter = CONTENT.chapterTen.stages[phase];
  if (!chapter) return;
  const labels = { arrival: "洪流源頭", lifelines: "世界求救", beasts: "星獸回應", reckoning: "最後證詞", name: "第一守護者", method: "歸潮機關", core: "洪流之心" };
  setStageLabel(`第十章・${labels[phase]}`, chapter.clock);
  const storyTitle = phase === "arrival" ? `第十章｜${chapter.title}` : chapter.title;
  setStory(storyTitle, [...(phase === "arrival" ? [] : [previousOutcome]), ...chapter.paragraphs].filter(Boolean));
  renderChoices(chapter.choices.map((choice) => ({ ...choice, choose: () => resolveChapterTen(choice) })));
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = "";
  renderStats();
  persistSave();
}

function resolveChapterTen(choice) {
  state.chapterTenPreviousOutcome = choice.outcome;
  if (state.chapterTenPhase === "arrival") {
    state.chapterTenArrivalChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterTenPhase("lifelines", choice.outcome);
  } else if (state.chapterTenPhase === "lifelines") {
    state.chapterTenLifelineChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterTenPhase("beasts", choice.outcome);
  } else if (state.chapterTenPhase === "beasts") {
    state.chapterTenBeastsChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterTenPhase("reckoning", choice.outcome);
  } else if (state.chapterTenPhase === "reckoning") {
    state.chapterTenReckoningChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterTenPhase("name", choice.outcome);
  } else if (state.chapterTenPhase === "name") {
    state.chapterTenNameChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterTenPhase("method", choice.outcome);
  } else if (state.chapterTenPhase === "method") {
    state.chapterTenMethodChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterTenPhase("core", choice.outcome);
  } else if (state.chapterTenPhase === "core") {
    state.chapterTenCoreBaseline = { stats: { ...state.stats }, trust: { ...state.trust } };
    state.chapterTenCoreChoice = choice.id;
    state.nextGoal = choice.nextGoal;
    renderChapterTenPhase("finale", choice.outcome);
  }
  applyEffects(choice.effects);
  persistSave();
  renderStats();
}

function renderChapterTenFinale(previousOutcome = state.chapterTenPreviousOutcome) {
  const finale = CONTENT.chapterTen.finales[state.chapterTenCoreChoice];
  if (!finale) return;
  state.chapterTenComplete = true;
  setStageLabel("第十章・尾聲", "洪流之心・結局");
  setStory(`第十章｜${finale.title}`, [previousOutcome, ...finale.paragraphs].filter(Boolean));
  $("#choices").innerHTML = "";
  $("#continueArea").innerHTML = "";
  $("#actionArea").innerHTML = "";
  $("#battleArea").innerHTML = "";
  $("#endingArea").innerHTML = `<div class="ending-card"><h2>${escapeHTML(finale.title)}</h2><p>${escapeHTML(finale.summary)}</p><p class="next-hook">${escapeHTML(finale.hook)}</p><div class="ending-actions"><button class="ending-button" id="reopenChapterTenFinale">改選另一個結局</button><button class="quiet-button" id="newRun">開始新週目</button></div></div>`;
  $("#reopenChapterTenFinale").addEventListener("click", () => {
    const baseline = state.chapterTenCoreBaseline;
    if (baseline) {
      state.stats = { ...baseline.stats };
      state.trust = { ...baseline.trust };
    }
    state.chapterTenCoreBaseline = null;
    state.chapterTenCoreChoice = null;
    state.chapterTenComplete = false;
    const methodChoice = CONTENT.chapterTen.stages.method.choices.find((choice) => choice.id === state.chapterTenMethodChoice);
    state.chapterTenPreviousOutcome = methodChoice?.outcome ?? "歸潮機關已準備就緒。";
    state.nextGoal = "為洪流之心選擇最後的結局";
    renderChapterTenPhase("core", state.chapterTenPreviousOutcome);
    renderStats();
    $("#choices").scrollIntoView({ behavior: "smooth", block: "center" });
  });
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
initTextSizeControls();
preserveStoredSaveDuringBoot = true;
renderOpening();
preserveStoredSaveDuringBoot = false;
renderStats();
renderLog();
renderSaveSlots();
