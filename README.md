# Share a Hatim 🌙

A collaborative Quran & Cevşen hatim coordination app. Each hatim is stored under a **secret token** in Firebase. Only people who receive the link can open that hatim (invite-only by capability). Your **dashboard list is per-device** (localStorage), not a global directory.

## Features

- Create a Quran (by juz/page) or Cevşen hatim and share it with a link
- Participants claim pages, and claimant names show directly on the juz cards
- **My Pages** panel: see the pages you claimed and mark them done
- Live sync across everyone's devices via Firebase Realtime Database
- Installable PWA that works offline for the app shell

## Stack

- React 18 (production UMD build via CDN). JSX is **precompiled** with Babel, so nothing is compiled in the browser
- Firebase Realtime Database (compat SDK 13.x)
- PWA with a service worker: network-first for app files, cache-first for pinned CDN assets

## Project layout

| Path | What it is |
| --- | --- |
| `src/app.jsx` | **App source.** Edit this. |
| `app.js` | Compiled output of `src/app.jsx`. Committed and served as is. Don't edit by hand. |
| `index.html` | Shell: styles, Firebase config, script tags |
| `sw.js` | Service worker |
| `database.rules.json` | Firebase Realtime Database security rules |
| `tweaks-panel.js` | Optional design-tweaks helper. Not loaded by the app. |

## Local development

```bash
npm install
```

```bash
npm run watch   # recompiles app.js whenever src/app.jsx changes
```

In a second terminal, serve the folder with any static server:

```bash
npx serve .
```

Open `http://localhost:3000`.

**Before committing, run `npm run build`** so `app.js` matches `src/app.jsx`. Vercel deploys the committed `app.js` and runs no build step.

## Data model and Firebase rules

Hatims live at `hatimByToken/{token}`, where `token` is a 12-character base62 string (`[0-9a-zA-Z]{12}`). Claimed pages are under `pageList/{page}` with `claimedBy`, `claimedAt` and an optional `completedAt`.

This repo includes [`database.rules.json`](database.rules.json) and [`firebase.json`](firebase.json). Apply the rules in the [Firebase Console](https://console.firebase.google.com/) → your project → **Realtime Database** → **Rules**, or from this directory run:

```bash
firebase deploy --only database
```

The legacy `hatims/{pushId}` path is locked (no reads or writes). Old data there must be migrated to `hatimByToken/{token}` with an Admin SDK script if you need it.

## Deployment

Connected to Vercel via GitHub. Every push to `main` auto-deploys. `index.html`, `app.js` and `sw.js` are served with `Cache-Control: no-cache`, and the service worker fetches app files network-first. Users get new releases on their next load without bumping the cache version.
