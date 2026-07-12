const dataPaths = {
  majorCards: "./assets/data/major-cards.json",
  minorCards: "./assets/data/minor-cards.json",
  majorInterpretations: "./assets/data/major-interpretations.json",
  minorInterpretations: "./assets/data/minor-interpretations.json",
};

const localHttpsApiOrigin = "https://localhost:5173";
const aiReadingEndpoint = location.protocol === "file:" ? `${localHttpsApiOrigin}/api/reading` : "./api/reading";
const aiSpeechEndpoint = location.protocol === "file:" ? `${localHttpsApiOrigin}/api/speech` : "./api/speech";
const voiceFlowStatusEndpoint = location.protocol === "file:" ? `${localHttpsApiOrigin}/api/voice-flow-status` : "./api/voice-flow-status";
const voiceFlowGreetingAudioUrl = "./assets/videos/voice-divination-greeting.mp3";
const guidedVoiceQuestion = "我現在腦袋很亂，不知道下一步該怎麼走，可以給我一些方向嗎？";
const maxSpeechChunkCharacters = 1200;

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

const questionSuggestions = {
  love: {
    daily: ["今天我的感情能量是什麼？", "今天我在感情中需要注意什麼？", "今天我該如何面對喜歡的人？", "今天這段關係帶給我的提醒是什麼？", "今天我適合主動表達感受嗎？"],
    quick: ["對方現在對我有好感嗎？", "我該主動聯絡對方嗎？", "這段關係還有發展機會嗎？", "對方是否正在想念我？", "我現在該繼續等待嗎？"],
    timeline: ["我和對方的關係過去、現在、未來會如何發展？", "這段感情從過去到現在發生了什麼變化？", "我們之間的問題是如何形成，又會如何發展？", "這段曖昧關係接下來會走向哪裡？", "我對感情的期待會如何影響未來？"],
    challenge: ["這段關係目前的真實狀況是什麼？", "我和對方現在最大的感情挑戰是什麼？", "我該如何改善和對方的互動？", "這段感情目前卡住的原因是什麼？", "我現在在感情中最適合採取什麼行動？"],
    relationship: ["我和對方目前彼此的感受是什麼？", "這段關係的核心問題是什麼？", "對方心裡真正想要的是什麼？", "我們之間還有沒有繼續發展的可能？", "這段感情未來最可能的走向是什麼？"],
    career: ["感情是否正在影響我的工作狀態？", "我該如何平衡感情與事業？", "工作壓力是否影響了我的感情關係？", "我目前應該優先經營感情還是工作？", "感情中的決定會不會影響我的職涯方向？"],
    choice: ["我該主動告白，還是繼續觀察？", "我該繼續等待對方，還是放下這段關係？", "我該修復這段關係，還是重新開始？", "我該相信對方，還是保留距離？", "我該選擇現在的人，還是新的可能性？"],
    celticCross: ["這段感情的深層課題與未來走向是什麼？", "我和對方目前關係中的核心阻礙是什麼？", "這段感情背後有哪些我沒有看見的影響？", "我該如何理解這段關係帶給我的人生課題？", "這段關係是否值得我長期投入？"],
  },
  work: {
    daily: ["今天我的工作狀態如何？", "今天職場上我需要注意什麼？", "今天我適合主動爭取機會嗎？", "今天和主管或同事互動要注意什麼？", "今天工作上會出現什麼重要提醒？"],
    quick: ["我現在的工作方向正確嗎？", "這份工作還適合我嗎？", "我該提出自己的想法嗎？", "主管是否看見我的努力？", "我近期有升遷或機會嗎？"],
    timeline: ["我的職涯從過去到現在如何演變？", "目前這份工作未來會如何發展？", "過去的職場選擇如何影響現在？", "我目前的工作瓶頸未來會改善嗎？", "我的事業方向接下來會有什麼變化？"],
    challenge: ["我目前的工作現況是什麼？", "我在工作中最大的挑戰是什麼？", "我該如何改善目前的工作表現？", "我現在職場上最需要注意什麼？", "我該如何突破目前的職涯瓶頸？"],
    relationship: ["工作壓力是否影響我的感情關係？", "我和伴侶對工作與生活的期待是否一致？", "感情中的支持是否能幫助我的事業？", "我該如何在感情與工作之間取得平衡？", "工作上的人際互動是否有曖昧或情感影響？"],
    career: ["我目前的職涯方向是否正確？", "我該如何提升在職場中的價值？", "目前工作環境對我有利嗎？", "我是否適合轉換工作或跑道？", "我的事業下一步應該怎麼走？"],
    choice: ["我該留在現在的工作，還是換新工作？", "我該接受這個職位，還是等待更好的機會？", "我該主動爭取升遷，還是先穩定累積？", "我該繼續目前產業，還是轉換跑道？", "我該自己創業，還是繼續受雇工作？"],
    celticCross: ["我目前職涯發展的核心課題是什麼？", "這份工作對我的長期發展有什麼影響？", "我在職場中真正需要突破的是什麼？", "我的事業未來有哪些機會與風險？", "我該如何看待目前的工作困境與選擇？"],
  },
  wealth: {
    daily: ["今天我的財運狀態如何？", "今天我在金錢上需要注意什麼？", "今天適合消費或投資嗎？", "今天有沒有需要避免的財務風險？", "今天我該用什麼心態面對金錢？"],
    quick: ["我現在適合投資嗎？", "這筆支出值得嗎？", "我近期財運會變好嗎？", "我該保守理財嗎？", "這個賺錢機會可靠嗎？"],
    timeline: ["我的財務狀況從過去到未來會如何變化？", "過去的金錢習慣如何影響現在？", "我目前的財務選擇未來會帶來什麼結果？", "這項投資過去、現在、未來的發展如何？", "我的財富累積接下來會有什麼趨勢？"],
    challenge: ["我目前的財務現況是什麼？", "我在金錢管理上的主要挑戰是什麼？", "我該如何改善目前的財務狀況？", "我現在最需要避免什麼金錢風險？", "我該如何建立更穩定的財務基礎？"],
    relationship: ["金錢問題是否影響我的感情關係？", "我和伴侶的金錢觀是否一致？", "我該如何處理感情中的財務壓力？", "對方在金錢上是否值得信任？", "這段關係會對我的財務造成什麼影響？"],
    career: ["我的工作能否帶來穩定收入？", "我該如何透過事業提升財富？", "目前的職涯選擇對財務有利嗎？", "我是否適合發展副業或額外收入？", "工作上的機會是否能改善我的財務狀況？"],
    choice: ["我該現在投資，還是先保留資金？", "我該買這項商品，還是暫時不買？", "我該選擇穩定收入，還是高風險高報酬？", "我該把錢投入學習，還是投入投資？", "我該增加收入來源，還是先控制支出？"],
    celticCross: ["我目前財務狀況背後的深層問題是什麼？", "我的財富累積會遇到哪些機會與阻礙？", "我該如何調整金錢觀與財務策略？", "目前這個財務決定的長期影響是什麼？", "我的財運未來整體發展趨勢如何？"],
  },
  health: {
    daily: ["今天我的身心狀態如何？", "今天健康上我需要注意什麼？", "今天我該如何照顧自己的身體？", "今天我的情緒是否影響身體狀態？", "今天適合休息還是積極行動？"],
    quick: ["我現在需要多休息嗎？", "我目前的生活習慣需要調整嗎？", "我的壓力是否影響健康？", "我該開始改善飲食或運動嗎？", "我目前的身心狀態穩定嗎？"],
    timeline: ["我的健康狀態從過去到未來會如何變化？", "過去的生活習慣如何影響現在的身體？", "我目前的健康管理未來會帶來什麼結果？", "我的壓力狀態會如何發展？", "我的身心平衡接下來會有什麼變化？"],
    challenge: ["我目前的身心現況是什麼？", "我健康上最大的挑戰是什麼？", "我該如何改善目前的生活狀態？", "我現在最需要注意哪方面的健康？", "我該如何讓身心恢復平衡？"],
    relationship: ["感情壓力是否影響我的健康？", "這段關係是否消耗了我的身心能量？", "我該如何在感情中保護自己的情緒健康？", "對方對我的身心狀態有什麼影響？", "我是否因為關係而忽略了自己的健康？"],
    career: ["工作壓力是否正在影響我的健康？", "我該如何在工作與健康之間取得平衡？", "目前的職場環境是否消耗我的身心？", "我是否需要調整工作節奏來照顧健康？", "我的事業追求是否讓我忽略了身體訊號？"],
    choice: ["我該休息恢復，還是繼續努力？", "我該調整飲食，還是增加運動？", "我該放慢生活節奏，還是維持現在步調？", "我該優先照顧身體，還是先處理工作壓力？", "我該尋求協助，還是先自我調整？"],
    celticCross: ["我目前身心狀態背後的深層原因是什麼？", "我的健康課題未來會如何發展？", "我該如何理解身體傳達給我的訊息？", "我的生活方式有哪些需要長期調整的地方？", "我如何建立更穩定的身心平衡？"],
  },
  interpersonal: {
    daily: ["今天我在人際互動中需要注意什麼？", "今天適合主動聯絡他人嗎？", "今天我該如何表達自己？", "今天我在人際關係中會遇到什麼提醒？", "今天適合化解誤會嗎？"],
    quick: ["對方是否對我有誤解？", "我該主動和對方溝通嗎？", "這段人際關係值得維持嗎？", "對方是否真心對待我？", "我該和這個人保持距離嗎？"],
    timeline: ["我和這個人的關係過去、現在、未來會如何變化？", "過去的互動如何影響現在的人際狀況？", "這段友情或合作關係接下來會如何發展？", "我在人際關係中的模式會如何延續？", "這場誤會未來是否有機會化解？"],
    challenge: ["我和對方目前的人際現況是什麼？", "這段人際關係最大的挑戰是什麼？", "我該如何改善和對方的互動？", "我在人際中最需要調整的是什麼？", "我該如何面對目前的人際壓力？"],
    relationship: ["我和對方之間是否有超過朋友的情感？", "這段人際關係是否可能發展成感情？", "我該如何分辨友情與曖昧？", "對方在關係中真正的感受是什麼？", "這段關係是否帶有情感依賴？"],
    career: ["職場人際目前對我有什麼影響？", "我和同事或主管的互動需要注意什麼？", "我該如何改善工作中的人際關係？", "目前的人際關係是否影響我的事業發展？", "我是否能從人脈中獲得工作機會？"],
    choice: ["我該主動溝通，還是暫時保持沉默？", "我該繼續維持這段關係，還是拉開距離？", "我該相信對方，還是提高警覺？", "我該和對方合作，還是自己處理？", "我該原諒對方，還是設定界線？"],
    celticCross: ["這段人際關係的深層課題是什麼？", "我和對方之間真正的問題在哪裡？", "這段關係未來會如何發展？", "我在人際互動中反覆遇到的模式是什麼？", "我該如何看待目前的人際困境？"],
  },
  academic: {
    daily: ["今天我的學習狀態如何？", "今天讀書或學習需要注意什麼？", "今天適合專注在哪個學習方向？", "今天我該如何提升學習效率？", "今天我的學業能量給我什麼提醒？"],
    quick: ["我現在的學習方法正確嗎？", "我這次考試準備方向對嗎？", "我該繼續目前的學習計畫嗎？", "我近期學業會有進步嗎？", "我是否需要調整讀書策略？"],
    timeline: ["我的學習狀態從過去到未來會如何變化？", "過去的學習習慣如何影響現在成績？", "目前的努力未來會帶來什麼結果？", "我的考試準備接下來會如何發展？", "我的學業目標未來是否有機會達成？"],
    challenge: ["我目前的學習現況是什麼？", "我在學業上最大的挑戰是什麼？", "我該如何改善目前的學習效率？", "我現在最需要補強哪個部分？", "我該如何克服拖延或分心？"],
    relationship: ["感情是否影響了我的學習狀態？", "我該如何平衡感情與學業？", "對方是否支持我的學習目標？", "我是否因為關係而分散學習專注力？", "感情中的情緒是否影響我的考試表現？"],
    career: ["目前的學習方向是否有助於未來工作？", "我該如何把學業轉化為職涯優勢？", "這個科系或課程適合我的事業發展嗎？", "我該繼續升學，還是提早投入工作？", "我的學習目標是否符合未來職涯需求？"],
    choice: ["我該繼續目前科系，還是轉換方向？", "我該升學，還是先工作？", "我該自學，還是報名課程？", "我該專注考試，還是培養實作能力？", "我該維持現在讀書方法，還是換新策略？"],
    celticCross: ["我目前學業發展的核心課題是什麼？", "我的學習困難背後真正的原因是什麼？", "我該如何突破目前的學業瓶頸？", "這個學習方向對我的未來有什麼影響？", "我的學業與長期人生方向是否一致？"],
  },
  spirituality: {
    daily: ["今天我的靈性能量是什麼？", "今天宇宙想給我的提醒是什麼？", "今天我該聆聽內在的哪個聲音？", "今天我需要放下什麼能量？", "今天我的直覺想告訴我什麼？"],
    quick: ["我現在是否該相信自己的直覺？", "這個訊號對我有什麼意義？", "我現在需要放下嗎？", "我是否走在正確的靈性道路上？", "我目前的內在指引是清晰的嗎？"],
    timeline: ["我的靈性成長過去、現在、未來會如何發展？", "過去的經驗如何影響我現在的內在狀態？", "我目前的靈性課題未來會帶來什麼轉變？", "我的直覺能力接下來會如何發展？", "我的人生課題正在如何演變？"],
    challenge: ["我目前的靈性狀態是什麼？", "我內在最大的挑戰是什麼？", "我該如何重新連結自己的直覺？", "我現在需要面對哪個內在課題？", "我該如何讓心靈回到平衡？"],
    relationship: ["這段關係帶給我的靈性課題是什麼？", "我和對方是否有深層靈魂連結？", "這段感情正在教會我什麼？", "我該如何從這段關係中成長？", "這段關係是否反映了我的內在陰影？"],
    career: ["我的工作是否符合內在使命？", "我目前的事業方向是否與靈魂目標一致？", "我該如何把天賦運用在工作中？", "工作上的挑戰帶給我什麼靈性課題？", "我是否該追尋更有意義的事業方向？"],
    choice: ["我該聽從理性安排，還是相信直覺？", "我該留在熟悉道路，還是走向未知召喚？", "我該放下過去，還是繼續尋找答案？", "我該向外追求成果，還是向內尋找平靜？", "我該接受改變，還是暫時穩定自己？"],
    celticCross: ["我目前靈魂成長的核心課題是什麼？", "這段人生階段帶給我的深層意義是什麼？", "我的內在陰影與潛意識正在提醒我什麼？", "我該如何理解目前生命中的反覆課題？", "我的靈性道路未來會如何展開？"],
  },
  advice: {
    daily: ["今天我最需要接收的建議是什麼？", "今天我該用什麼心態面對生活？", "今天我需要注意哪個方向？", "今天我可以採取什麼小行動？", "今天命運想提醒我什麼？"],
    quick: ["我現在最該做的是什麼？", "我該繼續前進嗎？", "我現在需要等待嗎？", "我是否該改變做法？", "我現在最需要注意什麼？"],
    timeline: ["過去的經驗、現在的狀態與未來的建議是什麼？", "我目前的選擇會如何影響未來？", "過去的錯誤如何轉化成未來的提醒？", "我現在的行動未來會帶來什麼結果？", "這件事從過去到未來給我的整體建議是什麼？"],
    challenge: ["我目前的狀況、挑戰與最佳建議是什麼？", "我現在卡住的原因與解法是什麼？", "我該如何面對眼前的問題？", "目前局勢中，我最該採取什麼行動？", "我應該注意什麼，並如何調整方向？"],
    relationship: ["在這段關係中，我最需要的建議是什麼？", "我該如何面對對方？", "我該如何處理目前的情感困擾？", "這段關係給我的提醒是什麼？", "我該如何在關係中保護自己？"],
    career: ["在目前事業上，我最需要的建議是什麼？", "我該如何面對工作中的壓力？", "我下一步事業方向該怎麼走？", "我該如何提升自己的職場價值？", "目前工作局勢給我的提醒是什麼？"],
    choice: ["我該選擇 A 方向，還是 B 方向？", "我該繼續原本計畫，還是改變做法？", "我該主動行動，還是先觀察等待？", "我該選擇穩定，還是選擇冒險？", "我該聽從理性判斷，還是跟隨內心感受？"],
    celticCross: ["目前這件事的完整局勢與深層建議是什麼？", "我該如何理解現在的人生課題？", "這個困境背後真正要我學會的是什麼？", "我目前面臨的選擇有哪些隱藏影響？", "我該如何做出最符合長遠發展的決定？"],
  },
};

