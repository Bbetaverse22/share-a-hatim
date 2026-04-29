# Share a Hatim 🌙

A collaborative Quran & Cevşen hatim coordination app. Anyone with the link can claim pages and track group progress in real time.

## Stack

- Vanilla React (via CDN + Babel standalone) — no build step
- Firebase Realtime Database — real-time sync
- PWA — installable on mobile

## Local Development

```bash
# Serve locally (any static server works)
npx serve .
# or
python3 -m http.server
```

Open `http://localhost:3000` (or `8000`).

## Deployment

Connected to Vercel via GitHub. Every push to `main` auto-deploys.
