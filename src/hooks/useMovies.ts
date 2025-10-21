'use client';

import { useState, useEffect } from 'react';
import type { Movie, TMDBResponse } from '@/types/tmdb';

interface UseMoviesOptions {
  endpoint?: 'popular' | 'now_playing' | 'top_rated' | 'upcoming';
  page?: number;
}

interface UseMoviesReturn {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  totalPages: number;
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export function useMovies({
  endpoint = 'popular',
  page = 1,
}: UseMoviesOptions = {}): UseMoviesReturn {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        
        if (!apiKey) {
          throw new Error('API Key no configurada. Verifica tu archivo .env.local');
        }

        const url = `${TMDB_BASE_URL}/movie/${endpoint}?api_key=${apiKey}&language=es-ES&page=${page}`;
        
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: TMDBResponse = await response.json();
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar películas';
        setError(errorMessage);
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [endpoint, page]);

  return { movies, loading, error, totalPages };
}

// Función helper para obtener la URL completa de la imagen
export function getImageUrl(path: string | null, size: 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) return '/placeholder-movie.jpg'; // Puedes crear una imagen placeholder
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
