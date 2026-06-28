const cardPool = window.CARD_POOL || [];

const state = {
  playerHp: 30,
  enemyHp: 30,
  playerShield: 0,
  enemyShield: 0,
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

beginButton.addEventListener("click", () => showView("battlePanel"));
restartButton.addEventListener("click", resetGame);
drawButton.addEventListener("click", drawOpeningHands);

navButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

function showView(viewId) {
  panels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.id !== viewId);
  });

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === viewId);
  });
}

function buildDeckFromPool() {
  const deck = [];
  cardPool.forEach((card) => {
    const copies = card.copies || 1;
    for (let index = 0; index < copies; index += 1) {
      deck.push({ ...card, instanceId: `${card.id}-${index}-${crypto.randomUUID()}` });
    }
  });
  return shuffle(deck);
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
  state.playerDeck = buildDeckFromPool();
  state.enemyDeck = buildDeckFromPool();
  state.playerHand = drawCardsFromDeck(state.playerDeck, 5);
  state.enemyHand = drawCardsFromDeck(state.enemyDeck, 5);
  state.hasDrawn = true;
  drawButton.disabled = true;
  turnStatus.textContent = "玩家回合：選一張牌出牌";
  roundLog.textContent = "已從卡池建立雙方牌堆並抽出起始手牌。選一張牌，電腦會接著出牌。";
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
  if (state.playerHand.length === 0) {
    state.playerHand.push(...drawCardsFromDeck(state.playerDeck, 2));
  }

  if (state.enemyHand.length === 0) {
    state.enemyHand.push(...drawCardsFromDeck(state.enemyDeck, 2));
  }
}

function playPlayerCard(index) {
  if (!state.hasDrawn || state.gameOver || state.waitingForEnemy) return;
  const playerCard = state.playerHand.splice(index, 1)[0];
  const playerResult = resolveCard(playerCard, "player", true);

  playerPlayed.innerHTML = cardSummary(playerCard, playerResult.totalPower);
  roundLog.innerHTML = [
    logLine("player", `玩家打出「${playerCard.name}」，造成 ${playerResult.damageDone} 點崩壞壓制。`),
    logLine("system", "潰堤使徒正在凝聚下一張牌...")
  ].join("<br>");

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
  if (state.gameOver || !state.enemyHand.length) return;
  const enemyIndex = Math.floor(Math.random() * state.enemyHand.length);
  const enemyCard = state.enemyHand.splice(enemyIndex, 1)[0];
  const enemyResult = resolveCard(enemyCard, "enemy", false);

  state.waitingForEnemy = false;
  state.enemyPlayTimer = null;
  enemyPlayed.innerHTML = cardSummary(enemyCard, enemyResult.totalPower);
  roundLog.innerHTML += `<br>${logLine("enemy", `電腦打出「${enemyCard.name}」，造成 ${enemyResult.damageDone} 點穩定衝擊。`)}`;
  roundLog.innerHTML += `<br>${logLine("system", statusLine())}`;

  refillHandIfNeeded();

  if (!state.playerHand.length || !state.enemyHand.length) {
    roundLog.innerHTML += `<br>${logLine("system", "有一方牌堆與手牌已耗盡，裂隙戰進入終局。")}`;
  }

  checkGameOver();
  render();
}

function logLine(type, text) {
  return `<span class="log-line log-${type}">${text}</span>`;
}

function resolveCard(card, side, isFirst) {
  const attacker = side === "player" ? "player" : "enemy";
  const defender = side === "player" ? "enemy" : "player";
  const bonus = card.bonus && isFirst ? card.bonus : 0;
  const totalPower = card.power + bonus;
  const shieldKey = `${defender}Shield`;
  const hpKey = `${defender}Hp`;
  const blocked = Math.min(state[shieldKey], totalPower);
  const damageDone = totalPower - blocked;

  state[shieldKey] -= blocked;
  state[hpKey] = Math.max(0, state[hpKey] - damageDone);

  if (card.heal) {
    const ownHp = `${attacker}Hp`;
    state[ownHp] = Math.min(30, state[ownHp] + card.heal);
  }

  if (card.shield) {
    state[`${attacker}Shield`] += card.shield;
  }

  if (card.selfDamage) {
    const ownHp = `${attacker}Hp`;
    state[ownHp] = Math.max(0, state[ownHp] - card.selfDamage);
  }

  return { totalPower, damageDone };
}

function statusLine() {
  const playerShieldText = state.playerShield ? `玩家護盾 ${state.playerShield}` : "玩家無護盾";
  const enemyShieldText = state.enemyShield ? `電腦護盾 ${state.enemyShield}` : "電腦無護盾";
  return `${playerShieldText}，${enemyShieldText}。`;
}

function checkGameOver(options = {}) {
  const allowExhaustion = options.allowExhaustion !== false;
  if (state.playerHp <= 0 && state.enemyHp <= 0) {
    endGame("星幽與崩壞同時歸零，世界停在危險的平衡。", "平局");
  } else if (state.enemyHp <= 0) {
    endGame("你壓制了潰堤使徒，星界堤防暫時穩住。", "玩家勝利");
  } else if (state.playerHp <= 0) {
    endGame("穩定值耗盡，星幽洪流吞沒了戰場。", "玩家失敗");
  } else if (allowExhaustion && (!state.playerHand.length || !state.enemyHand.length)) {
    const playerWon = state.playerHp >= state.enemyHp;
    const winner = playerWon
      ? "牌堆耗盡時你保有較高穩定值，星界堤防暫時穩住。"
      : "牌堆耗盡時潰堤使徒佔上風，星幽洪流壓過了防線。";
    endGame(winner, playerWon ? "玩家勝利" : "玩家失敗");
  }
}

function endGame(message, resultLabel = "") {
  state.gameOver = true;
  turnStatus.textContent = resultLabel ? `戰局結束：${resultLabel}` : "戰局結束";
  roundLog.innerHTML += `<br>${message}`;
}

function render() {
  playerHp.textContent = state.playerHp;
  enemyHp.textContent = state.enemyHp;
  playerDeckCount.textContent = state.playerDeck.length;
  enemyDeckCount.textContent = state.enemyDeck.length;
  poolCount.textContent = cardPool.length;
  playerHand.innerHTML = "";
  enemyHand.innerHTML = "";

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
    back.textContent = "星";
    enemyHand.append(back);
  });

  if (state.waitingForEnemy && !state.gameOver) {
    turnStatus.textContent = "電腦回合：3 秒後出牌";
  } else if (state.hasDrawn && !state.gameOver) {
    turnStatus.textContent = "玩家回合：選一張牌出牌";
  }
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

function resetGame() {
  if (state.enemyPlayTimer) {
    window.clearTimeout(state.enemyPlayTimer);
  }

  state.playerHp = 30;
  state.enemyHp = 30;
  state.playerShield = 0;
  state.enemyShield = 0;
  state.playerDeck = [];
  state.enemyDeck = [];
  state.playerHand = [];
  state.enemyHand = [];
  state.hasDrawn = false;
  state.gameOver = false;
  state.waitingForEnemy = false;
  state.enemyPlayTimer = null;
  drawButton.disabled = false;
  playerPlayed.textContent = "玩家尚未出牌";
  enemyPlayed.textContent = "電腦尚未出牌";
  roundLog.textContent = "抽牌後，玩家先出卡。";
  turnStatus.textContent = "等待抽牌";
  render();
}

renderLibrary();
render();
