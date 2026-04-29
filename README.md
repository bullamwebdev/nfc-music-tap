# NFC Music Tap 🎵

Tap an NFC tag → instant Spotify. Zero servers. Hosted on **GitHub Pages**.

## How it works

1. Diffuser iPhone plays Spotify → scrobbles to Last.fm (`wise_song`)
2. Guest taps NFC tag → opens this static page
3. **Browser fetches Last.fm directly** (no backend needed)
4. "▶ Play on Spotify" → `spotify://search/Title+Artist` opens Spotify app

## Deploy to GitHub Pages

### 1. Fork / push this repo

```bash
git clone https://github.com/YOURNAME/nfc-music-tap.git
cd nfc-music-tap
```

### 2. Enable GitHub Pages

- Go to repo → **Settings** → **Pages**
- Source: **Deploy from a branch**
- Branch: `main` → `/ (root)`
- Save → wait ~1 min → get URL: `https://YOURNAME.github.io/nfc-music-tap/`

### 3. Write NFC Tag

- **NFC Tools** app → NDEF URI record
- URL: `https://YOURNAME.github.io/nfc-music-tap/` (or `/tap` if you rename the file)

## File Map

```
index.html   → Single static file, does everything
README.md    → This file
```

## No env vars needed

Last.fm API key is **public** (client-side safe). No Spotify secrets required — we use `spotify://search/` deep link instead of `spotify:track:URI`.

## Trade-off vs server version

| | GitHub Pages (this) | Vercel server |
|---|---|---|
| Hosting | Free forever | Free tier |
| Server | None | Node.js function |
| Spotify open | Search (1 tap away) | Direct track play |
| Cold start | Instant | ~300ms |
| Setup | 1 click | CLI + env vars |

## Requirements

- Diffuser iPhone: Spotify → Last.fm scrobbling enabled
- Last.fm account: `wise_song` (or change in `index.html`)
- Guest phone: Spotify app installed

## License

MIT
