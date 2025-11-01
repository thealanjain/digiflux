'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/SearchBar';
import { Film, LogIn, LogOut, Heart } from 'lucide-react';
import { useAppSelector } from '@/lib/store/hooks';

export function Header() {
  const { data: session } = useSession();
  const favorites = useAppSelector((state) => state.favorites.favorites);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold flex-shrink-0">
            <Film className="h-6 w-6" />
            <span>DigiFlux Movie Browser</span>
          </Link>

          <div className="flex-1 max-w-2xl mx-4">
            <SearchBar />
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            {session && (
              <Link href="/favorites">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Favorites ({favorites.length})</span>
                  <span className="sm:hidden">({favorites.length})</span>
                </Button>
              </Link>
            )}

            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden md:inline">
                  {session.user?.name}
                </span>
                <Button onClick={() => signOut()} variant="outline" size="sm" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button onClick={() => signIn('google')} size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
