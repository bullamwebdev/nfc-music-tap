# NFC Music Tap 🎵

Tap NFC tag → opens page → **▶ Play on Spotify** → **auto-plays exact track**. Zero login.

## How it works

1. Diffuser iPhone plays Spotify → scrobbles to Last.fm (`wise_song`)
2. Guest taps NFC tag → opens web page
3. Page calls `/api/tap` → fetches now playing + searches Spotify for exact track URI
4. Green button → `spotify:track:ID?play=true` deep link → **Spotify opens + plays**

## Deploy to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Deploy

```bash
git clone https://github.com/bullamwebdev/nfc-music-tap.git
cd nfc-music-tap
vercel --prod
```

### 4. Set Environment Variables

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Project → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `SPOTIFY_CLIENT_ID` | `7f512f8773424a50b32130185023690a` |
| `SPOTIFY_CLIENT_SECRET` | `db10418a20fc4a798b28800e8966ab1b` |
| `LASTFM_API_KEY` | `a97e01d1ca04ed66d629eed5117df482` |
| `LASTFM_USERNAME` | `wise_song` |

### 5. Redeploy

```bash
vercel --prod
```

## Write NFC Tag

- **NFC Tools** app → NDEF URI record
- URL: `https://YOUR-VERCEL-URL.vercel.app/`

## Architecture

```
/                    → static index.html (glassmorphism card)
/api/tap             → serverless function (Last.fm + Spotify search)
/play-now.jpg        → background image
```

## File Map

```
/
├── api/
│   └── tap.js       → serverless: Last.fm → Spotify search → JSON
├── index.html       → static: fetches /api/tap, renders card
├── play-now.jpg     → background image
└── README.md
```

## Auto-play behaviour

| Spotify plan | Behaviour |
|--------------|-----------|
| **Premium** | Track auto-plays when Spotify app opens |
| **Free** | Track page opens, user taps play once |

If Spotify app is not installed, falls back to web player URL.

## Requirements

- Diffuser iPhone: Spotify → Last.fm scrobbling enabled
- Last.fm account: `wise_song` (or change env var)
- Guest phone: Spotify app installed (for auto-play)

## License

MIT
