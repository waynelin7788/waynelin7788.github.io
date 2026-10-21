# 第八章失敗結局支線：沒有名字的黎明

> 狀態：已接入第八章原型；獨立旁支，不改寫第八章原有選項與第九章入口。

## 進入方式與流程

在第八章「星噬者抵達之前」選擇「獨自踏進裂口，讓自己成為星錨」後，流程固定經過下列四個節點。每個節點只有一個選項，選擇後直接推進，不設返回或分歧：

1. **裂口門前的最後回望**：把牽引索交給英格瓦，獨自走進裂口。
2. **裂口內側的歸路**：沿星錨主鏈深入。
3. **星錨最後一節**：把共同旅程的記憶送入主鏈。
4. **無人回答的名字**：把自己的名字留在星門上。
5. **沒有名字的黎明**：調律者的名字與共同記憶被主鏈吸收；星群暫時獲救，但裂口只被拖入深處，未真正消失。

原有的「呼喚名字」和「穩住裂口」選項仍導向原第八章尾聲及第九章；失敗結局沒有前往第九章的按鈕。

## 專屬背景圖

- `assets/scenes/chapter-eight-failure-entry.webp`：裂口門前的選擇。
- `assets/scenes/chapter-eight-failure-descent.webp`：裂口內側的下行星道。
- `assets/scenes/chapter-eight-failure-anchor.webp`：破裂的星錨主鏈核心。
- `assets/scenes/chapter-eight-failure-name.webp`：等待名字的無名星門。
- `assets/scenes/chapter-eight-failure-ending.webp`：星群暫退後的無星海岸與未完全閉合的裂口。

## 實作位置

- 章節節點與劇情文字：`data/chapter-content.js` 的 `chapterEight.failureStages`、`chapterEight.failureFinales`。
- 推進、場景、存檔進度碼與故事紀錄：`src/main.js` 的第八章流程。
- 此支線每一節皆沿用第八章存檔和故事紀錄；結局可重新查看或開始新週目。