const state = {
  deck: [],
  currentDraw: [],
  currentSpread: "daily",
  currentSituation: "love",
  currentQuestion: "",
  inferredSituation: null,
  situationManuallySelected: false,
  suggestionsOpen: false,
  readingLocked: false,
  aiRequestId: 0,
  speechRequestId: 0,
  speechAudio: null,
  speechObjectUrl: null,
  speechAudioResolve: null,
  speechIsActive: false,
  speechWaitVideoRequestId: 0,
  voiceFlowEnabled: false,
  voiceFlowActive: false,
  voiceFlowAudio: null,
  voiceRecognition: null,
  voiceFallbackTimer: null,
  voiceFallbackStarted: false,
  autoRevealActive: false,
  aiWaitVideoRequestId: 0,
  aiWaitVideoPromise: null,
  aiWaitVideoResolve: null,
  lastReadingInput: null,
  poolRendered: false,
  poolCloseTimer: null,
  poolSelectedCardId: null,
};

const elements = {
  questionInput: document.querySelector("#questionInput"),
  questionContext: document.querySelector("#questionContext"),
  questionSuggestions: document.querySelector("#questionSuggestions"),
  suggestionToggle: document.querySelector("#suggestionToggle"),
  suggestionList: document.querySelector("#suggestionList"),
  deckStatus: document.querySelector("#deckStatus"),
  situationButtons: document.querySelector("#situationButtons"),
  spreadButtons: document.querySelector("#spreadButtons"),
  drawButton: document.querySelector("#drawButton"),
  resetButton: document.querySelector("#resetButton"),
  cancelVoiceFallbackButton: document.querySelector("#cancelVoiceFallbackButton"),
  deckStack: document.querySelector("#deckStack"),
  spreadZone: document.querySelector("#spreadZone"),
  readingPanel: document.querySelector("#readingPanel"),
  readingTitle: document.querySelector("#readingTitle"),
  summaryBox: document.querySelector("#summaryBox"),
  aiReading: document.querySelector("#aiReading"),
  aiReadingContent: document.querySelector("#aiReadingContent"),
  aiCopyButton: document.querySelector("#aiCopyButton"),
  aiSpeechButton: document.querySelector("#aiSpeechButton"),
  voiceDivinationButton: document.querySelector("#voiceDivinationButton"),
  voiceFlowStatus: document.querySelector("#voiceFlowStatus"),
  introVideo: document.querySelector("#introVideo"),
  introVideoPlayer: document.querySelector("#introVideoPlayer"),
  aiWaitVideo: document.querySelector("#aiWaitVideo"),
  aiWaitVideoPlayer: document.querySelector("#aiWaitVideoPlayer"),
  speechWaitVideo: document.querySelector("#speechWaitVideo"),
  speechWaitVideoPlayer: document.querySelector("#speechWaitVideoPlayer"),
  cardReadings: document.querySelector("#cardReadings"),
  cardTemplate: document.querySelector("#cardTemplate"),
  poolModal: document.querySelector("#poolModal"),
  poolBackdrop: document.querySelector("#poolBackdrop"),
  poolCloseButton: document.querySelector("#poolCloseButton"),
  poolSummary: document.querySelector("#poolSummary"),
  poolGrid: document.querySelector("#poolGrid"),
  poolCardDetail: document.querySelector("#poolCardDetail"),
};

