# Share a Hatim 🌙

A collaborative Quran & Cevşen hatim coordination app. Each hatim is stored under a **secret token** in Firebase; only people who receive the link can open that hatim (invite-only by capability). Your **dashboard list is per-device** (localStorage), not a global directory.

### Firebase Realtime Database rules

This repo includes [`database.rules.json`](database.rules.json) and [`firebase.json`](firebase.json). Apply rules in the [Firebase Console](https://console.firebase.google.com/) → your project → **Realtime Database** → **Rules** (paste / sync), or from this directory run:

```bash
firebase deploy --only database
```

**Important:** After locking rules, old data under `hatims/{pushId}` is no longer readable unless you migrate it to `hatimByToken/{64-char-hex}` manually or with a one-off script using the Admin SDK.

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
