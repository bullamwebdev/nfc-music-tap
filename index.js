import express from 'express';
import fetch from 'node-fetch';
import getNowPlaying from './lastfm.js';
import getSpotifyToken from './spotify.js';
import renderCard from './template.js';

const app = express();

app.get('/tap', async (req, res) => {
  try {
    const nowPlaying = await getNowPlaying();

    // If nothing is currently playing, show fallback immediately
    if (!nowPlaying || !nowPlaying.isNowPlaying) {
      return res.send(renderCard({
        title: '', artist: '', album: '', image: '', trackUri: null, trackUrl: null
      }));
    }

    const { title, artist, album, image } = nowPlaying;

    // Search Spotify for the track
    const token = await getSpotifyToken();
    const query = encodeURIComponent(`${title} ${artist}`);
    const searchUrl = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`;

    const spotifyRes = await fetch(searchUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    let trackUri = null;
    let trackUrl = null;

    if (spotifyRes.ok) {
      const spotifyData = await spotifyRes.json();
      const track = spotifyData?.tracks?.items?.[0];
      if (track) {
        trackUri = track.id;
        trackUrl = track.external_urls?.spotify;
      }
    }

    const html = renderCard({ title, artist, album, image, trackUri, trackUrl });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.send(html);

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).send(renderCard({
      title: '', artist: '', album: '', image: '', trackUri: null, trackUrl: null
    }));
  }
});

// Health check
app.get('/health', (req, res) => res.send('ok'));

// Catch-all redirects to /tap (for NFC tag root URL)
app.get('*', (req, res) => res.redirect('/tap'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`NFC Music Tap running on port ${PORT}`));

export default app;
