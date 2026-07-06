const cardPool = window.CARD_POOL || [];

const CONFIG = {
  maxHp: 30,
  secondPhaseHp: 15,
  startingHandSize: 5,
  refillCount: 2,
  resonanceMax: 2,
  resonanceGain: 1,
  enrageStartsAtTurn: 8,
  enrageDamage: 4,
  voidBaseDamage: 1,
  voidDamageIncrease: 1
};

const ENVOYS = [
  {
    id: "fire",
    element: "火",
    title: "火焰女王",
    beastName: "熾炎鳳凰",
    beastSkill: "煉獄火海",
    className: "fire",
    image: "source-materials/images/envoys/fire_envoy_full.png",
    profileText: "火屬性。高傲的火焰女王，擅長以爆發傷害與少量自我回復完成重生循環。",
    effectText: "打出火、星幽或崩壞卡累積共鳴。滿載後可召喚元素使，讓元素使卡進入牌堆，並回復 2 點穩定值。",
    summon: { power: 12, selfHeal: 2 }
  },
  {
    id: "water",
    element: "水",
    title: "深淵支配者",
    beastName: "深淵利維坦",
    beastSkill: "高壓水牢",
    className: "water",
    image: "source-materials/images/envoys/water_envoy_full.png",
    profileText: "水屬性。深淵支配者，兼具治療、護盾與穩定控場能力。",
    effectText: "打出水、星幽或崩壞卡累積共鳴。滿載後可召喚元素使，讓元素使卡進入牌堆，回復 6 點穩定值並獲得 2 點護盾。",
    summon: { power: 8, heal: 6, shield: 2 }
  },
  {
    id: "earth",
    element: "岩",
    title: "巨人戰士",
    beastName: "泰坦岩龜",
    beastSkill: "大地堡壘",
    className: "earth",
    image: "source-materials/images/envoys/earth_envoy_full.png",
    profileText: "岩屬性。不可撼動的巨人戰士，以厚重護盾拖長戰局並累積優勢。",
    effectText: "打出岩、星幽或崩壞卡累積共鳴。滿載後可召喚元素使，讓元素使卡進入牌堆，並獲得 10 點護盾。",
    summon: { power: 6, shield: 10 }
  },
  {
    id: "wind",
    element: "風",
    title: "幻影暗殺者",
    beastName: "虛空影隼",
    beastSkill: "真空斬",
    className: "wind",
    image: "source-materials/images/envoys/wind_envoy_full.png",
    profileText: "風屬性。自由奔放的幻影暗殺者，擅長快速壓血與突襲節奏。",
    effectText: "打出風、星幽或崩壞卡累積共鳴。滿載後可召喚元素使，讓元素使卡進入牌堆，推動快速壓制節奏。",
    summon: { power: 9, bonusDamage: 4 }
  },
  {
    id: "lightning",
    element: "雷",
    title: "閃電女王",
    beastName: "雷霆魔狼",
    beastSkill: "極光雷域",
    className: "lightning",
    image: "source-materials/images/envoys/lightning_envoy_full.png",
    profileText: "雷屬性。急躁且破壞力極高的閃電女王，主打直接而強烈的高爆發。",
    effectText: "打出雷、星幽或崩壞卡累積共鳴。滿載後可召喚元素使，讓元素使卡進入牌堆。",
    summon: { power: 13 }
  },
  {
    id: "light",
    element: "光",
    title: "黎明領袖",
    beastName: "聖裁天馬",
    beastSkill: "聖光幻像",
    className: "light",
    image: "source-materials/images/envoys/light_envoy_full.png",
    profileText: "光屬性。慈悲與審判並存的黎明領袖，能同時治療、守護與反擊。",
    effectText: "打出光、星幽或崩壞卡累積共鳴。滿載後可召喚元素使，讓元素使卡進入牌堆，回復 5 點穩定值並獲得 5 點護盾。",
    summon: { power: 7, heal: 5, shield: 5 }
  },
  {
    id: "dark",
    element: "闇",
    title: "深夜執行者",
    beastName: "虛空夢魘",
    beastSkill: "深黯夢境",
    className: "dark",
    image: "source-materials/images/envoys/dark_envoy_full.png",
    profileText: "闇屬性。深夜執行者，以反噬為代價換取最高單次召喚傷害。",
    effectText: "打出闇、星幽或崩壞卡累積共鳴。滿載後可召喚元素使，讓元素使卡進入牌堆，但自身會受到 3 點反噬。",
    summon: { power: 14, selfDamage: 3 }
  }
];

