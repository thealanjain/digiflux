'use client';

import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { MovieCard } from '@/components/MovieCard';
import { MovieCardSkeleton } from '@/components/MovieCardSkeleton';
import { useSearchMovies } from '@/lib/hooks/useMovies';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Search } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data, isLoading, error } = useSearchMovies(query);

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : data?.results && data.results.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              Found {data.total_results} results
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data.results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
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
