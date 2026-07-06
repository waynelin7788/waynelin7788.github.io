# 視覺素材整理

## 資料夾結構

圖片素材已整理到：

- `source-materials/images/envoys`：七位元素使者全身基礎造型
- `source-materials/images/beasts`：七大神獸基礎造型

## 命名規則

檔名採用穩定英文 ID，方便後續程式、卡牌資料與 UI 綁定：

- `{element}_envoy_full.png`
- `{beast_id}_full.png`

原始檔名保留於 `data/visual-assets.json` 的 `originalFilename` 欄位。

## 使者圖片

| 元素 | 角色 | 檔案 |
| --- | --- | --- |
| 火 | 火元素使者 | `source-materials/images/envoys/fire_envoy_full.png` |
| 水 | 水元素使者 | `source-materials/images/envoys/water_envoy_full.png` |
| 土 | 土元素使者 | `source-materials/images/envoys/earth_envoy_full.png` |
| 風 | 風元素使者 | `source-materials/images/envoys/wind_envoy_full.png` |
| 電 | 電元素使者 | `source-materials/images/envoys/lightning_envoy_full.png` |
| 光 | 光元素使者 | `source-materials/images/envoys/light_envoy_full.png` |
| 闇 | 闇元素使者 | `source-materials/images/envoys/dark_envoy_full.png` |

## 神獸圖片

| 元素 | 神獸 | 檔案 |
| --- | --- | --- |
| 火 | 熾炎鳳凰 | `source-materials/images/beasts/ignis_phoenix_full.png` |
| 水 | 深淵利維坦 | `source-materials/images/beasts/abyssal_leviathan_full.png` |
| 土 | 泰坦岩龜 | `source-materials/images/beasts/titan_rock_tortoise_full.png` |
| 風 | 虛空影隼 | `source-materials/images/beasts/void_shadow_falcon_full.png` |
| 電 | 雷霆魔狼 | `source-materials/images/beasts/thunder_fenrir_full.png` |
| 光 | 聖裁天馬 | `source-materials/images/beasts/sanctity_pegasus_full.png` |
| 闇 | 虛空夢魘 | `source-materials/images/beasts/void_nightmare_full.png` |

## 後續建議

- 遊戲實作時不要直接載入全尺寸原圖作為手機 UI 圖片。
- 建議後續另外產生 `game-assets` 或 `public/assets` 用的壓縮版、縮圖版與卡牌裁切版。
- `source-materials` 應視為原始素材庫，保留高解析度版本。