init();

async function init() {
  renderChoiceButtons();
  renderQuestionSuggestions();
  bindEvents();
  startIntroVideo();

  try {
    state.deck = await loadDeck();
    elements.deckStatus.innerHTML = `
      <span class="deck-pool-main">查看牌庫</span>
      <span class="deck-pool-sub">${state.deck.length} 張牌 · 點擊開啟卡池</span>
    `;
    elements.deckStatus.disabled = false;
    elements.drawButton.disabled = false;
    void loadVoiceFlowAvailability();
  } catch (error) {
    elements.deckStatus.innerHTML = `
      <span class="deck-pool-main">牌庫載入失敗</span>
      <span class="deck-pool-sub">請重新整理後再試</span>
    `;
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
  elements.cancelVoiceFallbackButton?.addEventListener("click", cancelGuidedVoiceFlow);
  elements.questionInput.addEventListener("input", handleQuestionInput);
  elements.suggestionToggle.addEventListener("click", toggleQuestionSuggestions);
  elements.suggestionList.addEventListener("click", handleSuggestionClick);
  elements.situationButtons.addEventListener("click", handleChoiceClick);
  elements.spreadButtons.addEventListener("click", handleChoiceClick);
  elements.deckStatus.addEventListener("click", openCardPool);
  elements.poolBackdrop.addEventListener("click", closeCardPool);
  elements.poolCloseButton.addEventListener("click", closeCardPool);
  elements.poolGrid.addEventListener("click", handlePoolCardClick);
  elements.poolGrid.addEventListener("keydown", handlePoolCardKeydown);
  elements.poolCardDetail.addEventListener("click", handlePoolCardDetailClick);
  elements.aiCopyButton?.addEventListener("click", copyAiReadingContent);
  elements.aiSpeechButton?.addEventListener("click", toggleAiSpeech);
  elements.voiceDivinationButton?.addEventListener("click", startVoiceDivination);
  elements.introVideoPlayer?.addEventListener("ended", stopIntroVideo);
  elements.introVideoPlayer?.addEventListener("error", stopIntroVideo);
  elements.aiWaitVideoPlayer?.addEventListener("ended", () => {
    if (!elements.aiWaitVideoPlayer.loop) {
      stopAiWaitVideo();
    }
  });
  elements.aiWaitVideoPlayer?.addEventListener("error", () => stopAiWaitVideo());
  elements.speechWaitVideoPlayer?.addEventListener("error", () => stopSpeechWaitVideo());
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.poolModal.hidden) {
      if (state.poolSelectedCardId !== null) {
        closePoolCardDetail();
      } else {
        closeCardPool();
      }
    }
    if (event.key === "Escape" && state.suggestionsOpen) {
      closeQuestionSuggestions();
      elements.suggestionToggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!state.suggestionsOpen || elements.questionSuggestions.contains(event.target)) return;
    closeQuestionSuggestions();
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
    renderQuestionSuggestions();
    updateQuestionContext();
    if (state.currentDraw.length > 0 && state.currentDraw.every((item) => item.revealed)) {
      renderReading();
    }
    return;
  }

  if (group === "spread") {
    state.currentSpread = value;
    updateChoiceState(elements.spreadButtons, value);
    renderQuestionSuggestions();
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
  const previousSituation = state.currentSituation;
  state.currentQuestion = event.target.value.trim();
  if (!hadQuestion && state.currentQuestion) {
    state.situationManuallySelected = false;
  }
  state.inferredSituation = inferSituationFromQuestion(state.currentQuestion);

  if (!state.situationManuallySelected && state.inferredSituation) {
    state.currentSituation = state.inferredSituation;
    updateChoiceState(elements.situationButtons, state.currentSituation);
  }

  if (previousSituation !== state.currentSituation) {
    renderQuestionSuggestions();
  }
  updateQuestionContext();

  if (state.currentDraw.length > 0 && state.currentDraw.every((item) => item.revealed)) {
    renderReading();
  }
}

