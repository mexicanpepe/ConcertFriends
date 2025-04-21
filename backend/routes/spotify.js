// backend/routes/spotify.js

import express from 'express';
import axios from 'axios';

const router = express.Router();

// Get access token from Spotify
let accessToken = null;
let tokenExpiresAt = 0;

const getAccessToken = async () => {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken; // Return existing valid token
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    accessToken = response.data.access_token;
    tokenExpiresAt = Date.now() + response.data.expires_in * 1000; // expires_in is in seconds

    return accessToken;

  } catch (error) {
    console.error('Error getting Spotify access token:', error.response?.data || error.message);
    throw new Error('Failed to get access token');
  }
};

// API: /spotify/search-artist?name=artistName
router.get('/search-artist', async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Missing artist name' });
  }

  try {
    const token = await getAccessToken();

    const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: name,
        type: 'artist',
        limit: 1
      }
    });

    const artist = searchResponse.data.artists.items[0];

    if (!artist) {
      return res.status(404).json({ error: 'Artist not found on Spotify' });
    }

    return res.json({
      name: artist.name,
      image: artist.images[0]?.url || null,
      description: artist.genres.join(', ') || 'No genre description',
      spotifyUrl: artist.external_urls.spotify
    });

  } catch (error) {
    console.error('Error searching artist:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to search artist' });
  }
});

export default router;
