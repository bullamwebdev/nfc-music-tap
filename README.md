# NFC Music Tap 🎵

Tap an NFC tag at the bar → instant one-tap Spotify playback. Zero login. Zero friction.

## How it works

1. Diffuser iPhone plays Spotify → Last.fm scrobbles live
2. Guest taps NFC tag → phone opens this web page
3. Page shows the **exact track** currently playing
4. One green button → deep links directly into Spotify app

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

## Environment Variables

Set these in the Vercel dashboard (Project → Settings → Environment Variables):

| Key | Value |
|-----|-------|
| `SPOTIFY_CLIENT_ID` | `7f512f8773424a50b32130185023690a` |
| `SPOTIFY_CLIENT_SECRET` | `db10418a20fc4a798b28800e8966ab1b` |
| `LASTFM_API_KEY` | `a97e01d1ca04ed66d629eed5117df482` |
| `LASTFM_USERNAME` | `wise_song` |

## Write NFC Tag

1. Download **NFC Tools** (iOS / Android)
2. Write an **NDEF URI record**
3. URL: `https://YOUR-VERCEL-URL.vercel.app/tap`
4. Tap the tag → instant now-playing page

## Architecture

- **Stateless** — no DB, every tap fetches fresh Last.fm data
- **Cold-start < 1s** — single Vercel function, no bundler overhead
- **No user auth** — Spotify Client Credentials + deep links only
- **Zero client JS** — pure server-rendered HTML

## File Map

```
index.js      → Express app, /tap route
lastfm.js     → Fetch now playing from Last.fm
spotify.js    → Client Credentials token manager
template.js   → HTML card renderer
vercel.json   → Vercel serverless config
package.json  → deps (express, node-fetch)
```

## Spotify App Requirements

- The diffuser iPhone must have Spotify connected to Last.fm account `wise_song`
- Use [Last.fm Scrobbler app](https://www.last.fm/about/trackmymusic) or built-in Spotify scrobbling
- **Scrobbling must be real-time** — Last.fm updates ~30s after track starts

## License

MIT
