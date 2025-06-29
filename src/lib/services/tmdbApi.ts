import type { ContentItem } from "../features/content/contentSlice";
import config from "../config";

const API_KEY = config.tmdbApiKey;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const mapMoviesToContentItems = (movies: any[]): ContentItem[] => {
  return movies
    .filter((movie: any) => movie.poster_path && movie.title && movie.overview)
    .map((movie: any): ContentItem => ({
      id: `movie-${movie.id}`,
      type: 'recommendation',
      title: movie.title,
      description: movie.overview,
      imageUrl: `${IMAGE_BASE_URL}${movie.poster_path}`,
      imageHint: 'movie poster',
      source: 'TMDB',
      url: `https://www.themoviedb.org/movie/${movie.id}`,
      isFavorite: false,
  }));
};


export async function fetchMovieRecommendations(page = 1): Promise<ContentItem[]> {
  if (!API_KEY) return [];

  try {
    const randomPageOffset = Math.floor(Math.random() * 10);
    const fetchPage = page + randomPageOffset;

    const response = await fetch(`${BASE_URL}/movie/popular?language=en-US&page=${fetchPage}&api_key=${API_KEY}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.status_message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return mapMoviesToContentItems(data.results);
  } catch (error) {
    console.error("Failed to fetch movie recommendations:", error);
    throw error;
  }
}

export async function fetchTrendingMovies(): Promise<ContentItem[]> {
  if (!API_KEY) return [];

  try {
    const response = await fetch(`${BASE_URL}/trending/movie/day?language=en-US&api_key=${API_KEY}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.status_message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Return only top 10 trending
    return mapMoviesToContentItems(data.results.slice(0, 10));
  } catch (error) {
    console.error("Failed to fetch trending movies:", error);
    throw error;
  }
}

export async function searchMovies(query: string, page = 1): Promise<ContentItem[]> {
  if (!API_KEY) return [];

  try {
    const response = await fetch(`${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}&api_key=${API_KEY}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.status_message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return mapMoviesToContentItems(data.results);
  } catch (error) {
    console.error("Failed to search movies:", error);
    throw error;
  }
}
