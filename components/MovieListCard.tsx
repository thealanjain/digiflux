'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Movie } from '@/lib/types';
import { getPosterUrl } from '@/lib/tmdb';
import { Calendar } from 'lucide-react';

interface MovieListCardProps {
  movie: Movie;
}

export function MovieListCard({ movie }: MovieListCardProps) {
  const posterUrl = getPosterUrl(movie.poster_path);
  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '';

  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg relative">
        <div className="absolute top-4 right-4 z-10">
          <FavoriteButton movie={movie} />
        </div>
        <CardContent className="p-0">
          <div className="flex gap-6 p-6">
            {/* Poster */}
            <div className="relative w-32 h-48 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-center gap-3">
              <div>
                <h3 className="text-2xl font-bold mb-1">{movie.title}</h3>
                {releaseDate && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{releaseDate}</span>
                  </div>
                )}
              </div>

              {movie.overview && (
                <p className="text-muted-foreground line-clamp-3">
                  {movie.overview}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
