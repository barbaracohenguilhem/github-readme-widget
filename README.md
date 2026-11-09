# GitHub Profile Pet

A Next.js API route that returns a self-contained SVG showing your current GitHub contribution streak. The cat is awake while the streak is active and sleeps when it reaches zero.

## Configure

Copy `.env.example` to `.env` and set `GITHUB_TOKEN`. Optionally set `GITHUB_USERNAME` to query a specific account; without it, the widget uses the token's authenticated account.

Use a GitHub token with permission to read the selected account's contribution data. Keep `.env` local and never commit the token. If a token has been shared in chat or another public place, revoke it and create a replacement.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to preview the widget. The SVG is served from `/api/pet`.

## Add artwork

Place these optional files in `public/assets/`:

- `sleeping_cat.png`
- `awake_cat.png`
- `fish.png`

The endpoint embeds available PNGs as Base64 data URLs. If an image is missing, it draws a small SVG fallback instead.

## Embed in a profile README

After deploying the app, add an image tag to your GitHub profile README and replace the example host with your deployment URL:

```html
<img src="https://your-domain.vercel.app/api/pet" alt="GitHub contribution streak" />
```

The endpoint caches GitHub contribution data for one hour.