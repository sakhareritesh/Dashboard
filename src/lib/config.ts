const config = {
  newsApiKey: process.env.NEWS_API_KEY,
  tmdbApiKey: process.env.TMDB_API_KEY,
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
};

if (!config.newsApiKey) {
  console.warn("Warning: NEWS_API_KEY is not set. News content will not be fetched.");
}

if (!config.tmdbApiKey) {
  console.warn("Warning: TMDB_API_KEY is not set. Movie recommendations will not be fetched.");
}

if (!config.spotifyClientId || !config.spotifyClientSecret) {
  console.warn("Warning: Spotify API credentials are not set. Spotify content will not be fetched.");
}


export default config;
