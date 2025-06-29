import { NextResponse } from 'next/server';
import type { ContentItem } from '@/lib/features/content/contentSlice';
import { fetchNews } from '@/lib/services/newsApi';
import { fetchTrendingMovies } from '@/lib/services/tmdbApi';
import { fetchSocialPosts } from '@/lib/services/socialApi';
import { fetchFeaturedPlaylists } from '@/lib/services/spotifyApi';

export async function GET() {
  try {
    const results = await Promise.allSettled([
      fetchNews('general', 1, 10), // Fetch general news for trending
      fetchTrendingMovies(),
      fetchSocialPosts(1, 5),
      fetchFeaturedPlaylists(1, 10),
    ]);

    const combinedContent: ContentItem[] = [];
    let apiError = false;

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        combinedContent.push(...result.value);
      } else if (result.status === 'rejected') {
        apiError = true;
        console.error("A trending API call failed:", result.reason);
      }
    });

    if (apiError && combinedContent.length === 0) {
       return NextResponse.json({ message: 'Failed to fetch some trending content.' }, { status: 500 });
    }

    const shuffledContent = combinedContent.sort(() => Math.random() - 0.5);
    
    return NextResponse.json(shuffledContent);

  } catch (error) {
    console.error("Error in trending API route:", error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}
