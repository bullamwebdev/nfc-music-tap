const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_USER = process.env.LASTFM_USERNAME || 'wise_song';

let cachedToken = null;
let tokenExpiry = 0;

async function getSpotifyToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!res.ok) throw new Error('Spotify auth failed');
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    // 1. Last.fm now playing
    const lastfmUrl = new URL('https://ws.audioscrobbler.com/2.0/');
    lastfmUrl.searchParams.set('method', 'user.getrecenttracks');
    lastfmUrl.searchParams.set('user', LASTFM_USER);
    lastfmUrl.searchParams.set('limit', '1');
    lastfmUrl.searchParams.set('api_key', LASTFM_API_KEY);
    lastfmUrl.searchParams.set('format', 'json');

    const lastfmRes = await fetch(lastfmUrl);
    const lastfmData = await lastfmRes.json();
    const track = lastfmData?.recenttracks?.track?.[0];

    if (!track || track['@attr']?.nowplaying !== 'true') {
      return res.end(JSON.stringify({ playing: false }));
    }

    const title = track.name;
    const artist = track.artist?.['#text'];
    const album = track.album?.['#text'] || '';
    const image = track.image?.find(i => i.size === 'extralarge')?.['#text'] || '';

    // 2. Spotify search for exact track
    const token = await getSpotifyToken();
    const query = encodeURIComponent(`${title} ${artist}`);
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    let trackUri = null;
    let trackUrl = null;

    if (spotifyRes.ok) {
      const spotifyData = await spotifyRes.json();
      const spotifyTrack = spotifyData?.tracks?.items?.[0];
      if (spotifyTrack) {
        trackUri = `spotify:track:${spotifyTrack.id}?play=true`;
        trackUrl = spotifyTrack.external_urls?.spotify;
      }
    }

    res.end(JSON.stringify({
      playing: true,
      title,
      artist,
      album,
      image,
      trackUri,
      trackUrl
    }));

  } catch (err) {
    console.error('API Error:', err.message);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  }
};