const state = {
  playerHp: CONFIG.maxHp,
  enemyHp: CONFIG.maxHp,
  playerShield: 0,
  enemyShield: 0,
  playerPhase: 1,
  enemyPhase: 1,
  turn: 0,
  playerVoidStacks: 0,
  enemyVoidStacks: 0,
  resonance: 0,
  selectedEnvoyId: "fire",
  hasSummonedEnvoy: false,
  beastCardsUnlocked: false,
  envoyCardsUnlocked: false,
  playerDeck: [],
  enemyDeck: [],
  playerHand: [],
  enemyHand: [],
  hasDrawn: false,
  gameOver: false,
  waitingForEnemy: false,
  enemyPlayTimer: null
};

const panels = document.querySelectorAll(".view-panel");
const navButtons = document.querySelectorAll("[data-view]");
const beginButton = document.querySelector("#beginButton");
const rulesButton = document.querySelector("#rulesButton");
const rulesCloseButton = document.querySelector("#rulesCloseButton");
const rulesPanel = document.querySelector("#rulesPanel");
const restartButton = document.querySelector("#restartButton");
const drawButton = document.querySelector("#drawButton");
const playerHand = document.querySelector("#playerHand");
const enemyHand = document.querySelector("#enemyHand");
const playerHp = document.querySelector("#playerHp");
const enemyHp = document.querySelector("#enemyHp");
const turnStatus = document.querySelector("#turnStatus");
const roundLog = document.querySelector("#roundLog");
const playerPlayed = document.querySelector("#playerPlayed");
const enemyPlayed = document.querySelector("#enemyPlayed");
const playerDeckCount = document.querySelector("#playerDeckCount");
const enemyDeckCount = document.querySelector("#enemyDeckCount");
const poolCount = document.querySelector("#poolCount");
const cardLibrary = document.querySelector("#cardLibrary");
const librarySummary = document.querySelector("#librarySummary");
const selectedEnvoyName = document.querySelector("#selectedEnvoyName");
const selectedEnvoyEffect = document.querySelector("#selectedEnvoyEffect");
const selectedEnvoyPortrait = document.querySelector("#selectedEnvoyPortrait");
const envoyButtons = document.querySelector("#envoyButtons");
const playerPhase = document.querySelector("#playerPhase");
const enemyPhase = document.querySelector("#enemyPhase");
const resonanceMeter = document.querySelector("#resonanceMeter");
const turnCounter = document.querySelector("#turnCounter");
const summonButton = document.querySelector("#summonButton");
const passButton = document.querySelector("#passButton");
const hazardStatus = document.querySelector("#hazardStatus");

beginButton.addEventListener("click", () => showView("battlePanel"));
rulesButton.addEventListener("click", showRules);
rulesCloseButton.addEventListener("click", hideRules);
rulesPanel.addEventListener("click", (event) => {
  if (event.target === rulesPanel) {
    hideRules();
  }
});
restartButton.addEventListener("click", resetGame);
drawButton.addEventListener("click", drawOpeningHands);
summonButton.addEventListener("click", summonEnvoy);
passButton.addEventListener("click", passPlayerTurn);

navButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !rulesPanel.classList.contains("is-hidden")) {
    hideRules();
  }
});

function currentEnvoy() {
  return ENVOYS.find((envoy) => envoy.id === state.selectedEnvoyId) || ENVOYS[0];
}

function selectEnvoy(envoyId) {
  if (state.hasDrawn) return;
  state.selectedEnvoyId = envoyId;
  render();
}

function showView(viewId) {
  panels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.id !== viewId);
  });

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === viewId);
  });
}

function showRules() {
  rulesPanel.classList.remove("is-hidden");
}

function hideRules() {
  rulesPanel.classList.add("is-hidden");
}

function buildDeckFromPool() {
  return buildDeckFromCards(cardPool);
}

function buildDeckFromCards(cards) {
  const deck = [];
  cards.forEach((card) => {
    const copies = card.copies || 1;
    for (let index = 0; index < copies; index += 1) {
      const randomId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
      deck.push({ ...card, instanceId: `${card.id}-${index}-${randomId}` });
    }
  });
  return shuffle(deck);
}

