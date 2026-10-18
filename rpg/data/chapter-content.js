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
          { text: "修復後的橋面留在身後。英格瓦帶巡守留守兩岸，送你們先行進入霜環峽；收起的守關旗子在風裡輕輕翻動。", when: { path: "chapterThreeChoice", equals: "repair_bridge" } },
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
  }
};