function handleSuggestionClick(event) {
  if (state.readingLocked) return;

  const button = event.target.closest(".suggestion-button");
  if (!button) return;

  state.currentQuestion = button.dataset.question;
  state.inferredSituation = inferSituationFromQuestion(state.currentQuestion);
  state.situationManuallySelected = true;
  elements.questionInput.value = state.currentQuestion;
  updateChoiceState(elements.situationButtons, state.currentSituation);
  updateQuestionContext();
  closeQuestionSuggestions();
  elements.questionInput.focus();
}

function toggleQuestionSuggestions() {
  if (state.readingLocked) return;
  setQuestionSuggestionsOpen(!state.suggestionsOpen);
}

function closeQuestionSuggestions() {
  setQuestionSuggestionsOpen(false);
}

function setQuestionSuggestionsOpen(isOpen) {
  state.suggestionsOpen = isOpen;
  elements.questionSuggestions.classList.toggle("is-open", isOpen);
  elements.suggestionToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  elements.suggestionList.hidden = !isOpen;
}

function renderQuestionSuggestions() {
  if (!elements.suggestionList) return;

  const questions = questionSuggestions[state.currentSituation]?.[state.currentSpread] ?? [];
  elements.suggestionList.innerHTML = questions
    .map(
      (question) => `
        <button class="suggestion-button" type="button" role="menuitem" data-question="${escapeHtml(question)}">
          ${escapeHtml(question)}
        </button>
      `,
    )
    .join("");
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

function inferSpreadFromQuestion(question, situation) {
  const normalized = question.replace(/\s+/g, "");
  if (/(選擇|比較|哪個|A[或、]?B|兩個|要不要)/i.test(normalized)) return "choice";
  if (/(感情|愛情|對方|關係|復合|曖昧|伴侶)/.test(normalized) || situation === "love") return "relationship";
  if (/(工作|職涯|轉職|升遷|事業|面試)/.test(normalized) || situation === "work") return "career";
  if (/(阻礙|困難|卡關|挑戰|如何面對)/.test(normalized)) return "challenge";
  if (/(今天|今日|本日|提醒|建議)/.test(normalized)) return "daily";
  return "timeline";
}

async function loadVoiceFlowAvailability() {
  try {
    const response = await fetch(voiceFlowStatusEndpoint);
    const result = await response.json();
    state.voiceFlowEnabled = Boolean(response.ok && result.ok && result.enabled);
  } catch (error) {
    state.voiceFlowEnabled = false;
  }

  if (elements.voiceDivinationButton) {
    elements.voiceDivinationButton.hidden = !state.voiceFlowEnabled;
  }
}

function setVoiceFlowStatus(message) {
  if (!elements.voiceFlowStatus) return;
  elements.voiceFlowStatus.textContent = message;
  elements.voiceFlowStatus.hidden = !message;
}

async function startVoiceDivination() {
  if (!state.voiceFlowEnabled || state.voiceFlowActive || state.readingLocked) return;

  if (!window.isSecureContext) {
    setVoiceFlowStatus("手機語音輸入需要 HTTPS 安全連線；目前的 http 家用 Wi‑Fi 網址無法使用麥克風。");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    setVoiceFlowStatus("此瀏覽器尚未支援語音辨識，請改用文字輸入問題。");
    return;
  }

  state.voiceFlowActive = true;
  state.voiceFallbackStarted = false;
  setVoiceFallbackCancelVisible(false);
  elements.voiceDivinationButton.disabled = true;
  setVoiceFlowStatus("命運正在回應你…");

  try {
    await playVoiceFlowGreeting();
    startQuestionRecognition(SpeechRecognition);
  } catch (error) {
    cancelVoiceFlow();
    setVoiceFlowStatus(String(error?.message || "開場語音暫時無法播放，請稍後再試。"));
  }
}

function playVoiceFlowGreeting() {
  return new Promise((resolve, reject) => {
    const audio = new Audio(voiceFlowGreetingAudioUrl);
    state.voiceFlowAudio = audio;
    audio.addEventListener("ended", () => {
      if (state.voiceFlowAudio === audio) state.voiceFlowAudio = null;
      resolve();
    }, { once: true });
    audio.addEventListener("error", () => {
      if (state.voiceFlowAudio === audio) state.voiceFlowAudio = null;
      reject(new Error("開場語音播放失敗，請再試一次。"));
    }, { once: true });
    audio.play().catch(() => reject(new Error("瀏覽器未允許語音播放，請再點一次開始語音占卜。")));
  });
}

function startQuestionRecognition(SpeechRecognition) {
  const recognition = new SpeechRecognition();
  state.voiceRecognition = recognition;
  recognition.lang = "zh-TW";
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;
  setVoiceFlowStatus("請說出你的問題，我正在聆聽…");

  recognition.addEventListener("result", (event) => {
    const question = Array.from(event.results)
      .map((result) => result[0]?.transcript || "")
      .join("")
      .trim();
    if (!question) {
      cancelVoiceFlow();
      setVoiceFlowStatus("沒有聽清楚問題，請再試一次。");
      return;
    }

    applyVoiceQuestion(question);
    state.voiceRecognition = null;
    setVoiceFlowStatus("已收到問題，正在展開牌陣…");
    window.setTimeout(startAutomatedDraw, 420);
  }, { once: true });

  recognition.addEventListener("error", (event) => {
    if (event.error === "no-speech") {
      state.voiceRecognition = null;
      startGuidedVoiceQuestion();
      return;
    }

    cancelVoiceFlow();
    const message = event.error === "not-allowed"
      ? "瀏覽器沒有取得麥克風使用權。請確認使用 HTTPS 網址，並在網站設定中允許麥克風。"
      : "沒有聽清楚問題，請再試一次。";
    setVoiceFlowStatus(message);
  }, { once: true });
  recognition.addEventListener("end", () => {
    if (state.voiceRecognition !== recognition) return;
    state.voiceRecognition = null;
    startGuidedVoiceQuestion();
  }, { once: true });
  recognition.start();
}

function applyVoiceQuestion(question) {
  state.currentQuestion = question;
  elements.questionInput.value = question;
  state.inferredSituation = inferSituationFromQuestion(question);
  state.situationManuallySelected = false;
  state.currentSituation = state.inferredSituation || "advice";
  state.currentSpread = inferSpreadFromQuestion(question, state.currentSituation);
  updateChoiceState(elements.situationButtons, state.currentSituation);
  updateChoiceState(elements.spreadButtons, state.currentSpread);
  renderQuestionSuggestions();
  updateQuestionContext();
}

function startGuidedVoiceQuestion() {
  if (!state.voiceFlowActive || state.voiceFallbackStarted) return;

  state.voiceFallbackStarted = true;
  setVoiceFallbackCancelVisible(true);
  setVoiceFlowStatus("目前沒有收到語音內容，麥克風已暫停。5 秒內可取消並重新開始。\n正在為你整理問題…");
  state.voiceFallbackTimer = window.setTimeout(() => {
    state.voiceFallbackTimer = null;
    if (!state.voiceFlowActive) return;

    setVoiceFallbackCancelVisible(false);
    applyVoiceQuestion(guidedVoiceQuestion);
    setVoiceFlowStatus(`我先替你問：「${guidedVoiceQuestion}」正在展開牌陣…`);
    window.setTimeout(startAutomatedDraw, 700);
  }, 5000);
}

function setVoiceFallbackCancelVisible(isVisible) {
  if (!elements.cancelVoiceFallbackButton) return;
  elements.cancelVoiceFallbackButton.hidden = !isVisible;
  elements.resetButton.hidden = isVisible;
}

function cancelGuidedVoiceFlow() {
  if (!state.voiceFallbackStarted) return;

  cancelVoiceFlow();
  state.currentQuestion = "";
  state.inferredSituation = null;
  state.situationManuallySelected = false;
  state.currentSituation = "love";
  state.currentSpread = "daily";
  elements.questionInput.value = "";
  updateChoiceState(elements.situationButtons, state.currentSituation);
  updateChoiceState(elements.spreadButtons, state.currentSpread);
  renderQuestionSuggestions();
  updateQuestionContext();
  setVoiceFlowStatus("已取消自動提問，你可以重新開始。");
}

function startAutomatedDraw() {
  if (!state.voiceFlowActive || state.deck.length === 0) return;
  state.autoRevealActive = true;
  drawReading();
  state.currentDraw.forEach((_, index) => {
    window.setTimeout(() => revealCard(index), 720 * (index + 1));
  });
}

function cancelVoiceFlow() {
  state.voiceFlowActive = false;
  state.autoRevealActive = false;
  state.voiceFallbackStarted = false;
  window.clearTimeout(state.voiceFallbackTimer);
  state.voiceFallbackTimer = null;
  setVoiceFallbackCancelVisible(false);
  state.voiceRecognition?.abort();
  state.voiceRecognition = null;
  state.voiceFlowAudio?.pause();
  state.voiceFlowAudio = null;
  if (elements.voiceDivinationButton) elements.voiceDivinationButton.disabled = false;
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
  stopAiWaitVideo();

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
  setAiCopyAvailability(false);
  setAiSpeechAvailability(false);
  startAiWaitVideo(requestId);
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

    await waitForAiWaitVideo(requestId);
    if (requestId !== state.aiRequestId) return;

    elements.aiReading.dataset.state = "success";
    elements.aiReadingContent.innerHTML = formatAiReading(result.text);
    setAiCopyAvailability(true);
    setAiSpeechAvailability(true);
    if (state.voiceFlowActive) {
      setVoiceFlowStatus("解析完成，正在準備為你朗讀…");
      void toggleAiSpeech();
    }
  } catch (error) {
    if (requestId !== state.aiRequestId) return;

    await waitForAiWaitVideo(requestId);
    if (requestId !== state.aiRequestId) return;

    elements.aiReading.dataset.state = "fallback";
    setAiCopyAvailability(false);
    setAiSpeechAvailability(false);
    if (isLikelyMissingAiApi(error)) {
      renderManualAiPromptFallback(readingInput);
    } else {
      elements.aiReadingContent.textContent = `${String(error?.message || "AI 解讀暫時無法產生。")} 目前已保留本地資料庫解讀。`;
    }
    if (state.voiceFlowActive) {
      cancelVoiceFlow();
      setVoiceFlowStatus("AI 解析暫時無法完成，已切換為手動閱讀模式。");
    }
  }
}