function isBeastCard(card) {
  return card.image.includes("/beasts/");
}

function isEnvoyCard(card) {
  return card.rarity === "主將" || card.image.includes("/envoys/");
}

function isOpeningCard(card) {
  return !isBeastCard(card) && !isEnvoyCard(card);
}

function insertUnlockedCards(deck, filterFn) {
  const unlockedCards = buildDeckFromCards(cardPool.filter(filterFn));
  deck.push(...unlockedCards);
  return shuffle(deck);
}

function unlockBeastCards() {
  if (state.beastCardsUnlocked) return "";

  state.beastCardsUnlocked = true;
  state.playerDeck = insertUnlockedCards(state.playerDeck, isBeastCard);
  state.enemyDeck = insertUnlockedCards(state.enemyDeck, isBeastCard);
  return "第一輪手牌耗盡，神獸型態卡已混入雙方牌堆。";
}

function shuffle(cards) {
  const shuffled = [...cards];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}

function drawOpeningHands() {
  if (state.hasDrawn || !cardPool.length) return;
  const openingPool = cardPool.filter(isOpeningCard);
  state.playerDeck = buildDeckFromCards(openingPool);
  state.enemyDeck = buildDeckFromCards(openingPool);
  state.playerHand = drawCardsFromDeck(state.playerDeck, CONFIG.startingHandSize);
  state.enemyHand = drawCardsFromDeck(state.enemyDeck, CONFIG.startingHandSize);
  state.hasDrawn = true;
  drawButton.disabled = true;
  turnStatus.textContent = "玩家回合：選一張牌出牌";
  roundLog.textContent = `已由「${currentEnvoy().title}」領戰並抽出起始手牌。起手不會抽到神獸或元素使，打完第一輪後神獸型態才會進入牌堆。`;
  render();
}

function drawCardsFromDeck(deck, count) {
  const drawn = [];
  while (drawn.length < count && deck.length > 0) {
    drawn.push(deck.shift());
  }
  return drawn;
}

function refillHandIfNeeded() {
  const unlockMessage = !state.playerHand.length && !state.enemyHand.length
    ? unlockBeastCards()
    : "";

  if (state.playerHand.length === 0) {
    state.playerHand.push(...drawCardsFromDeck(state.playerDeck, CONFIG.refillCount));
  }

  if (state.enemyHand.length === 0) {
    state.enemyHand.push(...drawCardsFromDeck(state.enemyDeck, CONFIG.refillCount));
  }

  if (unlockMessage) {
    roundLog.innerHTML += `<br>${logLine("system", unlockMessage)}`;
  }
}

function playPlayerCard(index) {
  if (!state.hasDrawn || state.gameOver || state.waitingForEnemy) return;
  const playerCard = state.playerHand.splice(index, 1)[0];
  const playerResult = resolveCard(playerCard, "player", true);
  const resonanceText = gainResonance(playerCard);

  playerPlayed.innerHTML = cardSummary(playerCard, playerResult.totalPower);
  roundLog.innerHTML = [
    logLine("player", `玩家打出「${playerCard.name}」，造成 ${playerResult.damageDone} 點崩壞壓制。`),
    resonanceText ? logLine("system", resonanceText) : "",
    playerResult.phaseMessage ? logLine("system", playerResult.phaseMessage) : "",
    logLine("system", "潰堤使徒正在凝聚下一張牌...")
  ].filter(Boolean).join("<br>");

  checkGameOver({ allowExhaustion: false });

  if (state.gameOver) {
    render();
    return;
  }

  state.waitingForEnemy = true;
  turnStatus.textContent = "電腦回合：3 秒後出牌";
  render();

  state.enemyPlayTimer = window.setTimeout(playEnemyCard, 3000);
}

