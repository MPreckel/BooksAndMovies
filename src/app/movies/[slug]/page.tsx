import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/utils/tmdb';
import MovieReviewForm from '@/components/reviews/MovieReviewForm';

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

interface MovieDetailPageProps {
  searchParams: Promise<{ id?: string }>;
}

async function fetchMovieDetails(movieId: string): Promise<MovieDetails> {
  const apiKey = process.env.TMDB_API_KEY;
  
  if (!apiKey) {
    throw new Error('TMDB API Key no configurada');
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es-ES`,
    {
      next: { revalidate: 3600 }, // Revalidar cada hora
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error('Error al cargar los detalles de la película');
  }

  return response.json();
}

export default async function MovieDetailPage({ searchParams }: MovieDetailPageProps) {
  const params = await searchParams;
  const movieId = params.id;

  if (!movieId) {
    notFound();
  }

  const movie = await fetchMovieDetails(movieId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Backdrop */}
      {movie.backdrop_path && (
        <div className="relative w-full h-[400px] md:h-[500px]">
          <Image
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            fill
            className="object-fill"
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
            <Link
              href="/"
              className="mb-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Volver
            </Link>

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

        {/* Review Section */}
        <div className="mt-8">
          <MovieReviewForm
            movieId={movie.id}
            movieTitle={movie.title}
            posterPath={movie.poster_path}
          />
        </div>
      </div>
    </div>
  );
}