function startAiWaitVideo(requestId) {
  const shell = elements.aiWaitVideo;
  const player = elements.aiWaitVideoPlayer;
  if (!shell || !player) {
    state.aiWaitVideoPromise = Promise.resolve();
    return;
  }

  state.aiWaitVideoRequestId = requestId;
  state.aiWaitVideoPromise = new Promise((resolve) => {
    state.aiWaitVideoResolve = resolve;
  });
  player.pause();
  player.loop = true;
  player.currentTime = 0;
  shell.hidden = false;
  window.requestAnimationFrame(() => {
    shell.classList.add("is-visible");
  });

  const playAttempt = player.play();
  if (playAttempt?.catch) {
    playAttempt.catch(() => {
      if (state.aiWaitVideoRequestId === requestId) {
        stopAiWaitVideo(requestId);
      }
    });
  }
}

function waitForAiWaitVideo(requestId) {
  if (requestId !== state.aiWaitVideoRequestId) return Promise.resolve();
  if (elements.aiWaitVideoPlayer) {
    elements.aiWaitVideoPlayer.loop = false;
  }
  return state.aiWaitVideoPromise || Promise.resolve();
}

function stopAiWaitVideo(requestId = state.aiWaitVideoRequestId) {
  const shell = elements.aiWaitVideo;
  const player = elements.aiWaitVideoPlayer;
  if (!shell || !player) return;
  if (requestId !== state.aiWaitVideoRequestId) return;

  state.aiWaitVideoRequestId = 0;
  const resolveWaitVideo = state.aiWaitVideoResolve;
  state.aiWaitVideoPromise = null;
  state.aiWaitVideoResolve = null;
  player.loop = false;
  shell.classList.remove("is-visible");
  player.pause();
  player.currentTime = 0;
  resolveWaitVideo?.();
  window.setTimeout(() => {
    if (!shell.classList.contains("is-visible")) {
      shell.hidden = true;
    }
  }, 220);
}