function playEnemyCard() {
  if (state.gameOver) return;
  if (!state.enemyHand.length) {
    state.waitingForEnemy = false;
    applyEndOfRoundRules();
    checkGameOver();
    render();
    return;
  }
  const enemyIndex = Math.floor(Math.random() * state.enemyHand.length);
  const enemyCard = state.enemyHand.splice(enemyIndex, 1)[0];
  const enemyResult = resolveCard(enemyCard, "enemy", false);

  state.waitingForEnemy = false;
  state.enemyPlayTimer = null;
  enemyPlayed.innerHTML = cardSummary(enemyCard, enemyResult.totalPower);
  roundLog.innerHTML += `<br>${logLine("enemy", `電腦打出「${enemyCard.name}」，造成 ${enemyResult.damageDone} 點穩定衝擊。`)}`;
  if (enemyResult.phaseMessage) {
    roundLog.innerHTML += `<br>${logLine("system", enemyResult.phaseMessage)}`;
  }
  roundLog.innerHTML += `<br>${logLine("system", statusLine())}`;

  refillHandIfNeeded();

  applyEndOfRoundRules();

  checkGameOver();
  render();
}

function logLine(type, text) {
  return `<span class="log-line log-${type}">${text}</span>`;
}

function gainResonance(card) {
  const envoy = currentEnvoy();
  if (state.hasSummonedEnvoy) return "";
  const isWildResonance = card.element === "星幽" || card.element === "崩壞";
  const isElementResonance = card.element === envoy.element;
  if (!isElementResonance && !isWildResonance) return "";

  state.resonance = Math.min(CONFIG.resonanceMax, state.resonance + CONFIG.resonanceGain);
  if (state.resonance >= CONFIG.resonanceMax) {
    return `「${envoy.element}」元素共鳴滿載，可以召喚「${envoy.title}」，讓元素使卡進入牌堆。`;
  }
  const sourceText = isWildResonance ? `${card.element}通用共鳴` : `${envoy.element}元素共鳴`;
  return `「${sourceText}」+${CONFIG.resonanceGain}。`;
}

function resolveCard(card, side, isFirst) {
  const attacker = side === "player" ? "player" : "enemy";
  const defender = side === "player" ? "enemy" : "player";
  const bonus = card.bonus && isFirst ? card.bonus : 0;
  const totalPower = card.power + bonus;
  const damageResult = dealDamage(defender, totalPower);

  if (card.heal) {
    const ownHp = `${attacker}Hp`;
    state[ownHp] = Math.min(maxHpFor(attacker), state[ownHp] + card.heal);
  }

  if (card.shield) {
    state[`${attacker}Shield`] += card.shield;
  }

  if (card.selfDamage) {
    dealDamage(attacker, card.selfDamage, { ignoreShield: true });
  }

  return {
    totalPower,
    damageDone: damageResult.damageDone,
    phaseMessage: damageResult.phaseMessage
  };
}

function maxHpFor(side) {
  return state[`${side}Phase`] === 1 ? CONFIG.maxHp : CONFIG.secondPhaseHp;
}

function dealDamage(side, amount, options = {}) {
  const shieldKey = `${side}Shield`;
  const hpKey = `${side}Hp`;
  const phaseKey = `${side}Phase`;
  const blocked = options.ignoreShield ? 0 : Math.min(state[shieldKey], amount);
  const damageDone = amount - blocked;
  let remainingDamage = damageDone;
  let phaseMessage = "";

  if (!options.ignoreShield) {
    state[shieldKey] -= blocked;
  }

  while (remainingDamage > 0 && state[hpKey] > 0 && !state.gameOver) {
    const damageToCurrentPhase = Math.min(state[hpKey], remainingDamage);
    state[hpKey] -= damageToCurrentPhase;
    remainingDamage -= damageToCurrentPhase;

    if (state[hpKey] <= 0 && state[phaseKey] === 1) {
      state[phaseKey] = 2;
      state[hpKey] = CONFIG.secondPhaseHp;
      state[shieldKey] = 0;
      const label = side === "player" ? "玩家使者" : "潰堤使徒";
      phaseMessage = `${label}第一階段被擊破，轉入神獸型態並恢復 ${CONFIG.secondPhaseHp} 點生命。`;
    }
  }

  return { blocked, damageDone, phaseMessage };
}

function statusLine() {
  const playerShieldText = state.playerShield ? `玩家護盾 ${state.playerShield}` : "玩家無護盾";
  const enemyShieldText = state.enemyShield ? `電腦護盾 ${state.enemyShield}` : "電腦無護盾";
  return `${playerShieldText}，${enemyShieldText}。`;
}

