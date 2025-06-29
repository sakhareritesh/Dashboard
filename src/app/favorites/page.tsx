'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import type { ContentItem } from '@/lib/features/content/contentSlice';
import ContentCard from '@/components/ContentCard';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star } from 'lucide-react';

export default function FavoritesPage() {
  const [favoriteItems, setFavoriteItems] = useState<ContentItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    // We listen for a custom event to re-render when favorites change in another part of the app.
    const handleFavoritesChange = () => {
      const favsJSON = localStorage.getItem('favoriteItems');
      const storedFavorites: ContentItem[] = favsJSON ? JSON.parse(favsJSON) : [];
      setFavoriteItems(storedFavorites);
    };

    // Initial load
    handleFavoritesChange();

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
          <h1 className="text-lg font-semibold md:text-2xl">Your Favorites</h1>
        </div>
        {favoriteItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favoriteItems.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-10">
            <Star className="h-12 w-12 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Favorites Yet</h2>
            <p>Click the star icon on any card to add it to your favorites.</p>
          </div>
        )}
      </AppLayout>
    </Suspense>
  );
}
