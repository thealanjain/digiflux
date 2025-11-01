'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { toggleFavorite } from '@/lib/store/favoritesSlice';
import { Movie } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  movie: Movie;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function FavoriteButton({ movie, size = 'icon', className }: FavoriteButtonProps) {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const isFavorite = favorites.some((fav) => fav.id === movie.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error('Please login to add favorites');
      return;
    }

    dispatch(toggleFavorite(movie));

    if (isFavorite) {
      toast.success('Removed from favorites');
    } else {
      toast.success('Added to favorites');
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggle}
      disabled={!session}
      className={cn(
        'hover:bg-transparent',
        className
      )}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-colors',
          isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
        )}
      />
    </Button>
  );
}
