'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogPortal,
  DialogOverlay,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { toggleFavorite } from '@/lib/store/favoritesSlice';
import { Movie } from '@/lib/types';
import { useSession, signIn } from 'next-auth/react';
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
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      setShowLoginDialog(true);
      return;
    }

    dispatch(toggleFavorite(movie));

    if (isFavorite) {
      toast.success('Removed from favorites');
    } else {
      toast.success('Added to favorites');
    }
  };

  const handleLogin = () => {
    setShowLoginDialog(false);
    signIn('google');
  };

  return (
    <>
      <div onClick={(e) => e.stopPropagation()}>
        <Button
          type="button"
          variant="ghost"
          size={size}
          onClick={handleToggle}
          className={cn(
            'cursor-pointer bg-white/90 hover:bg-white backdrop-blur-sm transition-all',
            'shadow-md hover:shadow-lg',
            className
          )}
        >
          <Heart
            className={cn(
              'h-5 w-5 transition-colors',
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
            )}
          />
        </Button>
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog} modal={true}>
        <DialogPortal>
          <DialogOverlay
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />
          <DialogContent
            onClick={(e) => e.stopPropagation()}
            onInteractOutside={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onEscapeKeyDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            showCloseButton={false}
          >
            <DialogHeader>
              <DialogTitle>Login Required</DialogTitle>
              <DialogDescription>
                You need to be logged in to add movies to your favorites. Please login with your Google account to continue.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLoginDialog(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogin();
                }}
              >
                Login with Google
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
