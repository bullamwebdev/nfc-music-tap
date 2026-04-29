import fetch from 'node-fetch';

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_USERNAME = process.env.LASTFM_USERNAME || 'wise_song';

async function getNowPlaying() {
  const url = new URL('https://ws.audioscrobbler.com/2.0/');
  url.searchParams.set('method', 'user.getrecenttracks');
  url.searchParams.set('user', LASTFM_USERNAME);
  url.searchParams.set('limit', '1');
  url.searchParams.set('api_key', LASTFM_API_KEY);
  url.searchParams.set('format', 'json');

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Last.fm error: ${res.status}`);

  const data = await res.json();
  const track = data?.recenttracks?.track?.[0];
  if (!track) return null;

  const isNowPlaying = track['@attr']?.nowplaying === 'true';
  const image = track.image?.find(i => i.size === 'extralarge')?.['#text'] || '';

  return {
    title: track.name || 'Unknown Track',
    artist: track.artist?.['#text'] || 'Unknown Artist',
    album: track.album?.['#text'] || '',
    image,
    isNowPlaying
  };
}

export default getNowPlaying;
