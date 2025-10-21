'use client';

import Card from '@/components/card/Card';
import { useMovies, getImageUrl } from '@/hooks/useMovies';

export default function Home() {
  const { movies, loading, error } = useMovies({ endpoint: 'popular' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Películas Populares
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Descubre las películas más populares del momento
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Cargando películas...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error al cargar películas</h3>
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && !error && movies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <Card
                key={movie.id}
                id={movie.id}
                title={movie.title}
                subtitle={new Date(movie.release_date).getFullYear().toString()}
                description={movie.overview}
                imageUrl={getImageUrl(movie.poster_path)}
                rating={movie.vote_average}
                footer={`${movie.vote_count.toLocaleString()} votos`}
                onClick={() => console.log('Película seleccionada:', movie.title)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && movies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No se encontraron películas
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