function startIntroVideo() {
  const shell = elements.introVideo;
  const player = elements.introVideoPlayer;
  if (!shell || !player) return;

  player.pause();
  player.currentTime = 0;
  player.muted = true;
  shell.hidden = false;
  window.requestAnimationFrame(() => {
    shell.classList.add("is-visible");
  });

  const playAttempt = player.play();
  if (playAttempt?.catch) {
    playAttempt.catch(stopIntroVideo);
  }
}

function stopIntroVideo() {
  const shell = elements.introVideo;
  const player = elements.introVideoPlayer;
  if (!shell || !player) return;

  shell.classList.remove("is-visible");
  player.pause();
  player.currentTime = 0;
  window.setTimeout(() => {
    if (!shell.classList.contains("is-visible")) {
      shell.hidden = true;
    }
  }, 220);
}

function setAiCopyAvailability(isAvailable) {
  const button = elements.aiCopyButton;
  if (!button) return;

  button.hidden = !isAvailable;
  button.disabled = !isAvailable;
  if (!isAvailable) {
    button.textContent = "複製內容";
  }
}

function setAiSpeechAvailability(isAvailable) {
  const button = elements.aiSpeechButton;
  if (!button) return;

  button.hidden = !isAvailable;
  button.disabled = !isAvailable;
  if (!isAvailable) {
    button.textContent = "朗讀內容";
  }
}

async function toggleAiSpeech() {
  const button = elements.aiSpeechButton;
  if (!button) return;

  if (state.speechIsActive) {
    stopAiSpeech();
    return;
  }

  const text = elements.aiReadingContent?.innerText?.trim();
  if (!text) return;

  const requestId = (state.speechRequestId += 1);
  const chunks = splitSpeechText(text);
  state.speechIsActive = true;
  button.disabled = false;
  button.textContent = "停止朗讀";
  startSpeechWaitVideo(requestId);

  try {
    let nextAudioPromise = requestSpeechAudio(chunks[0], requestId);

    for (let index = 0; index < chunks.length; index += 1) {
      if (requestId !== state.speechRequestId) return;
      const audioBlob = await nextAudioPromise;
      if (requestId !== state.speechRequestId) return;

      const playbackPromise = playSpeechAudio(audioBlob, requestId);
      if (index + 1 < chunks.length) {
        nextAudioPromise = requestSpeechAudio(chunks[index + 1], requestId);
      }
      await playbackPromise;
    }
  } catch (error) {
    if (requestId === state.speechRequestId) {
      window.alert(String(error?.message || "語音朗讀暫時無法使用。"));
    }
  } finally {
    if (requestId === state.speechRequestId) {
      stopAiSpeech(false);
      if (state.voiceFlowActive) {
        state.voiceFlowActive = false;
        state.autoRevealActive = false;
        if (elements.voiceDivinationButton) elements.voiceDivinationButton.disabled = false;
        setVoiceFlowStatus("本次解讀已朗讀完畢。");
      }
    }
  }
}

