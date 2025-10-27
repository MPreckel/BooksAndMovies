'use client'

import { useMoviesWatched } from '@/hooks/useMoviesWatched'
import { useAuth } from '@/hooks/useAuth'
import Card from '@/components/card/Card'
import { getImageUrl } from '@/hooks/useMovies'
import Link from 'next/link'

export default function WatchedMoviesPage() {
  const { user, loading: authLoading } = useAuth()
  const { movies, loading, error, removeMovie } = useMoviesWatched()

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Inicia sesión para ver tus películas
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Necesitas una cuenta para guardar películas vistas
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Películas Ya Vistas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {movies.length} {movies.length === 1 ? 'película vista' : 'películas vistas'}
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
              <p className="text-gray-600 dark:text-gray-400">Cargando películas vistas...</p>
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
                id={movie.tmdb_id}
                title={movie.title}
                imageUrl={getImageUrl(movie.poster_path)}
                footer={`Vista el ${new Date(movie.watched_date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}`}
                actionButton={{
                  label: 'Quitar de vistas',
                  onClick: async () => {
                    await removeMovie(movie.tmdb_id)
                  },
                  variant: 'danger',
                }}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && movies.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No has visto ninguna película aún
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Marca las películas que has visto para llevar un registro
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Explorar Películas
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
