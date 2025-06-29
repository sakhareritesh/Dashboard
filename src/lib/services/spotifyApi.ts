import type { ContentItem } from "../features/content/contentSlice";
import config from "../config";

const client_id = config.spotifyClientId;
const client_secret = config.spotifyClientSecret;

// In-memory cache for the access token
let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getAccessToken(): Promise<string | null> {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }
  
  if (!client_id || !client_secret) {
    return null;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error_description || `Spotify Auth error! status: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    // Set expiry time to 5 minutes before it actually expires for safety
    tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;
    
    return accessToken;
  } catch (error) {
    console.error("Failed to get Spotify access token:", error);
    accessToken = null;
    tokenExpiresAt = 0;
    throw error;
  }
}

export async function fetchSpotifyNewReleases(page: number, limit: number): Promise<ContentItem[]> {
  const token = await getAccessToken();
  if (!token) return [];
  
  const offset = (page - 1) * limit;

  try {
    const response = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=${limit}&offset=${offset}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || `Spotify API error! status: ${response.status}`);
    }
    const data = await response.json();
    
    return data.albums.items
      .filter((album: any) => album.images?.[0]?.url)
      .map((album: any): ContentItem => ({
        id: `spotify-album-${album.id}`,
        type: 'recommendation',
        title: album.name,
        description: `A new album by ${album.artists.map((a: any) => a.name).join(', ')}`,
        imageUrl: album.images[0].url,
        imageHint: 'album cover music',
        source: 'Spotify',
        url: album.external_urls.spotify,
        isFavorite: false,
    }));
  } catch (error) {
    console.error("Failed to fetch Spotify new releases:", error);
    throw error;
  }
}

export async function fetchFeaturedPlaylists(page: number, limit: number): Promise<ContentItem[]> {
  const token = await getAccessToken();
  if (!token) return [];

  const offset = (page - 1) * limit;

  try {
    const response = await fetch(`https://api.spotify.com/v1/browse/featured-playlists?limit=${limit}&offset=${offset}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });

     if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || `Spotify API error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.playlists.items
      .filter((playlist: any) => playlist.images?.[0]?.url)
      .map((playlist: any): ContentItem => ({
      id: `spotify-playlist-${playlist.id}`,
      type: 'recommendation',
      title: playlist.name,
      description: playlist.description || `A featured playlist by Spotify.`,
      imageUrl: playlist.images[0].url,
      imageHint: 'playlist cover music',
      source: 'Spotify',
      url: playlist.external_urls.spotify,
      isFavorite: false,
    }));

  } catch (error) {
     console.error("Failed to fetch Spotify featured playlists:", error);
    throw error;
  }
}

export async function searchSpotify(query: string, page: number, limit: number): Promise<ContentItem[]> {
  const token = await getAccessToken();
  if (!token) return [];

  const offset = (page - 1) * limit;

  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}&offset=${offset}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || `Spotify API error! status: ${response.status}`);
    }
    const data = await response.json();
    
    return data.tracks.items
      .filter((track: any) => track.album.images?.[0]?.url)
      .map((track: any): ContentItem => ({
        id: `spotify-track-${track.id}`,
        type: 'recommendation',
        title: track.name,
        description: `By ${track.artists.map((a: any) => a.name).join(', ')} from the album "${track.album.name}"`,
        imageUrl: track.album.images[0].url,
        imageHint: 'album cover music',
        source: 'Spotify',
        url: track.external_urls.spotify,
        isFavorite: false,
    }));
  } catch (error) {
    console.error("Failed to search Spotify:", error);
    throw error;
  }
}
