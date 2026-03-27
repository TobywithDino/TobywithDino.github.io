# SDD — TobywithDino Personal Website

> **本文件為交付給 AI Agent 開發的完整需求規格書。**  
> Agent 應依照本文件中的所有規格、檔案結構、UI 設計及互動邏輯，從零生成完整可運行的靜態網站，部署目標為 GitHub Pages。

---

## 1. 專案基本資訊

| 欄位 | 值 |
|------|----|
| 擁有者 | TobywithDino |
| GitHub Repository | https://github.com/TobywithDino/TobywithDino.github.io |
| 部署網址 | https://TobywithDino.github.io |
| 部署平台 | GitHub Pages（靜態，免費）|
| 開發環境 | Windows，VSCode + Live Server |

---

## 2. 個人資料（直接填入程式碼，不使用佔位符）

| 欄位 | 值 |
|------|----|
| 顯示名稱 | Toby |
| 自我介紹文字 | 我目前就讀中央大學資訊工程學系四年級，平時喜歡彈吉他、打排球，這是我最近新的 side project，做一個自我介紹的網站，請多多指教！ |
| 大頭貼路徑 | `assets/avatar.jpg`（由使用者自行放入，預設顯示佔位圓形）|
| Instagram | https://www.instagram.com/toby.0928/?hl=zh-tw |
| GitHub | https://github.com/TobywithDino |
| Email | penguinoftoby@gmail.com（連結使用 `mailto:penguinoftoby@gmail.com`）|

---

## 3. 專案目錄結構

Agent 需生成以下所有檔案：

```
TobywithDino.github.io/
│
├── index.html              # 首頁
├── style.css               # 全站共用樣式（含動畫、RWD）
├── main.js                 # 全站互動邏輯（貓貓漂浮、喵聲、按鈕動效）
├── weather.js              # 天氣 + 座標模組（獨立檔案，方便未來維護）
│
├── assets/
│   ├── avatar.jpg          # 大頭貼（使用者自行替換，agent 產生佔位元素）
│   └── meow.mp3            # 貓叫聲音效（使用者自行替換，或由 JS 用 Web Audio API 產生替代音）
│
├── guitar/
│   └── index.html          # 吉他相關應用分頁（骨架，內容 Coming Soon）
│
└── games/
    └── index.html          # 個人網頁遊戲分頁（骨架，內容 Coming Soon）
```

---

## 4. 設計風格規範

| 屬性 | 規格 |
|------|------|
| 整體風格 | **簡潔（Minimalist）**，大量留白，排版清晰 |
| 配色方向 | 淺色系為主（白 / 淺灰）+ 單一主色調（建議米白 / 淡藍 / 淡綠擇一）|
| 字型 | `Noto Sans TC`（繁中）+ `Inter`（英文），均從 Google Fonts 引入 |
| 圓角 | 卡片、按鈕統一使用 `border-radius: 1rem` |
| 陰影 | 使用柔和 box-shadow，避免過重 |
| 響應式（RWD）| **必須支援**，斷點設計：Mobile（< 480px）、Tablet（480–768px）、Desktop（> 768px）|

---

## 5. 首頁 `index.html` — 版面規格（由上至下）

### Section 0 — 天氣 & 座標小工具列（頁面最頂部，橫幅式）

- 位置：Hero 區塊**正上方**，橫幅置中，寬度隨視窗縮放
- 元件（水平排列，間距均等）：
  1. **座標 / 地點**：`📍 台北市, 台灣`（預設值，可由 Geolocation API 更新）
  2. **天氣圖示 + 狀態文字**：對應天氣代碼顯示（見第 8 節天氣規格）
  3. **降雨機率**：`🌧 降雨機率 XX%`
  4. **溫度**（選用）：`🌡 XX°C`
- 樣式：字體小（`0.85rem`），底色略深於頁面背景（淺灰或毛玻璃效果 `backdrop-filter: blur`），不搶主視覺
- 資料載入中顯示 skeleton / loading 文字，失敗時顯示 `⚠️ 天氣資訊暫時無法取得`

### Section 1 — Hero（個人介紹區）

