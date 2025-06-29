'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import ContentCard from '@/components/ContentCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { ContentItem } from '@/lib/features/content/contentSlice';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function TrendingPage() {
  const [trendingItems, setTrendingItems] = useState<ContentItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'succeeded' | 'failed'>('loading');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // This function syncs the favorite status from localStorage and updates the state
    const syncAndSetItems = (items: ContentItem[]) => {
      const favsJSON = localStorage.getItem('favoriteItems');
      const favoriteIds = new Set(favsJSON ? JSON.parse(favsJSON).map((fav: ContentItem) => fav.id) : []);
      const syncedItems = items.map(item => ({
        ...item,
        isFavorite: favoriteIds.has(item.id),
      }));
      setTrendingItems(syncedItems);
    };

    const handleFavoritesChange = () => {
      // When a favorite changes anywhere, re-sync the items on this page
      setTrendingItems(currentItems => {
          const favsJSON = localStorage.getItem('favoriteItems');
          const favoriteIds = new Set(favsJSON ? JSON.parse(favsJSON).map((fav: ContentItem) => fav.id) : []);
          return currentItems.map(item => ({
            ...item,
            isFavorite: favoriteIds.has(item.id),
          }));
      });
    };

    async function fetchTrendingContent() {
      setStatus('loading');
      try {
        const response = await fetch('/api/trending');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch trending content');
        }
        const data = await response.json();
        syncAndSetItems(data); // Sync favorites on initial load
        setStatus('succeeded');
      } catch (err) {
        setStatus('failed');
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    }

    fetchTrendingContent();

    // Listen for changes to favorites from other parts of the app
    window.addEventListener('favoritesUpdated', handleFavoritesChange);
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesChange);
    };
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppLayout>
        <div className="flex items-center gap-4 mb-4">
           <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-lg font-semibold md:text-2xl">Trending Now</h1>
        </div>

        {status === 'loading' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[220px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {status === 'failed' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error || 'Failed to fetch trending content. Please try again later.'}
            </AlertDescription>
          </Alert>
        )}

        {status === 'succeeded' && (
          <>
            {trendingItems.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                <p>Could not load trending content.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {trendingItems.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
        )}
      </AppLayout>
    </Suspense>
  );
}