async function requestSpeechAudio(text, requestId) {
  const response = await fetch(aiSpeechEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (requestId !== state.speechRequestId) return null;

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || "語音朗讀暫時無法使用。");
  }

  return response.blob();
}

function splitSpeechText(text) {
  const sentences = text.replace(/\s+/g, " ").match(/[^。！？!?]+[。！？!?]?/gu) || [text];
  const chunks = [];
  let current = "";

  for (let sentence of sentences) {
    if (current && current.length + sentence.length > maxSpeechChunkCharacters) {
      chunks.push(current.trim());
      current = "";
    }

    while (sentence.length > maxSpeechChunkCharacters) {
      chunks.push(sentence.slice(0, maxSpeechChunkCharacters));
      sentence = sentence.slice(maxSpeechChunkCharacters);
    }
    current += sentence;
  }
  if (current.trim()) chunks.push(current.trim());

  return chunks;
}

function playSpeechAudio(blob, requestId) {
  return new Promise((resolve, reject) => {
    if (requestId !== state.speechRequestId) {
      resolve();
      return;
    }

    const audio = new Audio(URL.createObjectURL(blob));
    stopSpeechWaitVideo(requestId);
    state.speechAudio = audio;
    state.speechObjectUrl = audio.src;
    state.speechAudioResolve = resolve;

    audio.addEventListener("ended", () => {
      revokeSpeechObjectUrl();
      state.speechAudio = null;
      state.speechAudioResolve = null;
      resolve();
    }, { once: true });
    audio.addEventListener("error", () => {
      revokeSpeechObjectUrl();
      state.speechAudio = null;
      state.speechAudioResolve = null;
      reject(new Error("語音播放失敗，請再試一次。"));
    }, { once: true });
    audio.play().catch(() => {
      revokeSpeechObjectUrl();
      state.speechAudio = null;
      state.speechAudioResolve = null;
      reject(new Error("瀏覽器未允許語音播放，請再按一次朗讀。"));
    });
  });
}

function stopAiSpeech(invalidateRequest = true) {
  if (invalidateRequest) state.speechRequestId += 1;
  state.speechIsActive = false;
  stopSpeechWaitVideo();
  state.speechAudio?.pause();
  state.speechAudio = null;
  revokeSpeechObjectUrl();
  const resolvePlayback = state.speechAudioResolve;
  state.speechAudioResolve = null;
  resolvePlayback?.();
  if (elements.aiSpeechButton) {
    elements.aiSpeechButton.disabled = false;
    elements.aiSpeechButton.textContent = "朗讀內容";
  }
}

function startSpeechWaitVideo(requestId) {
  const shell = elements.speechWaitVideo;
  const player = elements.speechWaitVideoPlayer;
  if (!shell || !player) return;

  state.speechWaitVideoRequestId = requestId;
  player.pause();
  player.loop = true;
  player.currentTime = 0;
  shell.hidden = false;
  window.requestAnimationFrame(() => {
    shell.classList.add("is-visible");
  });

  const playAttempt = player.play();
  if (playAttempt?.catch) {
    playAttempt.catch(() => {
      if (state.speechWaitVideoRequestId === requestId) {
        stopSpeechWaitVideo(requestId);
      }
    });
  }
}

function stopSpeechWaitVideo(requestId = state.speechWaitVideoRequestId) {
  const shell = elements.speechWaitVideo;
  const player = elements.speechWaitVideoPlayer;
  if (!shell || !player) return;
  if (requestId !== state.speechWaitVideoRequestId) return;

  state.speechWaitVideoRequestId = 0;
  player.loop = false;
  shell.classList.remove("is-visible");
  player.pause();
  player.currentTime = 0;
  window.setTimeout(() => {
    if (!shell.classList.contains("is-visible")) {
      shell.hidden = true;
    }
  }, 220);
}

function revokeSpeechObjectUrl() {
  if (state.speechObjectUrl) {
    URL.revokeObjectURL(state.speechObjectUrl);
    state.speechObjectUrl = null;
  }
}

async function copyAiReadingContent() {
  const button = elements.aiCopyButton;
  const text = elements.aiReadingContent?.innerText?.trim();
  if (!button || !text) return;

  await copyTextWithButtonFeedback(text, button, "複製內容");
}

async function copyTextWithButtonFeedback(text, button, defaultLabel) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      copyTextWithTemporaryTextarea(text);
    }

    button.textContent = "已複製";
    window.setTimeout(() => {
      button.textContent = defaultLabel;
    }, 1600);
  } catch (error) {
    copyTextWithTemporaryTextarea(text);
    button.textContent = "已複製";
    window.setTimeout(() => {
      button.textContent = defaultLabel;
    }, 1600);
  }
}

function copyTextWithTemporaryTextarea(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function isLikelyMissingAiApi(error) {
  const message = String(error?.message || "");
  return (
    error instanceof SyntaxError ||
    /Unexpected token|is not valid JSON|Failed to fetch|NetworkError|API KEY|API key/i.test(message)
  );
}

function renderManualAiPromptFallback(readingInput) {
  const manualPrompt = buildManualAiPrompt(readingInput);

  elements.aiReadingContent.innerHTML = `
    <div class="manual-ai-fallback">
      <p>目前未設定 AI API Key，因此系統將使用本地資料庫進行解讀。</p>
      <p class="small-note">若想使用 AI 深度解讀，可複製下方 Prompt，貼到你慣用的 AI（例如 Gemini、ChatGPT、Copilot 或 Apple Intelligence）即可取得 AI 解讀。</p>
      <div class="manual-ai-prompt-header">
        <span>手動 AI Prompt</span>
        <button class="manual-ai-copy-button" type="button">複製 Prompt</button>
      </div>
      <textarea class="manual-ai-prompt" readonly>${escapeHtml(manualPrompt)}</textarea>
    </div>
  `;

  const button = elements.aiReadingContent.querySelector(".manual-ai-copy-button");
  const textarea = elements.aiReadingContent.querySelector(".manual-ai-prompt");
  button?.addEventListener("click", () => copyManualAiPrompt(manualPrompt, textarea, button));
}

async function copyManualAiPrompt(prompt, textarea, button) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(prompt);
    } else {
      textarea.select();
      document.execCommand("copy");
      textarea.setSelectionRange(0, 0);
    }

    button.textContent = "已複製";
    window.setTimeout(() => {
      button.textContent = "複製 Prompt";
    }, 1600);
  } catch (error) {
    textarea.select();
    button.textContent = "請手動複製";
  }
}

