'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { MovieListCard } from '@/components/MovieListCard';
import { MovieListCardSkeleton } from '@/components/MovieListCardSkeleton';
import { useInfiniteSearchMovies } from '@/lib/hooks/useMovies';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Search, Loader2 } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSearchMovies(query);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allMovies = data?.pages.flatMap((page) => page.results) || [];
  const totalResults = data?.pages[0]?.total_results || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          {query && (
            <p className="text-muted-foreground">
              Showing results for "{query}"
            </p>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to search movies. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {!query ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No search query</h2>
            <p className="text-muted-foreground">
              Enter a movie title in the search bar above
            </p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <MovieListCardSkeleton key={i} />
            ))}
          </div>
        ) : allMovies.length > 0 ? (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              Found {totalResults} results
            </p>
            <div className="space-y-4">
              {allMovies.map((movie) => (
                <MovieListCard key={`${movie.id}-${movie.title}`} movie={movie} />
              ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={observerTarget} className="py-8 flex justify-center">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading more...</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground">
              Try searching for a different movie title
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
