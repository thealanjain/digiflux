'use client';

import { MovieCard } from '@/components/MovieCard';
import { Movie } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface MovieCarouselProps {
  movies: Movie[];
  title: string;
}

export function MovieCarousel({ movies, title }: MovieCarouselProps) {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="relative px-12">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {movies.map((movie) => (
              <CarouselItem key={movie.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                <div className="h-full">
                  <MovieCard movie={movie} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12 bg-background/80 backdrop-blur-sm hover:bg-background" />
          <CarouselNext className="-right-12 bg-background/80 backdrop-blur-sm hover:bg-background" />
        </Carousel>
      </div>
    </section>
  );
}
