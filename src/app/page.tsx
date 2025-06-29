'use client';

import { useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { AlertCircle, LoaderCircle } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store";
import ContentCard from "@/components/ContentCard";
import { fetchContent } from "@/lib/features/content/contentSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AppLayout from "@/components/AppLayout";

function DashboardContent() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const query = searchParams.get('search');
  const filter = searchParams.get('filter') || 'all';

  const { items: contentItems, status, error, hasMore, page } = useAppSelector((state) => state.content);

  const observer = useRef<IntersectionObserver>();
  const lastContentItemRef = useCallback((node: HTMLDivElement) => {
      if (status === 'loading' || status === 'loadingMore') return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && hasMore) {
              dispatch(fetchContent({ page: page + 1, query, filter }));
          }
      });
      if (node) observer.current.observe(node);
  }, [status, hasMore, page, dispatch, query, filter]);

  useEffect(() => {
    // Fetch content whenever the query changes, or on initial load
    dispatch(fetchContent({ page: 1, query, filter }));
  }, [dispatch, query, filter]);


  return (
    <AppLayout>
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">
          {query ? `Results for "${query}"` : 'Personalized Feed'}
        </h1>
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
            {error || 'Failed to fetch content. Please try again later.'}
          </AlertDescription>
        </Alert>
      )}
      {(status === 'succeeded' || status === 'loadingMore') && (
        <>
          {contentItems.length === 0 && !query && (
              <div className="text-center text-muted-foreground py-10">
                <p>Your feed is empty.</p>
                <p className="text-sm">Try refreshing or checking back later.</p>
              </div>
          )}
          {contentItems.length === 0 && query && (
            <div className="text-center text-muted-foreground py-10">
              <p>No results found for "{query}".</p>
              <p className="text-sm">Try a different search term or filter.</p>
            </div>
          )}
          <div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {contentItems.map((item, index) => {
              if (contentItems.length === index + 1) {
                return (
                   <div ref={lastContentItemRef} key={item.id}>
                     <ContentCard item={item} />
                   </div>
                )
              }
              return <ContentCard key={item.id} item={item} />
            })}
          </div>
          {status === 'loadingMore' && (
             <div className="flex justify-center items-center py-8">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
             </div>
          )}
        </>
      )}
    </AppLayout>
  )
}


export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
