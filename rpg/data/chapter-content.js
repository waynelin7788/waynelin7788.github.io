/*
 * Narrative and branching data for the static RPG prototype.
 * Keep prose, dialogue, visible choices, conditions and state effects here;
 * main.js owns rendering and the small set of reusable game rules.
 */
window.RPG_CONTENT = {
  storageKey: "aether-revelation-rpg-chapter-save-v1",
  opening: {
    title: "界碑村的天色，像被水浸過的灰燼。",
    paragraphs: [
      { text: "你是能與七大神獸共鳴的凡人調律者。界碑村的石牆在腳下微微顫動，遠處蒼穹之壁的殘光一閃一滅，像是有什麼東西正隔著天幕敲門。", aside: true },
      "英格瓦守在村口，巨龍之肋橫在臂彎；弗蕾亞把藥箱搬進祈禱所；法芙娜獨自站在界碑旁，望著那道不斷吐出灰白微光的裂隙。",
      { speaker: "英格瓦", text: "三次震動之間的間隔變短了。天黑以前，我們得把村子的人送上高地。" },
      { speaker: "弗蕾亞", text: "我需要幫手。南坡還有幾戶沒找到家人，不能就這樣把他們留在原地。" },
      { speaker: "法芙娜", text: "等一下。裂隙裡……有人在叫。" },
      "夕照只剩一線。你還能安排三個行動時段。"
    ],
    choices: [
      { id: "measured", title: "蹲下，把掌心貼上石面", description: "先聽清楚地底的震動從哪裡來。", effects: [{ op: "set", path: "stance", value: "measured" }, { op: "set", path: "stats.insight", value: 1 }], journal: "你先聽地底的震動。" },
      { id: "compassionate", title: "接過弗蕾亞手裡的藥箱", description: "先讓最需要幫助的人離開危險。", effects: [{ op: "set", path: "stance", value: "compassionate" }, { op: "set", path: "evac", value: 1 }, { op: "inc", path: "trust.freya", value: 1, max: 3 }], journal: "你先接手撤離與照護。" },
      { id: "curious", title: "走到法芙娜身旁", description: "先回應那道不該存在的聲音。", effects: [{ op: "set", path: "stance", value: "curious" }, { op: "set", path: "stats.resonance", value: 1 }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }], journal: "你靠近裂隙，試著辨認回響。" }
    ],
    stanceBeats: {
      measured: { narration: "你屈膝貼近石面。冰冷的界碑傳來一下、兩下，第三下卻遲遲沒有到來。", speaker: "英格瓦", line: "好。先弄清楚它什麼時候會再震。" },
      compassionate: { narration: "你接過藥箱，弗蕾亞肩頭的重量終於卸下一點。村道盡頭傳來孩子的哭聲。", speaker: "弗蕾亞", line: "謝謝。等把他們送到高處，我們再回來找其他人。" },
      curious: { narration: "你走近裂隙，耳邊的風聲忽然沉了下去。那道回響像是在等你先開口。", speaker: "法芙娜", line: "別急著回答。先聽它把話說完。" }
    }
  },
  actions: {
    survey: { title: "查勘界碑", body: "沿裂縫追查震動，辨認裂隙獸的動向。", tag: "洞察機會", effects: [{ op: "inc", path: "stats.insight", value: 1, max: 3 }, { op: "set", path: "clue", value: true }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }], journal: "你查出裂隙獸的突進方向，也聽見了裂隙深處的回聲。", scene: [{ text: "石粉從界碑刻痕間落下。你把耳朵貼近冰冷的岩面，低鳴裡果然藏著另一種節奏。" }, { speaker: "法芙娜", text: "聽見了吧？那不是牠在吼叫。是有什麼東西被困在更深處。" }] },
    evacuate: { title: "協助撤離", body: "陪居民走上高地，打開離村的路。", tag: "撤離進度 +2", effects: [{ op: "inc", path: "evac", value: 2, max: 4 }, { op: "inc", path: "trust.freya", value: 1, max: 3 }], journal: "你和弗蕾亞送走一批居民，仍有家人留在村裡等待彼此。", scene: [{ text: "山路窄得只能兩人並行。弗蕾亞一手扶著受傷的老人，一手把孩子往前推；她自己始終走在隊伍最後。" }, { speaker: "弗蕾亞", text: "先把他們送到高處。等我回頭時，別讓我看見你們還站在原地。" }] },
    train: { title: "練習調律", body: "以自己的呼吸，穩住界碑外溢的星幽回響。", tag: "共鳴提升", effects: [{ op: "inc", path: "stats.resonance", value: 1, max: 3 }, { op: "set", path: "trained", value: true }], journal: "你掌握了短暫收束逸散元素的方法。", scene: [{ text: "你把掌心按在界碑上，跟著震動調整呼吸。每次低鳴都像要把你的心跳扯散；直到某一刻，兩種節奏短暫重合。" }, { speaker: "英格瓦", text: "記住剛才那口氣。等石頭開始崩的時候，你不會有時間再想一遍。" }] },
    ingvar: { title: "與英格瓦守線", body: "沿撤離通道巡查可能的突破點。", tag: "堅忍提升｜英格瓦信任", effects: [{ op: "inc", path: "stats.grit", value: 1, max: 3 }, { op: "inc", path: "trust.ingvar", value: 1, max: 3 }], journal: "英格瓦帶你熟悉每一個可能失守的位置。", scene: [{ text: "英格瓦用巨龍之肋敲了敲石牆，沿著裂縫聽回音。他走得很慢，每隔幾步就停下來確認身後的撤離路線。" }, { speaker: "英格瓦", text: "守線不是站著不退。要知道什麼時候讓人先走，什麼時候才輪到自己。" }] },
    freya: { title: "協助安置傷者", body: "整理藥品，照顧還來不及離開的人。", tag: "撤離進度 +1｜弗蕾亞信任", effects: [{ op: "inc", path: "evac", value: 1, max: 4 }, { op: "inc", path: "trust.freya", value: 1, max: 3 }], journal: "你和弗蕾亞安置傷者，祈禱所暫時成了避難處。", scene: [{ text: "石砌祈禱所裡沒有足夠的床。你們把門板架在木箱上，讓傷者躺得離地遠一些；外頭的低鳴一陣比一陣近。" }, { speaker: "弗蕾亞", text: "有人走不了，就先陪他們坐一會兒。不是每個人都能被我們背上山。" }] },
    fafnira: { title: "追問裂隙回響", body: "和法芙娜一起分辨那道聲音的來處。", tag: "線索｜法芙娜信任", effects: [{ op: "set", path: "clue", value: true }, { op: "inc", path: "stats.insight", value: 1, max: 3 }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }], journal: "法芙娜確認回響不像裂隙獸的嘶聲。", scene: [{ text: "法芙娜閉上眼，把手懸在裂縫上方。風把她的衣角吹向身後，灰燼卻朝裂隙裡飄去。" }, { speaker: "法芙娜", text: "它不是在叫我們靠近。它只是還沒忘記怎麼呼喚。" }] }
  },
  battle: {
    introTitle: "碎石崩落，裂隙獸衝向村口。",
    intro: [
      { text: "牠的前爪在石地上刨出火星，沒有停下來攻擊你們，反而像是在逃離身後更深的黑暗。", unless: { path: "clue", equals: true } },
      { text: "你認出牠的突進方向正對著撤離通道；牠身上的黑色脈絡卻與地底回響同頻。", when: { path: "clue", equals: true } },
      { text: "已有 {{evac}} 組居民抵達高地。暮色裡還有人影困在村道上。" },
      { speaker: "法芙娜", text: "牠不是朝我們來的。看牠的眼睛——牠在找出口。", when: { path: "clue", equals: true } },
      { speaker: "弗蕾亞", text: "路上的人還沒走完。先把牠從通道引開！", when: { path: "clue", equals: false, any: [{ path: "evac", gt: 0 }] } },
      { speaker: "英格瓦", text: "全員靠攏！別讓牠衝進村子。", when: { path: "clue", equals: false, all: [{ path: "evac", equals: 0 }] } },
      "三次交鋒的時間，決定你們能救下多少人、穩住多少界碑。"
    ],
    roundTitles: ["裂隙獸再次撲來。", "界碑發出刺耳的碎裂聲。", "最後一次衝擊逼近。"],
    roundEndLines: ["隊伍等你指出下一個目標。", "煙塵遮住了半條村道。你只有片刻能重新部署。", "再拖下去，界碑和撤離隊伍都會失去屏障。"],
    finishJournal: { pressured: "隊伍頂住最後一波衝擊，所有人都帶著傷和灰塵站起來。", held: "裂隙獸被逼退，村道終於安靜了一瞬。" },
    finishEffects: [{ op: "inc", path: "stats.grit", value: 1, max: 3, when: { path: "battle.pressure", gt: 0 } }],
    actions: {
      guard: { title: "守住撤離通道", body: "英格瓦頂住正面衝撞，讓更多居民趁隙通過。", effects: [{ op: "inc", path: "battle.rescue", value: 1, max: 5 }, { op: "inc", path: "battle.rescue", value: 1, max: 5, when: { any: [{ path: "stats.grit", gte: 2 }, { path: "trust.ingvar", gte: 1 }] } }, { op: "inc", path: "battle.rescue", value: 1, max: 5, when: { path: "evac", gte: 3 } }, { op: "inc", path: "battle.guarded", value: 2 }], narration: "英格瓦把盾面重重抵上路口。裂隙獸撞得他單膝跪地，但孩子們從他身後一個接一個跑過。", speaker: "英格瓦", line: "別回頭！往坡上跑！", journal: "你守住撤離通道，{{rescuedNow}} 組居民趁隙抵達高地。" },
      stabilize: { title: "把力量送入界碑", body: "承受震盪，修補裂痕；洞察或共鳴能讓調律更穩。", effects: [{ op: "inc", path: "battle.stable", value: 1, max: 4 }, { op: "inc", path: "battle.stable", value: 1, max: 4, when: { any: [{ path: "stats.insight", gte: 2 }, { path: "stats.resonance", gte: 2 }] } }, { op: "inc", path: "battle.threat", value: -1, min: 0 }], narration: "你把手按上界碑。裂縫裡滲出的光順著手臂竄動，耳邊所有聲音都被拉成細線。", narrationTrained: "你依循先前練習過的呼吸，讓散亂的力量一寸寸合攏。", narrationUntrained: "你咬緊牙關，逼自己跟上忽快忽慢的脈動。", speakerTrust: "法芙娜", speakerDefault: "弗蕾亞", lineTrust: "抓住那個節奏！別讓它把你帶走。", lineDefault: "我在這裡。聽我的聲音，慢慢來。", journal: "你將力量導入界碑，穩定度增加 {{stableNow}}。" },
      strike: { title: "引開並牽制裂隙獸", body: "把牠從村道逼開，為同伴爭取行動空間。", effects: [{ op: "inc", path: "battle.threat", value: -2, min: 0 }, { op: "inc", path: "battle.threat", value: -1, min: 0, when: { any: [{ path: "stats.resonance", gte: 2 }, { path: "trust.fafnira", gte: 1 }] } }, { op: "inc", path: "battle.guarded", value: 1 }], narration: "你故意暴露破綻，把裂隙獸從村道引向界碑外的碎石坡。牠的爪子擦過你的肩頭；同伴的攻勢迫使牠偏離方向。", speakerTrust: "法芙娜", speakerDefault: "弗蕾亞", lineTrust: "牠又在看那道裂口——牠想回去！", lineDefault: "牠離村子遠了。趁現在把人帶走！", journal: "你與同伴牽制裂隙獸，威脅降低 {{threatReduced}}。" }
    },
    aftermath: [
      "{{lastBattleNarration}}",
      "{{rescued}} 組居民已抵達高地。{{stabilityDescription}}",
      { text: "裂隙深處的回聲再次響起。這次，連英格瓦也聽見了。", when: { path: "clue", equals: true } },
      { text: "裂隙深處傳來一聲低鳴。你仍不知道那是威脅，還是求援。", unless: { path: "clue", equals: true } },
      { speaker: "弗蕾亞", text: "大部分人已經上山。可是界碑撐不了太久，我們得現在決定。", when: { path: "rescued", gte: 3 } },
      { speaker: "弗蕾亞", text: "還有人沒到高地。拜託，至少別讓這次撤離變成徒勞。", when: { path: "rescued", lt: 3 } },
      { speaker: "法芙娜", text: "封住它，我們就聽不見了。可那不代表裡面的東西會消失。", when: { path: "clue", equals: true } },
      { speaker: "英格瓦", text: "我可以再守一陣。告訴我，這次要守住什麼。", unless: { path: "clue", equals: true } }
    ],
    choices: [
      { id: "seal", title: "把最後的力量送進界碑", description: "關上裂口，讓村子先得到喘息；回聲也會被封在另一側。" },
      { id: "evacuate", title: "帶剩下的人上山，再回來修補界碑", description: "不讓任何人被留在村裡，但防線將多承受一段時間。" },
      { id: "answer", title: "沿著回聲，把共鳴送進裂隙", description: "試著理解裡面的存在；你無法預知它會如何回應。" }
    ]
  },
  endings: {
    seal: {
      title: "石門之後", effects: [{ op: "set", path: "chapterChoice", value: "seal" }, { op: "inc", path: "trust.ingvar", value: 1, max: 3 }],
      scene: "你與英格瓦把剩餘力量送進界碑。石紋一層層合攏，裂隙的光被壓成細線。{{rescued}} 組居民已抵達高地；{{sealResult}}",
      reactions: [
        { when: { path: "trust.ingvar", gt: 1 }, speaker: "英格瓦", text: "我會守住這裡。你去查清楚封印下面還剩下什麼。" },
        { speaker: "法芙娜", text: "它安靜了。但我不覺得它離開了。" }
      ],
      summary: "封鎖暫時穩住界碑，{{rescued}} 組居民抵達高地。裂隙回聲被隔絕，封印底下仍留有未解的動靜。",
      hook: "留下的線索：封印之下仍有東西在活動。英格瓦主張加派守軍，法芙娜要求追查被隔絕的回響。"
    },
    evacuate: {
      title: "人群走過山脊", effects: [{ op: "set", path: "chapterChoice", value: "evacuate" }, { op: "inc", path: "trust.freya", value: 1, max: 3 }, { op: "set", path: "evac", value: "{{rescued}}" }],
      scene: "你把最後幾個人送上山脊。{{rescued}} 組居民離開低地；你回頭時，界碑的光在煙塵裡忽明忽滅。{{evacResult}}",
      reactions: [{ speaker: "弗蕾亞", text: "他們都在這裡了。等天亮，我們再一起回去。" }],
      summary: "所有撤離進度都轉化成了抵達高地的人數。界碑仍需要處理，但倖存者此刻聚在一起。",
      hook: "留下的線索：安全地帶收容了大量倖存者，糧食與醫療資源開始吃緊。"
    },
    answer: {
      titleSuccess: "回聲有了名字", titleFailure: "沒有答案的回聲", effects: [{ op: "set", path: "chapterChoice", value: "answer" }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "set", path: "echoUnderstood", value: true, when: { all: [{ path: "clue", equals: true }], any: [{ path: "stats.insight", gte: 1 }, { path: "trust.fafnira", gte: 2 }] } }],
      sceneSuccess: "你沒有封住裂隙，而是把共鳴送進回聲傳來的方向。紊亂的光流停了一瞬；那些翻湧的影子終於有了輪廓。{{rescued}} 組居民已抵達高地，界碑{{answerStability}}。",
      sceneFailure: "你把共鳴送進裂隙。回聲忽然變得清晰，接著一股陌生力量沿著你的手臂反向湧來。{{rescued}} 組居民已撤離，界碑{{answerStability}}。",
      reactionSuccess: { speaker: "法芙娜", text: "它記得其他界碑。也記得我們還沒有放棄這個世界。" },
      reactionFailure: { speaker: "英格瓦", text: "夠了，先把手收回來。下一次再聽它說話之前，我們得知道那股力量會拿走什麼。" },
      summarySuccess: "調律讓你理解回聲來自被混沌纏住的古老能量殘響，並聽見它提到其他界碑。",
      summaryFailure: "你沒有辨認出回聲的來處；陌生力量留下的調律負荷仍在體內迴盪。",
      hookSuccess: "留下的線索：那道殘響提到其他界碑也正在呼喚。",
      hookFailure: "留下的代價：調律負荷增加，必須在下一章尋找穩定共鳴的方法。"
    }
  },
  chapterTwo: {
    seal: {
      title: "第二章｜封印線上的清晨",
      paragraphs: ["天亮時，界碑外圍已拉起第二道防線。封印把回聲留在石壁另一側，夜裡卻有三次敲擊從地下傳來。你們循著刻紋指向東北方，抵達一座廢棄觀星台。", { speaker: "英格瓦", text: "我答應守住這裡。現在得知道我們守的是一道門，還是一座墳。" }, "觀星台中央立著另一座界碑。它沒有裂開，碑面卻映出一條不屬於天空的星河。"],
      choices: [
        { id: "inspect_seal", title: "沿封印刻紋追查敲擊", description: "請法芙娜辨認回聲，尋找封印內部的異常。", effects: [{ op: "set", path: "nextGoal", value: "調查封印內側" }], outcome: "法芙娜在第三道刻紋下找到微弱的逆向脈動。封印沒有破，但裡面的東西正在回應別處。" },
        { id: "reinforce_line", title: "先替防線補上缺口", description: "讓英格瓦帶人加固村口，避免再有居民受困。", effects: [{ op: "set", path: "nextGoal", value: "加固界碑防線" }], outcome: "英格瓦把巡守隊重新排成兩道。防線暫時穩住，你也注意到每次震動都指向東北方。" }
      ]
    },
    evacuate: {
      title: "第二章｜高地上的第一夜",
      paragraphs: ["高地很快擠滿臨時帳棚。孩子們睡在裝糧食的麻袋旁，傷者的咳嗽聲一整夜沒有停。界碑村的方向仍映著暗紅色的光。你們沿山脊東行，想找一處能讓倖存者安頓的地方。", { speaker: "弗蕾亞", text: "人都到了，可他們沒有辦法一直靠意志撐下去。得先找到水和藥。" }, "山路盡頭，一座廢棄觀星台從雲海中露出輪廓。它中央的界碑亮著微弱的星光。"],
      choices: [
        { id: "organize_camp", title: "先整理收容點與傷者名冊", description: "讓弗蕾亞分配照護，找出最急迫的需求。", effects: [{ op: "set", path: "nextGoal", value: "建立臨時收容點" }], outcome: "弗蕾亞把照護工作分給幾個自願留下的人。名冊裡還有三個名字旁邊沒有家人簽認。" },
        { id: "scout_supplies", title: "帶隊尋找水源與藥材", description: "趁白天尚未結束，確認附近能否支撐避難者。", effects: [{ op: "set", path: "nextGoal", value: "尋找水源與藥材" }], outcome: "你們找到一處尚未受污染的泉眼，也在石縫裡看見沿山向東延伸的星幽痕跡。" }
      ]
    },
    echo_known: {
      title: "第二章｜沿著回聲北行",
      paragraphs: ["法芙娜把昨夜聽見的片語記在薄石片上。天亮後，字痕仍泛著微光，箭頭般指向北方的下一座界碑。你們沿著回聲翻過山脊，抵達一座廢棄觀星台。", { speaker: "法芙娜", text: "它不是在求我們救它。它是在提醒我們，別的地方也快撐不住了。" }, "界碑周圍沒有守軍，只有一圈被人匆忙拖動過的石盤。回聲在這裡變得斷續。"],
      choices: [
        { id: "follow_echo", title: "立刻沿回聲前往北方界碑", description: "趁線索還清晰時追上那道訊息。", effects: [{ op: "set", path: "nextGoal", value: "追蹤北方界碑回響" }], outcome: "你們帶上必要補給出發。回聲每隔一段路便響一次，像在替你們指路。" },
        { id: "record_echo", title: "先把訊息交給守護者記錄", description: "留下證據，避免只有你們能理解這段回聲。", effects: [{ op: "set", path: "nextGoal", value: "保存並驗證回聲線索" }], outcome: "守護者答應保存石片，但也要求派人同行查證。你們獲得支援，出發時間因此延後。" }
      ]
    },
    echo_unknown: {
      title: "第二章｜調律的餘震",
      paragraphs: ["你醒來時，手臂還殘留著細碎的星光。昨夜的回聲已經聽不清，只剩每次心跳後短暫的刺痛。你們循著裂隙留下的星幽痕跡，找到一座廢棄觀星台。", { speaker: "英格瓦", text: "先別碰界碑。我要找到能替你分擔那股力量的辦法。" }, "觀星台中央的界碑與你的脈搏同時亮起。每一次閃爍，都讓手臂深處的刺痛更清晰。"],
      choices: [
        { id: "seek_anchor", title: "尋找能穩住共鳴的媒介", description: "從附近遺跡找出可暫時承載星幽力量的物件。", effects: [{ op: "set", path: "nextGoal", value: "尋找調律錨點" }], outcome: "法芙娜在舊觀測站找到一枚黯淡的星核。它或許能分擔負荷，但已經有裂痕。" },
        { id: "ask_guardians", title: "向原初守護請求協助", description: "讓守護者檢查你的狀態，再決定何時重返裂隙。", effects: [{ op: "set", path: "nextGoal", value: "接受守護者檢查" }], outcome: "守護者替你封住最急迫的反噬，代價是要求你暫時接受同行監督。" }
      ]
    },
    investigation: {
      seal: {
        title: "石盤背面的刻痕",
        paragraphs: ["你們先把界碑外圍清出一條窄路。石盤背面的刻痕被灰燼填滿，最深處有一道新近留下的銅色刮痕。英格瓦守在階梯口，讓巡守輪流休息。"],
        choices: [
          { id: "marks", title: "清理刻痕，比對封印紋路", description: "確認兩座界碑是否受到同一種力量干涉。", effects: [{ op: "set", path: "chapterTwoInvestigation", value: "marks" }, { op: "inc", path: "stats.insight", value: 1, max: 3 }], outcome: "兩道刻紋方向相反，卻都在第三筆突然中斷。有人沒有破壞界碑，而是把它收到的訊號倒轉了。" },
          { id: "watchline", title: "和英格瓦巡查防線與退路", description: "找出星盤再度逆轉時，巡守能安全撤退的位置。", effects: [{ op: "set", path: "chapterTwoInvestigation", value: "watchline" }, { op: "inc", path: "stats.grit", value: 1, max: 3 }, { op: "inc", path: "trust.ingvar", value: 1, max: 3 }], outcome: "英格瓦找到三條能避開落石的退路，也發現每條路的石面都朝同一個方向磨損：山道上的燈火正在被引向觀星台。" }
        ]
      },
      evacuate: {
        title: "名冊上缺少的名字",
        paragraphs: ["觀星台暫時成了收容點。弗蕾亞把藥品分成急用和備用兩份，巡守則把濕透的名冊攤在銅環旁晾乾。幾個名字被水泡開，只剩墨痕。"],
        choices: [
          { id: "supplies", title: "先清點飲水、藥品與床位", description: "讓下一批抵達的人有地方休息，也找出最短缺的物資。", effects: [{ op: "set", path: "chapterTwoInvestigation", value: "supplies" }, { op: "inc", path: "trust.freya", value: 1, max: 3 }], outcome: "藥品只夠再照顧一夜。弗蕾亞從名冊背面找出一條舊運水道，可以避開已經中斷的東側山路。" },
          { id: "missing_lights", title: "逐一詢問山路上的求援燈火", description: "找出還沒抵達的人，避免名冊上的空白變成失聯。", effects: [{ op: "set", path: "chapterTwoInvestigation", value: "missing_lights" }, { op: "inc", path: "stats.insight", value: 1, max: 3 }], outcome: "燈火不是沿山路排成一列，而是繞著觀星台畫出半個圓。有人在另一側等著接走抵達的人。" }
        ]
      },
      echo_known: {
        title: "回聲留下的空格",
        paragraphs: ["法芙娜把薄石片放到星盤中央。片上的字痕和界碑刻紋彼此牽引，唯獨中間留著一塊沒有任何回聲能填上的空白。"],
        choices: [
          { id: "compare_slate", title: "把石片與刻紋逐字比對", description: "確認「尚未校正」指的是界碑方向，還是回聲本身。", effects: [{ op: "set", path: "chapterTwoInvestigation", value: "compare_slate" }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }], outcome: "你們辨認出被刪去的不是地名，而是一個發送者的稱呼。留下訊息的存在不希望被界碑記錄。" },
          { id: "read_disc", title: "轉動星盤，讓石片追上回聲", description: "冒險重現訊號傳遞的方向，可能讓星盤再次失控。", effects: [{ op: "set", path: "chapterTwoInvestigation", value: "read_disc" }, { op: "inc", path: "stats.insight", value: 1, max: 3 }], outcome: "石片上的字跡短暫拼成一個方向，隨即被新的星光覆蓋。你看見訊號穿過三座界碑後，折向地圖之外。" }
        ]
      },
      echo_unknown: {
        title: "手臂裡的第二個節奏",
        paragraphs: ["你把手臂包在披風裡，刺痛仍跟著星盤的節奏一下一下傳來。法芙娜沒有催你靠近，只把一枚黯淡星核放在兩人中間。"],
        choices: [
          { id: "inspect_core", title: "讓星核短暫承接餘震", description: "測試它是否能分擔回聲，代價是星核可能裂開。", effects: [{ op: "set", path: "chapterTwoInvestigation", value: "inspect_core" }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }], outcome: "星核接住一部分刺痛，表面也多出一道細縫。你聽見三種不同節奏，正從星盤的三個方向同時逼近。" },
          { id: "ask_ingvar", title: "請英格瓦帶你離開界碑一段距離", description: "先確認共鳴是否會跟著你移動，避免把身體當成測試媒介。", effects: [{ op: "set", path: "chapterTwoInvestigation", value: "ask_ingvar" }, { op: "inc", path: "trust.ingvar", value: 1, max: 3 }], outcome: "你離開石盤十步後，手臂上的星光仍朝著觀星台亮起。英格瓦確認異常跟著界碑走，不是追著你而來。" }
        ]
      }
    },
    crisis: {
      title: "星盤逆轉，界碑失去北方",
      paragraphs: [
        "你們剛完成第一項安排，觀星台地底忽然傳來一聲沉重的轉動。環繞界碑的銅環自行逆轉，原本指向北方的星圖全數偏移。石盤彼此摩擦，磨出的粉末像一場很慢的雪落在階梯上。",
        { speaker: "法芙娜", text: "方向被改寫了。這不是星象——有人把界碑收到的回響折回了它自己。" },
        "碑面浮現一道細長裂痕。每當銅環轉過裂痕，山下雲海便亮起一點燈火；那些燈正沿著陡峭山道往上移動。",
        { text: "封印上的三道刻紋也在石盤背面留下相同排列。敲擊不是從封印裡傳來，而是沿著界碑網絡被送到這裡。", when: { path: "chapterChoice", equals: "seal" } },
        { text: "你認出燈火間隔和村民撤離時的隊伍相近。山路上有人掉隊，若等界碑完全穩定才下去接應，他們可能趕不上下一次震動。", when: { path: "chapterChoice", equals: "evacuate" } },
        { text: "薄石片上的字痕在星盤下方重新亮起，最後一個片語不是方向，而是『尚未校正』。", when: { all: [{ path: "chapterChoice", equals: "answer" }, { path: "echoUnderstood", equals: true }] } },
        { text: "你手臂上的星光忽然和裂痕同時閃爍。那股昨夜未能辨認的力量，正借你的脈搏尋找回去的路。", when: { all: [{ path: "chapterChoice", equals: "answer" }, { path: "echoUnderstood", equals: false }] } },
        "裂痕沿著界碑向下延伸。你們必須在燈火抵達前，決定先把力量用在哪裡。"
      ],
      choices: [
        { id: "steady", title: "用調律穩住界碑", description: "先壓下逆轉的星盤，避免裂痕繼續擴大。", effects: [{ op: "set", path: "nextGoal", value: "追查校正界碑的訊號" }, { op: "set", path: "chapterTwoOutcome", value: "steady" }], outcome: "你讓星盤停在兩次脈動之間。裂痕沒有消失，但觀星台重新辨認出北方。" },
        { id: "rescue", title: "先接應山路上的人", description: "離開界碑一段時間，帶迷途的巡守與倖存者上來。", effects: [{ op: "set", path: "nextGoal", value: "護送山路上的倖存者" }, { op: "set", path: "chapterTwoOutcome", value: "rescue" }], outcome: "你們沿山路找到三名巡守和一隊迷失的居民。所有人都抵達觀星台時，界碑又多了一道裂紋。" },
        { id: "answer", title: "沿逆向脈動回應界碑", description: "把回聲送回源頭，查明是誰改寫了星圖。", effects: [{ op: "set", path: "nextGoal", value: "追查改寫星圖的回聲" }, { op: "set", path: "chapterTwoOutcome", value: "answer" }], outcome: "你把脈動送回裂痕深處。片刻之後，一串陌生座標浮現在星盤上；你的調律負荷也隨之加深。" }
      ]
    },
    finales: {
      steady: {
        title: "被校正的星盤",
        paragraphs: [
          "你把呼吸壓進界碑每一次短促的震動裡。第一道銅環停住時，石面裂光沿著刻紋退回；第二道環仍在逆轉，像有一隻看不見的手不肯鬆開。",
          { speaker: "英格瓦", text: "我來壓住外環。你只管找出它要指向哪裡。", when: { path: "trust.ingvar", gte: 1 } },
          { speaker: "英格瓦", text: "別硬扛。我守住石盤，你看清它的方向。", unless: { path: "trust.ingvar", gte: 1 } },
          "銅環終於停在北方。裂痕沒有癒合，卻映出一串按固定間隔亮起的遠方星點。它們不像求救訊號，更像一份正在被逐一核對的名單。",
          { speaker: "法芙娜", text: "每一個亮點都是一座界碑。有人知道它們在哪裡，也知道該怎麼讓它們失去方向。" }
        ],
        summary: "界碑暫時穩定，觀星台重新指向北方。裂痕另一端留下規律回應，像是有人在遠處逐一校正界碑。",
        hook: "下一步：穩定北方界碑，查明回應來自誰。"
      },
      rescue: {
        title: "雲海上方的燈火",
        paragraphs: [
          "你轉身離開界碑，英格瓦替你們守住通往山道的石階。燈火在雲霧裡忽隱忽現；每接近一盞，就多聽見一個人呼喚同伴的名字。",
          { text: "你們帶著先前的撤離名冊。山路上的居民聽見家人的名字，終於肯把水和毯子交給弗蕾亞。", when: { path: "chapterChoice", equals: "evacuate" } },
          "弗蕾亞沒有先問誰還能走。她把藥箱放在石階上，逐一摸過每個人的手腕，確認誰需要先停下來。",
          { speaker: "弗蕾亞", text: "把名字告訴我。每個人都要有地方休息，也要有人知道他們到了。" },
          "最後一名巡守抵達時，觀星台的界碑又裂開一寸。他說東側山道已被落石截斷，而山下還有一道光沒有跟上來。"
        ],
        summary: "巡守與迷途居民獲救，但界碑裂痕擴大。弗蕾亞帶隊安置傷者；東側山道中斷，山下仍有一道燈火沒有抵達。",
        hook: "下一步：護送倖存者前往安全地帶，再尋找東側通路。"
      },
      answer: {
        title: "座標之外",
        paragraphs: [
          "你把掌心貼上裂痕，沒有追著星盤的方向走，而是沿著那股逆流把共鳴送回去。銅環立刻加速，觀星台上空浮現一片不屬於這片天空的暗色星域。",
          { speaker: "法芙娜", text: "停在這裡。它正在回應你，但回應裡還有別人的聲音。", when: { path: "echoUnderstood", equals: true } },
          { speaker: "英格瓦", text: "到此為止。你已經聽見足夠多了，先把手收回來。", when: { path: "echoUnderstood", equals: false } },
          "一串座標在星盤上逐點亮起，最後一點卻落在星圖之外。那裡沒有登錄過界碑，只有幾道彼此交錯的回聲。",
          { text: "你聽懂其中一段：有人正沿著界碑逐座改寫方向。", when: { path: "echoUnderstood", equals: true } },
          { text: "你沒能分辨那些聲音。陌生力量退去後，手臂仍像被冰冷的細線纏住。", when: { path: "echoUnderstood", equals: false } }
        ],
        summary: "星盤留下陌生座標，指向一處未記載的界碑。回應也讓調律者的負荷加深；那個方向傳來的並非單一聲音。",
        hook: "下一步：追查改寫星圖的回聲，並設法分擔調律負荷。"
      }
    },
    aftermathChoices: {
      steady: [
        { id: "record_grid", title: "留下校正記錄，再帶隊啟程", description: "複製星盤的刻度，讓守護者也能辨認下一處異常。", effects: [{ op: "set", path: "chapterTwoResolution", value: "record" }, { op: "set", path: "nextGoal", value: "交付觀星記錄並追查訊號" }] },
        { id: "follow_signal", title: "趁訊號未散，立刻追蹤北方星點", description: "放棄完整記錄，趕在界碑再次偏轉前出發。", effects: [{ op: "set", path: "chapterTwoResolution", value: "pursue" }, { op: "set", path: "nextGoal", value: "追蹤下一座失去方向的界碑" }] }
      ],
      rescue: [
        { id: "escort_people", title: "隨弗蕾亞護送傷者下山", description: "多花時間確保獲救的人能抵達安全地帶。", effects: [{ op: "set", path: "chapterTwoResolution", value: "escort" }, { op: "set", path: "nextGoal", value: "把傷者送往安全地帶" }] },
        { id: "chase_lights", title: "讓英格瓦守台，你和法芙娜追上最後的燈火", description: "把觀星台交給巡守，趁山道尚未完全中斷前回頭。", effects: [{ op: "set", path: "chapterTwoResolution", value: "chase" }, { op: "set", path: "nextGoal", value: "追上尚未抵達的山路燈火" }] }
      ],
      answer: [
        { id: "find_anchor", title: "先找能分擔負荷的調律錨點", description: "避免帶著不穩定的力量追進未知座標。", effects: [{ op: "set", path: "chapterTwoResolution", value: "anchor" }, { op: "set", path: "nextGoal", value: "尋找能分擔回聲的錨點" }] },
        { id: "follow_coordinates", title: "沿陌生座標立即出發", description: "趁星盤還留著座標，追上回聲指向的地方。", effects: [{ op: "set", path: "chapterTwoResolution", value: "coordinates" }, { op: "set", path: "nextGoal", value: "追查星圖之外的座標" }] }
      ]
    },
    chapterThree: {
      steady: {
        title: "第三章入口｜霜環峽的無星夜",
        paragraphs: [
          "離開觀星台後，山脊上的星光逐一熄滅。你們照著最後留下的方位走了一整日，直到夜色降下，頭頂竟看不見任何星辰。",
          { text: "觀星記錄交給守護者後，巡守回報霜環峽的界碑也在偏轉；他們能派一支小隊跟上，但最快要到明早。", when: { path: "chapterTwoResolution", equals: "record" } },
          { text: "你們沒有等待支援。北方星點每隔一刻便少一顆，像有人沿途吹熄路標。", when: { path: "chapterTwoResolution", equals: "pursue" } },
          { speaker: "英格瓦", text: "前面是霜環峽。過了那道關口，任何撤退都得沿原路回來。" },
          "峽口的烽火台沒有點火，值守的旗子卻被整齊地折起，掛在石門內側。雪地上沒有腳印，只有一道道朝關內延伸的圓形凹痕。",
          "側路傳來一聲短促的哨響。阿斯特麗德沿岩壁滑下，披風結著薄霜。她和格里姆原本受命守住另一段撤離通道；通道被落石切斷後，兩人改走高地追蹤異常風向，直到此刻才與你們會合。",
          { speaker: "阿斯特麗德・龍怒", text: "風在門縫裡打轉，外面每少一個人影，它就轉得更急。我先看過了——這裡沒有安全的正面路線。" }
        ],
        choices: [
          { id: "trace_watchtower", title: "採用阿斯特麗德的風向，登上烽火台", description: "沿她標出的側風路線取得高處視野，查明界碑偏轉方向。", nextGoal: "查明霜環峽界碑的偏轉方向", outcome: "烽火台的銅鏡映出山腹裡另一道光。它不是界碑的反射，而像有人在峽谷深處點亮了第二片星圖。" },
          { id: "find_watch", title: "沿凹痕尋找失蹤的守關者", description: "暫不追風向，先確認旗子為何被收起，避免隊伍踏進無人看守的陷阱。", nextGoal: "尋找霜環峽失蹤的守關者", outcome: "凹痕在關內分成三列，最後都停在一扇由內側封死的石門前。門後有人敲了三下。" }
        ]
      },
      rescue: {
        title: "第三章入口｜斷橋另一端",
        paragraphs: [
          "弗蕾亞替最後一名傷者包好手掌時，山脊另一側傳來木梁折斷的聲音。通往安全地帶的舊橋被夜裡的落石截成兩段，另一端還亮著幾盞沒有移動的燈。",
          { text: "留下的撤離名冊讓收容點先備好床位，但接應的人還沒到。傷者需要休息，你們也不能讓那幾盞燈在原地等一整夜。", when: { path: "chapterTwoResolution", equals: "escort" } },
          { text: "英格瓦和巡守留在觀星台看守界碑。你們帶著繩索回到山道，追上最後那批沒有抵達的居民。", when: { path: "chapterTwoResolution", equals: "chase" } },
          { speaker: "弗蕾亞", text: "橋可以再修，人不能先被當成已經安全。讓我知道你打算怎麼帶他們過去。" },
          "橋下的冰河被星幽光照得像一面碎鏡。對岸有孩子揮動布條，身後的山壁正一寸寸往下剝落。",
          "阿斯特麗德從高處落到你們身旁。她和格里姆原本守著另一段撤離通道，直到落石封死路線，才沿著異常的風聲追上來。",
          { speaker: "阿斯特麗德・龍怒", text: "冰河上方有一股穩定的逆風，可以帶人繞過斷橋。但橋若能修起來，留下的人也能跟上。" }
        ],
        choices: [
          { id: "cross_ice", title: "依阿斯特麗德判讀的逆風，沿冰河繞行", description: "路程較長，但風會替你們穩住繩索，避開搖搖欲墜的橋面。", nextGoal: "帶倖存者沿冰河舊道撤離", outcome: "你們把繩索固定在兩側岩柱，分批引導人群踏上冰面。最後一個孩子越過河岸時，舊橋整段墜入雲霧。" },
          { id: "repair_bridge", title: "留下修橋，讓兩側隊伍能往返", description: "需要更多時間和人手，卻能保住這條山路。", nextGoal: "修復霜環峽舊橋", outcome: "英格瓦用盾架住斷裂的梁木，巡守將繩索拉成臨時扶手。橋面只恢復一半，但兩側的人終於能互相看見。" }
        ]
      },
      answer: {
        title: "第三章入口｜盲星谷的座標",
        paragraphs: [
          "星盤上的座標在離開觀星台後仍黏在你的視野裡。白天它指向山脈之外，入夜卻落在一座地圖沒有標出的谷地。",
          { text: "你先前選擇尋找錨點。法芙娜在觀星台底層找到一枚舊星核，裂痕已經開始吸收你手臂上的星光。", when: { path: "chapterTwoResolution", equals: "anchor" } },
          { text: "你們選擇直接追蹤座標。一路上，回聲從三個不同方向同時傳來，沒有一個能被單獨辨認。", when: { path: "chapterTwoResolution", equals: "coordinates" } },
          { speaker: "法芙娜", text: "盲星谷沒有界碑記錄。若座標是真的，那裡可能是網絡之外；若它是陷阱，我們已經走進它的範圍。" },
          "谷口的霧向內流動，地上散落著被磨平的路牌。每塊石牌背面，都刻著一個被刮去的名字。",
          "阿斯特麗德沿谷口外側追來。她和格里姆原本守著另一段撤離通道，通道被落石切斷後，兩人沿異常風向一路追蹤至此。",
          { speaker: "阿斯特麗德・龍怒", text: "谷裡的風沒有出口。若要進去，就趁座標還清楚；若要等，也得先讓星核穩下來。" }
        ],
        choices: [
          { id: "enter_valley", title: "依阿斯特麗德標出的風口進入盲星谷", description: "趁座標還清楚，沿著她判讀的風向查明回聲來源。", nextGoal: "調查盲星谷的無名界碑", outcome: "霧在你們身後合攏。谷地深處傳來一聲鐘響，法芙娜認出那是界碑回應的節奏。" },
          { id: "stabilize_first", title: "先安置星核，穩住調律者狀態", description: "延後進谷，避免未知回聲借你的力量擴散。", nextGoal: "修復星核並穩定調律負荷", outcome: "星核暫時接住了手臂上的星光。霧中傳來的聲音隨之變遠，但被刮去的名字開始一個接一個亮起。" }
        ]
      }
    },
    chapterThreeStages: {
      trail: {
        title: "第三章｜霜環峽的回聲",
        clock: "峽口・夜深",
        paragraphs: [
          { text: "烽火台的銅鏡映出山腹裡另一片星圖。", when: { path: "chapterThreeChoice", equals: "trace_watchtower" } },
          { text: "三聲敲擊從石門後傳來。門閂由內側扣住，附近卻沒有任何守關者的腳印。", when: { path: "chapterThreeChoice", equals: "find_watch" } },
          { text: "你們沿冰河繞過斷橋時，霧裡的燈火一直沒有熄滅。抵達峽口後，最後一名孩子指著石門，說有人在裡面叫過他的名字。", when: { path: "chapterThreeChoice", equals: "cross_ice" } },
          { text: "橋梁只被暫時穩住，英格瓦與巡守仍留在兩岸維持繩索。當你們護送最後一批人通過後，橋面在身後崩落；收起的守關旗子在風裡翻動。", when: { path: "chapterThreeChoice", equals: "repair_bridge" } },
          { text: "霧在你們身後合攏，谷內的路牌卻逐一清晰。被刮去的名字下方，開始浮出新的筆畫。", when: { path: "chapterThreeChoice", equals: "enter_valley" } },
          { text: "星核暫時穩住了手臂裡的星光。你們沒有立刻踏進霧中，而是沿著那些重新亮起的名字，找到霜環峽通往盲星谷的舊關道。", when: { path: "chapterThreeChoice", equals: "stabilize_first" } },
          "石階後方爆出一聲金屬巨響。格里姆揮動熔岩逆鱗斬斷落下的石梁，火光在黑色鱗甲間迸開。他把巡守推到安全處，自己卻一步也沒退。",
          { speaker: "格里姆・破裂之鱗", text: "再慢一點，整座關口就要塌了。給我一個能衝的方向，我會替你們打開路。" },
          { speaker: "阿斯特麗德・龍怒", text: "你每次都把「能做到」當成「該去做」。" },
          "峽谷的風從石門縫隙裡吹出，帶著乾燥的灰燼味。法芙娜將手掌貼近門面，沒有碰到石頭，門後的敲擊卻立刻停了。",
          { speaker: "法芙娜", text: "它知道我們在這裡。接下來的每一步，都可能是它在等的回答。" }
        ],
        choices: [
          { id: "follow_ruts", title: "讓格里姆開路，沿凹痕追進關內", description: "借他的衝鋒追出隱藏路徑，但熔岩逆鱗可能令石門裂痕擴大。", outcome: "格里姆沿著凹痕突進。每一道磨痕都在石門前停下，像是有人曾反覆走到這裡，卻始終沒有進去；他的逆鱗也被震得發紅。" },
          { id: "protect_torch", title: "讓阿斯特麗德守望烽火台，先安排退路", description: "由她標記安全風道，讓傷者與巡守有退路，再接近石門。", outcome: "阿斯特麗德在烽火台下架起風向標，弗蕾亞帶傷者避入背風處。等眾人安頓好，門後傳來第四下敲擊，石縫透出微弱的暖光。" }
        ]
      },
      door: {
        title: "第三章｜門後的三次敲擊",
        clock: "古關・石門",
        paragraphs: [
          "門後的聲音再次響起，這次每一下都落在界碑回聲的間隔上。石門上沒有鎖孔，只有一圈磨得發亮的凹槽。",
          { text: "你們發現凹痕不是腳印，而是許多人的手掌在同一處反覆留下的磨痕。", when: { path: "chapterThreeRidgeChoice", equals: "follow_ruts" } },
          { text: "避難者的燈火安定下來後，石門縫裡的暖光也亮了一些。門後似乎聽見了外面的人聲。", when: { path: "chapterThreeRidgeChoice", equals: "protect_torch" } },
          { text: "格里姆手臂上的逆鱗仍泛著灼紅。他把刀尖垂向地面，卻還盯著石門，像在等下一次衝鋒的理由。", when: { path: "chapterThreeRidgeChoice", equals: "follow_ruts" } },
          { speaker: "阿斯特麗德・龍怒", text: "每一道風都在門前折返。這不是鎖，是一段沒有人接完的訊息。" },
          { text: "英格瓦試著推動石門，門面紋風不動。法芙娜卻聽出石門並非被封死；它正等候一段完整的節奏。" },
          { speaker: "格里姆・破裂之鱗", text: "給我一聲令下，我能把門撞開。" },
          { speaker: "英格瓦", text: "若門後有活人，我們不能讓它一直等。若那是陷阱，我會替你們擋住第一下。" }
        ],
        choices: [
          { id: "break_seal", title: "讓格里姆以熔岩逆鱗破開石門", description: "以力量開路，能立刻確認門後是否有人，但可能擴大石室裂縫。", outcome: "格里姆以熔岩逆鱗撞上石門。石屑沿著門框崩落，門扉終於向內移動；後方沒有守軍，只有一間刻滿名字的空室，而裂口仍在擴大。" },
          { id: "answer_knock", title: "依照回聲的節奏敲回去", description: "讓阿斯特麗德讀取風中的回音，再確認門後是否理解你們。", outcome: "你敲出三短一長的節奏。阿斯特麗德側耳辨認風中的停頓；門後沉默片刻，隨即以同樣的間隔回應，石門上的凹槽逐一亮起。" }
        ]
      },
      names: {
        title: "第三章｜被刮去的名字",
        clock: "盲星谷・無名界碑",
        paragraphs: [
          "石室盡頭立著一座沒有方位刻度的界碑。成百上千個名字被刻在碑面，又被人逐一刮除；最下方留著一行尚未完成的空白。",
          { text: "空室裡的名字從最舊的一列開始亮起，像是在回應你們沿凹痕找到這裡的路。", when: { path: "chapterThreeRidgeChoice", equals: "follow_ruts" } },
          { text: "門外的燈火隔著石壁連成一線。每當有人呼喚同伴，碑面就多亮起一個被刮去的名字。", when: { path: "chapterThreeRidgeChoice", equals: "protect_torch" } },
          { text: "推門留下的裂口仍在擴大；若不盡快穩住界碑，整座石室都會被霧吞沒。", when: { path: "chapterThreeDoorChoice", equals: "break_seal" } },
          { text: "你敲回去的節奏在碑面留下四道光痕。門後的存在已經回應，但它仍沒有說出自己的名字。", when: { path: "chapterThreeDoorChoice", equals: "answer_knock" } },
          { speaker: "阿斯特麗德・龍怒", text: "風把最後的回聲帶到這裡了。門外還有人等著被記住。" },
          { speaker: "法芙娜", text: "這些名字不是被遺忘的死者。它們像是被從星圖裡刪掉的人。" },
          "石碑背後傳來衣料擦過石面的聲音。一名青年從暗處走出，灰銀色的髮梢沾著石粉，手腕上留著被刮淡的字痕。",
          { speaker: "瑟恩・遺名", text: "先別刻下去。這些名字是我親手刮掉的。只要名字留在星圖上，回聲就能循著它找到那個人。" },
          { speaker: "瑟恩・遺名", text: "我也刮掉了自己的名字，才把他們藏在這裡。現在我只記得自己曾經守著這座界碑。" },
          "空白處浮出第一筆。有人正在等你決定，該把名字還給石碑，還是用自己的聲音填上那個位置。"
        ],
        choices: [
          { id: "restore_names", title: "把被刮去的名字逐一刻回去", description: "讓失去記錄的人重新出現在界碑網絡中。", outcome: "你沿著殘存筆畫逐一補回名字。每完成一個，石室外便亮起一顆星；有些名字旁傳來久違的呼喚。" },
          { id: "offer_name", title: "在空白處留下自己的名字", description: "以調律者作為回應，換取門後存在的身分。", outcome: "你在空白處刻下自己的名字。界碑立刻收緊回聲，另一個陌生名字隨之浮現，像是有人終於被允許回答。" }
        ]
      },
      finales: {
        restore_names: {
          title: "星圖重新記得他們",
          paragraphs: [
            "最後一個名字落下時，盲星谷裡的霧向兩側退開。石碑沒有指向北方，也沒有指向任何一座已知界碑；它映出的是一條由名字連成的路。",
            { text: "你敲回去的節奏沿著路傳開，石室裡的回聲不再孤單。", when: { path: "chapterThreeDoorChoice", equals: "answer_knock" } },
            { text: "英格瓦扶住仍在震動的門框，讓最後幾道刻痕完成。", when: { path: "chapterThreeDoorChoice", equals: "break_seal" } },
            { speaker: "法芙娜", text: "原來這些界碑記錄的不是領土。它們記得曾經替彼此守門的人。" },
            { speaker: "阿斯特麗德・龍怒", text: "風終於不再往回吹了。這些名字可以走出山谷，去找還記得他們的人。" },
            { speaker: "格里姆・破裂之鱗", text: "下次遇到石門，先讓我試著敲門。" },
            { speaker: "瑟恩・遺名", text: "名字回來了。我想親自把這條路記下去。下一座界碑，我和你們一起找。" },
            "遠方傳來新的敲擊。這次不只三下，而是從群山各處一一響起。"
          ],
          summary: "被刮去的名字重新回到星圖，盲星谷與其他界碑恢復了聯繫。新的敲擊從群山深處傳來。",
          hook: "下一步：循著重新亮起的名字，尋找仍未回應的界碑。"
        },
        offer_name: {
          title: "空白處的回答",
          paragraphs: [
            "你的名字亮起後，界碑深處傳來一聲長長的回響。那不是威脅，也不像求救；更像一個人終於想起自己曾經如何被稱呼。",
            { text: "因為你先敲回了節奏，回應沿著石門與烽火台一路傳出谷外。", when: { path: "chapterThreeDoorChoice", equals: "answer_knock" } },
            { text: "石門的裂口尚未合攏，英格瓦與巡守守在外側，替回聲爭取傳出去的時間。", when: { path: "chapterThreeDoorChoice", equals: "break_seal" } },
            { speaker: "法芙娜", text: "它記住了你的名字。現在，換我們找出它的名字。" },
            { speaker: "阿斯特麗德・龍怒", text: "你的名字沿著風傳出去了。這次，回聲知道該往哪裡找你。" },
            { speaker: "格里姆・破裂之鱗", text: "那就把它找回來。這次我會等你說可以再動手。" },
            { speaker: "瑟恩・遺名", text: "你替我留下了一個可以回答的名字。我會陪你們去找它的來處，也找回我失去的那一段記憶。" },
            "你的手臂再次浮起星光。這一次，光芒沿著界碑向外延伸，在天幕上照出一個從未存在過的星座。"
          ],
          summary: "調律者以自己的名字接住回聲，門後的存在終於作出回答。星幽負荷重新增加，一個未知星座出現在天幕上。",
          hook: "下一步：辨認新星座，找出那個被界碑網絡刪去的存在。"
        }
      }
    }
  },
  chapterFour: {
    title: "倒懸之城",
    stages: {
      approach: {
        title: "雲海之上的倒影",
        clock: "倒懸之城・抵達",
        paragraphs: [
          "盲星谷上空的新星座沒有固定在天幕。它像一座倒懸的城，沿著群山的輪廓緩慢移動；城牆間垂落的光橋，正把你們引向雲海深處。",
          { text: "星圖記回名字後，前方的路比預想中清楚。", when: { path: "chapterThreeFinaleChoice", equals: "restore_names" } },
          { text: "你留下的名字成了路標。遠方也有什麼東西，正順著它回望。", when: { path: "chapterThreeFinaleChoice", equals: "offer_name" } },
          "六名同行者終於聚在同一條路上。英格瓦與格里姆走在前方，弗蕾亞照看隊伍，法芙娜和瑟恩辨認星圖；阿斯特麗德則盯著橋面下不合常理的風。",
          { speaker: "阿斯特麗德・龍怒", text: "橋不是往城裡升，是城在往我們這邊落。風每隔一刻就會換向，得趁下一次翻轉前過去。" },
          { speaker: "瑟恩・遺名", text: "那座城叫維洛斯。它不該出現在任何星圖上。我只記得，祖先曾把它的名字從所有界碑上刮掉。" },
          "你們必須先選一條能抵達城門的路。"
        ],
        choices: [
          { id: "follow_wind", title: "跟著阿斯特麗德踏上風橋", description: "借風向變化搶先越過雲海，讓她帶路。", outcome: "阿斯特麗德讀出風橋翻轉的節奏，隊伍在橋面下沉前抵達城牆。你們留下的足跡很少，城外的風卻把那串名字帶得更遠。", nextGoal: "在維洛斯城門前找到安全入口", effects: [{ op: "inc", path: "trust.astrid", value: 1, max: 3 }, { op: "inc", path: "stats.insight", value: 1, max: 3 }] },
          { id: "follow_names", title: "沿著瑟恩記得的舊名尋路", description: "逐一核對被刮去的地名，走一條較慢但能避開風眼的路。", outcome: "瑟恩把殘缺地名逐個念出，法芙娜聽出其中藏著避風的停靠點。你們平安抵達城門，也讓被遺忘的名字再次在星圖上留下痕跡。", nextGoal: "在維洛斯城門前找到安全入口", effects: [{ op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }] }
        ]
      },
      gate: {
        title: "三環城門",
        clock: "倒懸之城・外門",
        paragraphs: [
          "城門倒懸在崖壁下方，三道石環彼此錯開，環心卻朝向雲海。門上沒有把手，只有三處像被誰敲過的凹痕。每一次城體翻轉，凹痕便滲出一線冷光。",
          { text: "你們沿風橋迅速抵達，城門的光環仍在可預測的節奏裡。", when: { path: "chapterFourApproachChoice", equals: "follow_wind" } },
          { text: "舊地名讓你們避開風眼，但也喚醒了城牆裡沉睡的刻痕。", when: { path: "chapterFourApproachChoice", equals: "follow_names" } },
          { speaker: "法芙娜", text: "這不是鎖。它在等三次回應，和盲星谷那道門很像，只是這次回聲來自整座城。" },
          { speaker: "格里姆・破裂之鱗", text: "我可以把石環撬開。不過它們互相咬住了，硬拆可能會讓整座城都跟著震。" },
          "選擇回應城門，或由格里姆破開入口。"
        ],
        choices: [
          { id: "answer_rings", title: "依次敲回三環的節奏", description: "讓法芙娜與全隊聽辨回聲，試著不傷城門地開啟它。", outcome: "你們分別敲回三種音高。三道石環依序轉正，城門緩緩打開，門後有一股冷風帶著灰燼吹出。沒有警鐘響起，但遠處的黑霧也停下了移動。", nextGoal: "穿過倒懸街區，找出名字被抹去的原因", effects: [{ op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "trust.freya", value: 1, max: 3 }] },
          { id: "break_rings", title: "請格里姆撐開石環", description: "趁環身交錯時找出受力點，以破壞換取最快入口。", outcome: "格里姆把肩抵上石環，英格瓦在另一側替他承受回彈。入口被撐開了，碎石落入雲海；城內的街燈也因此一盞接一盞亮起，像有東西被驚醒。", nextGoal: "穿過倒懸街區，找出名字被抹去的原因", effects: [{ op: "inc", path: "trust.grimm", value: 1, max: 3 }, { op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] }
        ]
      },
      archive: {
        title: "沒有名字的檔案廳",
        clock: "倒懸之城・舊檔案廳",
        paragraphs: [
          "城裡的街道貼著天頂延伸，窗戶朝下望向雲海。你們沿著熄滅的燈一路走進檔案廳，成千上萬塊銀色名牌漂浮在水面上，字跡被磨得一乾二淨。",
          { text: "完整的敲擊替你們保住了廳內的沉寂；水面下有微弱的人聲。", when: { path: "chapterFourGateChoice", equals: "answer_rings" } },
          { text: "破門的震動傳遍街區，檔案廳上方的暗霧已開始聚攏。", when: { path: "chapterFourGateChoice", equals: "break_rings" } },
          { speaker: "弗蕾亞・龍脈", text: "水下面有人。先把他們拉上來，名牌不會自己逃走。" },
          { speaker: "瑟恩・遺名", text: "我想起來了。維洛斯刮去居民的名字，是為了讓某種追逐名字的東西找不到他們。可現在，守護它的核心正在熄滅。" },
          "你們只有時間做一件事：打撈名牌，或先救出檔案廳裡的人。"
        ],
        choices: [
          { id: "recover_names", title: "先打撈被抹去的名牌", description: "取回維洛斯居民的身分，也查清這座城曾經防備什麼。", outcome: "瑟恩和法芙娜辨認出名牌上的刻痕。名牌歸位時，檔案廳露出一段被藏起來的記錄：星噬者循著被記住的名字追蹤活物，而維洛斯的沉默曾讓整座城躲過它。水下的人仍在等待，但你們終於知道面前的黑霧是什麼。", nextGoal: "前往城市核心，決定維洛斯如何躲過星噬者", effects: [{ op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "stats.insight", value: 1, max: 3 }] },
          { id: "rescue_archive", title: "先救出水下的人", description: "由弗蕾亞安排救援，讓被困居民先離開即將淹沒的檔案廳。", outcome: "弗蕾亞帶隊把檔案廳裡的人一一救上岸。倖存者認出瑟恩，替他補回一段記憶：他曾是維洛斯最後一任守名人。名牌仍沉在水底，但一位年老的居民指出通往城市核心的路。", nextGoal: "帶著獲救居民前往城市核心", effects: [{ op: "inc", path: "trust.freya", value: 1, max: 3 }, { op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "evac", value: 1, max: 3 }] }
        ]
      },
      core: {
        title: "倒懸之城的心臟",
        clock: "倒懸之城・核心室",
        paragraphs: [
          "城市核心懸在倒轉的重力中央。六道光環圍著一張空座輪轉，每轉一圈，城中便有一條街道失去光芒。暗霧從破碎的天窗灌入，像在尋找某個可以呼喚的名字。",
          { text: "被取回的名牌拼出星噬者的舊記錄，也指出核心仍能重新啟動。", when: { path: "chapterFourArchiveChoice", equals: "recover_names" } },
          { text: "獲救的居民認出了瑟恩，並把守名人的記憶交還給他。", when: { path: "chapterFourArchiveChoice", equals: "rescue_archive" } },
          { text: "你留下的名字仍沿著星圖發亮，黑霧正循著那道光接近。", when: { path: "chapterThreeFinaleChoice", equals: "offer_name" } },
          { speaker: "瑟恩・遺名", text: "我終於記得自己守過什麼。核心可以把維洛斯重新接回星圖，也可以切斷所有通往這裡的路。兩種做法都會有人付出代價。" },
          { speaker: "英格瓦・龍心", text: "如果要讓城市重新亮起來，我們就一起守住它。如果要斷開道路，我會確保所有人都能先離開。" },
          "最後的選擇將決定這座城市如何活下去。"
        ],
        choices: [
          { id: "restore_city", title: "重啟核心，讓維洛斯回到星圖", description: "以取回的名牌或獲救居民的口述記憶校準核心，承擔星噬者追來的風險。", outcome: "你們以已取回的名牌，或獲救居民口述的名字校準六道光環。維洛斯重新出現在星圖上，居民逐一找回彼此的稱呼；星噬者因此鎖定城市，但六名同行者已守住通路，準備迎擊。", nextGoal: "守住重返星圖的維洛斯，迎接星噬者", effects: [{ op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "trust.astrid", value: 1, max: 3 }] },
          { id: "sever_path", title: "切斷核心與星圖的連結", description: "以核心最後的力量排出檔案廳積水、打開避難通道，再讓維洛斯再次消失。", outcome: "你們依瑟恩記得的順序停下六道光環。核心先排出檔案廳積水，讓仍受困的人沿應急通道撤到安全街區；隨後維洛斯的名字從星圖淡去，黑霧失去方向，通往外界的光橋也一條條熄滅。你們與居民被困在城裡，必須另找出口。", nextGoal: "在星圖之外的維洛斯尋找新的出口", effects: [{ op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "trust.freya", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] },
          { id: "split_core", title: "把核心力量分給兩條路", description: "一半重啟星圖、一半隱去城市，試著同時保住居民與維洛斯。", outcome: "六道光環被迫分向相反方向。維洛斯短暫亮起又立刻被抹去，核心室同時傳來兩種互不相容的脈動。你們保住了撤離通道，卻讓城市失去唯一穩定的座標。", nextGoal: "穩住彼此拉扯的核心光環" }
        ]
      }
    },
    finales: {
      restore_city: {
        title: "星圖重燃，黑霧來襲",
        summary: "維洛斯與居民的名字重新回到星圖。星噬者循著這道光逼近，全隊將共同守住城市。",
        hook: "下一步：在維洛斯迎戰循名而來的星噬者。",
        paragraphs: [
          { text: "最後一塊名牌嵌入空座，整座倒懸之城同時亮起。街燈倒映在雲海裡，居民終於能叫出彼此的名字。", when: { path: "chapterFourArchiveChoice", equals: "recover_names" } },
          { text: "獲救的居民循著記憶，把自己的名字一個個說回空座。核心逐漸亮起，街燈倒映在雲海裡。", when: { path: "chapterFourArchiveChoice", equals: "rescue_archive" } },
          "瑟恩站在核心旁，沒有再避開自己的過去。阿斯特麗德沿著光橋巡視，格里姆與英格瓦守住外門，弗蕾亞安置獲救的人，法芙娜則把星噬者的行蹤記在新星圖上。",
          { speaker: "瑟恩・遺名", text: "這次我們知道它會來，也知道彼此的名字。" },
          "遠處的黑霧忽然向上翻湧。一道沒有星光的影子越過群山，朝著重新點亮的維洛斯伸出長臂。六名冒險者在核心室外重新列隊。"
        ]
      },
      sever_path: {
        title: "隱去的城市，未完的歸途",
        summary: "你們切斷維洛斯與星圖的連結，黑霧失去追蹤方向；全隊與倖存者則被困在一座再次消失的城市。",
        hook: "下一步：穿過無名街區，替維洛斯找到新的出口。",
        paragraphs: [
          "最後一道光環停下時，維洛斯從星圖上消失。黑霧在城外盤旋片刻，終於失去方向。街燈熄滅，倖存者的名字仍留在彼此心裡。",
          "英格瓦與格里姆封住通往外牆的裂口，弗蕾亞照看受困居民，法芙娜保存最後一張手繪地圖。阿斯特麗德確認所有風都停了，瑟恩則帶你們找到一條舊地道。",
          { speaker: "阿斯特麗德・龍怒", text: "風橋不見了，但城裡還有空氣流動。出口一定存在，只是我們得重新聽懂這座城。" },
          "六名同行者與維洛斯的居民向無名街道出發。城市再次離開星圖，但你們沒有把彼此的名字留下。"
        ]
      }
    },
    failureStages: {
      failureEntry: {
        title: "兩種方向的心跳",
        clock: "倒懸之城・核心室",
        paragraphs: [
          "分裂的光環一半指向星圖，一半指向空白。城市每亮一次，黑霧便靠近一寸；每暗一次，倒懸街區便失去一段重力。",
          { speaker: "瑟恩・遺名", text: "核心不能同時記得自己在哪裡、又假裝自己不存在。得先讓其中一種脈動停下來。" },
          "光環開始逆向旋轉。你們必須先穩住中央空座，否則整座城會被兩條路撕開。"
        ],
        choices: [
          { id: "brace_rings", title: "以全隊的力量固定六道光環", description: "把相互拉扯的能量暫時壓在同一個節拍裡。", outcome: "英格瓦和格里姆撐住環架，法芙娜與瑟恩將兩種節拍勉強疊合。核心暫時安靜，卻把不穩定的震動傳進每一條街。", nextGoal: "前往三環城門，確認撤離路線是否仍存在" }
        ]
      },
      failureRings: {
        title: "翻轉的城門",
        clock: "倒懸之城・三環城門",
        paragraphs: [
          "城門三道石環輪流朝上、朝下，原本通往外界的光橋被折進城牆。居民聚在門後，腳下的街道每隔幾息就改變一次方向。",
          { speaker: "阿斯特麗德・龍怒", text: "風也被兩種重力扯住了。我能帶大家穿過去，但橋面只能維持一次翻轉。" },
          "門環停頓的瞬間出現一條狹窄通道。你們必須趁它再次翻轉前送居民離城。"
        ],
        choices: [
          { id: "evacuate_bridge", title: "帶居民穿過最後的光橋", description: "由阿斯特麗德領路，英格瓦和弗蕾亞押後護送人群。", outcome: "居民一批批越過光橋。最後一批人抵達雲海彼岸時，石環重新合攏；橋身斷成光屑，城內只剩你們和一座正在失去方向的城市。", nextGoal: "回到核心室，找出能固定維洛斯的最後座標" }
        ]
      },
      failureBridge: {
        title: "空座上的最後座標",
        clock: "倒懸之城・空座廳",
        paragraphs: [
          "空座廳的牆面開始映出兩座維洛斯：一座回到星圖，另一座沉入雲海之外。兩幅影像交替吞掉彼此，連瑟恩也無法從舊名中辨認真正的城市。",
          { speaker: "法芙娜・暗瞳", text: "居民都出去了。若要讓城留下來，就得選一個位置；再拖下去，它會連自己曾存在過都忘掉。" },
          "座椅上浮現一格空白刻度，似乎能把核心的最後光芒釘在一處。"
        ],
        choices: [
          { id: "anchor_city", title: "把最後光芒釘在空座上", description: "以自身記憶作為座標，替維洛斯留下最後一次定位。", outcome: "空座記住了你的記憶，也記住了維洛斯最後的輪廓。城市停止撕裂，卻沒有回到星圖；定位光被固定在一段不屬於任何航路的空白裡。", nextGoal: "確認維洛斯是否仍能被任何人找到" }
        ]
      },
      failureAnchor: {
        title: "星圖之外的維洛斯",
        clock: "星圖之外・失序雲海",
        paragraphs: [
          "城市終於不再翻轉。雲海彼岸的居民看見一點靜止的光，卻無法辨認它是星辰、船燈，還是自己失去的家。",
          { speaker: "瑟恩・遺名", text: "我記得名字，也記得每一條路。可是只要說出維洛斯，星圖就把它改寫成空白。" },
          "核心的兩種脈動都已耗盡。光點只剩最後一瞬，無法同時照亮城市和回家的路。"
        ],
        choices: [
          { id: "release_anchor", title: "讓定位光照亮撤離者的歸途", description: "將最後座標交給雲海彼岸的人，替倖存者保留方向。", outcome: "最後的光離開空座，沿著雲海照向居民。每個人都找到了安全岸線；而維洛斯的座標從星圖與記憶中一同消失。", nextGoal: "見證倒懸之城最後一次出現在天幕" }
        ]
      }
    },
    failureFinales: {
      split_core: {
        title: "兩條路盡頭的失城",
        summary: "分給兩條路的核心力量成功送出撤離訊號，也讓居民安全離開；維洛斯卻失去唯一座標，沉入星圖之外，再沒有人能找到它。",
        hook: "失敗結局：城市與居民都活了下來，但彼此再也無法返回。",
        paragraphs: [
          "天幕最後映出一座倒懸的城。它沒有墜落，也沒有回到星圖，只在光與空白的交界停留片刻。",
          { speaker: "阿斯特麗德・龍怒", text: "風記得它在哪裡。可風不會替任何人帶路了。" },
          "光點熄滅。居民保住性命，星噬者也被錯位的座標引向遠方；然而六名同行者失去回城的航線，瑟恩手中的名字再也無法讓維洛斯重新顯形。",
          "選擇確實奏效了，代價卻超過任何人能承受的範圍。星圖上只留下空白，而空白沒有歸途。"
        ]
      }
    }
  },
  chapterFive: {
    title: "無星渡口",
    stages: {
      harbor: {
        title: "沉星潮抵達維洛斯",
        clock: "無星渡口・潮汐前",
        paragraphs: [
          "維洛斯的鐘聲還沒停，雲海下方便升起一片沒有星光的潮。它沿著星圖邊緣推進，把沿途亮起的界碑一座座吞進黑暗。",
          { text: "城市重返星圖後，黑潮已鎖定維洛斯。街燈亮著，居民也第一次看見逼近的敵人。", when: { path: "chapterFourCoreChoice", equals: "restore_city" } },
          { text: "維洛斯仍藏在星圖之外，但潮聲穿過了封閉的城牆。黑暗正在吞掉附近的界碑。", when: { path: "chapterFourCoreChoice", equals: "sever_path" } },
          "瑟恩認出那不是水，而是被抹去的名字聚成的回聲。它們被困得太久，最後凝成追逐一切記憶的星噬者。燈塔裡還留著一枚能改變潮向的古鏡。",
          { speaker: "燈守・伊蘭", text: "別讓它聽見你們互相呼喚。它會拿走第一個被記住的名字，再沿著那道記憶找上所有人。" },
          { speaker: "法芙娜・暗瞳", text: "我們可以留在城裡守住居民，也可以先去燈塔，把潮引離這片星域。時間只夠做一件事。" },
          "先決定如何應對第一波沉星潮。"
        ],
        choices: [
          { id: "hold_harbor", title: "留在渡口保護居民", description: "由英格瓦與弗蕾亞安置人群，全隊守住街道入口。", outcome: "英格瓦和格里姆在渡口架起防線，弗蕾亞帶居民進入石室。法芙娜用咒光遮住他們的名字；黑潮撞上城牆，卻沒有立刻找到入口。你們為燈塔爭取到一段時間。", nextGoal: "穿越沉星潮，抵達改變潮向的燈塔", effects: [{ op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "trust.freya", value: 1, max: 3 }, { op: "inc", path: "evac", value: 1, max: 3 }] },
          { id: "rush_lighthouse", title: "立刻出發前往燈塔", description: "趁黑潮還沒合攏，由阿斯特麗德帶路搶先抵達。", outcome: "阿斯特麗德帶隊衝過渡口，格里姆清出被倒塌石柱堵住的路。你們在黑潮包圍城牆前抵達燈塔；身後幾座無人看守的界碑逐一熄滅。", nextGoal: "穿越沉星潮，抵達改變潮向的燈塔", effects: [{ op: "inc", path: "trust.astrid", value: 1, max: 3 }, { op: "inc", path: "trust.grimm", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] }
        ]
      },
      undercity: {
        title: "星圖之外的舊潮渠",
        clock: "維洛斯・城底撤離道",
        paragraphs: [
          "維洛斯已從星圖上消失。沒有界碑指引，燈塔的航線也無法直接定位；沉星潮仍沿著城外的刻痕逼近。居民從封閉的街區聚到城底，唯一能離城的路，是一條早被水泥封住的舊潮渠。",
          { speaker: "阿斯特麗德・龍怒", text: "切斷連結保住了城裡人的名字，卻也讓我們失去星圖的指路。要帶大家出去，就得先找到潮渠盡頭的舊航標。" },
          { speaker: "弗蕾亞・春息", text: "這裡的人已經失去家園一次。我不會再讓他們為了趕路被丟在後面。" },
          "隊伍必須決定如何打通潮渠，並在黑潮追上前帶居民抵達外海。"
        ],
        choices: [
          { id: "guide_residents", title: "先帶居民分批穿過潮渠", description: "以隊伍作為引路標記，確保老弱與傷者都能抵達出口。", outcome: "英格瓦與格里姆清開塌落的石門，弗蕾亞分批帶居民前進。隊伍因此慢了一步，但沒有人被留在城內。潮渠出口的舊航標仍能辨認海流方向，伊蘭據此校準燈塔航線。", nextGoal: "護送維洛斯居民離開城底，接上通往燈塔的航道", effects: [{ op: "inc", path: "evac", value: 1, max: 3 }, { op: "inc", path: "trust.freya", value: 1, max: 3 }] },
          { id: "recover_beacon", title: "先搶修潮渠盡頭的航標", description: "讓伊蘭和瑟恩恢復定位能力，再安排居民沿安全水道撤離。", outcome: "伊蘭辨認出航標的舊式刻度，瑟恩以名冊補回失落的地名。航線重新可辨，居民能避開黑潮最深的水道；但修復耗去的時間讓外城幾座界碑被吞沒。", nextGoal: "依照重啟的航標，帶居民接上通往燈塔的航道", effects: [{ op: "inc", path: "stats.insight", value: 1, max: 3 }, { op: "inc", path: "trust.sern", value: 1, max: 3 }] }
        ]
      },
      crossing: {
        title: "被潮水倒映的航道",
        clock: "無星渡口・沉沒航道",
        paragraphs: [
          "通往燈塔的舊航道已沉進雲海。黑水倒映出一片陌生星空，水面下的光點會跟著說出口的名字移動。每走一步，腳下就傳來一次遲來的回聲。",
          { text: "渡口防線替居民擋下第一波黑潮，但潮水已漫過你們的退路。", when: { path: "chapterFiveHarborChoice", equals: "hold_harbor" } },
          { text: "你們搶先抵達航道，黑潮尚未合攏，水面卻已追著腳步改變。", when: { path: "chapterFiveHarborChoice", equals: "rush_lighthouse" } },
          { speaker: "阿斯特麗德・龍怒", text: "別看水裡的星。那不是天空，是它記住的人。" },
          { speaker: "瑟恩・遺名", text: "燈塔有兩條航線。一條靠風，一條靠名冊；走錯一步，就會把它帶到我們身邊。" },
          "選擇借風穿越，或沿著舊名冊找出安全航道。"
        ],
        choices: [
          { id: "ride_wind", title: "跟隨阿斯特麗德的風勢躍過航道", description: "快速通過會移動的潮面，但必須承受風橋隨時崩解的風險。", outcome: "阿斯特麗德抓住潮面轉向的瞬間，帶著隊伍連續越過三段斷橋。你們很快抵達燈塔下方，黑水在身後捲起一道人形輪廓。", nextGoal: "在燈塔內尋找古鏡與星噬者的來歷", effects: [{ op: "inc", path: "trust.astrid", value: 1, max: 3 }, { op: "inc", path: "stats.insight", value: 1, max: 3 }] },
          { id: "follow_manifest", title: "依照瑟恩記得的名冊尋找暗礁", description: "放慢腳步辨認潮下刻痕，避開會回應名字的水面。", outcome: "瑟恩對照古名冊辨出幾處沉沒的界碑。你們沿著暗礁繞過會回應呼喚的潮水，抵達燈塔時仍保留了完整隊形；但星噬者也學會了你們避開它的方法。", nextGoal: "在燈塔內尋找古鏡與星噬者的來歷", effects: [{ op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }] }
        ]
      },
      lighthouse: {
        title: "燈塔裡的舊航海圖",
        clock: "無星渡口・守燈室",
        paragraphs: [
          "燈塔內部比外觀看起來更深。牆上掛滿空白航海圖，中央的古鏡裂成六片，映出的卻是同一個空座。燈守伊蘭守在鏡前，手裡握著一枚不肯熄滅的燈芯。",
          { text: "你們沿風勢趕來，潮中那道人形仍被甩在遠處。", when: { path: "chapterFiveCrossingChoice", equals: "ride_wind" } },
          { text: "舊名冊帶你們找到暗礁航線，鏡面因此映出曾被刮去的地名。", when: { path: "chapterFiveCrossingChoice", equals: "follow_manifest" } },
          { speaker: "燈守・伊蘭", text: "古鏡上的早期記錄稱星噬者為『第一守護者』。古人為躲避它，刮掉整座城的名字；它便把那些無人回應的回聲吞進自己身體裡。至於守望者是否就是它，這些記錄還不能證明。" },
          { speaker: "瑟恩・遺名", text: "所以我們不能只把它引走。若它繼續吞下名字，總有一天會把整張星圖都當成自己的記憶。" },
          "燈守指出古鏡仍能運作，但需要先選擇修復鏡片，或救出被困在塔底的人。"
        ],
        choices: [
          { id: "repair_lens", title: "先修復古鏡", description: "讓法芙娜與瑟恩重組鏡片，盡快找出能分離回聲的方法。", outcome: "瑟恩認出鏡片上的舊名，法芙娜將它們逐一固定。鏡面映出星噬者的核心並非黑暗，而是一個被反覆刮除、無法完整說出的名字。你們找到分離回聲的可能，也讓燈塔重新發亮。", nextGoal: "啟動古鏡，決定如何改變星噬者的潮向", effects: [{ op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "stats.insight", value: 1, max: 3 }] },
          { id: "rescue_keeper", title: "先救出塔底受困者", description: "由弗蕾亞與英格瓦救人，之後再讓伊蘭協助修鏡。", outcome: "英格瓦撐住正在崩裂的樓梯，弗蕾亞帶出困在塔底的居民。伊蘭認出其中一位老人是自己的母親，終於放下守燈人的孤獨。老人記得古鏡的啟動方式，並說出那個被刮除名字的第一個音節。", nextGoal: "啟動古鏡，決定如何改變星噬者的潮向", effects: [{ op: "inc", path: "trust.freya", value: 1, max: 3 }, { op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "evac", value: 1, max: 3 }] }
        ]
      },
      lens: {
        title: "古鏡映出的名字",
        clock: "無星渡口・鏡心室",
        paragraphs: [
          "六片鏡片重新合攏，映出的不是怪物，而是一個由無數名字組成的影子。那些名字彼此重疊，誰也無法完整說出自己。黑潮已包圍燈塔，鏡心只夠承受一次完整的照映。",
          { text: "修復鏡片讓你們看清星噬者的核心：一個被刮除的名字，仍在等待回答。", when: { path: "chapterFiveLighthouseChoice", equals: "repair_lens" } },
          { text: "獲救者記得古鏡的啟動方式，也想起那個名字最初的音節。", when: { path: "chapterFiveLighthouseChoice", equals: "rescue_keeper" } },
          { text: "維洛斯重返星圖，居民的名字仍是黑潮最清晰的路標。", when: { path: "chapterFourCoreChoice", equals: "restore_city" } },
          { text: "維洛斯雖然隱去，黑潮卻正沿著周遭熄滅的界碑擴大。", when: { path: "chapterFourCoreChoice", equals: "sever_path" } },
          { speaker: "燈守・伊蘭", text: "把它引向遠方，能替這裡爭取時間；回答那個名字，或許能讓它停止吞噬。可是我們不知道它會變回什麼。" },
          "選擇用古鏡製造遠方的假星，或把隊伍的記憶合在一起，回應那個名字。"
        ],
        choices: [
          { id: "decoy_star", title: "在遠方點亮假星，引開星噬者", description: "把古鏡的能量投向空無一物的星域，替受困者爭取逃離時間。", outcome: "你們把光投向無人的星域。星噬者追著假星離開渡口，沉星潮暫時退去；但一大片遠方天幕也被它吞進黑暗。伊蘭留下鏡片刻下航線，讓各地界碑能在下一次追擊前撤離。", nextGoal: "沿著古鏡留下的航線追蹤星噬者，搶在它吞下更多界碑前抵達", effects: [{ op: "inc", path: "trust.astrid", value: 1, max: 3 }, { op: "inc", path: "trust.grimm", value: 1, max: 3 }] },
          { id: "answer_name", title: "以全隊的記憶回答那個名字", description: "不再用刪除躲避它，讓六名同行者一起承接未知回聲。", outcome: "六名同行者依序說出彼此記得的名字，伊蘭也加入其中。古鏡把回聲一層層拆開，星噬者第一次停止追逐，露出第一守護者殘存的記憶。它沒有完全甦醒，但被抹去的名字終於得到回應。", nextGoal: "沿第一守護者的殘響前往星圖深處，查明名字如何被封存", effects: [{ op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] },
          { id: "mirror_overload", title: "同時送出假星與名字的回聲", description: "把古鏡推過承受極限，讓遠方的假星引走星噬者，也讓第一守護者聽見回答。", outcome: "伊蘭提醒你們，鏡心只承受得住一次完整照映。你仍將兩道刻度疊在一起，決定用自己的記憶填補鏡面的空缺。", nextGoal: "讓古鏡同時送出假星與名字的回答" }
        ]
      }
    },
    finales: {
      decoy_star: {
        title: "假星遠行",
        summary: "星噬者追逐古鏡投出的假星，沉星潮暫退。維洛斯與附近的界碑獲得撤離時間，但遠方星域陷入黑暗。",
        hook: "下一步：沿古鏡留下的航線追上星噬者，阻止它吞下更多界碑。",
        paragraphs: [
          "古鏡的光越過雲海，落在一片沒有居民的星域。黑潮立刻轉向追去，無星渡口的水面終於映出幾點微光。",
          "英格瓦帶人修補渡口，弗蕾亞照看獲救者，格里姆和阿斯特麗德將鏡片固定在船首。法芙娜記下黑潮遠去的方向；瑟恩則把最後一頁空白名冊交給伊蘭保管。",
          { speaker: "燈守・伊蘭", text: "它追著光走。我會讓每一座界碑都知道，什麼時候該熄燈、什麼時候該轉移。" },
          "星噬者的影子消失在天幕之外。你們乘上燈塔的舊航船，沿著古鏡留下的微光追去。"
        ]
      },
      answer_name: {
        title: "第一守護者的回聲",
        summary: "全隊用共同記憶回答星噬者，沉星潮停止擴張。第一守護者留下的殘響浮現，指向七約聖所；守望者仍是另一個存在，尚未現身。",
        hook: "下一步：追尋最初被刮去的名字，查明星噬者如何誕生。",
        paragraphs: [
          "六個名字落進古鏡，彼此照亮了那些無法說出口的空白。黑潮像退潮般沉回海底，曾被吞進去的星光一點點浮上水面。",
          "鏡心深處睜開一雙疲憊的眼睛。那是第一守護者留在黑潮裡的記憶殘響；它曾替六位星獸守住歸途，如今只記得自己失去了名字。它沒有實體，也不是守望者。",
          { speaker: "法芙娜・暗瞳", text: "它沒有回答我們是誰。它在問，最初是誰把它變成了只會吞噬的東西。" },
          "殘響映出一條通往六位星獸與第一守護者舊約的航線。六名冒險者與燈守伊蘭登上航船，前往七約聖所尋找負責保管盟約的守望者。"
        ]
      }
    },
    failureStages: {
      failureEntry: {
        title: "鏡心過載",
        clock: "無星渡口・鏡心室",
        paragraphs: [
          "你將假星的引路刻度與名字回聲的刻度推到同一條光線上。鏡面先亮得像一輪新日，隨即裂出細密紋路；每道裂紋裡都閃過一段你曾經記住的旅程。",
          { speaker: "燈守・伊蘭", text: "訊號送出去了！假星正在把它引往外海，回聲也有人聽見了。可是鏡子在拿走你的記憶——快把手收回來！" },
          "古鏡仍能照出一條通往外海的航路。光線盡頭，星噬者已轉身追向那顆假星。"
        ],
        choices: [
          { id: "hold_signal", title: "維持鏡光，直到居民離開渡口", description: "把已經送出的訊號維持到最後一艘船駛出黑潮。", outcome: "你沒有鬆手。星噬者追著假星遠去，名字回聲也穿過外海；渡口的船隊趁著退潮離開。古鏡卻把每一段同行記憶都抽成細光，送往同一片黑暗。", nextGoal: "沿古鏡照出的航道追上遠去的訊號" }
        ]
      },
      failureCrossing: {
        title: "越過無星的航道",
        clock: "無星渡口・外海航路",
        paragraphs: [
          "船隊沿著鏡光穿過雲海。遠方的假星仍在移動，星噬者緊追不放；每當它吞下一處星域，古鏡便把更多光從你身上抽走，替船隊補上下一段航線。",
          { speaker: "阿斯特麗德・龍怒", text: "我們的船都跟上了。你還認得我們嗎？" },
          "你知道她在等一個名字。那個音節就在唇邊，卻像從未屬於你。"
        ],
        choices: [
          { id: "keep_course", title: "沿著假星繼續前行", description: "在最後的光消失前，確認回聲是否真的抵達。", outcome: "船隊追上假星留下的銀色尾跡。星噬者被引離渡口，回聲也穿過了星海；但你已經想不起自己為什麼要追上它。", nextGoal: "在航道盡頭接住回傳的名字回聲" }
        ]
      },
      failureEcho: {
        title: "抵達的回答",
        clock: "星圖之外・回聲交會處",
        paragraphs: [
          "一段古老回聲從航道盡頭傳回。第一守護者確實聽見了你們的回答；它留下的影像清楚映出七者舊約，也映出一座能通往聖所的星門。",
          { speaker: "瑟恩・遺名", text: "線索完整了。只要抄下刻度，我們就能帶著它回去——你看得懂我在說什麼嗎？" },
          "你低頭看著古鏡。鏡面沒有剩下任何一段能辨認的記憶，只有最後一道微光仍連著渡口。"
        ],
        choices: [
          { id: "send_echo_home", title: "把最後一道回聲送回渡口", description: "將聖所座標傳給已撤離的船隊，讓所有人至少帶著答案返航。", outcome: "座標沿鏡面傳回船隊。每艘船都收到同一段完整訊息；代價是古鏡的光在你掌心熄滅，回程不再有星圖可循。", nextGoal: "回到燈塔，與已抵達的船隊會合" }
        ]
      },
      failureHarbor: {
        title: "回到沒有星圖的渡口",
        clock: "無星渡口・沉星後的岸邊",
        paragraphs: [
          "船隊終於回到維洛斯外海。居民都已抵達安全岸線，沉星潮也退到遠方；第一守護者的回答和七約聖所座標，則被完整刻在伊蘭帶回的鏡片上。",
          { speaker: "弗蕾亞・春息", text: "大家都在。可是我們一路上一直在叫一個人的名字——現在，誰也想不起那是誰。" },
          "你望向鏡片的反光，卻看不見自己曾經站在隊伍裡的證明。遠方星域仍是一片黑暗，通往聖所的座標也沒有人知道該交給誰。"
        ],
        choices: [
          { id: "let_mirror_rest", title: "讓古鏡和最後的記憶一同熄滅", description: "不再追索已經無法承受的代價，讓倖存者先留在岸上。", outcome: "古鏡熄滅。船隊與居民都活了下來，假星成功引走星噬者，第一守護者也給出了回答；但隊伍失去了共同記憶、調律者失去了名字，沒有人能再沿座標前往聖所。", nextGoal: "看著渡口迎來一個沒有歸人的黎明" }
        ]
      }
    },
    failureFinales: {
      mirror_overload: {
        title: "有光抵達，無人歸來",
        summary: "假星成功引走星噬者，第一守護者的回聲也送達了；渡口居民平安撤離。代價是調律者的名字與隊伍共同記憶被古鏡耗盡，聖所座標因此無人能追尋。",
        hook: "失敗結局：訊號送達了，答案也留下了，但再沒有人知道該由誰繼續旅程。",
        paragraphs: [
          "天亮時，渡口已空。居民在遠岸重新點起燈火，星噬者被假星引往地圖之外；它沒有消失，只是暫時離開了這片星域。古鏡保存下第一守護者的回答，完整的七約座標也仍刻在碎片上。",
          { speaker: "燈守・伊蘭", text: "我們把訊號送到了，也把人都帶回來了。可是那個一路替大家找路的人，究竟叫什麼？" },
          "沒有人回答。六名同伴看著彼此，知道自己曾經共同走過很長的路，卻再也想不起路上發生過什麼。碎片上的座標清楚可讀，但沒有人能說明它要帶誰去、為什麼要去。",
          "外海亮起第一道晨光。這次選擇奏效了，代價卻超出了任何人能帶著繼續前行的重量。"
        ]
      }
    }
  },
  undercityRoute: {
    title: "失星航路篇",
    stages: {
      six: {
        chapter: "第六章・失星航路",
        clock: "維洛斯外海・潮渠出口",
        title: "沒有星圖的航線",
        paragraphs: [
          "古鏡的光熄下後，燈塔外只剩潮聲。星噬者沒有追進維洛斯，卻沿著遠方的星錨鏈繼續前行；每熄滅一座界碑，海面便多出一道沒有岸的水道。",
          "居民帶來的民用航標圖在船上攤開。圖紙畫的不是星座，而是潮汐、暗礁與各聚落自己刻下的岸線。守望者曾把它從正式星圖上刪掉，伊蘭認得圖角的燈塔印記，確認這些航標仍能彼此辨認。",
          { speaker: "伊蘭", text: "這枚石芯只能再完整啟動一次。用了，我們就能校準航線；留著它，或許能在更危急的時候派上用場。" },
          { speaker: "瑟恩・遺名", text: "圖上的名字被刮過，但潮汐刻度還在。先找到舊站，我才能知道那些記錄為什麼被刪掉。" },
          "船底撞上第一道暗流。前方沒有星光，居民的航標圖也缺了最外側的一角。"
        ],
        choices: [
          { id: "trust_beacon", title: "以航標石芯校準路線", description: "消耗一次航標能量，取得最快且可核對的座標。", outcome: "伊蘭把石芯嵌進羅盤。光線穿過霧幕，將六處暗礁和一座沒有登錄的舊站連成航線。石芯隨即裂開，只剩最後一次傳訊的力量。居民看著自己熟悉的刻度被照亮，終於肯把船舵交給伊蘭；瑟恩則拓下那段被抹去的盟約座標。", effects: [{ op: "inc", path: "undercityRouteEvidence", value: 1, max: 5 }, { op: "inc", path: "trust.eilan", value: 1, max: 3 }] }
        ]
      },
      seven: {
        chapter: "第七章・無席之庭",
        clock: "星圖之外・盟約舊站",
        title: "盟約沒有記載的人",
        paragraphs: [
          "羅盤把船帶到一座低矮的石庭。它沒有七席聖所的高塔，只有避風牆、蓄水池和供難民留名的長廊。潮水退去時，牆上浮出一列列求援紀錄，其中一筆提到第一守護者曾請求六獸保留凡人自建航路，後來卻被從正式盟約中刪去。",
          "瑟恩逐字拓印。缺頁讓他無法判斷這項要求是被拒絕，還是被暫緩；守望者的印記也只出現在刪改處，不能證明它獨自造成第一次潰堤。",
          "石庭深處傳來一位星獸的夢聲。牠沒有醒來，只問這些名字是否願意被所有人聽見。",
          { speaker: "法芙娜・暗瞳", text: "夢聲很微弱。若把完整姓名刻上牆，星噬者也會沿著記憶找來。" },
          { speaker: "弗蕾亞・春息", text: "他們已經被別人替自己決定過一次。至少這次，先問清楚他們願意留下什麼。" }
        ],
        choices: [
          { id: "keep_testimony", title: "先封存證詞，保護居民身分", description: "將原件交居民保管，只讓星獸聽見不含姓名的夢聲。", outcome: "法芙娜把拓印封進裂開的航標外殼，沒有公開任何人的姓名。居民推選兩名見證者隨隊前往檔案庫，原件則留在石庭，由當地人自行決定何時公開。夢中的星獸答應把這段不含身分的訊息傳給其餘同伴，但也提醒你們：牠們還沒有同意締約。", effects: [{ op: "inc", path: "undercityRouteCivilians", value: 1, max: 5 }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }] }
        ]
      },
      eight: {
        chapter: "第八章・潮下檔案",
        clock: "失落海岸・水下檔案庫",
        title: "被刪去的備援盟約",
        paragraphs: [
          "舊站的潮位刻度把船引向失落海岸。檔案庫沉在雲海下方，入口每隔一刻才會露出水面；瑟恩用羅盤石芯留下的座標確認潮窗，英格瓦和格里姆固定船身，讓弗蕾亞帶守庫人先離開積水的外廊。",
          "深層書庫裡保存著正式盟約副本，也有一份未簽署完成的備援條文：星錨失效時，各地居民可以自行關閉航標、撤離家園，不必等待守護者批准。旁註提到第一守護者在失名後被稱作星噬者，卻沒有交代牠是否同意這個稱呼。",
          "末頁已被水流撕走。現存副本只留下守望者的筆跡，以及第一守護者要求把選擇權交還居民的一句批註。",
          { speaker: "瑟恩・遺名", text: "我可以下到最深處找末頁，但那裡的支架快斷了。底層還有人被困住。" },
          { speaker: "英格瓦・龍心", text: "我們有力氣撐一處。先說清楚，想救哪一邊。" }
        ],
        choices: [
          { id: "save_archive", title: "先救出檔案庫中的居民", description: "不拿受困者的性命交換末頁，接受證據可能不完整。", outcome: "英格瓦用盾面頂住下沉的梁柱，格里姆和阿斯特麗德接力把守庫人送上船。弗蕾亞找到最後一名老人時，瑟恩已經看見末頁被潮水捲進深處。他沒有追下去，轉而把老人交給弗蕾亞照料。老人記得祖母曾口述備援條文，願意在安全後作證；但她的證詞仍需要其他聚落核對。", effects: [{ op: "inc", path: "undercityRouteCivilians", value: 1, max: 5 }, { op: "inc", path: "undercityRouteTrust", value: 1, max: 5 }, { op: "inc", path: "trust.freya", value: 1, max: 3 }] }
        ]
      },
      nine: {
        chapter: "第九章・潮汐議盟",
        clock: "維洛斯避難港・潮汐議廳",
        title: "讓沒有席位的人發言",
        paragraphs: [
          "避難港用漁網和船板搭起臨時議廳。守望者沿著民用航路抵達，帶來舊盟約印記；星噬者停在港外，居民先聽完守庫者的口述，才同意讓牠進入。這不是七席環庭，議席留給撤離者、守庫人與各地推選的見證者。",
          "守望者承認自己刪去備援盟約。洪流失控時，它害怕各地各自關閉星錨會讓局勢更亂，便把所有決定收回守護者手中。它沒有要求原諒，只將印記放在桌上，等居民決定如何處置。",
          { speaker: "星噬者", text: "我記得你們沉默的樣子。那時我把每個空白都當成拒絕，才開始吞下名字。" },
          { speaker: "弗蕾亞・春息", text: "這些人不需要立刻相信你們。他們要先知道，往後能不能自己說不。" },
          "各聚落提出不同條件。有些要共同維護航標，有些只願保留撤離路線；受災最重的地方甚至不想再與星錨相連。守望者同意由居民分別決定，代價是洪流來臨時不會有一套命令能同時控制所有地方。"
        ],
        choices: [
          { id: "local_pacts", title: "由各聚落分別決定是否締約", description: "不設中央盟約，讓居民自己決定是否連上航標。", outcome: "居民把盟約拆成一份份可以拒絕、修改或終止的地方約定。守望者交出舊印，由各地見證人共同保管；星獸只承諾逐地回應求援。議盟沒有讓所有人立刻信任彼此，卻替每個聚落保住說不的權利。", effects: [{ op: "inc", path: "undercityRouteCivilians", value: 1, max: 5 }, { op: "inc", path: "undercityRouteTrust", value: 1, max: 5 }, { op: "inc", path: "trust.sern", value: 1, max: 3 }] }
        ]
      },
      ten: {
        chapter: "第十章・無星洪流",
        clock: "維洛斯外海・潮汐之心",
        title: "沒有星錨的最後航行",
        paragraphs: [
          "洪流在維洛斯外海抬起整片海床。主星錨鏈一座接一座熄滅，舊潮渠的水位卻仍跟著居民航標起伏。各聚落派回的訊號彼此不同：有人願意接通，有人拒絕，有人只要求先留下一條撤退路。",
          "你們抵達潮汐之心時，伊蘭發現航標石芯只剩最後一次傳訊。它能把潮汐之心的變化送往所有聚落，卻不能替任何地方回答。若直接接上中央星錨，地方約定便會失去意義；若完全放任洪流，避難港也撐不了多久。",
          { speaker: "守望者", text: "我可以把印記交出來。這一次，我不會替任何人決定要不要連上去。" },
          { speaker: "星噬者", text: "我曾以為，只要吞下所有名字，就再也不會有人消失。現在我知道，名字必須由本人留下。" },
          { speaker: "瑟恩・遺名", text: "潮汐網需要維護，遷徙也會失去家園。守門則會把兩個人留在裂口旁。每條路都有代價，讓各地先聽見，再由他們自己選。" },
          "潮汐之心開始下沉。伊蘭將最後一枚航標石芯扣上羅盤，等待你發出訊號。"
        ],
        choices: [
          { id: "send_final_signal", title: "發出最後的潮汐訊號", description: "把三種可行方案與各自代價傳到聚落，讓居民、守護者與星獸共同作出最後選擇。", outcome: "伊蘭啟動石芯。訊號沿舊潮渠傳出，沒有替任何聚落預先接上航標。居民的回覆陸續抵達，星噬者與守望者也把各自願意承擔的部分說清楚；潮汐之心只剩一次脈動，三條路都已準備好。", effects: [{ op: "inc", path: "undercityRouteTrust", value: 1, max: 5 }] },
          { id: "enter_name_current", title: "與星噬者潛入潮心，尋回第一個名字", description: "暫緩對外發訊，順著被吞下的名字進入潮汐之心；各聚落依地方盟約自行決定撤離與否。", outcome: "星噬者沒有要求你們替牠取名，只說潮心深處仍留著牠成為守護者以前的第一段記憶。你們把對外訊號交給各聚落依自治盟約處理，改由星噬者帶路潛入水下。若牠能親自找回那段記憶，洪流或許不必再由星錨、遷徙或守門來處置；但牠也可能在潮心裡再次失去自我。", effects: [{ op: "inc", path: "undercityRouteTrust", value: 1, max: 5 }, { op: "inc", path: "undercityRouteEvidence", value: 1, max: 5 }] }
        ]
      },
      name_return: {
        chapter: "第十章・無星洪流",
        clock: "潮汐之心・失名回廊",
        title: "名字回到潮聲裡",
        paragraphs: [
          "水下回廊裡沒有文字，只有無數被吞下的名字化成微光，沿著石壁一遍遍流過。星噬者走在最前方，身上的黑潮隨每道回聲起伏；牠若停下，洪流便會重新灌滿維洛斯外海。",
          { speaker: "星噬者", text: "我記得有人曾把一個名字交到我手裡。後來我怕再失去誰，便把所有名字都留在身體裡。" },
          "守望者沒有替牠解釋，也沒有伸手替牠承受。瑟恩把檔案庫救出的口述證詞放在石階上，法芙娜辨認出其中的音節並非命令，而是一段自願留下的約定。",
          { speaker: "弗蕾亞・春息", text: "我們可以陪你聽完，但只有你能決定那個名字要不要回來。" },
          "回廊盡頭，最初的回聲浮上水面。星噬者伸出手，黑潮因此短暫退開；牠可以把名字留在自己體內，繼續成為永不沉睡的潮心，也可以讓名字回到記得它的人手中，承受失去力量後未知的未來。"
        ],
        choices: [
          { id: "return_first_name", endingId: "names_returned", title: "讓星噬者親自說回自己的名字", description: "由活著的見證者陪牠記起，而不是由盟約替牠命名。", outcome: "星噬者沒有接受守望者遞來的印記。牠先向瑟恩確認那段口述，再向身旁的人說出自己願意承認的名字。微光離開牠的身體，沿回廊回到各地記得那些人的居民手中；牠失去吞納名字的力量，潮汐之心也不再需要活物看守。", effects: [{ op: "inc", path: "undercityRouteTrust", value: 1, max: 5 }, { op: "inc", path: "undercityRouteCivilians", value: 1, max: 5 }] },
          { id: "keep_first_name", endingId: "name_kept", title: "讓星噬者保留名字，引潮離開海岸", description: "牠保留記憶與力量，將洪流導向無人海溝；沿岸聚落須共同維護可隨時撤回的潮路。", outcome: "星噬者沒有把名字交出，而是親口說出它，並以自己的意志握住潮心。牠引導洪流流入遠離聚落的深海裂谷；力量仍留在牠身上，但潮路每次漲潮都會鬆動，沿岸居民與星獸必須輪值觀測，任何人都能要求中止這條潮路。", effects: [{ op: "inc", path: "undercityRouteTrust", value: 1, max: 5 }, { op: "inc", path: "undercityRouteEvidence", value: 1, max: 5 }] },
          { id: "share_tide_name", endingId: "shared_stars", title: "把真名寫進眾星共守的航路", description: "只有證據、信任與居民見證都齊備時才會出現；由星噬者本人確認被盟約抹去的真名。", outcome: "星噬者沒有交出名字，也沒有把整股力量留在自己體內。牠親口說出真名，讓潮心的光分成沿岸各處的星標；各聚落可自行接通或關閉航路，星噬者則保留自由離開的權利。", effects: [{ op: "inc", path: "undercityRouteTrust", value: 1, max: 5 }, { op: "inc", path: "undercityRouteCivilians", value: 1, max: 5 }, { op: "inc", path: "undercityRouteEvidence", value: 1, max: 5 }] }
        ]
      }
    },
    endings: {
      tide_network: { title: "潮汐萬家燈", choiceDescription: "接通各地自願維護的居民航標，分散洪流並保住大部分家園。", choiceOutcome: "各聚落逐一回覆同意，但都要求保留切斷連結的權利。潮汐網沒有中央核心，第一段支線亮起時，維洛斯的海牆終於停止下沉。", summary: "洪流由居民航標分流，各地以可撤回的新盟約共同維護。舊世界大致保全，但每個聚落都必須持續參與修復。", paragraphs: ["潮汐網沒有中央核心。哪一處航標受損，附近聚落便能自行關閉支線，避免整張網被拖入洪流。星獸自願巡行，卻不再替凡人決定何處值得拯救。", "英格瓦和格里姆帶居民逐段修復舊潮渠，弗蕾亞把航標維護交給願意輪值的聚落。瑟恩將正式盟約與備援條文並列保存；守望者交出印記，星噬者留下自己的名字，卻不再被要求成為第一守護者。", "多年以後，潮汐升起時，沿岸家家點燈。有人接通鄰近航標，有人選擇獨自守著港口；每一盞燈都能自行熄滅。"] },
      new_sea: { title: "越過無星之海", choiceDescription: "打開潮門，帶領居民遷往新海岸，接受舊地貌被洪流改寫。", choiceOutcome: "各聚落沒有接通潮汐網。居民把船隊排成能互相照應的長列，守望者與星噬者一同打開潮門，將洪流引向未命名的海域。", summary: "洪流改寫地貌，居民離開部分舊家園，沿新海岸建立不依賴星錨的文明。", paragraphs: ["潮門打開後，山脈沉入海底，新的島鏈從洪流中升起。居民分批乘船離開維洛斯，帶走潮渠圖、盟約原稿與各自的名字。沒有人能保證新家園安全，但所有人都知道這次遷徙由自己決定。", "弗蕾亞留在船隊中照看傷者，英格瓦和格里姆輪流守夜；阿斯特麗德負責尋找能停泊的岸線。星噬者與守望者沒有留下守門，兩者陪隊伍航行一段後，各自選擇去向。", "第一座新港建成時，居民沒有替它取下永久名字。他們把命名留給後來者，也把是否留下的決定交給每一家人。"] },
      tide_gate: { title: "兩道守門人的回航燈", choiceDescription: "由星噬者與守望者自願守住潮門，居民保留召回與接替兩人的方法。", choiceOutcome: "沿岸聚落決定暫不接通航標。星噬者與守望者共同進入潮門內側，居民把召回刻印分交給各地見證人，任何人都無法獨自延長守門期限。", summary: "星噬者與守望者自願共同守門，居民握有召回兩人的方法，潮門持續接受定期檢查。", paragraphs: ["兩位守護者進入潮門內側前，將召回刻印交給維洛斯與沿岸聚落的見證人。星獸只承諾短期巡守，任何人都不能單方面延長守門期限。", "潮水退去後，居民重建渡口與舊潮渠。弗蕾亞與伊蘭安排定期航行檢查潮門；若兩位守護者要求回家，便由居民推選接替者，而不是讓沉默變成新的封印。", "夜裡，外海亮起兩盞回航燈。門後傳來的聲音不再像求救，而像兩個旅人約好：等下一班船抵達，就一起回港。"] },
      names_returned: { title: "潮聲記得的名字", choiceDescription: "潛入失名回廊，陪星噬者親自取回自己的名字，讓被吞下的記憶回到見證者手中。", choiceOutcome: "星噬者選擇說回自己願意承認的名字。被吞下的微光回到沿岸居民記憶裡，牠失去吞納名字的力量，潮汐之心也不再需要守門者。", summary: "洪流退去，失落名字回到仍記得它們的人手中。星噬者成為凡人，和眾人一起面對沒有盟約保證的未來。", paragraphs: ["星噬者說出名字後，潮心的黑水不再追逐任何人的記憶。洪流散回海床，沒有建立新的中央星錨，也沒有把星噬者留在門後。牠失去了漫長歲月累積的力量，卻第一次能在潮聲裡分辨自己的呼吸。", "瑟恩將口述證詞與舊盟約並列抄錄，讓每一個名字都附有見證者，也保留本人日後收回記錄的權利。守望者把印記交給居民議盟，自己不再替沉默作解釋。", "幾個月後，星噬者以旅人的身分回到維洛斯。居民沒有替牠立像，只在渡口留下一張空白名牌，等牠決定是否刻上自己的名字。海潮仍會漲落，但它不再替任何人保管記憶。"] },
      name_kept: { title: "潮路之上的自願守望", choiceDescription: "讓星噬者保留名字與力量，把洪流導向無人海溝，由沿岸聚落共同維護潮路。", choiceOutcome: "星噬者親口說出自己的名字，選擇保留記憶與潮心力量。牠將洪流引向無人海溝，但拒絕獨自承擔永久守望；沿岸聚落與星獸共同監測潮路，並保有隨時中止的權利。", summary: "洪流被引離沿岸，星噬者仍保有力量與自我。新的潮路需要眾人輪值維護，也能由聚落共同決議停止。", paragraphs: ["星噬者說出名字，卻沒有讓名字離開自己。黑潮沿著牠手臂退去，潮心深處顯出一條通往無人海溝的舊潮路。牠以自己的意志引導洪流遠離維洛斯，沒有把任何居民的名字當作燃料。", "潮路並不穩定。每次大潮之前，居民議盟、星獸與星噬者都要共同檢查；若牠感到力量正在吞沒自我，或沿岸有人撤回同意，航標便會切斷潮路，所有人改走撤離方案。星噬者保留力量，卻不再被稱作唯一的守門者。", "翌年第一場潮汐來臨，星噬者和一支由居民組成的巡航隊站在海堤上。牠報出自己的名字，眾人也逐一回應。潮聲仍然危險，但從此沒有人需要獨自承受它。"] },
      shared_stars: { title: "群星共記的真名", choiceDescription: "在證據、信任與居民同意齊備時，讓星噬者說出被盟約抹去的真名，並把潮心力量分散成自願接通的星標。", choiceOutcome: "航標拓印、沿岸口述與星噬者本人的記憶終於互相印證。牠第一次說出真正的名字：「阿斯忒洛斯」。潮心的光分成許多星標，各聚落自行決定是否接通；牠保有力量與離去的自由，洪流也不再由單一守護者承受。", summary: "只有在舊證據、居民見證與星噬者信任同時具備時，牠才說出被盟約抹去的真名「阿斯忒洛斯」。潮心力量分散為各地自願接通的星標，星噬者不再被迫獨自守護洪流。", paragraphs: ["航標拓印、盟約證詞與居民口述在潮心中重合。被刮去的音節不再像命令，而像一個人終於能自行取回的記憶。星噬者望向沿岸傳來的燈火，確認每一處都願意聽見後，才說出自己的真名：「阿斯忒洛斯。」", "名字落下，潮心的光分成數十道細小星火，越過海牆與島鏈，落在願意接納它們的港口。沒有任何一處成為中心，也沒有任何一個名字被刻成命令。洪流沿著星火間的空隙退向外海；各港口可以自行接通或熄滅星標，不會拖垮其他航路。", "星噬者保留自己的力量與離去的自由，星獸輪流巡看海面，守望者只負責傳遞警訊。多年後，航海者仍沿著群星辨認潮路；完整的真名則由星噬者親自決定要告訴誰。"] }
    }
  },
  chapterSix: {
    title: "七約殘響",
    stages: {
      arrival: {
        title: "浮在星圖之外的聖所",
        clock: "七約聖所・入口",
        paragraphs: [
          "燈塔航船沿著古鏡留下的航線前進，穿過被刮除的星域，抵達一座懸浮於星圖之外的聖所。六尊星獸石像環繞入口，中央另有一枚被鑿損的印記座；那不是第七隻神獸，而是曾用來封存名字的歸名之印。",
          { text: "你們追著假星航行，星噬者仍在後方吞沒遠處的星域。", when: { path: "chapterFiveLensChoice", equals: "decoy_star" } },
          { text: "黑潮裡甦醒的是第一守護者的記憶殘響；真正的守望者在聖所入口迎接你們，說明自己是盟約保管者。它也聽見歸名之印裡有回聲，卻不把那聲音認作自己的。", when: { path: "chapterFiveLensChoice", equals: "answer_name" } },
          { text: "你們沿著星噬者留下的航跡抵達聖所。入口前的守望者自稱盟約保管者，指出中央印記的名字曾遭封存，卻未說明自己是否改寫過盟約。", when: { path: "chapterFiveLensChoice", equals: "decoy_star" } },
          { speaker: "瑟恩・遺名", text: "這裡記錄六位星獸與第一守護者立下的盟約。中央的印記座被鑿損了；那是歸名之印，不是第七隻神獸的席位。" },
          { speaker: "法芙娜・暗瞳", text: "星噬者正在靠近。聖所深處有星錨與盟約檔案，兩處都需要人手；我們不能同時全部顧到。" },
          "你們先決定沿著哪一道線索進入聖所。"
        ],
        choices: [
          { id: "follow_echo", title: "循第一守護者的殘響前進", description: "讓守望者帶路，先接近殘響指向的中央歸名之印。", outcome: "你們循著第一守護者的殘響穿過聖所外環。守望者以保管者身分帶路；每靠近中央印記一步，黑霧便退開一步，封存的名字也更清晰。", nextGoal: "找出星錨與盟約檔案，避免聖所崩解", effects: [{ op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] },
          { id: "follow_marks", title: "沿著被刮除的盟約刻痕前進", description: "先查明保管者留下的記錄，再接近歸名之印。", outcome: "瑟恩和法芙娜沿著牆面尋找刻痕。那些刮痕不只是警告，也包括中止的名字；越接近聖所中心，越能看出有人試圖抹去第一守護者曾參與盟約的證據。", nextGoal: "找出星錨與盟約檔案，避免聖所崩解", effects: [{ op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "stats.insight", value: 1, max: 3 }] }
        ]
      },
      split: {
        title: "兩條旁支，一段倒數",
        clock: "七約聖所・分岔廊",
        paragraphs: [
          "聖所中央的地板裂成兩道斜坡。一側通往星錨工坊，錨鏈已從牆上脫落；另一側通往盟約檔案室，門縫裡傳出刮石般的聲音。每次震動，頭頂的石像就會掉下一片碎屑。",
          { text: "守望者的回聲暫時壓住黑霧，但聖所正從內部崩解。", when: { path: "chapterSixApproachChoice", equals: "follow_echo" } },
          { text: "刻痕指出歸名之印曾被刻意破壞，震動也讓更多舊字浮現。", when: { path: "chapterSixApproachChoice", equals: "follow_marks" } },
          { speaker: "英格瓦・龍心", text: "弗蕾亞和我會留在你身邊。其他人可以分成兩組，先把一條線索處理好，再回來會合。" },
          { speaker: "阿斯特麗德・龍怒", text: "我和格里姆可以去星錨工坊。那裡需要速度和能扛住回震的人。" },
          { speaker: "瑟恩・遺名", text: "我和法芙娜去檔案室。若名字真的被刮掉，裡面一定還留著痕跡。" },
          "兩處都必須有人處理，但隊伍不能全員分成兩支。選擇誰去執行旁支任務，留下的人便由你帶領處理另一處；分隊途中會失去聯絡，彼此只知道對方已出發。"
        ],
        choices: [
          { id: "anchor_team", title: "派阿斯特麗德與格里姆修復星錨", description: "兩人前往工坊；你帶英格瓦與弗蕾亞進檔案室，通訊中斷時需各自完成任務。", outcome: "阿斯特麗德與格里姆前往星錨工坊。你帶英格瓦、弗蕾亞進入檔案室；兩邊以約定的三短一長訊號報平安，但在聖所震動加劇後失去聯絡。", nextGoal: "完成檔案室調查，與星錨工坊小隊會合", effects: [{ op: "inc", path: "trust.astrid", value: 1, max: 3 }, { op: "inc", path: "trust.grimm", value: 1, max: 3 }] },
          { id: "archive_team", title: "派法芙娜與瑟恩尋回被刮去的盟約", description: "兩人前往檔案室；你帶英格瓦與弗蕾亞穩住星錨，通訊中斷時需各自完成任務。", outcome: "法芙娜與瑟恩帶著殘缺名冊進入檔案室。你帶英格瓦、弗蕾亞前往星錨工坊；兩邊以約定的三短一長訊號報平安，但在聖所震動加劇後失去聯絡。", nextGoal: "穩住星錨，與檔案室小隊會合", effects: [{ op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }] }
        ]
      },
      revelation: {
        title: "被刮掉的不是名字，是罪證",
        clock: "七約聖所・盟約內室",
        paragraphs: [
          "你帶領留守的同伴完成另一處任務，分隊同伴則從另一側發出三短一長的會合信號。兩邊都取得了線索，但直到會合前，你們無法核對對方究竟發現什麼。",
          { text: "阿斯特麗德和格里姆傳回訊息：主鏈重新咬合，錨鏈裡還卡著一枚刻有無名記號的黑色石片。它證明封印曾透過星錨運作，卻不足以判定誰同意了什麼。", when: { path: "chapterSixDispatchChoice", equals: "anchor_team" } },
          { text: "法芙娜和瑟恩傳回盟約原稿：六位星獸同意暫時封存一場失控災變，原稿卻缺少最後的具名頁，無法證明封存對象是否同意，也看不出後來是誰改動條文。", when: { path: "chapterSixDispatchChoice", equals: "archive_team" } },
          "聖所震動暫歇。守望者站在空席之外，說明自己是盟約的保管者，並非第七位星獸。六位星獸共同造出的歸名之印是一套機制；原本的第一守護者曾以自己的名字承受封印，後來失名成為星噬者。守望者承認自己保管過遭改動的盟約，卻沒有說明自己是否參與改寫；完整證據仍缺一角。遠方傳來三短一長的會合信號，派出的同伴只帶回了他們那一路取得的線索。",
          { speaker: "格里姆・破裂之鱗", text: "所以這些年它吞下那些名字，是想把自己拼回來？" },
          { speaker: "瑟恩・遺名", text: "也可能是想找人記得它。可一旦還名，封印也會一起鬆開。" },
          "你們可以把已取得的證據告訴守望者，要求它交代改約經過；也可以先不揭露尚未核實的部分。第一守護者的名字仍在封印中，眼下還不能直接歸還。"
        ],
        choices: [
          { id: "tell_truth", title: "要求守望者交代它改寫盟約的經過", description: "公開手上的證據，讓保管者說明自己做過的事；證據缺頁仍待查證。", outcome: "你們把手上的錨片或原稿放在空席前。守望者承認自己把暫時封存改成永久抹名，卻說不出六位星獸是否曾知情同意。它答應交出仍封存的記憶，讓你們在後續核實。", nextGoal: "穩住聖所，前往沉眠星群補齊盟約缺頁", effects: [{ op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }] },
          { id: "withhold_truth", title: "先封存證據，暫不與守望者對質", description: "在星錨與原稿尚未交叉核實前，避免以單一線索定罪。", outcome: "你們暫時不公開手上的證據，只要求守望者協助穩住聖所。瑟恩與法芙娜各自保存已取得的記錄；守望者察覺仍有未說明之處，但同意等證據補齊後再作證。", nextGoal: "穩住聖所，前往沉眠星群補齊盟約缺頁", effects: [{ op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] }
        ]
      },
      heart: {
        title: "歸名之印等待的回答",
        clock: "七約聖所・心室",
        paragraphs: [
          "聖所心室的六座星獸石席與中央歸名之印一同亮起。印記不是一位星獸，也不是守望者的席位；它原本用來讓六獸共同保管第一守護者的名字。星錨勉強穩住崩裂的浮島。若啟動印記，封印中的名字會開始回應，但完整記憶仍須日後取回。",
          { text: "會合信號響起，阿斯特麗德與格里姆趕回心室。修好的主鏈穩住浮島，足以承受名字回歸時的震盪。", when: { path: "chapterSixDispatchChoice", equals: "anchor_team" } },
          { text: "瑟恩與法芙娜趕回心室，將盟約殘頁帶來；它證明六獸同意暫時封存，卻沒有守望者或第一守護者同意永久抹名的記錄。", when: { path: "chapterSixDispatchChoice", equals: "archive_team" } },
          { text: "守望者已承認改寫盟約，並同意交出封存記憶以供核對。", when: { path: "chapterSixTruthChoice", equals: "tell_truth" } },
          { text: "你們尚未對質；守望者只協助穩住聖所，手上的證據仍由同伴分別保管。", when: { path: "chapterSixTruthChoice", equals: "withhold_truth" } },
          { speaker: "法芙娜・暗瞳", text: "我們現在知道它不是無辜，也不是單純的怪物。問題是：它願不願意再次承擔封印，而我們敢不敢讓它選。" },
          "最後的抉擇將決定是否啟動歸名之印，讓封存的名字開始回應；它不會替第一守護者決定是否歸隊。"
        ],
        choices: [
          { id: "restore_seventh", title: "啟動歸名之印，讓第一守護者聽見自己的名字", description: "先恢復名字的回聲，不宣稱記憶已完整，也不要求它承擔封印。", outcome: "你們以六獸留下的印記喚回第一守護者的名字回聲。守望者只負責開啟自己保管的記錄，並未取代當事者作答。封印因此鬆動，星噬者開始回應；是否接受名字、取回記憶或重返盟約，都留待它本人決定。", nextGoal: "帶著名字回聲前往沉眠星群，尋求六獸同意並補齊記憶", effects: [{ op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] },
          { id: "keep_seventh_empty", title: "讓歸名之印維持休眠", description: "先保留封印，等六位星獸與第一守護者都能參與決定。", outcome: "你們沒有啟動歸名之印，只把已取得的記錄刻在六席之間。守望者繼續保管印記，但不再隱瞞它的存在；第一守護者的名字仍封在星海裂口，星噬者也仍未能被完整辨認。", nextGoal: "前往沉眠星群，尋求六獸同意並補齊盟約缺頁", effects: [{ op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "trust.freya", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] }
        ]
      }
    },
    finales: {
      restore_seventh: {
        title: "歸名之印重新回應",
        summary: "第一守護者的名字回聲重新出現，守望者仍是盟約保管者，六位星獸尚未完成共同同意。沉星潮沒有消失，但終於有了能被追查的方向。",
        hook: "下一步：尋找六位星獸，核實盟約並補回第一守護者的記憶。",
        paragraphs: [
          "歸名之印啟動時，聖所深處傳出六道不同的回響。那只是第一守護者名字的回聲，並未解除封印，也未替六位星獸作出同意。",
          { text: "阿斯特麗德和格里姆修好的星錨穩穩扣住浮島，讓六座石席與中央印記不再互相撕扯。", when: { path: "chapterSixDispatchChoice", equals: "anchor_team" } },
          { text: "瑟恩與法芙娜保存的殘頁證明印記曾被改動；第一守護者是否同意仍未有答案。", when: { path: "chapterSixDispatchChoice", equals: "archive_team" } },
          { speaker: "守望者", text: "我會把原稿交給你們。至於那個名字的主人是否願意回來，不能再由我替它回答。" },
          "遠方六道星獸星座依序亮起。牠們沒有立刻答應重立盟約，只在星圖上留下六個可供尋訪的方向。你們帶著仍在保管記錄的守望者，踏上尋找星獸與第一守護者的旅程。"
        ]
      },
      keep_seventh_empty: {
        title: "空席上的共同誓言",
        summary: "你們讓歸名之印維持休眠，並公開記錄封印與改約的線索。第一守護者仍被封存，守望者則繼續保管尚待核實的原稿。",
        hook: "下一步：尋找六大神獸與其他盟約見證者，找到共同解除封印的方法。",
        paragraphs: [
          "中央印記座依然休眠，但它不再被鑿去，也不再被遮住。每個人都能看見那道空痕，知道它曾經封存第一守護者的名字。",
          { text: "阿斯特麗德和格里姆留下修好的星錨，讓聖所能在封印鬆動時繼續浮在星海。", when: { path: "chapterSixDispatchChoice", equals: "anchor_team" } },
          { text: "法芙娜和瑟恩把盟約原稿公開刻在七席之間，再沒有人能輕易刮去那段歷史。", when: { path: "chapterSixDispatchChoice", equals: "archive_team" } },
          { speaker: "守望者", text: "我會守住這份記錄。等你們找到第一守護者，再由它自己決定要不要取回名字。" },
          "聖所重新啟航，朝著六大神獸沉睡的星域前進。你們尚未解開封印，卻已讓下一次選擇不再只由一個人承擔。"
        ]
      }
    }
  },
  chapterSeven: {
    title: "沉眠星群",
    stages: {
      arrival: {
        title: "六座沉睡的星座",
        clock: "沉眠星群・外環",
        paragraphs: [
          "七約聖所的航線帶你們穿過星海，抵達一片漂浮著群山的夜空。六道巨大的獸形星座沉在雲層之下，像是連星辰也在它們的呼吸間明滅。最靠近你們的一座，正反覆傳來微弱的夢中呼喚。",
          { text: "歸名之印已喚回第一守護者的名字回聲。守望者仍以保管者身分同行，不能替當事者接受名字。", when: { path: "chapterSixCovenantChoice", equals: "restore_seventh" } },
          { text: "歸名之印仍休眠，守望者留在聖所看守封存記錄；你們依星圖尋找六位星獸。", when: { path: "chapterSixCovenantChoice", equals: "keep_seventh_empty" } },
          { text: "阿斯特麗德和格里姆修好的星錨讓航船能穿過浮山間的亂流。", when: { path: "chapterSixDispatchChoice", equals: "anchor_team" } },
          { text: "瑟恩與法芙娜保存的原稿，指出這裡是盟約刻意避開的第一座沉眠之地。", when: { path: "chapterSixDispatchChoice", equals: "archive_team" } },
          { speaker: "瑟恩・遺名", text: "盟約沒有寫著要喚醒它們，只記下六個相互指引的方向。第一步由誰決定，後面的星路就會跟著改變。" },
          "你們可以回應夢中的呼喚，也可以依照盟約留下的星圖安靜接近。"
        ],
        choices: [
          { id: "follow_call", title: "回應沉睡者的呼喚", description: "讓守望者或隊伍向夢境發出回音，確認對方是否願意醒來。", outcome: "你們以自己的名字回應那陣呼喚。雲層下的星獸微微睜眼，整片星群同時亮起；更遠處也有某種沉重的存在轉向了你們。", nextGoal: "通過沉眠者設下的夢門", effects: [{ op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] },
          { id: "follow_witnesses", title: "依照盟約星圖靜默接近", description: "先沿著六座星座的見證路徑前進，避免驚動整片沉眠星群。", outcome: "你們關掉船上的星燈，沿著舊盟約標出的暗流靠近。最近的星獸沒有睜眼，但一條通往夢門的石階從雲底慢慢升起。", nextGoal: "通過沉眠者設下的夢門", effects: [{ op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "stats.insight", value: 1, max: 3 }] }
        ]
      },
      threshold: {
        title: "夢門只記得失去的人",
        clock: "沉眠星群・夢門",
        paragraphs: [
          "夢門立在浮山邊緣，門面像一層凝住的水。每個人靠近時，水面都映出一段被遺忘的記憶；只有門中央始終映著一張空白的面孔。",
          { text: "回應呼喚後，夢門已經記住你們的名字，卻把守望者的倒影留在門外。", when: { path: "chapterSevenApproachChoice", equals: "follow_call" } },
          { text: "靜默航行讓夢門仍保持沉睡，只有一段盟約殘句浮在水面。", when: { path: "chapterSevenApproachChoice", equals: "follow_witnesses" } },
          { text: "歸名之印已回應，但它不會讓守望者代替第一守護者承接記憶；夢門仍需由在場者決定如何分擔。", when: { path: "chapterSixCovenantChoice", equals: "restore_seventh" } },
          { text: "歸名之印仍休眠，夢門只能由同行者共同承擔它映出的記憶。", when: { path: "chapterSixCovenantChoice", equals: "keep_seventh_empty" } },
          { speaker: "弗蕾亞・龍脈", text: "門不是要我們證明自己勇敢。它在問：有沒有哪段記憶，我們願意替別人一起承受？" },
          "選擇讓守望者承接夢境，或由隊伍共同走入記憶。"
        ],
        choices: [
          { id: "guardian_dream", title: "讓守望者獨自承接夢境", description: "由它以保管者的權限開啟夢門，隊伍保留完整心神。", outcome: "守望者踏入水面，門裡立刻浮現六道獸形記憶。它咬緊牙關，把那些夢境一一接住；門開了，但歸名之印的回聲又暗了一筆。", nextGoal: "進入第一座沉眠者的記憶，找出盟約沒有記錄的部分", effects: [{ op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] },
          { id: "shared_dream", title: "由隊伍共同走入夢境", description: "每個人分擔一段回憶，不讓任何一位同伴獨自承受。", outcome: "你們手牽著手踏進水面。夢門把六段記憶分給六名同行者，誰也沒有被單獨留下；夢境因此完整顯現，卻也讓沉眠星群全都聽見了你們的名字。", nextGoal: "進入第一座沉眠者的記憶，找出盟約沒有記錄的部分", effects: [{ op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "trust.freya", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] }
        ]
      },
      memory: {
        title: "歸名之印封存的真相",
        clock: "沉眠星群・記憶之庭",
        paragraphs: [
          "第一位星獸沉在記憶之庭中央，銀白鱗甲像整片夜空覆在牠身上。回憶裡，六位星獸與第一守護者曾共同立約；守望者站在盟約之外，負責保管記錄。另有一道被誤認為第七席的刻痕，其實是六獸共同創造的歸名之印，不是生物或盟約成員。",
          { text: "守望者獨自承接夢境，回憶裡浮現它曾保管、卻未曾看守過的第一守護者身影。", when: { path: "chapterSevenThresholdChoice", equals: "guardian_dream" } },
          { text: "隊伍共同承擔記憶，六道身影首次同時說出那枚印記的用途。", when: { path: "chapterSevenThresholdChoice", equals: "shared_dream" } },
          { text: "第六章修復的星錨證明，歸名之印曾沿主鏈暫時封存第一守護者的名字。", when: { path: "chapterSixDispatchChoice", equals: "anchor_team" } },
          { text: "第六章保存的盟約原稿證明，六大神獸並未寫下守望者是唯一承擔者。", when: { path: "chapterSixDispatchChoice", equals: "archive_team" } },
          "第一位星獸透過夢境確認：星噬者原是第一守護者，名字被封進歸名之印；守望者只是保管印記的人，後來卻擅自改寫盟約，把暫時封存變成永久抹名。六獸共同造印，不代表牠們同意永久封存。",
          { text: "先前回應過呼喚的星獸仍記得你們的名字；如今牠選擇用夢聲協助查證，而非被迫維持清醒。", when: { path: "chapterSevenApproachChoice", equals: "follow_call" } },
          { speaker: "法芙娜・暗瞳", text: "印記是工具，守望者是保管者，星噬者才是被封住名字的人。三者不能再混成同一個第七席。" },
          "你們可以把這段真相告訴沉眠者，也可以先尋找其他星獸，確認它們是否願意共同承擔。"
        ],
        choices: [
          { id: "reveal_seal", title: "立刻公開歸名之印的真相", description: "讓第一位醒來的星獸有權決定是否加入新的盟約。", outcome: "你們當著星獸的面說出第七道印記真正的用途。它沉默很久，接著把一枚銀色鱗片交給你們：那是足以喚醒同伴的信物，但使用後，六道沉眠中的名字都會向星噬者發出回聲。", nextGoal: "抵達星獸心室，決定如何處理第一枚歸名鱗片", effects: [{ op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "stats.insight", value: 1, max: 3 }] },
          { id: "seek_consent", title: "先尋找其他星獸，再共同確認真相", description: "不把第一位醒來者的決定當成六者的答案。", outcome: "你們沒有急著要求星獸交出鱗片，而是承諾帶著真相去找它的同伴。星獸仍把一枚未啟動的鱗片交給你們，並提醒：只要有一位不同意，印記就不能再由少數人替所有人決定。", nextGoal: "抵達星獸心室，決定如何處理第一枚歸名鱗片", effects: [{ op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "trust.freya", value: 1, max: 3 }] }
        ]
      },
      heart: {
        title: "第一枚歸名鱗片",
        clock: "沉眠星群・星獸心室",
        paragraphs: [
          "銀色鱗片懸在星獸心室上方，邊緣映出尚未甦醒的五道星座。它能喚醒第一位星獸，也能把歸名之印的回聲傳給其餘星獸；守望者不能把自己的名字放進印記代替任何人作答。",
          { text: "公開真相後，星獸交出能喚醒同伴的鱗片，也說明啟動會暴露六道名字。", when: { path: "chapterSevenMemoryChoice", equals: "reveal_seal" } },
          { text: "你們承諾等待共同同意，星獸交出未啟動的鱗片，並把選擇權留給六者。", when: { path: "chapterSevenMemoryChoice", equals: "seek_consent" } },
          { text: "夢門裡的記憶由守望者獨自承接；歸名之印的回聲因此再次變淡。", when: { path: "chapterSevenThresholdChoice", equals: "guardian_dream" } },
          { text: "隊伍共同承擔夢境，六名同行者都保留了完整記憶。", when: { path: "chapterSevenThresholdChoice", equals: "shared_dream" } },
          { speaker: "英格瓦・龍心", text: "如果現在喚醒它們，敵人也會聽見；如果不喚醒，就要讓它們自己決定何時承擔風險。" },
          "你們要現在喚醒第一位星獸，或保留鱗片，等待六者共同選擇。"
        ],
        choices: [
          { id: "wake_first", title: "喚醒第一位星獸，讓它選擇盟約", description: "接受名字會暴露給星噬者，換取一位真正參與決定的盟友。", outcome: "你們將歸名鱗片嵌入星獸的心室。它甦醒後沒有立刻宣誓，而是先說出自己的名字，再答應與你們一同尋找其他五位同伴。遠方的星噬者也聽見了這道聲音，朝沉眠星群轉向。", nextGoal: "在星噬者抵達前，尋找另外五位星獸並取得共同同意", effects: [{ op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "trust.grimm", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] },
          { id: "keep_dreaming", title: "保留鱗片，等待六位星獸共同決定", description: "不替沉睡者作出選擇，先尋找能安全召集它們的方法。", outcome: "你們把未啟動的鱗片放回心室，並將真相刻在庭院外，讓每位星獸醒來時都能看見。第一位星獸仍在沉睡，但它的夢境不再孤單；星噬者暫時沒有追上你們，尋找共同同意的方法成了下一段旅程。", nextGoal: "尋找能安全喚醒並召集六位星獸的方法", effects: [{ op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] }
        ]
      }
    },
    finales: {
      wake_first: {
        title: "第一道星名甦醒",
        summary: "第一位星獸短暫醒來並確認自己的名字，隨後以夢聲陪伴旅程。星噬者已聽見甦醒的回聲，剩下五位星獸的選擇也將決定新盟約能否成立。",
        hook: "下一步：趕在星噬者之前找到其餘五位星獸，讓它們親自選擇是否立約。",
        paragraphs: [
          "銀色鱗片亮起時，第一座沉睡星座從雲底升到夜空。星獸短暫甦醒，說出自己的名字，確認印記中的回聲確實屬於第一守護者；牠沒有替同伴立約，隨後便重新沉入夢境。",
          { text: "歸名之印已喚回名字的回聲；第一位星獸確認來源，仍未替其餘五位同伴答應任何盟約。", when: { path: "chapterSixCovenantChoice", equals: "restore_seventh" } },
          { text: "歸名之印仍休眠；星獸只留下可供日後核實的夢中記憶。", when: { path: "chapterSixCovenantChoice", equals: "keep_seventh_empty" } },
          { text: "你們已向星獸公開真相；它帶著知情的選擇加入旅程。", when: { path: "chapterSevenMemoryChoice", equals: "reveal_seal" } },
          { text: "星獸只同意先尋找其他同伴，新的盟約仍需要六者逐一作答。", when: { path: "chapterSevenMemoryChoice", equals: "seek_consent" } },
          "遠處五道沉睡星座同時亮起，又在黑暗逼近時熄滅。星噬者正在追來，而第一位甦醒的星獸已走在你們身旁。"
        ]
      },
      keep_dreaming: {
        title: "仍在夢中的盟約",
        summary: "第一位星獸繼續沉睡，歸名鱗片與真相被公開保存。你們選擇讓六位星獸共同決定盟約，而不是替它們作答。",
        hook: "下一步：尋找安全喚醒六位星獸的方法，並在星噬者抵達前召集它們。",
        paragraphs: [
          "第一座星座緩緩沉回雲層，未啟動的鱗片留在庭院中央。它沒有成為新的盟約印記，也沒有被任何人帶走。",
          { text: "歸名之印已喚回第一守護者的名字回聲，但牠仍未醒來或作答。", when: { path: "chapterSixCovenantChoice", equals: "restore_seventh" } },
          { text: "歸名之印依然休眠；六位星獸各自保有醒來與否的選擇。", when: { path: "chapterSixCovenantChoice", equals: "keep_seventh_empty" } },
          "你們帶著未啟動的鱗片離開心室。沉眠星群仍在呼吸，星噬者的影子也仍在遠方；這一次，至少沒有人被迫獨自承擔整個盟約。"
        ]
      }
    }
  },
  chapterEight: {
    title: "裂星前夜",
    stages: {
      return: {
        title: "兩路歸航",
        clock: "沉眠星群・歸航港",
        paragraphs: [
          "沉眠星群的外環剛亮起第一線晨光，第六章分頭執行任務的同伴便在歸航港攤開一路帶回的成果。修好的星錨石片與盟約原稿經過反覆校對，終於拼出此前未能確認的最後一層意思。",
          { text: "阿斯特麗德和格里姆先行抵達。他們修復了星錨主鏈，卻發現鏈節上刻著星噬者最初的名字。", when: { path: "chapterSixDispatchChoice", equals: "anchor_team" } },
          { text: "法芙娜與瑟恩帶著盟約原稿歸來。原稿記錄六獸同意暫時封存無名之潮，卻沒有證明牠們同意永久抹去第一守護者的名字。", when: { path: "chapterSixDispatchChoice", equals: "archive_team" } },
          { text: "第一位星獸已經醒來，牠的星名在港口上空化成一道引路光。", when: { path: "chapterSevenHeartChoice", equals: "wake_first" } },
          { text: "第一位星獸已重新沉眠；牠的夢境透過未啟動的鱗片傳來新的回聲。", when: { path: "chapterSevenHeartChoice", equals: "keep_dreaming" } },
          { speaker: "阿斯特麗德・龍怒", text: "我們以為只是把零件修好。現在看來，那條鏈一直拴著某個不該被忘掉的人。" },
          "你們必須決定先讓所有人看見任務成果，還是先沿著星錨找到那個名字。"
        ],
        choices: [
          { id: "share_findings", title: "公開兩支隊伍帶回的成果", description: "讓所有同伴一起判讀星錨與原稿，避免再由少數人決定盟約。", outcome: "你們把星錨石片與盟約原稿並排放上桌。不同版本的刻痕彼此吻合：星噬者曾被六獸稱作「無名之潮」，而封印把它的記憶、名字與痛苦一併抹去。", nextGoal: "在星噬者抵達前，找出能承載眾人記憶的地方", effects: [{ op: "inc", path: "trust.astrid", value: 1, max: 3 }, { op: "inc", path: "trust.grimm", value: 1, max: 3 }, { op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] },
          { id: "trace_name", title: "先循星錨刻痕追查名字", description: "趁星噬者尚未逼近，確認它的名字與沉眠星群的關係。", outcome: "格里姆將星錨石片嵌回主鏈，瑟恩則用原稿校對浮現的刻痕。兩份證據指向同一段被刪除的記憶：星噬者曾替六獸承受第一次元素潰堤，後來卻被盟約當成災變本身封存。", nextGoal: "在星噬者抵達前，找出能承載眾人記憶的地方", effects: [{ op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "trust.grimm", value: 1, max: 3 }, { op: "inc", path: "stats.insight", value: 1, max: 3 }] }
        ]
      },
      refuge: {
        title: "記憶該由誰保管",
        clock: "沉眠星群・共夢廊道",
        paragraphs: [
          "歸航港的地圖在桌面上自行展開，星錨的主鏈與盟約原稿共同指向一座被雲海掩埋的共夢廊道。那裡曾讓六位星獸共享記憶，也是唯一可能接住星噬者全部回憶的地方。",
          { text: "公開成果後，所有同伴都能讀懂刻痕；沒有人再需要獨自猜測它的代價。", when: { path: "chapterEightReturnChoice", equals: "share_findings" } },
          { text: "先追查名字讓你們搶得時間，但部分原稿仍由瑟恩與法芙娜保管。", when: { path: "chapterEightReturnChoice", equals: "trace_name" } },
          { text: "名字回聲已出現，但第一守護者的記憶仍未取回；守望者交出自己保管的部分記錄供查驗。", when: { path: "chapterSixCovenantChoice", equals: "restore_seventh" } },
          { text: "歸名之印仍休眠，共夢廊道必須由在場的同伴共同維持。", when: { path: "chapterSixCovenantChoice", equals: "keep_seventh_empty" } },
          { speaker: "法芙娜・暗瞳", text: "如果讓它的記憶回來，我們可能得承認當初封印它的人也有我們熟悉的名字。" },
          "你們可以立刻開啟共夢廊道，也可以先讓第一位星獸或守望者確認其中的風險。"
        ],
        choices: [
          { id: "open_together", title: "由全隊共同開啟廊道", description: "每人承接一段記憶，讓任何人都不必獨自面對星噬者。", outcome: "六名同伴依照星錨刻度站定，守望者與星獸的回聲也加入其中。廊道亮起時，每個人都看見了同一段往事：星噬者曾是七者盟約的第一位守護者。", nextGoal: "前往盟約原址，確認七者當年為何改寫誓約", effects: [{ op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "trust.freya", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] },
          { id: "verify_first", title: "請星獸先驗證記憶來源", description: "避免把封印留下的幻象誤當成完整真相。", outcome: "若第一位星獸已醒來，牠親自辨認出共夢廊道裡的同伴；若牠仍沉睡，未啟動的鱗片便映出六道相同的呼吸。真相得到確認，但星噬者也因此察覺你們正在接近它的名字。", nextGoal: "前往盟約原址，確認七者當年為何改寫誓約", effects: [{ op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "stats.insight", value: 1, max: 3 }] }
        ]
      },
      covenant: {
        title: "七者盟約的缺頁",
        clock: "沉眠星群・盟約原址",
        paragraphs: [
          "共夢廊道盡頭是一座沒有屋頂的圓形石室。七道座位環繞中央空環，六道刻痕記著星獸，第七道卻被新舊兩層文字反覆刮除。",
          { text: "共同開啟廊道後，全隊都記得相同的往事：星噬者曾是第一位守護者。", when: { path: "chapterEightRefugeChoice", equals: "open_together" } },
          { text: "經星獸驗證後，記憶來源已經確認；星噬者也知道你們看見了它的過去。", when: { path: "chapterEightRefugeChoice", equals: "verify_first" } },
          { text: "喚醒第一位星獸的決定，讓盟約原址出現了新的星座刻痕。", when: { path: "chapterSevenHeartChoice", equals: "wake_first" } },
          { text: "保留沉睡者的選擇使石室保持安靜，但第七道刻痕仍無法自行顯現。", when: { path: "chapterSevenHeartChoice", equals: "keep_dreaming" } },
          "缺頁揭開一個更難回答的問題：當年六獸是否真的共同同意封存星噬者，還是有人替所有人寫下了答案？"
        ],
        choices: [
          { id: "restore_record", title: "補回所有被刪除的記錄", description: "即使真相會揭露盟約創立者的錯誤，也讓每個人都能看見完整過去。", outcome: "瑟恩逐字補回缺頁，法芙娜用星光照出被刮掉的名字。六獸曾一致同意封存無名之潮，卻沒有同意永遠抹去它；誓約後來被守望者獨自改寫，才把暫時封印變成永久遺忘。", nextGoal: "趕往星海裂口，決定如何面對即將到來的星噬者", effects: [{ op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "trust.eilan", value: 1, max: 3 }, { op: "inc", path: "stats.insight", value: 1, max: 3 }] },
          { id: "protect_witness", title: "先保護盟約見證者的名字", description: "星噬者正追蹤你們，先確保記錄與同行者不會再次被抹除。", outcome: "伊蘭以古鏡封住石室入口，英格瓦與格里姆護送記錄離開。你們暫時沒有公開缺頁內容，但每一位同伴都親手保存了一段原文，星噬者再也無法一次抹去所有證據。", nextGoal: "趕往星海裂口，決定如何面對即將到來的星噬者", effects: [{ op: "inc", path: "trust.eilan", value: 1, max: 3 }, { op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] }
        ]
      },
      rift: {
        title: "星噬者抵達之前",
        clock: "沉眠星群・星海裂口",
        paragraphs: [
          "星海裂口正在群山上方擴大，六座星獸星座逐一映在裂隙深處。星噬者尚未現身，所有星光卻已朝同一處傾斜，像整片天空都在等待它開口。",
          { text: "完整記錄證明，星噬者被封存而非自願離去；守望者補充說明自己改寫盟約的理由。", when: { path: "chapterEightCovenantChoice", equals: "restore_record" } },
          { text: "同伴各自保管記錄，真相暫未公開；被抹去的名字因此多了一層保護。", when: { path: "chapterEightCovenantChoice", equals: "protect_witness" } },
          { text: "第一位星獸已重新沉入夢境，牠的夢聲沿歸名之印傳來，願意以自己的名字呼喚星噬者。", when: { path: "chapterSevenHeartChoice", equals: "wake_first" } },
          { text: "沉睡星獸的夢聲仍在鱗片裡，提醒你們大結局的選擇不能由少數人代替。", when: { path: "chapterSevenHeartChoice", equals: "keep_dreaming" } },
          { speaker: "守望者", text: "我把它的名字從世界上刪掉，以為這樣就能替所有人承受後果。如今它回來了，我不會再替你們決定該如何回答。" },
          "最後的追兵已越過星群外環。你們必須決定在決戰前，以什麼方式迎接星噬者。"
        ],
        choices: [
          { id: "call_by_name", title: "以它原本的名字呼喚它", description: "準備共同承接它的記憶，讓大結局從一次對話開始。", outcome: "六名同伴和守望者一同念出缺頁上的名字。裂口停止擴大，黑暗裡傳來一聲回應；星噬者沒有退去，卻第一次沒有吞沒你們的聲音。決戰將從它現身的那一刻開始。", nextGoal: "在最終章中與星噬者相見，完成新盟約", effects: [{ op: "inc", path: "trust.freya", value: 1, max: 3 }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] },
          { id: "hold_the_rift", title: "先穩住裂口，等待全體星獸回應", description: "延後正面接觸，讓尚未甦醒的星獸也能參與最後決定。", outcome: "阿斯特麗德與格里姆重新扣緊星錨，其他同伴守住各自的刻痕。裂口暫時穩定，六座星獸星座同時亮起回應；星噬者仍在前方，但這一次沒有人必須獨自面對它。", nextGoal: "在最終章中召集星獸，與星噬者共同決定新盟約", effects: [{ op: "inc", path: "trust.astrid", value: 1, max: 3 }, { op: "inc", path: "trust.grimm", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] },
          { id: "solo_anchor", title: "獨自踏進裂口，讓自己成為星錨", description: "不再要求任何同伴替你分擔；把自己的名字交給裂口，替所有人留下一條退路。", outcome: "你沒有等同伴回答，便沿著斷裂的星錨主鏈走進裂口。身後傳來的呼喊逐漸遠去，眼前只剩一條通往星海深處的路。", nextGoal: "沿星錨主鏈深入裂口", effects: [{ op: "set", path: "chapterEightFailureChoice", value: "solo_anchor" }] }
        ]
      }
    },
    finales: {
      call_by_name: {
        title: "被喊回的名字",
        summary: "星噬者聽見自己的名字，並在裂口前停止吞噬星光。它即將現身；隊伍已準備好以完整記憶迎接最終對決。",
        hook: "大結局前哨：找回星噬者的名字，並讓所有星獸親自決定新盟約。",
        paragraphs: [
          "黑暗深處亮起一雙眼睛，星噬者沿著你們喊出的名字走向裂口。它沒有放下力量，也沒有再次吞噬星光，只是問：這一次，你們會記得我是誰嗎？",
          "守望者站到隊伍中央，交出那段被自己封存的記憶。星噬者接過記憶，整片星群隨之震動；真正的決戰已近在眼前。"
        ]
      },
      hold_the_rift: {
        title: "六道星座的回聲",
        summary: "星錨暫時穩住裂口，六座星獸星座都回應了召集。星噬者仍在前方，大結局將從全體星獸共同到場開始。",
        hook: "大結局前哨：集結六位星獸，讓牠們決定如何面對被遺忘的第一位守護者。",
        paragraphs: [
          "六道星光從雲海升起，沿著星錨主鏈匯聚到裂口邊緣。沉睡者沒有被強行喚醒；它們以自己的方式回應了你們留下的名字與記錄。",
          "星噬者在裂口另一端停下。它望著六道回聲，第一次沒有立刻攻擊。下一次相見，所有盟約的參與者都將在場。"
        ]
      }
    },
    failureStages: {
      failureEntry: {
        title: "裂口門前的最後回望",
        clock: "沉眠星群・裂口門前",
        paragraphs: [
          "星錨廣場只剩一道窄窄的安全地面。六座星獸星座在裂口上方閃爍，隊伍已替所有人留好退路；只有你站在通往內側的主鏈前。",
          { speaker: "英格瓦", text: "我們可以一起守住這裡。你不用替所有人把路走完。" },
          "你知道此刻仍能轉身。主鏈另一端的黑暗卻傳來熟悉的脈動，像第一次潰堤前，界碑敲出的那三聲回響。"
        ],
        choices: [
          { id: "enter_rift", title: "不回頭，走進裂口", description: "讓同伴帶著星獸撤離，由你獨自把星錨扣向內側。", outcome: "你把最後一截牽引索交給英格瓦，轉身踏上主鏈。身後的光沒有熄滅，只是再也照不到你前方的路。", nextGoal: "沿著星錨主鏈深入裂口" }
        ]
      },
      failureDescent: {
        title: "裂口內側的歸路",
        clock: "沉眠星群・裂口內側",
        paragraphs: [
          "星錨主鏈在你腳下斷成一節一節。每跨過一道裂縫，身後的星群便少一顆；你知道外面的同伴正在拉住錨鏈，卻再也聽不清他們的聲音。",
          { speaker: "星噬者", text: "你要用自己的名字替他們換一段時間？這條路只會把你帶到我曾經待過的地方。" },
          "裂口深處亮起一條尚未熄滅的銀線，沿著古老主鏈往下延伸。"
        ],
        choices: [
          { id: "follow_chain", title: "沿著主鏈走向最深處", description: "不回頭，找到仍在吞噬星光的源頭。", outcome: "你把手按上冰冷的鏈節，繼續往下走。鏈條記住了你的體溫，卻沒有記住你的名字。", nextGoal: "把星錨主鏈扣回裂口核心" }
        ]
      },
      failureAnchor: {
        title: "星錨最後一節",
        clock: "沉眠星群・主鏈核心",
        paragraphs: [
          "主鏈的最後一節懸在裂口中心。它不是鎖，也不是門，而是曾經讓七位守護者共同承受洪流的錨點；如今只剩你一個人站在它面前。",
          { speaker: "星噬者", text: "我曾以為只要有人留下，其他人就能回家。後來我連自己為誰留下都忘了。" },
          "錨節仍有一道空隙。要讓它重新咬合，必須把一段完整記憶送進去。"
        ],
        choices: [
          { id: "feed_memory", title: "把共同旅程的記憶送入主鏈", description: "讓錨節重新咬合，替外面的星群爭取退離裂口的時間。", outcome: "你一段一段想起同伴的聲音，直到記憶化成銀光流進錨節。裂口停止擴大；與此同時，你再也想不起那些聲音屬於誰。", nextGoal: "在最後一道星門前留下自己的名字" }
        ]
      },
      failureName: {
        title: "無人回答的名字",
        clock: "沉眠星群・無名星門",
        paragraphs: [
          "星門後的洪流暫時退去，錨節卻開始鬆動。門框上浮現一處空白，像是在等待一個能把所有記憶固定下來的名字。",
          { speaker: "星噬者", text: "若你把名字留在這裡，外面的人或許能活下來。但沒有人能替你證明你曾經存在。" },
          "遠方傳來最後一聲呼喚，音節抵達門前時已經散失。"
        ],
        choices: [
          { id: "leave_name", title: "把自己的名字留在星門上", description: "完成主鏈的最後一道刻痕，讓裂口暫時閉合。", outcome: "你把名字按進空白。星門合攏，整片星海重新亮起；而你的名字從每一段記憶裡退去。", nextGoal: "見證星門閉合後的最後一個黎明" }
        ]
      }
    },
    failureFinales: {
      solo_anchor: {
        title: "沒有名字的黎明",
        summary: "調律者以自己的名字和共同記憶扣合星錨，讓星群暫時逃過洪流；裂口仍未真正消失，而所有同伴都失去了尋回調律者的線索。",
        hook: "失敗結局：星海迎來黎明，卻沒有人記得是誰替它留下了這一夜。",
        paragraphs: [
          "星門在你身後閉合。裂口沒有消失，只被主鏈拖入更深的黑暗；外面的星群得以退離，代價是沒有人再記得誰走進了門內。",
          "守望者在門外找到一節仍帶著微光的錨鏈。英格瓦記得有人曾與他並肩，弗蕾亞記得一段沒有姓名的道別，法芙娜則把那個空白留在故事裡，沒有替它補上答案。",
          "遠方的天色亮了。星錨仍在震動，彷彿有人從另一側敲了三下；這一次，沒有人知道該如何回答。"
        ]
      }
    }
  },
  chapterNine: {
    title: "七席將明",
    stages: {
      gathering: {
        title: "星獸的集會",
        clock: "沉眠星群・七席回航殿",
        paragraphs: [
          "星海裂口暫時停在遠方，六道星獸回聲卻沿著星錨主鏈逐一抵達回航殿。第六章離隊執行旁支任務的同伴已帶回修復成果與盟約原稿；第八章拼出的記錄則讓它們終於能對照同一段歷史。",
          { text: "第一位星獸已重新沉入夢境，夢聲沿著歸名之印傳到回航殿；牠沒有替五位同伴作答。", when: { path: "chapterSevenHeartChoice", equals: "wake_first" } },
          { text: "第一位星獸在確認回憶後已重新沉眠；牠的夢聲沿鱗片傳到集會，六道回聲都清楚聽見了。", when: { path: "chapterSevenHeartChoice", equals: "keep_dreaming" } },
          { text: "你們曾公開星錨與盟約成果，記錄此刻放在所有星獸面前。", when: { path: "chapterEightReturnChoice", equals: "share_findings" } },
          { text: "你們曾先循刻痕追查，原稿仍由法芙娜與瑟恩妥善保存，尚未公開的部分也一併帶來。", when: { path: "chapterEightReturnChoice", equals: "trace_name" } },
          { text: "星噬者已聽見自己的名字，跟著你們來到七席前庭；六道星獸回聲正在等它開口。", when: { path: "chapterEightRiftChoice", equals: "call_by_name" } },
          { text: "六位星獸已回應召集，星噬者仍在裂口另一側；這場集會將決定是否讓它靠近。", when: { path: "chapterEightRiftChoice", equals: "hold_the_rift" } },
          "星獸沒有立刻要求喚醒或封印星噬者。牠們先問起守望者：當年那份盟約，究竟是誰替誰作出的決定？",
          "你們可以先讓守望者向所有星獸作證，也可以先由同伴核對六份記憶中的差異。"
        ],
        choices: [
          { id: "guardian_confess", title: "讓守望者當眾說明", description: "由它親口承認曾改寫盟約，接受星獸與隊伍的質問。", outcome: "守望者走到空席前承認：六獸同意的是暫時封存無名之潮，自己卻把它改成永不歸還的誓約。它沒有替自己辯解，只把被刪除的原稿交給星獸。", nextGoal: "確認守望者改寫盟約的原因，以及星噬者真正承受的代價", effects: [{ op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "trust.eilan", value: 1, max: 3 }, { op: "inc", path: "stats.insight", value: 1, max: 3 }] },
          { id: "compare_memories", title: "先核對每位星獸的記憶", description: "不讓任何一份證詞獨自成為定論，逐一找出盟約被改寫的時間。", outcome: "瑟恩把原稿攤開，法芙娜逐段比對六道星獸回聲。大家確認守望者確實改寫了誓約，但原稿也留下另一個空缺：守望者當年相信，只要星噬者被世界遺忘，所有人就能活下來。", nextGoal: "確認守望者改寫盟約的原因，以及星噬者真正承受的代價", effects: [{ op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] }
        ]
      },
      testimony: {
        title: "守望者留下的空白",
        clock: "沉眠星群・記憶裁庭",
        paragraphs: [
          "六道回聲疊成一座記憶裁庭，舊日的盟約在石壁上重演。星噬者並不是六位星獸之一，而是七者盟約的第一位守護者；它曾替眾人承受第一次元素潰堤，最後被封進自己守護的星海裂口。",
          { text: "守望者已在眾人面前承認改寫誓約，星獸要求它說出當年的理由。", when: { path: "chapterNineGatheringChoice", equals: "guardian_confess" } },
          { text: "你們先核對了六份記憶，找到守望者為何相信抹去星噬者能拯救眾人的線索。", when: { path: "chapterNineGatheringChoice", equals: "compare_memories" } },
          { text: "共夢廊道的共同記憶證實星噬者曾是第一位守護者。", when: { path: "chapterEightRefugeChoice", equals: "open_together" } },
          { text: "第一位星獸驗證了記憶來源，星噬者也已察覺你們正在追查它的過去。", when: { path: "chapterEightRefugeChoice", equals: "verify_first" } },
          { text: "盟約原址的完整記錄證明，星獸只同意暫時封存，沒有同意永遠抹去守護者。", when: { path: "chapterEightCovenantChoice", equals: "restore_record" } },
          { text: "你們仍保護著部分原稿；守望者得以說明，抹名是為了讓裂口失去追索它的座標。", when: { path: "chapterEightCovenantChoice", equals: "protect_witness" } },
          { speaker: "守望者", text: "我以為只要它被忘記，裂口就找不到回來的路。我救下了你們，卻也把它困在沒有人能回應的黑暗裡。" },
          "你們可以要求守望者交出封存記憶，也可以先找回星噬者承受的那段災變記憶。"
        ],
        choices: [
          { id: "take_guardian_memory", title: "取回守望者封存的記憶", description: "先知道當年災變如何發生，再決定如何接近星噬者。", outcome: "守望者交出自己的記憶。你們看見它曾和星噬者並肩守住裂口，卻在災變後獨自改寫誓約；那不是命令，而是它在恐懼中作出的錯誤選擇。", nextGoal: "前往裂口內側，找回星噬者失去的最後一段記憶", effects: [{ op: "inc", path: "trust.freya", value: 1, max: 3 }, { op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "stats.insight", value: 1, max: 3 }] },
          { id: "seek_erased_memory", title: "先尋找星噬者被奪走的記憶", description: "讓受害者的經歷先被看見，再判斷守望者應承擔什麼。", outcome: "伊蘭以古鏡追蹤裂口邊緣殘留的記憶，星獸共同穩住鏡面。映出的不是怪物誕生，而是第一位守護者把自己推入裂口、替六獸擋下元素洪流的那一刻。", nextGoal: "前往裂口內側，找回星噬者失去的最後一段記憶", effects: [{ op: "inc", path: "trust.eilan", value: 1, max: 3 }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] }
        ]
      },
      encounter: {
        title: "裂口中的第一位守護者",
        clock: "沉眠星群・裂隙內側",
        paragraphs: [
          "星錨重新扣住裂口邊緣，你們沿著斷裂的主鏈進入星海深處。星噬者在漆黑的回廊盡頭現身，身上每一道裂痕都映著一座曾被它守護的星獸星座。",
          { text: "守望者交出的記憶讓你們看見兩人曾並肩守門；它的悔意此刻也被星噬者聽見。", when: { path: "chapterNineTestimonyChoice", equals: "take_guardian_memory" } },
          { text: "古鏡映出的災變記憶讓星噬者明白，你們先看見了它的犧牲，而不是它被封印後的力量。", when: { path: "chapterNineTestimonyChoice", equals: "seek_erased_memory" } },
          { text: "第一位星獸走在隊伍前方，願意替其他星獸確認它們所聽見的回憶。", when: { path: "chapterSevenHeartChoice", equals: "wake_first" } },
          { text: "星獸仍以回聲相伴，沒有任何一位被迫離開夢境或代替同伴作答。", when: { path: "chapterSevenHeartChoice", equals: "keep_dreaming" } },
          { speaker: "星噬者", text: "你們把我叫回來，卻還不知道我曾經為誰守門。" },
          "星噬者承認自己曾是第一位守護者，卻拒絕立刻回到盟約之中：它不相信一個能被隨意改寫的誓約值得再次守護。",
          "你們可以先交還它的名字與記憶，也可以請它親眼看見星獸如今擁有的選擇權。"
        ],
        choices: [
          { id: "return_name", title: "先交還名字與記憶", description: "不要求它立刻原諒任何人，先把被奪走的身分還給它。", outcome: "你們把原稿上的名字與守望者保存的記憶一併交還。星噬者接住名字，黑色裂痕間亮起第一道金光；它仍不肯回到隊伍，卻答應和你們一起走到六獸面前。", nextGoal: "讓六位星獸與第一位守護者共同選擇新盟約的形式", effects: [{ op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "trust.eilan", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] },
          { id: "show_new_choice", title: "請它親眼見證星獸的選擇", description: "先讓星噬者看見今日的盟約不再由一人替所有人決定。", outcome: "六道星獸回聲逐一向星噬者開口，沒有誰替其他人作答。它看見沉睡者也能拒絕、等待或醒來，終於放下攻擊姿勢，願意親自聽完每一位星獸的回答。", nextGoal: "讓六位星獸與第一位守護者共同選擇新盟約的形式", effects: [{ op: "inc", path: "trust.freya", value: 1, max: 3 }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] }
        ]
      },
      witnesses: {
        title: "六份記憶，一道缺席",
        clock: "沉眠星群・回聲長廊",
        paragraphs: [
          "星噬者暫時與你們同行。回聲長廊連接六座星獸星域，每一道門後都保存著不同版本的第一次元素潰堤；它們共同指向一個事實：當年的勝利來自分擔，而不是抹除某個人。",
          { text: "星噬者已取回名字，願意走到星獸面前；它的記憶仍缺少最後一段。", when: { path: "chapterNineEncounterChoice", equals: "return_name" } },
          { text: "星噬者看見六獸各自作答，雖仍未取回名字，卻願意聽完每份證詞。", when: { path: "chapterNineEncounterChoice", equals: "show_new_choice" } },
          { text: "你們曾選擇公開完整記錄，六獸能直接辨認被刪除的原句。", when: { path: "chapterEightCovenantChoice", equals: "restore_record" } },
          { text: "同伴分別保存的原稿在此拼合，沒有任何一份證據能再被單獨抹去。", when: { path: "chapterEightCovenantChoice", equals: "protect_witness" } },
          "每座星域都要決定要不要交出自己的記憶。你們可以請星獸逐一作證，也可以讓隊伍先承接它們最痛苦的片段。"
        ],
        choices: [
          { id: "beast_testimony", title: "由星獸逐一作證", description: "尊重每位星獸選擇公開或保留記憶的權利。", outcome: "第一位星獸先說出自己的名字，另外五道回聲隨後各自選擇願意公開的片段。牠們的證詞並不完全相同，卻都記得星噬者曾替它們擋下洪流。", nextGoal: "整合分散記憶，準備一場不再抹去任何人的盟約儀式", effects: [{ op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "trust.freya", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] },
          { id: "party_carry", title: "由隊伍先承接痛苦記憶", description: "讓星獸保留選擇是否作證的自由，由同伴承受回憶的重量。", outcome: "你們把記憶分成六份，各自承接一段潰堤當晚的恐懼。星獸不必立刻交出隱私；隊伍卻因此親身感受到星噬者守門時承受的痛苦。", nextGoal: "整合分散記憶，準備一場不再抹去任何人的盟約儀式", effects: [{ op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "trust.grimm", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] }
        ]
      },
      ritual: {
        title: "不再以沉默為代價",
        clock: "沉眠星群・七席環庭",
        paragraphs: [
          "七席環庭的六座星獸石座與中央歸名之印依次亮起，星錨、古鏡、盟約原稿與六份記憶都已到齊。守望者站在印記之外，以保管者身分作證；第一守護者則站在裂口一側，沒有要求誰立刻原諒守望者。",
          { text: "六位星獸各自決定公開記憶的範圍，盟約保留了每一份不同的證詞。", when: { path: "chapterNineWitnessChoice", equals: "beast_testimony" } },
          { text: "隊伍承接了痛苦記憶，讓星獸能在不交出隱私的情況下參與盟約。", when: { path: "chapterNineWitnessChoice", equals: "party_carry" } },
          { text: "阿斯特麗德與格里姆修復的星錨可穩定儀式；若當初追查原稿，刻痕也提供了完整誓詞。", when: { path: "chapterSixDispatchChoice", equals: "anchor_team" } },
          { text: "瑟恩與法芙娜保存的原稿可校正誓詞；若當初修復星錨，主鏈則能承住回聲。", when: { path: "chapterSixDispatchChoice", equals: "archive_team" } },
          "在大結局前，你們必須選擇新盟約以何種方式成立：由六位星獸與第一守護者這七位締約者共同承擔，或先保留所有人的自由，等待完整同意。守望者只作保管與見證。"
        ],
        choices: [
          { id: "shared_oath", title: "立下七位締約者共擔的新誓約", description: "六位星獸與第一守護者共同承擔裂口；守望者以保管者身分見證並保存條文。", outcome: "六位星獸與第一守護者逐一說出願意承擔的部分，守望者只負責記錄與保管；沒有人被要求獻出名字或記憶。新盟約不是命令，而是一連串可以撤回的承諾；星海裂口第一次在七位締約者的同意下穩定下來。", nextGoal: "確認新盟約能否承受最後的星潮，並準備大結局", effects: [{ op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "trust.freya", value: 1, max: 3 }, { op: "inc", path: "trust.eilan", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] },
          { id: "wait_full_consent", title: "暫不立誓，先確保每位星獸都能拒絕", description: "保留盟約之外的選擇權，即使裂口仍須由星錨暫時支撐。", outcome: "你們沒有急著讓七席重新亮滿。星錨先承擔裂口的重量，星獸逐一確認自己仍有拒絕的權利；星噬者答應留下來，直到最後一位同伴準備好。", nextGoal: "在星潮抵達前補齊同意，並準備大結局", effects: [{ op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] }
        ]
      },
      threshold: {
        title: "大結局的門前",
        clock: "沉眠星群・最後星門",
        paragraphs: [
          "最後星門浮現在七席環庭之外，門後就是元素洪流最初撕開天空的地方。星噬者是否取回名字與記憶，取決於它在前一節的選擇；六位星獸也各自作出回答。接下來不會再有盟約替任何人決定結局。",
          { text: "七者已立下可以共同承擔、也能自行撤回的新誓約。", when: { path: "chapterNineRitualChoice", equals: "shared_oath" } },
          { text: "新盟約仍等待完整同意，星錨暫時守住裂口，沒有人被迫加入。", when: { path: "chapterNineRitualChoice", equals: "wait_full_consent" } },
          { text: "星獸已逐一作證，六份記憶由牠們自己決定是否交出。", when: { path: "chapterNineWitnessChoice", equals: "beast_testimony" } },
          { text: "隊伍替星獸承接痛苦記憶；你們將帶著這份重量走進最後星門。", when: { path: "chapterNineWitnessChoice", equals: "party_carry" } },
          "星門前需要最後一次準備：立刻讓星噬者帶隊穿門，或留在此處集結所有同伴，再一起面對最初的潰堤。"
        ],
        choices: [
          { id: "enter_now", title: "與星噬者一同穿過星門", description: "趁裂口穩定，直接前往元素洪流的源頭。", outcome: "星噬者踏入星門，你們跟在它身後。門後的元素洪流像一片倒懸海洋，最初的裂隙正從深處醒來；大結局將在洪流中心展開。", nextGoal: "進入元素洪流源頭，完成星噬者與新盟約的最終抉擇", effects: [{ op: "inc", path: "trust.grimm", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] },
          { id: "gather_all", title: "等所有同伴集結後再穿門", description: "讓星獸、守望者與冒險者小隊全員同行，帶著完整見證進入終局。", outcome: "六道星獸回聲、守望者與整支冒險者小隊在星門前重新會合。最後一次點名時，沒有人替缺席者回答；所有人準備好後，星門才在共同見證下開啟。", nextGoal: "帶全隊進入元素洪流源頭，完成新盟約的最終抉擇", effects: [{ op: "inc", path: "trust.astrid", value: 1, max: 3 }, { op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] }
        ]
      }
    },
    finales: {
      enter_now: {
        title: "直面洪流之心",
        summary: "隊伍與星噬者已進入元素洪流源頭。新盟約的承諾、六獸留下的記憶，以及守望者的錯誤都將在大結局迎來最後答案。",
        hook: "大結局入口：在洪流之心決定星噬者、六位星獸與世界的未來。",
        paragraphs: [
          "星門在你們身後合攏，六道回聲仍在耳邊。前方的洪流中心浮出第一道裂隙，星噬者停在它面前，等候你們決定要修補、分擔，還是讓它徹底改變世界。",
          "沒有任何人再握有替所有人作答的盟約。這一次，每個名字都能親自走到結局面前。"
        ]
      },
      gather_all: {
        title: "全員同行的最後星門",
        summary: "所有冒險者、守望者與星獸回聲都已集結。大結局將在完整隊伍與共同見證下，處理元素潰堤與星噬者的命運。",
        hook: "大結局入口：帶著全員的選擇穿過星門，決定新的世界是否仍需要封印。",
        paragraphs: [
          "星門前，英格瓦、弗蕾亞、法芙娜、阿斯特麗德、格里姆、瑟恩與伊蘭依次報出自己的名字。六道星獸回聲在他們之間亮起，守望者沒有站到最前方，也沒有躲在眾人身後。",
          "星噬者看著這支不再以沉默維持盟約的隊伍，終於踏入洪流。門後的第一道裂隙張開，所有人都在場。"
        ]
      }
    }
  },
  chapterTen: {
    title: "萬象歸潮",
    stages: {
      arrival: {
        title: "洪流源頭",
        clock: "元素洪流・初裂之心",
        paragraphs: [
          "最後星門在身後闔上。元素洪流的源頭像一片倒懸的海，火、風、水與雷電沿著星海裂隙互相吞噬；正中央，一道尚未癒合的裂口映出世界各處的天空。",
          { text: "六位星獸與第一守護者已立下可撤回的新誓約，守望者以保管者身分保存記錄。", when: { path: "chapterNineRitualChoice", equals: "shared_oath" } },
          { text: "盟約仍等待完整同意；星錨暫時支撐裂口，隊伍帶著未完成的誓詞抵達源頭。", when: { path: "chapterNineRitualChoice", equals: "wait_full_consent" } },
          { text: "你們已和星噬者一同進門，牠走在最前方，記憶仍缺少最後一片。", when: { path: "chapterNineThresholdChoice", equals: "enter_now" } },
          { text: "冒險者小隊、守望者與星獸回聲全員同行；沒有人被留在星門之外。", when: { path: "chapterNineThresholdChoice", equals: "gather_all" } },
          "星噬者望向裂口，說出最後一段真相：第一次潰堤並非自然災害，而是六獸、兩位守護者與世界共同承受失衡元素的結果。如今洪流再起，必須有人選擇它將以什麼方式流過世界。"
        ],
        choices: [
          { id: "read_world_signals", title: "先讀取各地傳來的信號", description: "確認世界各處正在承受什麼，再決定如何分配洪流的力量。", outcome: "伊蘭與瑟恩展開星圖，各地信號逐一亮起：邊境村落被水霧包圍，倒懸之城的支柱承受雷暴，無星渡口的燈塔仍在替迷航者指路。你們把每一處求救都標上星圖。", nextGoal: "在洪流擴散前，選擇先保護哪些世界連結", effects: [{ op: "inc", path: "trust.eilan", value: 1, max: 3 }, { op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "stats.insight", value: 1, max: 3 }] },
          { id: "follow_first_ripple", title: "沿著第一道元素脈衝前進", description: "直抵源頭核心，找出洪流為何再次失控。", outcome: "英格瓦與格里姆固定星錨，隊伍沿著第一道脈衝穿過火與風的交界。你們發現裂口並非自行擴張，而是舊封印仍在排斥星噬者的名字。", nextGoal: "在洪流擴散前，選擇先保護哪些世界連結", effects: [{ op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "trust.grimm", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] }
        ]
      },
      lifelines: {
        title: "世界傳來的求救",
        clock: "元素洪流・星圖環廊",
        paragraphs: [
          "星圖環廊把你們與各地的星錨連在一起。每一次震盪都會使一處天空變色；若裂口再擴大，第一章的邊境村、倒懸之城與無星渡口都會被洪流推離原本的世界。",
          { text: "你們已從求救信號標出最危急的地點，也看見每個地方彼此牽連。", when: { path: "chapterTenArrivalChoice", equals: "read_world_signals" } },
          { text: "你們已沿脈衝抵達源頭，確認舊封印正排斥星噬者的名字。", when: { path: "chapterTenArrivalChoice", equals: "follow_first_ripple" } },
          { text: "阿斯特麗德和格里姆修好的主鏈可分流雷暴，但需要有人留下維持連結。", when: { path: "chapterSixDispatchChoice", equals: "anchor_team" } },
          { text: "瑟恩與法芙娜保存的原稿能校正各地星錨，為居民爭取撤離時間。", when: { path: "chapterSixDispatchChoice", equals: "archive_team" } },
          "你們只能先穩住一種連結：將力量送往最脆弱的聚落，或保住能連接所有地區的星錨主鏈。"
        ],
        choices: [
          { id: "protect_settlements", title: "先保住聚落與撤離航道", description: "讓村民、渡口旅客與城市居民有時間避開洪流。", outcome: "弗蕾亞和伊蘭把星錨餘力導向各地避難路線。邊境村民乘上渡船，倒懸之城的居民沿著舊纜橋撤離，無星渡口的燈火也照亮最後一批迷航者。各地仍有損壞，但沒有一座聚落被洪流吞沒。", nextGoal: "集結六位星獸的力量，選擇由誰承擔世界連結", effects: [{ op: "inc", path: "trust.freya", value: 1, max: 3 }, { op: "inc", path: "trust.eilan", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] },
          { id: "protect_anchor_network", title: "先保住星錨主鏈", description: "讓各地仍能互相聯繫，避免整個世界被裂口分成孤島。", outcome: "阿斯特麗德與格里姆把修復後的主鏈固定在星圖環廊。各地星錨重新相連，村民收到撤離指引，城市與渡口也能交換物資；然而靠近裂口的聚落承受了第一波洪流，部分家園被迫放棄。", nextGoal: "集結六位星獸的力量，選擇由誰承擔世界連結", effects: [{ op: "inc", path: "trust.astrid", value: 1, max: 3 }, { op: "inc", path: "trust.grimm", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] }
        ]
      },
      beasts: {
        title: "六道星名同時回應",
        clock: "元素洪流・星獸中庭",
        paragraphs: [
          "六道獸形星座從洪流深處升起。牠們不是被召來替你們戰鬥的武器，而是各自擁有名字、記憶與拒絕權的盟約見證者。第一位星獸將自己的聲音傳給其餘五者，等待牠們逐一作答。",
          { text: "靠近裂口的居民已獲得撤離時間，六獸能把力量用於修補世界本身。", when: { path: "chapterTenLifelineChoice", equals: "protect_settlements" } },
          { text: "星錨主鏈已恢復連結，但部分家園受損；六獸可以協助把居民送往安全地帶。", when: { path: "chapterTenLifelineChoice", equals: "protect_anchor_network" } },
          { text: "第一位星獸曾短暫醒來、確認回憶後重新沉眠；牠透過夢聲傳達召喚，沒有替任何同伴答應。", when: { path: "chapterSevenHeartChoice", equals: "wake_first" } },
          { text: "六獸仍保有各自的夢境；牠們透過回聲相聚，無須被迫醒來才能參與決定。", when: { path: "chapterSevenHeartChoice", equals: "keep_dreaming" } },
          "你們可以讓星獸各自選擇要支援的地區，也可以請牠們把力量集中在第一道裂口，爭取一次修復的機會。"
        ],
        choices: [
          { id: "beasts_choose_regions", title: "讓星獸各自選擇支援地區", description: "保留每位星獸的自主決定，接受各地恢復速度不同。", outcome: "六位星獸各自選擇一處需要幫助的地方：有人護送撤離船，有人穩住城市支柱，也有人替受損村落帶回水源。牠們沒有被固定成新的封印，世界的修復因而不平均，卻保留了每一位的自由。", nextGoal: "讓守望者說清楚當年改寫誓約的責任與補償", effects: [{ op: "inc", path: "trust.freya", value: 1, max: 3 }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] },
          { id: "beasts_focus_rift", title: "請星獸集中力量修補裂口", description: "取得一次封住源頭的機會，但每位星獸都必須明確同意。", outcome: "六位星獸逐一表明願意提供多少力量，拒絕或保留力量的回聲也被完整記下。牠們共同穩住裂口邊緣，讓世界暫時免於崩解；星獸仍保有撤回力量的權利。", nextGoal: "讓守望者說清楚當年改寫誓約的責任與補償", effects: [{ op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] }
        ]
      },
      reckoning: {
        title: "守望者的最後證詞",
        clock: "元素洪流・失名石階",
        paragraphs: [
          "通往核心的石階刻滿被改寫的盟約。守望者再次站在六位星獸與第一守護者面前，逐字確認自己把暫時封存改成永遠抹名，讓世界遺忘第一守護者，也讓所有人失去共同承擔洪流的機會。",
          { text: "星獸各自守護不同地區，守望者必須面對分散在各處的受害者與見證者。", when: { path: "chapterTenBeastsChoice", equals: "beasts_choose_regions" } },
          { text: "五位星獸仍在各地支援聚落；牠們透過星錨投射意識回到中庭參與討論。投影能表達意願，不能代替本體承諾力量。", when: { path: "chapterTenBeastsChoice", equals: "beasts_choose_regions" } },
          { text: "六獸同意共同穩住裂口，但每一份力量都能撤回；守望者不能再替牠們決定。", when: { path: "chapterTenBeastsChoice", equals: "beasts_focus_rift" } },
          { text: "你曾讓守望者當眾認罪，它沒有再要求星獸替自己的決定保密。", when: { path: "chapterNineGatheringChoice", equals: "guardian_confess" } },
          { text: "你曾先核對六份記憶；星獸記得守望者曾為了阻止更大的災變而恐懼。", when: { path: "chapterNineGatheringChoice", equals: "compare_memories" } },
          "星噬者沒有要求處決守望者，只問它是否願意把剩下的記憶還給世界。你們可以交出全部記錄，也可以先讓守望者以行動承擔補償。"
        ],
        choices: [
          { id: "publish_truth", title: "公開完整真相與原稿", description: "讓世界知道誰改寫誓約，也知道星噬者曾為眾人犧牲。", outcome: "瑟恩與法芙娜把原稿送上所有星錨，伊蘭用古鏡將記憶映向各地。守望者沒有替自己辯護；星噬者的犧牲、六獸的同意與誓約被改寫的過程都被完整公開。", nextGoal: "與星噬者討論它願意如何取回名字與未來", effects: [{ op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "stats.insight", value: 1, max: 3 }] },
          { id: "guardian_repair", title: "先讓守望者以行動補償", description: "暫不替它宣判，要求它先修復被自己破壞的連結。", outcome: "守望者把自己的名字刻回星錨，親手替各地修補被抹去的記錄。它不再要求原諒，也不再擔任裁決者；世界將知道部分真相，但完整原稿先留給當事者共同保管。", nextGoal: "與星噬者討論它願意如何取回名字與未來", effects: [{ op: "inc", path: "trust.ingvar", value: 1, max: 3 }, { op: "inc", path: "trust.eilan", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] }
        ]
      },
      name: {
        title: "星噬者選擇自己的名字",
        clock: "元素洪流・第一守護者之庭",
        paragraphs: [
          "第一守護者之庭保留著星噬者被抹名前的座位。名字回到它手中後，牠終於能選擇：重新使用舊名、以星噬者之名繼續活下去，或不接受任何稱號。這個決定只屬於牠。",
          { text: "完整真相已傳到各地；星噬者可以自己向世界回答曾經的犧牲。", when: { path: "chapterTenReckoningChoice", equals: "publish_truth" } },
          { text: "守望者正以修補星錨承擔責任，星噬者不必在此刻原諒它。", when: { path: "chapterTenReckoningChoice", equals: "guardian_repair" } },
          { text: "你曾先歸還星噬者的名字，牠如今記得那份沒有附帶條件的選擇。", when: { path: "chapterNineEncounterChoice", equals: "return_name" } },
          { text: "你曾讓牠先看見星獸的自主，牠知道這次的盟約不會要求牠立刻承諾。", when: { path: "chapterNineEncounterChoice", equals: "show_new_choice" } },
          { speaker: "星噬者", text: "你們不必替我決定該成為誰。我只想知道，這個世界能不能記得每個人都曾有選擇。" },
          "你們可以邀請牠以舊名重新加入盟約，也可以陪牠以自己的方式走向洪流核心。"
        ],
        choices: [
          { id: "restore_first_guardian", title: "邀請牠以第一守護者之名歸隊", description: "承認牠曾經的身分，但不把守門責任重新交給牠一人。", outcome: "星噬者接受舊名，卻把守護者徽記留在石庭。牠願意同行，不再接受單獨守門的職責；六獸也各自表示，這次牠們會在牠身旁，而不是把牠推回裂口。", nextGoal: "決定以何種代價終止元素洪流", effects: [{ op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "trust.grimm", value: 1, max: 3 }, { op: "inc", path: "stats.resonance", value: 1, max: 3 }] },
          { id: "let_name_rest", title: "讓牠自行決定是否留下名字", description: "不要求牠回到任何角色裡，只陪牠走向最後的選擇。", outcome: "星噬者把舊名放在石庭，暫時不取回任何稱號。牠仍願意同行，但不承諾成為守護者或盟約成員；這是牠第一次不必為了活下去先替自己命名。", nextGoal: "決定以何種代價終止元素洪流", effects: [{ op: "inc", path: "trust.freya", value: 1, max: 3 }, { op: "inc", path: "trust.eilan", value: 1, max: 3 }, { op: "inc", path: "stats.insight", value: 1, max: 3 }] }
        ]
      },
      method: {
        title: "洪流可以如何停止",
        clock: "元素洪流・歸潮機關",
        paragraphs: [
          "歸潮機關在世界各處的星錨之間展開。它能把洪流重新分配，也能把裂口封回原處；若有人願意抹去所有痕跡，還能讓時間倒回第一次潰堤之前。每種做法都會改變世界，也會留下不同的失去。",
          { text: "星獸已分頭支援各地，修復機關時能同時保護居民與星錨。", when: { path: "chapterTenBeastsChoice", equals: "beasts_choose_regions" } },
          { text: "六獸已同意暫時穩住裂口，歸潮機關可在它們同意的範圍內運作。", when: { path: "chapterTenBeastsChoice", equals: "beasts_focus_rift" } },
          { text: "星噬者願意以第一守護者身分同行，但不再單獨承擔封印。", when: { path: "chapterTenNameChoice", equals: "restore_first_guardian" } },
          { text: "星噬者仍保留不命名自己的權利，牠會同行，但不成為機關的核心。", when: { path: "chapterTenNameChoice", equals: "let_name_rest" } },
          "你們可以建立由眾人分擔、能持續修補的回流盟約；也可以選擇封回裂口、放出洪流改變世界，或把時間送回最初的災變。"
        ],
        choices: [
          { id: "build_conduit", title: "修復歸潮機關", description: "讓洪流分流至世界各地，由新的共同盟約長期維持平衡。", outcome: "英格瓦、阿斯特麗德和格里姆固定星錨，瑟恩、法芙娜與伊蘭補回機關的記錄與古鏡。六獸與兩位守護者各自選擇承擔的份量，回流路線逐一亮起。", nextGoal: "在核心決定最後要如何與洪流共存", effects: [{ op: "inc", path: "trust.astrid", value: 1, max: 3 }, { op: "inc", path: "trust.sern", value: 1, max: 3 }, { op: "inc", path: "stats.insight", value: 1, max: 3 }] },
          { id: "break_conduit", title: "拆除歸潮機關的強制核心", description: "拒絕任何人被固定成世界的支柱，接受元素洪流必須尋找新路。", outcome: "你們拆除機關中央會鎖定名字的核心，只留下可供自願使用的星錨。洪流不再有唯一出口，世界將面對劇烈變化；但再也沒有人會被指定成永遠不能離開的守門者。", nextGoal: "在核心決定最後要如何與洪流共存", effects: [{ op: "inc", path: "trust.grimm", value: 1, max: 3 }, { op: "inc", path: "trust.fafnira", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] }
        ]
      },
      core: {
        title: "最後一次點名",
        clock: "元素洪流・洪流之心",
        paragraphs: [
          "洪流之心睜開時，第一章邊境村的界碑、第二章觀星台的星盤、無星渡口的燈塔與七席石庭同時映在你們周圍。每一段旅程都留在這裡，等待你們決定它們會成為新世界的根，還是被時間抹平。",
          { text: "歸潮機關已恢復回流，元素力量能被分擔，但需要所有參與者定期重新同意。", when: { path: "chapterTenMethodChoice", equals: "build_conduit" } },
          { text: "強制核心已拆除，世界不再依賴單一封印，但短期內會承受元素變動。", when: { path: "chapterTenMethodChoice", equals: "break_conduit" } },
          { text: "星噬者取回第一守護者之名，卻拒絕再次獨自守門。", when: { path: "chapterTenNameChoice", equals: "restore_first_guardian" } },
          { text: "星噬者沒有選擇舊名；它仍能參與未來，但不被誓約定義。", when: { path: "chapterTenNameChoice", equals: "let_name_rest" } },
          "你們要讓世界共同承擔洪流，請兩位守護者自願守住裂口，讓洪流改造舊世界，或回到災變之前抹去這段旅程。"
        ],
        choices: [
          { id: "shared_return", title: "讓所有人共同承擔洪流", description: "以新的回流盟約分散力量，接受世界需要長久照護。", outcome: "你們將歸潮機關接上六位星獸、第一守護者與各地星錨。每位締約者只承擔自己同意的部分；守望者負責保存可修改、可撤回的記錄。洪流開始回流，世界終於不再需要靠遺忘維持平衡。", nextGoal: "見證新盟約啟動，確認世界與同伴的後續", effects: [{ op: "inc", path: "stats.resonance", value: 1, max: 3 }, { op: "inc", path: "stats.insight", value: 1, max: 3 }] },
          { id: "guard_together", title: "由兩位守護者自願封住裂口", description: "讓星噬者與守望者共同留下，六獸與世界不再被迫獻出名字。", outcome: "星噬者與守望者都明確同意進入裂口內側，並約定任何一方都能在盟友到來時離開。六獸只提供短期支援，不再被刻進封印。世界得以恢復，兩位守護者卻將長時間留在門後，隊伍只能定期聽見他們的回聲。", nextGoal: "見證封印成立，記下兩位守護者留下的約定", effects: [{ op: "inc", path: "stats.grit", value: 1, max: 3 }, { op: "inc", path: "trust.sern", value: 1, max: 3 }] },
          { id: "release_elements", title: "拆開裂口，讓元素洪流改變世界", description: "不再把洪流封起來，帶領居民迎接新的地貌與生活方式。", outcome: "你們拆開最後一道封印，讓洪流沿著可控的星錨通道流向世界。舊地貌部分崩塌，幾座城鎮必須遷移，元素風暴也改寫了季節；但居民得以學會與力量共存，星獸不再被固定成封印的一部分。", nextGoal: "見證新世界形成，陪伴居民開始重建", effects: [{ op: "inc", path: "stats.grit", value: 1, max: 3 }, { op: "inc", path: "trust.astrid", value: 1, max: 3 }] },
          { id: "rewind_first_break", title: "回溯至第一次元素潰堤之前", description: "用全部同伴的記憶換回未被洪流改變的世界，接受旅程也會被抹去。", outcome: "星噬者以第一守護者之力將時間推回第一道裂隙出現之前。元素潰堤沒有發生，村落與城市得以保全；代價是你們這段旅程從所有人的記憶與記錄中消失，連同行者也不再認得彼此。", nextGoal: "見證被改寫的世界，以及無人記得的旅程留下什麼", effects: [{ op: "inc", path: "stats.insight", value: 1, max: 3 }, { op: "inc", path: "stats.grit", value: 1, max: 3 }] }
        ]
      }
    },
    finales: {
      shared_return: {
        title: "共同承擔的黎明",
        summary: "元素洪流不再靠抹除名字或單人犧牲維持。世界開始修復，新的盟約允許每位參與者重新選擇自己的責任。",
        hook: "完整結局：世界仍需照護，但沒有任何人被迫永遠成為封印。",
        paragraphs: [
          "回流盟約啟動後，火、風、水與雷沿著星錨分散到不同地區。邊境村的界碑重新亮起，觀星台修復了星盤，無星渡口重新點起引路燈；倒懸之城也在居民共同修補下回到穩定高度。重建需要多年，卻不再有哪一座地方被當成可以犧牲的代價。",
          "六位星獸各自選擇要不要醒來、要守護哪裡；第一位星獸成為牠們的聯絡者，而非統領者。星噬者取回名字後與守望者一起旅行，兩者沒有立刻和解，卻開始公開修正舊盟約。",
          "冒險者小隊回到最初的村落，將完整記錄刻在界碑旁。每年星潮升起時，村民都會舉行點名儀式，提醒後來者：任何誓約都必須讓每個人有說不的權利。"
        ]
      },
      guard_together: {
        title: "門後仍有回聲",
        summary: "世界與聚落獲得穩定，兩位守護者自願共同留在裂口內側。封印不再由一人承受，但隊伍仍要面對長久分離。",
        hook: "帶著遺憾的結局：每年都能聽見門後的回聲，卻無法保證兩位守護者何時歸來。",
        paragraphs: [
          "裂口緩緩閉合，洪流退回星海深處。星錨主鏈仍會震動，六位星獸因此輪流巡守外環，卻不再被刻進封印。邊境村、觀星台、無星渡口與倒懸之城逐漸恢復；世界保住原有的山河，也必須記得封印可能再次需要協助。",
          "星噬者與守望者進入門後前，約定不再替彼此承擔沉默。兩人共同保管新的出口，並讓隊伍每隔一段時間帶著星錨訊號前來。你們聽見他們的聲音，卻看不見他們何時能走出來。",
          "冒險者們回到村落重建家園。居民把兩位守護者的名字刻在界碑上，不稱他們為犧牲者，而稱為仍在履行約定的旅人。每次星光變暗，大家都會點亮燈塔，提醒門後的人：你們沒有被忘記。"
        ]
      },
      release_elements: {
        title: "洪流之後的新大地",
        summary: "舊世界的地貌被元素洪流改寫，聚落必須遷移與重建；星獸與守護者則第一次能自由選擇自己的道路。",
        hook: "帶著失去的結局：舊家園無法完全復原，但居民與同伴開始建立不依賴封印的新文明。",
        paragraphs: [
          "洪流穿過拆除封印後的星錨通道，山脈被水抬起，火脈在遠方形成新的島鏈，雷暴帶來不再依循舊季節的雨。靠近裂口的村落被迫遷往高地，倒懸之城部分崩解，無星渡口失去了原本的海岸；居民仍活著，卻再也回不到原來的生活。",
          "六位星獸散入新的地貌，選擇守護或離開各自的星域。星噬者沒有成為封印核心，守望者則帶著原稿陪同居民遷徙。世界不再穩定，卻第一次不必靠抹除任何人的名字才能呼吸。",
          "冒險者小隊沿著新河道建立避難站，將村民、渡口旅客與城市工匠接到同一條商路上。多年後，孩子們把這場災變稱作第二次創世；年長者則記得那是失去家園、仍選擇活下去的一天。"
        ]
      },
      rewind_first_break: {
        title: "沒有人記得的守護",
        summary: "第一次元素潰堤被阻止，世界保留了原本的家園；代價是隊伍、盟約與整段旅程都從所有人的記憶中消失。",
        hook: "留有遺憾的結局：世界平安度日，卻再也沒有人能說出是誰替它找回了明天。",
        paragraphs: [
          "時間回到第一道裂隙出現之前。村落的界碑沒有裂痕，觀星台的星盤按原本的方向轉動，倒懸之城與無星渡口也沒有經歷洪流。居民平安地生活，六位星獸仍在自己的星域沉睡；世界沒有看見它差點失去的一切。",
          "星噬者、守望者與冒險者小隊的名字都從記憶裡消失。曾並肩作戰的同伴回到不同的道路，擦肩而過時只覺得似曾相識。沒有任何人記得自己曾選擇原諒、承擔或拒絕。",
          "然而每年同一天，村民總會在界碑旁多留一盞無人認領的燈。星盤的記錄裡也偶爾出現無法解釋的空白。世界保存下來了，這段守護卻不會被任何故事完整講出；只有那些微小的習慣，證明有人曾為它走到洪流之心。"
        ]
      }
    }
  }
};
