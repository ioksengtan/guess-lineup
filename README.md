# 橘架猜排列（guess-lineup）

拖曳卡片猜隱藏排列。送出後**只回報有幾個位置全對**（整數 N），不會標出是哪一格，也不會給「對了飲料但位置錯」的提示。分數是耗時秒數，愈低愈好。

首發題材：橘色飲料架。

## 本地執行

```bash
npm install
npm run dev
```

瀏覽器開啟終端機顯示的本機網址（預設 `http://localhost:5173`）。建議用手機寬度（約 360–430px）或開發者工具裝置模式。

```bash
npm test    # generateAnswer 穩定性、countCorrect
npm run build
```

純前端，不需後端或帳號。

## 線上玩

手機直接開：https://ioksengtan.github.io/guess-lineup/

GitHub Pages 專案站（`base` 在 CI 為 `/guess-lineup/`，本機仍是 `/`）。推到 `main` 後 Actions 會建置並部署。

## 怎麼玩

1. 設定格數（3–6，預設 4）與牌庫種類（4–8，預設 6；必須 ≥ 格數）。
2. 選單人或同機對戰。
3. 從牌庫**拖**卡片到空位；每種只有一張，放上去原位會留空洞（不會往前擠），拖回牌庫會回到原來的格子。格子互拖可交換，不會複製。牌庫永遠單列，卡片會等比縮小以塞進螢幕寬。
4. 填滿後按「送出」。畫面上會出現「目前 N 個位置全對」（不會標出是哪一格）。
5. N 等於格數即過關，計時停止。

對戰共用同一種子與同一答案。玩家 A 過關後進入交接畫面（清空猜測與回饋），玩家 B 進遊戲時才開始自己的計時。

## 規則鎖定

- 答案**不重複**（從牌庫不放回抽樣）。每種飲料實體只有一張。
- 計時在進入遊玩畫面時開始（A / B 各自獨立）。
- 牌庫是固定飲料 id 清單的前 N 個，不依種子洗牌；只有答案用種子。
- 第 8 種是標示 **P1** 的占位牌。

飲料 id 順序：`ghost-orange-cream`、`prime-orange`、`crush-orange`、`monster-ultra-sunrise`、`prime-ice-pop`、`peace-tea`、`gatorade-orange`、`p1`。

卡片可先用色塊＋標籤。若要換圖，放到 `public/assets/drinks/{id}.webp`。