function summonEnvoy() {
  if (
    !state.hasDrawn ||
    state.gameOver ||
    state.waitingForEnemy ||
    state.hasSummonedEnvoy ||
    state.resonance < CONFIG.resonanceMax
  ) {
    return;
  }

  const envoy = currentEnvoy();
  const effect = envoy.summon;
  const messages = [
    logLine("player", `共鳴滿載，召喚「${envoy.title}」，元素使卡已混入雙方牌堆。`)
  ];

  state.playerDeck = insertUnlockedCards(state.playerDeck, isEnvoyCard);
  state.enemyDeck = insertUnlockedCards(state.enemyDeck, isEnvoyCard);

  if (effect.heal) {
    state.playerHp = Math.min(maxHpFor("player"), state.playerHp + effect.heal);
    messages.push(logLine("system", `玩家回復 ${effect.heal} 點穩定值。`));
  }

  if (effect.selfHeal) {
    state.playerHp = Math.min(maxHpFor("player"), state.playerHp + effect.selfHeal);
    messages.push(logLine("system", `火焰重生，玩家回復 ${effect.selfHeal} 點穩定值。`));
  }

  if (effect.shield) {
    state.playerShield += effect.shield;
    messages.push(logLine("system", `玩家獲得 ${effect.shield} 點護盾。`));
  }

  if (effect.selfDamage) {
    dealDamage("player", effect.selfDamage, { ignoreShield: true });
    messages.push(logLine("system", `深黯反噬，玩家承受 ${effect.selfDamage} 點傷害。`));
  }

  state.resonance = 0;
  state.hasSummonedEnvoy = true;
  state.envoyCardsUnlocked = true;
  playerPlayed.innerHTML = envoySummary(envoy);
  roundLog.innerHTML = messages.join("<br>");
  checkGameOver({ allowExhaustion: false });
  render();
}

function passPlayerTurn() {
  if (!state.hasDrawn || state.gameOver || state.waitingForEnemy) return;

  state.waitingForEnemy = true;
  playerPlayed.textContent = "玩家本回合未出牌";
  roundLog.innerHTML = [
    logLine("player", state.playerHand.length ? "玩家選擇保留手牌，結束回合。" : "玩家沒有可出的手牌，結束回合。"),
    logLine("system", "潰堤使徒正在凝聚下一張牌...")
  ].join("<br>");
  turnStatus.textContent = "電腦回合：3 秒後出牌";
  render();

  state.enemyPlayTimer = window.setTimeout(playEnemyCard, 3000);
}

function applyEndOfRoundRules() {
  state.turn += 1;
  const messages = [];

  if (!state.playerDeck.length && !state.playerHand.length) {
    state.playerVoidStacks += CONFIG.voidDamageIncrease;
    const damage = CONFIG.voidBaseDamage + state.playerVoidStacks - 1;
    dealDamage("player", damage, { ignoreShield: true });
    messages.push(`玩家牌堆耗盡，虛無吞噬造成 ${damage} 點傷害。`);
  }

  if (!state.enemyDeck.length && !state.enemyHand.length) {
    state.enemyVoidStacks += CONFIG.voidDamageIncrease;
    const damage = CONFIG.voidBaseDamage + state.enemyVoidStacks - 1;
    dealDamage("enemy", damage, { ignoreShield: true });
    messages.push(`潰堤使徒牌堆耗盡，虛無吞噬造成 ${damage} 點傷害。`);
  }

  if (state.turn >= CONFIG.enrageStartsAtTurn) {
    dealDamage("player", CONFIG.enrageDamage, { ignoreShield: true });
    dealDamage("enemy", CONFIG.enrageDamage, { ignoreShield: true });
    messages.push(`第 ${state.turn} 回合後元素狂暴，雙方各受到 ${CONFIG.enrageDamage} 點不可防禦傷害。`);
  }

  if (messages.length) {
    roundLog.innerHTML += `<br>${logLine("system", messages.join(" "))}`;
  }
}

function checkGameOver(options = {}) {
  const allowExhaustion = options.allowExhaustion !== false;
  if (state.playerHp <= 0 && state.enemyHp <= 0) {
    endGame("星幽與崩壞同時歸零，世界停在危險的平衡。", "平局");
  } else if (state.enemyHp <= 0) {
    endGame("你壓制了潰堤使徒，星界堤防暫時穩住。", "玩家勝利");
  } else if (state.playerHp <= 0) {
    endGame("穩定值耗盡，星幽洪流吞沒了戰場。", "玩家失敗");
  } else if (allowExhaustion && !state.playerHand.length && !state.enemyHand.length && !state.playerDeck.length && !state.enemyDeck.length) {
    endGame("雙方資源耗盡，裂隙戰被迫停在未決狀態。", "平局");
  }
}

