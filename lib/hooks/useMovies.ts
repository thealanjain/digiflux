import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getPopularMovies, getTopRatedMovies, searchMovies, getMovieDetails } from '@/lib/tmdb';

export function usePopularMovies(page: number = 1) {
  return useQuery({
    queryKey: ['movies', 'popular', page],
    queryFn: () => getPopularMovies(page),
  });
}

export function useTopRatedMovies(page: number = 1) {
  return useQuery({
    queryKey: ['movies', 'topRated', page],
    queryFn: () => getTopRatedMovies(page),
  });
}

export function useSearchMovies(query: string, page: number = 1) {
  return useQuery({
    queryKey: ['movies', 'search', query, page],
    queryFn: () => searchMovies(query, page),
    enabled: query.length > 0,
  });
}

export function useInfiniteSearchMovies(query: string) {
  return useInfiniteQuery({
    queryKey: ['movies', 'search', 'infinite', query],
    queryFn: ({ pageParam = 1 }) => searchMovies(query, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: query.length > 0,
    initialPageParam: 1,
  });
}

export function useMovieDetails(movieId: number) {
  return useQuery({
    queryKey: ['movies', 'details', movieId],
    queryFn: () => getMovieDetails(movieId),
  });
}
