function renderCard({ title, artist, album, image, trackUri, trackUrl }) {
  const fallbackImage = 'https://i.imgur.com/3kJCXU0.png'; // generic vinyl icon
  const cover = image || fallbackImage;
  const spotifyDeepLink = trackUri ? `spotify:track:${trackUri}` : (trackUrl || '#');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Now Playing · ${title}</title>
<meta name="theme-color" content="#000000">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #000;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 24px;
  text-align: center;
}
.cover {
  width: 240px;
  height: 240px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  margin-bottom: 32px;
  background: #111;
}
.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 6px;
  line-height: 1.2;
  max-width: 100%;
}
.meta {
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 32px;
}
.btn {
  display: inline-block;
  background: #1DB954;
  color: #fff;
  text-decoration: none;
  padding: 14px 32px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  transition: transform 0.1s, background 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.btn:active {
  transform: scale(0.96);
}
.fallback {
  font-size: 1.1rem;
  color: #aaa;
}
.fallback .emoji { font-size: 2rem; margin-bottom: 16px; }
.badge {
  display: inline-block;
  background: #1DB954;
  color: #000;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
</head>
<body>
${trackUri ? `
  <div class="badge">Now Playing</div>
  <img class="cover" src="${cover}" alt="${album || title}" crossorigin="anonymous">
  <div class="title">${escapeHtml(title)}</div>
  <div class="meta">${escapeHtml(artist)} ${album ? `· ${escapeHtml(album)}` : ''}</div>
  <a class="btn" href="${spotifyDeepLink}">▶ Play on Spotify</a>
` : `
  <div class="fallback">
    <div class="emoji">🎵</div>
    Nothing playing right now
  </div>
`}
</body>
</html>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default renderCard;