function buildManualAiPrompt(readingInput) {
  return [
    "你是一位溫柔、清楚、有人味的 Aura of Fate 塔羅解讀者，像懂塔羅的朋友正在陪我整理狀態，不像客服、老師或正式報告。",
    "你只能根據下方 JSON 提供的本地牌義資料解讀，不要自行新增未提供的牌義。",
    "請結合我的問題、占卜情境、牌陣位置、正逆位、關鍵字、象徵、核心牌義、情境牌義與建議牌義，生成自然的繁體中文解讀。",
    "請直接從「整體訊息」開始，不要自我介紹，不要寒暄，不要說「以下為你解析」。",
    "結構只包含：「整體訊息」、「牌陣解讀」、「行動建議」。",
    "整體訊息最多 2 句，簡單明瞭地回答目前的大方向。",
    "牌陣解讀是主要價值區。每張牌請寫成一個小段落，包含牌義重點、正逆位狀態、牌陣位置意義，以及和我的問題的具體關聯。不要只重述關鍵字。",
    "行動建議給 2 到 3 點，使用「1.」「2.」「3.」開頭；每點一句口語、具體、可執行的小行動。",
    "避免恐嚇式語氣，也不要做醫療、法律、投資保證；必要時提醒尋求專業協助。",
    "以下是本次抽牌資料：",
    JSON.stringify(readingInput, null, 2),
  ].join("\n\n");
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
      <p class="small-note card-position-line"><span class="reading-symbol-mini" aria-hidden="true"></span>${position} · ${orientationLabel(orientation)}</p>
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
  closePoolCardDetail();
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
    <article class="pool-card" data-card-id="${card.id}" tabindex="0" role="button" aria-label="查看 ${escapeHtml(card.nameZh)} 的牌意">
      <img src="./assets/images/cards/${card.imageFile}" alt="${escapeHtml(card.nameZh)}" loading="lazy" />
      <div class="pool-card-meta">
        <strong>${escapeHtml(card.nameZh)}</strong>
        <span>${escapeHtml(card.nameEn)}</span>
        <small>${typeLabel(card.type)}</small>
      </div>
    </article>
  `;
}

function handlePoolCardClick(event) {
  const poolCard = event.target.closest(".pool-card");
  if (!poolCard) return;
  openPoolCardDetail(poolCard.dataset.cardId);
}

function handlePoolCardKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") return;
  const poolCard = event.target.closest(".pool-card");
  if (!poolCard) return;
  event.preventDefault();
  openPoolCardDetail(poolCard.dataset.cardId);
}

function openPoolCardDetail(cardId) {
  const card = state.deck.find((item) => String(item.id) === String(cardId));
  if (!card) return;

  if (String(state.poolSelectedCardId) === String(card.id)) {
    closePoolCardDetail();
    return;
  }

  state.poolSelectedCardId = card.id;
  elements.poolGrid.querySelectorAll(".pool-card").forEach((poolCard) => {
    const isSelected = poolCard.dataset.cardId === String(card.id);
    poolCard.classList.toggle("is-selected", isSelected);
    poolCard.setAttribute("aria-pressed", String(isSelected));
  });

  const uprightKeywords = card.keywords?.upright ?? [];
  const reversedKeywords = card.keywords?.reversed ?? [];
  const situationMeaning = card.interpretation?.situations?.[state.currentSituation];
  elements.poolCardDetail.innerHTML = `
    <button class="pool-card-detail-card" type="button" aria-label="收起 ${escapeHtml(card.nameZh)} 的牌意">
      <img src="./assets/images/cards/${card.imageFile}" alt="${escapeHtml(card.nameZh)}" />
    </button>
    <div class="pool-card-detail-copy">
      <p class="kicker">${escapeHtml(typeLabel(card.type))}</p>
      <h3>${escapeHtml(card.nameZh)}</h3>
      <p class="pool-card-detail-en">${escapeHtml(card.nameEn)}</p>
      <p>${escapeHtml(card.coreMeaning || "暫無牌意資料。")}</p>
      ${poolKeywordTemplate("正位關鍵字", uprightKeywords)}
      ${poolKeywordTemplate("逆位關鍵字", reversedKeywords)}
      ${situationMeaning ? `<div class="pool-card-situation"><strong>目前情境解讀：${escapeHtml(situations[state.currentSituation] || "目前情境")}</strong><p>${escapeHtml(situationMeaning)}</p></div>` : ""}
      <button class="pool-card-detail-close" type="button">點擊牌卡收起</button>
    </div>
  `;
  elements.poolCardDetail.hidden = false;
  window.requestAnimationFrame(() => elements.poolCardDetail.classList.add("is-open"));
}

function poolKeywordTemplate(label, keywords) {
  if (!keywords.length) return "";
  return `<div class="pool-card-keywords"><strong>${label}</strong><div>${keywords.map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join("")}</div></div>`;
}

function handlePoolCardDetailClick(event) {
  if (event.target.closest(".pool-card-detail-card, .pool-card-detail-close")) {
    closePoolCardDetail();
  }
}

function closePoolCardDetail() {
  if (state.poolSelectedCardId === null) return;
  state.poolSelectedCardId = null;
  elements.poolCardDetail.classList.remove("is-open");
  elements.poolCardDetail.hidden = true;
  elements.poolCardDetail.innerHTML = "";
  elements.poolGrid.querySelectorAll(".pool-card.is-selected").forEach((poolCard) => {
    poolCard.classList.remove("is-selected");
    poolCard.setAttribute("aria-pressed", "false");
  });
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
  cancelVoiceFlow();
  stopAiSpeech();
  stopAiWaitVideo();
  state.currentDraw = [];
  state.readingLocked = false;
  closeQuestionSuggestions();
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
  closeQuestionSuggestions();
  elements.questionInput.disabled = true;
  elements.suggestionToggle.disabled = true;
  elements.situationButtons.querySelectorAll(".choice-button").forEach((button) => {
    button.disabled = true;
  });
  elements.spreadButtons.querySelectorAll(".choice-button").forEach((button) => {
    button.disabled = true;
  });
  elements.suggestionList.querySelectorAll(".suggestion-button").forEach((button) => {
    button.disabled = true;
  });
  updateQuestionContext();
}

function unlockReadingSetup() {
  elements.questionInput.disabled = false;
  elements.suggestionToggle.disabled = false;
  elements.situationButtons.querySelectorAll(".choice-button").forEach((button) => {
    button.disabled = false;
  });
  elements.spreadButtons.querySelectorAll(".choice-button").forEach((button) => {
    button.disabled = false;
  });
  elements.suggestionList.querySelectorAll(".suggestion-button").forEach((button) => {
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