- 版面：垂直置中，水平置中
- 元件（由上至下）：
  1. **大頭貼**
     - 顯示 `assets/avatar.jpg`
     - 圓形裁切（`border-radius: 50%`）
     - 尺寸：Desktop 150px × 150px；Mobile 110px × 110px
     - 若圖片不存在，顯示有背景色的佔位圓形（CSS fallback）
  2. **姓名標題**：`Toby`，`font-size: 2rem`，粗體
  3. **自我介紹段落**：如第 2 節所定義，`font-size: 1rem`，`max-width: 480px`，置中對齊
  4. **社群連結列**（水平排列，間距均等）：
     - Instagram icon → 開新分頁連至 `https://www.instagram.com/toby.0928/?hl=zh-tw`
     - GitHub icon → 開新分頁連至 `https://github.com/TobywithDino`
     - Email icon → `mailto:penguinoftoby@gmail.com`
     - Icon 來源：**Font Awesome 6 Free CDN**
     - Icon 大小：`1.6rem`；hover 時放大 + 改色（動畫 transition 0.2s）

### Section 2 — 分頁導覽卡片區

- 標題文字：`My Projects`（或 `我的專區`），小標，置中
- 兩張並排卡片（Desktop 水平並排；Mobile 垂直堆疊）
- 卡片規格：

  | 卡片 | Emoji | 標題 | 副標 | 連結路徑 |
  |------|-------|------|------|----------|
  | 吉他應用 | 🎸 | Guitar | 吉他相關工具與應用 | `./guitar/` |
  | 網頁遊戲 | 🎮 | Games | 個人開發的網頁遊戲 | `./games/` |

- 卡片互動：
  - hover → 輕微上移（`translateY(-6px)`）+ 加深陰影，transition 0.25s
  - 整張卡片可點擊（`<a>` 包覆）
  - 卡片點擊按下時有輕微縮小效果（`scale(0.97)`）

---

## 6. 互動功能規格

### 6.1 漂浮貓貓背景

- 在頁面背景層（`position: fixed`，`z-index: -1`）隨機產生多隻小貓圖示
- 貓的呈現方式：使用 CSS + Unicode 貓咪 emoji（`🐱`）或內嵌 SVG 貓圖（優先使用 emoji）
- 數量：**6 ~ 10 隻**，隨機初始位置分佈於視窗各處
- 動態效果：每隻貓以不同速度、不同方向緩慢漂浮（CSS `@keyframes` 實作，`animation-duration` 在 8s ~ 18s 之間隨機）
- 大小：`1.5rem` ~ `2.5rem` 之間隨機
- 透明度：`0.25` ~ `0.45`（淡化，不干擾主內容閱讀）

### 6.2 點擊貓貓發出喵聲

- 每隻漂浮貓貓元素加上 `click` 事件監聽
- 點擊時播放喵聲音效：
  - **優先**：載入 `assets/meow.mp3`（使用者自備）
  - **備援**：若音效檔案不存在，使用 Web Audio API 合成簡短「嗶」聲作為替代，確保功能不因缺少音檔而出錯
- 點擊同時貓貓執行短暫跳動動畫（`scale(1.4)` → 還原，duration 300ms）

### 6.3 按鈕動態效果

- 所有互動按鈕（社群 icon、分頁卡片）需有以下動效：
  - **Hover**：輕微放大 / 上移 + 顏色過渡，`transition: all 0.2s ease`
  - **Active（按下）**：輕微縮小 `scale(0.95)`
  - **Focus**：顯示清晰的 outline（無障礙需求）

---

## 7. 座標功能規格

### 7.1 預設座標

- 預設城市：**台北市**
- 預設經緯度：`lat: 25.0330, lon: 121.5654`
- 任何 Geolocation 失敗、拒絕授權或 API 錯誤，均回退至此預設值，不中斷頁面運作

### 7.2 Geolocation 取得流程

```
頁面載入
  └─▶ 嘗試呼叫 navigator.geolocation.getCurrentPosition()
        ├─▶ 成功 → 取得 lat / lon → 呼叫 Reverse Geocoding 或直接帶入天氣 API
        │         → 更新頁面顯示的城市名稱（若 Reverse Geocoding 成功）
        └─▶ 失敗 / 拒絕 → 使用預設台北座標，靜默 fallback（不跳警告）
```

### 7.3 Reverse Geocoding（座標轉城市名，選用）

- 使用 **OpenWeatherMap Geocoding API**（免費，不需額外 key）：
  ```
  GET https://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit=1&appid={API_KEY}
  ```
