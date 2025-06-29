
'use client';

import Image from 'next/image';
import type { ContentItem } from '@/lib/features/content/contentSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink } from 'lucide-react';
import { useAppDispatch } from '@/lib/store';
import { toggleFavorite } from '@/lib/features/content/contentSlice';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  item: ContentItem;
}

export default function ContentCard({ item }: ContentCardProps) {
  const dispatch = useAppDispatch();

  const handleFavoriteClick = () => {
    const favsJSON = localStorage.getItem('favoriteItems');
    let favorites: ContentItem[] = favsJSON ? JSON.parse(favsJSON) : [];
    const isCurrentlyFavorite = favorites.some(fav => fav.id === item.id);

    if (isCurrentlyFavorite) {
        favorites = favorites.filter(fav => fav.id !== item.id);
    } else {
        favorites.push({ ...item, isFavorite: true });
    }
    
    localStorage.setItem('favoriteItems', JSON.stringify(favorites));
    
  
    dispatch(toggleFavorite(item.id));
    
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  const typeVariantMap = {
    news: 'default',
    recommendation: 'secondary',
    social: 'outline',
  } as const;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="relative h-48 w-full mb-4">
           <Image
              src={item.imageUrl || 'https://placehold.co/600x400.png'}
              alt={item.title}
              fill
              className="rounded-t-lg object-cover"
              data-ai-hint={item.imageHint || 'placeholder'}
            />
        </div>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription className="pt-1">From {item.source}</CardDescription>
            </div>
            <Badge variant={typeVariantMap[item.type]}>{item.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="icon" onClick={handleFavoriteClick}>
          <Star
            className={cn(
              'h-5 w-5',
              item.isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'
            )}
          />
          <span className="sr-only">Favorite</span>
        </Button>
        <Button asChild variant="outline">
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            Read More
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
