'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/hooks/useMovies';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  tagline: string;
}

export default function MovieDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get('id');
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=es-ES`
        );
        
        if (!response.ok) {
          throw new Error('Error al cargar los detalles de la película');
        }
        
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error</h3>
          <p className="text-red-600 dark:text-red-300">{error || 'Película no encontrada'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Backdrop */}
      {movie.backdrop_path && (
        <div className="relative w-full h-[400px] md:h-[500px]">
          <Image
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          {movie.poster_path && (
            <div className="flex-shrink-0">
              <div className="relative w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Details */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <button
              onClick={() => router.back()}
              className="mb-4 text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Volver
            </button>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-lg text-gray-600 dark:text-gray-400 italic mb-4">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-md">
                <span className="text-yellow-600 dark:text-yellow-400">⭐</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({movie.vote_count.toLocaleString()} votos)
                </span>
              </div>

              {movie.release_date && (
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">
                  <span className="text-gray-900 dark:text-white">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                </div>
              )}

              {movie.runtime > 0 && (
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">
                  <span className="text-gray-900 dark:text-white">
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                  </span>
                </div>
              )}
            </div>

            {movie.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Géneros
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.overview && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Sinopsis
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {movie.overview}
                </p>
              </div>
            )}

            {movie.production_companies.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Productoras
                </h3>
                <div className="flex flex-wrap gap-4">
                  {movie.production_companies.map((company) => (
                    <div key={company.id} className="text-sm text-gray-600 dark:text-gray-400">
                      {company.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