- 取回 `name`（城市）+ `country`（國家代碼）組成顯示字串，例如 `台北市, TW`
- 若此 API 呼叫失敗，維持預設文字 `台北市, 台灣`

### 7.4 未來擴充預留介面

- `weather.js` 中需匯出以下函式供未來呼叫，保留擴充性：
  ```js
  // 由外部傳入座標（例如手機 App 透過 postMessage 或 URL 參數傳入）
  export function setLocation(lat, lon, cityName = null) { ... }
  ```
- 支援透過 **URL Query String** 傳入座標，方便未來手機端或其他頁面直接帶參數：
  ```
  https://TobywithDino.github.io/?lat=25.0330&lon=121.5654
  ```
  頁面載入時優先讀取 URL 參數，其次用 Geolocation，最後 fallback 預設值

---

## 8. 天氣功能規格

### 8.1 使用的 API — 中央氣象署開放資料平台

- **API 來源**：[中央氣象署開放資料平台（CWA Open Data）](https://opendata.cwa.gov.tw/)
- **授權方式**：免費申請 API 授權碼，網址：https://opendata.cwa.gov.tw/userLogin
- **主要使用端點**（一般天氣預報）：
  ```
  GET https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001
      ?Authorization={API_KEY}
      &locationName={城市名稱}
      &elementName=Wx,PoP,MinT,MaxT
  ```
  | 參數 | 說明 |
  |------|------|
  | `Authorization` | 申請到的 API 授權碼 |
  | `locationName` | 縣市名稱，例如 `臺北市`（注意是繁體「臺」）|
  | `Wx` | 天氣現象（含天氣代碼 + 描述）|
  | `PoP` | 12 小時降雨機率（0 ~ 100%）|
  | `MinT` / `MaxT` | 最低 / 最高溫度（°C）|

- **備用端點（逐時，精度更高）**：
  ```
  GET https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-061
      ?Authorization={API_KEY}
      &locationName={行政區}
      &elementName=WeatherDescription,PoP6h,T
  ```
  此端點精細到「行政區」層級，未來擴充定位功能時可切換至此

### 8.2 天氣代碼對應顯示規格

CWA 天氣現象代碼（`Wx`）為數字，Agent 需實作對應表如下：

| 天氣代碼範圍 | 天氣描述（代表）| 顯示 Emoji | 顯示文字 |
|------------|----------------|-----------|--------|
| 1 | 晴天 | ☀️ | 晴天 |
| 2 | 晴時多雲 | 🌤️ | 晴時多雲 |
| 3 ~ 6 | 多雲 / 陰天 | ⛅ | 多雲 |
| 7 ~ 9 | 陰天 | ☁️ | 陰天 |
| 10 ~ 14 | 短暫雨 / 陣雨 | 🌦️ | 短暫雨 |
| 15 ~ 22 | 雨天 | 🌧️ | 雨天 |
| 23 ~ 27 | 大雨 / 豪雨 | ⛈️ | 大雨 |
| 28 ~ 41 | 暴雨 / 雷雨 | 🌩️ | 暴雨 |

> 完整代碼表參考：https://opendata.cwa.gov.tw/opendatadoc/MFC/A0012-001.pdf  
> Agent 實作時可將對應表定義為 `weather.js` 內的 `WEATHER_CODE_MAP` 常數物件

### 8.3 顯示狀態機

```
[初始化]
  └─▶ 顯示 loading skeleton（灰色佔位列）
        └─▶ 取得座標（見第 7 節）
              └─▶ 呼叫 CWA API
                    ├─▶ 成功 → 解析資料 → 更新 DOM（天氣圖示、文字、降雨機率、溫度）
                    └─▶ 失敗（網路、超時、無效 key）→ 顯示 ⚠️ 天氣資訊暫時無法取得
```

### 8.4 API Key 處理方式

- 由於本站為純靜態網頁，API Key **直接寫入 `weather.js`**（無後端可隱藏）
- Agent 在程式碼中以 `const CWA_API_KEY = 'YOUR_CWA_API_KEY';` 常數形式定義，並加上明顯的註解提示使用者替換
- 未來若需保護 Key，可考慮 Cloudflare Worker 作為 Proxy（列為 Backlog）

### 8.5 城市名稱對應表（預設台北，Geolocation 擴充用）

由於 CWA API 的 `locationName` 需使用繁體中文縣市名稱，`weather.js` 需維護一份座標→縣市名稱的對應邏輯：

```js
// 簡易縣市邊界判斷（依緯度/經度範圍），或直接使用 Reverse Geocoding 回傳的城市名稱
const DEFAULT_CITY = '臺北市';
```

---

## 9. 子分頁規格（骨架）

### 9.1 `guitar/index.html`

- 頁面標題（`<title>`）：`Guitar | TobywithDino`
- 頁面顯示內容：
  - 返回首頁的連結按鈕（左上角或頁頂）
  - 置中大標題：`🎸 Guitar`
  - 副標：`Coming Soon — 吉他工具與應用即將上線`
  - 樣式風格與首頁一致（引用同一份 `style.css`）

### 9.2 `games/index.html`

- 頁面標題（`<title>`）：`Games | TobywithDino`
- 頁面顯示內容：
  - 返回首頁的連結按鈕（左上角或頁頂）
  - 置中大標題：`🎮 Games`
  - 副標：`Coming Soon — 個人網頁遊戲即將上線`
  - 樣式風格與首頁一致（引用同一份 `style.css`）

---

## 10. 技術規範與限制

| 項目 | 規格 |
|------|------|
| 標記語言 | HTML5，語意化標籤（`<header>`, `<main>`, `<section>`, `<footer>`）|
| 樣式 | 純 CSS3，禁止使用 Bootstrap 等 CSS 框架 |
| JavaScript | 純 Vanilla JS（ES6+），禁止引入 jQuery 或其他框架 |
| 字型 | Google Fonts CDN（`Noto Sans TC` + `Inter`）|
| Icon | Font Awesome 6 Free CDN |
| 圖片 | `assets/avatar.jpg`（使用者自備）|
| 音效 | `assets/meow.mp3`（使用者自備，JS 需處理缺檔備援）|
| 天氣 API | 中央氣象署 CWA Open Data（免費授權碼，使用者自行申請填入）|
| Geolocation | 瀏覽器原生 `navigator.geolocation`，失敗時 fallback 台北預設座標 |
| 外部依賴 | 僅允許 Google Fonts CDN + Font Awesome CDN + CWA API，其餘皆本地實作 |
| 瀏覽器相容 | 現代瀏覽器（Chrome / Firefox / Safari / Edge 最新版）|
| 無障礙 | icon 連結需加 `aria-label`；圖片需加 `alt` 屬性 |

---

## 11. 部署說明（GitHub Pages）

```powershell
# Clone 已建立的 repo
git clone https://github.com/TobywithDino/TobywithDino.github.io.git
cd TobywithDino.github.io

# 將 agent 產生的所有檔案放入此目錄後提交
git add .
git commit -m "feat: init personal website"
git push origin main
```

- 確認 GitHub → Settings → Pages → Source 設定為 `main` 分支 `/root`
- 部署完成後網址：**https://TobywithDino.github.io**

---

## 12. 後續擴充方向（Backlog，本次不實作）

- [ ] 吉他分頁：線上和弦查詢 / 節拍器工具
- [ ] 遊戲分頁：填入個人開發的網頁遊戲
- [ ] Dark Mode 切換
- [ ] 自訂網域（Custom Domain）綁定
- [ ] 頁面切換 Fade-in 動畫
- [ ] 天氣：切換至逐時預報端點（F-D0047-061），精細至行政區
- [ ] 天氣：Cloudflare Worker Proxy 保護 CWA API Key
- [ ] 座標：手機 App 透過 `postMessage` 或 URL Query String 動態傳入定位
- [ ] 座標：多城市切換下拉選單

---

## 13. 里程碑 (Milestones)

| 階段 | 目標 | 狀態 |
|------|------|------|
| M1 | 完成 SDD 文件 | ✅ 完成 |
| M2 | 生成 `index.html` + `style.css` + `main.js` | ⬜ 待開始 |
| M3 | 生成 `weather.js` 並串接 CWA API | ⬜ 待開始 |
| M4 | 生成 `guitar/index.html` + `games/index.html` | ⬜ 待開始 |
| M5 | 本機 Live Server 驗證所有功能（含天氣、Geolocation）| ⬜ 待開始 |
| M6 | Push 至 GitHub，確認 Pages 上線 | ⬜ 待開始 |
