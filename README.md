# slaypedia 🔥
### Gen Z Slang Dictionary — React + Tailwind CSS v4 + Node.js

---

## Project Structure

```
slaypedia/
├── backend/
│   ├── server.js          ← Express API (Node.js)
│   ├── .env               ← PORT config
│   └── package.json
│
└── frontend/
    ├── index.html
    ├── vite.config.js     ← Tailwind v4 plugin + /api proxy
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx            ← Root component + view state
        ├── api.js             ← All fetch calls
        ├── index.css          ← Tailwind v4 @import + @theme tokens
        ├── hooks/
        │   └── useStorage.js  ← useFavorites + useHistory (localStorage)
        └── components/
            ├── Cursor.jsx         Custom animated cursor
            ├── Ticker.jsx         Scrolling slang marquee
            ├── SearchBar.jsx      Search input + suggestion pills
            ├── HistoryBar.jsx     Recent search history
            ├── SlangCard.jsx      Result card (fav, copy, modal)
            ├── WordModal.jsx      Full word detail overlay
            ├── FavoritesPanel.jsx Slide-in drawer for saved words
            ├── RandomWord.jsx     Word of the moment + shuffle
            ├── Trending.jsx       10 curated trending words
            └── QuizMode.jsx       5-round multiple choice quiz
```

---

## Quick Start

### Step 1 — Backend

```bash
cd backend
npm install
npm start
```
Backend runs at → **http://localhost:3001**

### Step 2 — Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```
Frontend runs at → **http://localhost:5173**

### Step 3 — Open browser

Go to **http://localhost:5173** 🎉

---

## Features

| Feature | Description |
|---|---|
| **Search** | Full-text search across 1,779 Gen Z slang words |
| **Word detail modal** | Click any card → full definition + example. Press Esc to close |
| **Favorites** | Save words with ♡. Persists in localStorage |
| **Search history** | Last 20 searches shown as clickable pills |
| **Random word** | Shuffles a new word on load + shuffle button |
| **Trending** | 10 curated popular words |
| **Quiz mode** | 5-round multiple choice — guess the word from its definition |
| **Custom cursor** | Animated cursor with mix-blend-mode effect |
| **Copy to clipboard** | Copy any definition in one click |

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/search?q=rizz&limit=9` | Search slang words |
| GET | `/api/word/:word` | Best match for a word |
| GET | `/api/random` | Random slang word |
| GET | `/api/trending` | 10 trending words |
| GET | `/api/health` | Health check |

---

## Tech Stack

- **Frontend** — React 18, Tailwind CSS v4, Vite 5
- **Backend** — Node.js, Express, dotenv
- **Data** — [MLBtrio/genz-slang-dataset](https://huggingface.co/datasets/MLBtrio/genz-slang-dataset) via HuggingFace Dataset Viewer API (free, no key needed)
