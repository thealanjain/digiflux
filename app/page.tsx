'use client';

import { Header } from '@/components/Header';
import { MovieCarousel } from '@/components/MovieCarousel';
import { MovieCardSkeleton } from '@/components/MovieCardSkeleton';
import { usePopularMovies, useTopRatedMovies } from '@/lib/hooks/useMovies';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function HomePage() {
  const { data: popularData, isLoading: popularLoading, error: popularError } = usePopularMovies();
  const { data: topRatedData, isLoading: topRatedLoading, error: topRatedError } = useTopRatedMovies();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {(popularError || topRatedError) && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load movies. Please check your TMDB API key in .env.local
            </AlertDescription>
          </Alert>
        )}

        {/* Popular Movies Section */}
        {popularLoading ? (
          <section className="py-8">
            <h2 className="text-2xl font-bold mb-6">Popular Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          </section>
        ) : popularData?.results ? (
          <MovieCarousel movies={popularData.results} title="Popular Movies" />
        ) : null}

        {/* Top Rated Movies Section */}
        {topRatedLoading ? (
          <section className="py-8">
            <h2 className="text-2xl font-bold mb-6">Top Rated Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          </section>
        ) : topRatedData?.results ? (
          <MovieCarousel movies={topRatedData.results} title="Top Rated Movies" />
        ) : null}
      </main>
    </div>
  );
}
