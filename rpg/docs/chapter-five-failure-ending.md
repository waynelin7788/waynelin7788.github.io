# 第五章失敗結局支線：有光抵達，無人歸來

> 狀態：已接入第五章原型；新增一條高代價旁支，原有「假星遠行」與「第一守護者的回聲」兩種結果維持原樣。

## 進入方式與流程

在第五章「古鏡映出的名字」選擇「同時送出假星與名字的回聲」後，流程固定經過下列四個節點。每個節點只有一個選項，選擇後直接推進：

1. **鏡心過載**：把假星訊號與名字回聲疊在一起，以調律者的記憶補足古鏡的力量。
2. **越過無星的航道**：沿著假星引導船隊撤離，持續以記憶維持航線。
3. **抵達的回答**：收到第一守護者回傳的回聲和七約聖所座標，再把訊息送回渡口。
4. **回到沒有星圖的渡口**：居民已安全撤離，但隊伍無法想起調律者，也失去共同旅程的記憶。
5. **有光抵達，無人歸來**：假星成功引走星噬者、回聲成功送達，居民也平安；古鏡耗盡了調律者的名字與隊伍記憶，沒有人能繼續追查座標。

此結局不提供前往第六章的按鈕。原有兩個古鏡選項仍分別通往原結局及既有後續路線。

## 專屬背景圖

- `assets/scenes/chapter-five-failure-entry.webp`：古鏡同時發出兩道訊號。
- `assets/scenes/chapter-five-failure-crossing.webp`：假星引路、穿越無星航道。
- `assets/scenes/chapter-five-failure-echo.webp`：星圖之外的回聲檔案。
- `assets/scenes/chapter-five-failure-harbor.webp`：居民撤離後的無星渡口。
- `assets/scenes/chapter-five-failure-ending.webp`：失敗結局的空岸與熄滅的古鏡。

## 實作位置

- 節點與劇情文字：`data/chapter-content.js` 的 `chapterFive.failureStages`、`chapterFive.failureFinales`。
- 推進、場景、存檔進度碼與故事紀錄：`src/main.js` 的第五章流程。
- 此支線沿用第五章存檔及故事紀錄；結局可重新查看或開始新週目。