function endGame(message, resultLabel = "") {
  state.gameOver = true;
  turnStatus.textContent = resultLabel ? `戰局結束：${resultLabel}` : "戰局結束";
  roundLog.innerHTML += `<br>${message}`;
}

function render() {
  const envoy = currentEnvoy();
  playerHp.textContent = state.playerHp;
  enemyHp.textContent = state.enemyHp;
  playerDeckCount.textContent = state.playerDeck.length;
  enemyDeckCount.textContent = state.enemyDeck.length;
  poolCount.textContent = cardPool.length;
  selectedEnvoyName.textContent = `${envoy.title} / ${envoy.beastName}`;
  selectedEnvoyEffect.textContent = `${envoy.profileText} ${envoy.effectText}`;
  selectedEnvoyPortrait.src = envoy.image;
  selectedEnvoyPortrait.alt = `${envoy.title}，${envoy.element}元素使者`;
  playerPhase.textContent = state.playerPhase === 1 ? "一階" : "神獸型態";
  enemyPhase.textContent = state.enemyPhase === 1 ? "一階" : "神獸型態";
  resonanceMeter.textContent = state.hasSummonedEnvoy
    ? "元素使已召喚"
    : `${state.resonance} / ${CONFIG.resonanceMax}`;
  turnCounter.textContent = state.turn;
  summonButton.disabled = !state.hasDrawn ||
    state.gameOver ||
    state.waitingForEnemy ||
    state.hasSummonedEnvoy ||
    state.resonance < CONFIG.resonanceMax;
  passButton.disabled = !state.hasDrawn || state.gameOver || state.waitingForEnemy;
  hazardStatus.textContent = hazardLine();
  playerHand.innerHTML = "";
  enemyHand.innerHTML = "";
  renderEnvoyButtons();

  state.playerHand.forEach((card, index) => {
    const button = document.createElement("button");
    button.className = `card ${card.className}`;
    button.innerHTML = cardMarkup(card);
    button.disabled = state.gameOver || state.waitingForEnemy;
    button.addEventListener("click", () => playPlayerCard(index));
    playerHand.append(button);
  });

  state.enemyHand.forEach(() => {
    const back = document.createElement("div");
    back.className = "card-back";
    enemyHand.append(back);
  });

  if (state.waitingForEnemy && !state.gameOver) {
    turnStatus.textContent = "電腦回合：3 秒後出牌";
  } else if (state.hasDrawn && !state.playerHand.length && !state.gameOver) {
    turnStatus.textContent = "玩家回合：無手牌，可結束回合";
  } else if (state.hasDrawn && !state.gameOver) {
    turnStatus.textContent = "玩家回合：選一張牌出牌";
  }
}

function renderEnvoyButtons() {
  envoyButtons.innerHTML = "";
  ENVOYS.forEach((envoy) => {
    const button = document.createElement("button");
    button.className = `envoy-button ${envoy.className}`;
    button.type = "button";
    button.innerHTML = `
      <img src="${envoy.image}" alt="">
      <span>${envoy.element}</span>
    `;
    button.title = `${envoy.title}：${envoy.effectText}`;
    button.disabled = state.hasDrawn;
    button.classList.toggle("is-active", envoy.id === state.selectedEnvoyId);
    button.addEventListener("click", () => selectEnvoy(envoy.id));
    envoyButtons.append(button);
  });
}

function hazardLine() {
  const parts = [];
  if (state.playerVoidStacks || state.enemyVoidStacks) {
    parts.push(`虛無層數 玩家 ${state.playerVoidStacks} / 敵方 ${state.enemyVoidStacks}`);
  }

  if (state.turn >= CONFIG.enrageStartsAtTurn) {
    parts.push(`狂暴中：每回合 ${CONFIG.enrageDamage} 傷害`);
  } else {
    const remainingTurns = CONFIG.enrageStartsAtTurn - state.turn;
    parts.push(`狂暴倒數：剩餘 ${remainingTurns} 回合`);
  }

  return parts.join("。");
}

