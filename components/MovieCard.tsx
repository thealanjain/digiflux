'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Movie } from '@/lib/types';
import { getPosterUrl } from '@/lib/tmdb';
import { Star } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.poster_path);

  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="group overflow-hidden transition-all hover:scale-105 hover:shadow-lg relative">
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton movie={movie} />
        </div>
        <CardContent className="p-0">
          <div className="relative aspect-2/3 w-full overflow-hidden bg-muted">
            <Image
              src={posterUrl}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold line-clamp-2 mb-2">{movie.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              {movie.release_date && (
                <span>• {new Date(movie.release_date).getFullYear()}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
