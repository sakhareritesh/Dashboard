import type { ContentItem } from "../features/content/contentSlice";
import config from "../config";

const API_KEY = config.newsApiKey;
const BASE_URL = 'https://newsapi.org/v2';

// Mapper function to avoid code duplication
const mapArticlesToContentItems = (articles: any[]): ContentItem[] => {
  return articles
    .filter((article: any) => article.urlToImage && article.title && article.description)
    .map((article: any): ContentItem => ({
      id: `news-${article.url}`,
      type: 'news',
      title: article.title,
      description: article.description,
      imageUrl: article.urlToImage,
      imageHint: 'news article',
      source: article.source.name,
      url: article.url,
      isFavorite: false,
  }));
}

export async function fetchNews(category = 'technology', page = 1, pageSize = 20): Promise<ContentItem[]> {
  if (!API_KEY) return [];

  try {
    const response = await fetch(`${BASE_URL}/top-headlines?country=us&category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return mapArticlesToContentItems(data.articles);
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw error;
  }
}

export async function searchNews(query: string, page = 1, pageSize = 20): Promise<ContentItem[]> {
  if (!API_KEY) return [];

  try {
    const response = await fetch(`${BASE_URL}/everything?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return mapArticlesToContentItems(data.articles);
  } catch (error) {
    console.error("Failed to search news:", error);
    throw error;
  }
}
