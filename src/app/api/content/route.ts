import { NextResponse } from 'next/server';
import type { ContentItem } from '@/lib/features/content/contentSlice';
import { fetchNews, searchNews } from '@/lib/services/newsApi';
import { fetchMovieRecommendations, searchMovies } from '@/lib/services/tmdbApi';
import { fetchSocialPosts, searchSocialPosts } from '@/lib/services/socialApi';
import { fetchSpotifyNewReleases, searchSpotify } from '@/lib/services/spotifyApi';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const query = searchParams.get('search');
  const filter = searchParams.get('filter') || 'all';

  try {
    let results;

    if (query) {
      const searchPromises = [];

      if (filter === 'all' || filter === 'news') {
        searchPromises.push(searchNews(query, page, 10));
      }
      if (filter === 'all' || filter === 'movie') {
        searchPromises.push(searchMovies(query, page));
      }
      if (filter === 'all' || filter === 'music') {
        searchPromises.push(searchSpotify(query, page, 10));
      }
      if (filter === 'all' || filter === 'social') {
        searchPromises.push(searchSocialPosts(query));
      }
      results = await Promise.allSettled(searchPromises);

    } else {
      // Fetch from default endpoints if no query
      results = await Promise.allSettled([
        fetchNews('technology', page, 10),
        fetchMovieRecommendations(page, 20),
        fetchSocialPosts(page, 5),
        fetchSpotifyNewReleases(page, 10),
      ]);
    }

    const combinedContent: ContentItem[] = [];
    let apiError = false;

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        combinedContent.push(...result.value);
      } else if (result.status === 'rejected') {
        apiError = true;
        console.error("An API call failed:", result.reason);
      }
    });

    if (apiError && combinedContent.length === 0 && page === 1) {
       return NextResponse.json({ message: 'Failed to fetch content from external APIs.' }, { status: 500 });
    }

    const shuffledContent = combinedContent.sort(() => Math.random() - 0.5);
    
    return NextResponse.json(shuffledContent);

  } catch (error) {
    console.error("Error in content API route:", error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}
