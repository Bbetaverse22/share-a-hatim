# Share a Hatim 🌙

A collaborative Quran & Cevşen hatim app. Each hatim lives under a secret 12-character token in Firebase (`hatimByToken/{token}`), so only people with the link can open it. Your dashboard list is stored per device.

## Development

Edit `src/app.jsx`, then compile it to `app.js`:

```bash
npm install
```

```bash
npm run build
```

Serve the folder with any static server (e.g. `npx serve .`). Commit `app.js` along with your changes, because Vercel deploys it as is.

## Deployment

Every push to `main` auto-deploys on Vercel. Firebase rules are in `database.rules.json`:

```bash
firebase deploy --only database
```
