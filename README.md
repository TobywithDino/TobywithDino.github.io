# 與AI一起創作「精緻屍體」

**生成式 AI 的人文導論 · 期末專案**

🌐 [網站連結](https://TobywithDino.github.io)

---

## 創作理念

精緻屍體（Exquisite Corpse）是超現實主義的集體創作遊戲。參與者輪流在紙上創作，每個人只能看見前一人留下的極少部分，然後繼續延伸。最終揭開整幅作品時，往往出現任何人都無法單獨構思的奇異形象。

這件作品將這個遊戲的「另一位玩家」換成了生成式 AI。

AI 先完成畫面的上半部，而使用者只看得見接縫處的一條細線，便須接續創作下半部。AI 並不理解美，不懷有意圖，它所做的只是根據訓練資料，以機率的方式在畫紙上一個像素一個像素地塗上顏色。那些形象的出現，是統計的結果，而非意志的展現。

然而，當人選擇面對這條陌生的線，並決定如何回應，這個當下的猶豫與選擇，或許正是藝術之所在。

完成的作品會被保存在這座網頁美術館中，成為展覽的一部分。

---

## 技術架構

```
前端 (GitHub Pages)
  └── index.html / style.css / script.js
        │
        ├── POST /api/generate-image
        │     └── 後端呼叫 Replicate (Flux Schnell)
        │           └── 回傳 AI 生成圖片 URL
        │
        ├── POST /api/save-artwork
        │     ├── 接收 base64 合成圖片
        │     ├── 上傳至 Supabase Storage
        │     └── 寫入 Supabase Database
        │
        └── GET /api/gallery
              └── 從 Supabase 讀取隨機 10 張作品

後端 (Render)
  └── server.js (Node.js / Express)
        ├── Replicate API — AI 圖片生成
        └── Supabase — 作品儲存與讀取
```

### 使用技術

| 項目 | 技術 |
|------|------|
| 前端 | HTML / CSS / JavaScript (Canvas API) |
| 後端 | Node.js / Express，部署於 [Render](https://exquisite-corpse-with-genai.onrender.com) |
| AI 生成 | [Replicate](https://replicate.com) — black-forest-labs/flux-schnell |
| 資料庫 | [Supabase](https://supabase.com) — PostgreSQL + Storage |
| 前端部署 | GitHub Pages |
