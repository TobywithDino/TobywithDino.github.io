# TobywithDino — Personal Website

> 🌐 Live at **[https://TobywithDino.github.io](https://TobywithDino.github.io)**

A minimalist personal introduction website built with pure HTML / CSS / Vanilla JS, deployed via GitHub Pages.

---

## Features

- **Hero Section** — Avatar, name, self-introduction, and social links (Instagram / GitHub / Email)
- **Weather Bar** — Real-time weather powered by [CWA Open Data](https://opendata.cwa.gov.tw/), showing weather condition, precipitation probability, and temperature
- **Geolocation** — Auto-detects your location via browser API; falls back to Taipei by default
- **Floating Cats** — Animated cat emojis drifting in the background; click them to hear a meow 🐱
- **Project Pages** — Skeleton pages for Guitar tools and Web Games (coming soon)
- **Responsive Design** — Mobile / Tablet / Desktop breakpoints

---

## Project Structure

```
TobywithDino.github.io/
├── index.html        # Main page
├── style.css         # Global styles + animations + RWD
├── main.js           # Floating cats, meow sound, button effects
├── weather.js        # Weather & geolocation module (CWA API)
├── assets/
│   ├── avatar.jpg    # Profile photo (add your own)
│   └── meow.mp3      # Meow sound effect (add your own, optional)
├── guitar/
│   └── index.html    # Guitar tools page (coming soon)
└── games/
    └── index.html    # Web games page (coming soon)
```

---

## Setup

### 1. Clone the repo

```powershell
git clone https://github.com/TobywithDino/TobywithDino.github.io.git
cd TobywithDino.github.io
```

### 2. Add your assets

- Place your profile photo as `assets/avatar.jpg`
- *(Optional)* Place a meow sound as `assets/meow.mp3`

### 3. Set up the Weather API key

Apply for a free API key at [CWA Open Data](https://opendata.cwa.gov.tw/userLogin), then open `weather.js` and replace:

```js
const CWA_API_KEY = 'YOUR_CWA_API_KEY';
```

### 4. Preview locally

Open `index.html` with **VSCode Live Server** extension for instant preview.

### 5. Deploy

```powershell
git add .
git commit -m "your message"
git push origin main
```

GitHub Pages will automatically deploy from the `main` branch.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Markup | HTML5 (semantic tags) |
| Styling | Pure CSS3 (Flexbox / Grid, no frameworks) |
| Scripting | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — Inter + Noto Sans TC |
| Icons | Font Awesome 6 Free |
| Weather API | CWA Open Data (Taiwan) |
| Hosting | GitHub Pages |

---

## Roadmap

- [ ] Guitar page: online chord lookup / metronome
- [ ] Games page: personal web games
- [ ] Dark mode toggle
- [ ] Cloudflare Worker proxy to protect API key

---

© 2026 TobywithDino. All rights reserved.