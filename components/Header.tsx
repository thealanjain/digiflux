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
    <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Film className="h-6 w-6" />
            <span>MovieDB</span>
          </Link>

          <div className="flex items-center gap-4">
            {session && (
              <Link href="/favorites">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Favorites ({favorites.length})
                </Button>
              </Link>
            )}

            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {session.user?.name}
                </span>
                <Button onClick={() => signOut()} variant="outline" size="sm" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={() => signIn('google')} size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            )}
          </div>
        </div>

        <SearchBar />
      </div>
    </header>
  );
}