function renderLibrary() {
  const totalCopies = cardPool.reduce((sum, card) => sum + (card.copies || 1), 0);
  const elements = [...new Set(cardPool.map((card) => card.element))].join(" / ");
  librarySummary.innerHTML = `
    <span>卡片種類 <strong>${cardPool.length}</strong></span>
    <span>牌堆總張數 <strong>${totalCopies}</strong></span>
    <span>元素 <strong>${elements}</strong></span>
  `;

  cardLibrary.innerHTML = "";
  cardPool.forEach((card) => {
    const article = document.createElement("article");
    article.className = `card preview-card ${card.className}`;
    article.innerHTML = `
      ${cardMarkup(card)}
      <dl class="card-stats">
        <div><dt>稀有度</dt><dd>${card.rarity}</dd></div>
        <div><dt>卡池數量</dt><dd>${card.copies || 1}</dd></div>
        <div><dt>編號</dt><dd>${card.id}</dd></div>
      </dl>
      <small>${card.flavor}</small>
    `;
    cardLibrary.append(article);
  });
}

function cardMarkup(card) {
  const traits = [];
  if (card.heal) traits.push(`回復 ${card.heal}`);
  if (card.shield) traits.push(`護盾 ${card.shield}`);
  if (card.bonus) traits.push(`先手 +${card.bonus}`);
  if (card.selfDamage) traits.push(`反噬 ${card.selfDamage}`);
  const traitText = traits.length ? traits.join("｜") : "無附加效果";

  return `
    <div class="card-frame">
      <img class="card-art" src="${card.image}" alt="${card.name}">
      <div class="card-caption">
        <div class="card-title-row">
          <strong>${card.name}</strong>
          <span>${card.element}</span>
        </div>
        <p>${card.text}</p>
        <em>力量 ${card.power}｜${traitText}</em>
      </div>
    </div>
  `;
}

function cardSummary(card, power) {
  return `
    <div class="card-frame summary-card">
      <img class="card-art" src="${card.image}" alt="${card.name}">
      <div class="card-caption">
        <div class="card-title-row">
          <strong>${card.name}</strong>
          <span>${card.element}</span>
        </div>
        <p>${card.text}</p>
        <em>本次力量 ${power}</em>
      </div>
    </div>
  `;
}

function beastSummary(envoy, power) {
  return `
    <div class="card-frame summary-card">
      <div class="beast-sigil ${envoy.className}">${envoy.element}</div>
      <div class="card-caption">
        <div class="card-title-row">
          <strong>${envoy.beastName}</strong>
          <span>${envoy.element}</span>
        </div>
        <p>${envoy.beastSkill}</p>
        <em>召喚力量 ${power}</em>
      </div>
    </div>
  `;
}

function envoySummary(envoy) {
  return `
    <div class="card-frame summary-card">
      <img class="card-art" src="${envoy.image}" alt="${envoy.title}">
      <div class="card-caption">
        <div class="card-title-row">
          <strong>${envoy.title}</strong>
          <span>${envoy.element}</span>
        </div>
        <p>${envoy.beastSkill}的共鳴已開啟，元素使卡將從牌堆中現身。</p>
        <em>召喚元素使</em>
      </div>
    </div>
  `;
}

function resetGame() {
  if (state.enemyPlayTimer) {
    window.clearTimeout(state.enemyPlayTimer);
  }

  state.playerHp = CONFIG.maxHp;
  state.enemyHp = CONFIG.maxHp;
  state.playerShield = 0;
  state.enemyShield = 0;
  state.playerPhase = 1;
  state.enemyPhase = 1;
  state.turn = 0;
  state.playerVoidStacks = 0;
  state.enemyVoidStacks = 0;
  state.resonance = 0;
  state.hasSummonedEnvoy = false;
  state.beastCardsUnlocked = false;
  state.envoyCardsUnlocked = false;
  state.playerDeck = [];
  state.enemyDeck = [];
  state.playerHand = [];
  state.enemyHand = [];
  state.hasDrawn = false;
  state.gameOver = false;
  state.waitingForEnemy = false;
  state.enemyPlayTimer = null;
  drawButton.disabled = false;
  summonButton.disabled = true;
  passButton.disabled = true;
  playerPlayed.textContent = "玩家尚未出牌";
  enemyPlayed.textContent = "電腦尚未出牌";
  roundLog.textContent = "抽牌後，玩家先出卡。";
  turnStatus.textContent = "等待抽牌";
  render();
}

renderLibrary();
render();
