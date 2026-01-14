'use client';

import Card from '@/components/card/Card';
import { useMovies, getImageUrl } from '@/hooks/useMovies';
import { useMoviesToWatch } from '@/hooks/useMoviesToWatch';
import { useMoviesWatched } from '@/hooks/useMoviesWatched';
import { useState } from 'react';
import SearchBar from '@/components/searchbar/SearchBar';
import { useRouter } from 'next/navigation';
import { createMovieUrl } from '@/utils/slug';

type MovieCategory = 'popular' | 'now_playing' | 'top_rated' | 'upcoming';

const CATEGORIES: { key: MovieCategory; label: string }[] = [
  { key: 'popular', label: 'Populares' },
  { key: 'now_playing', label: 'En Cartelera' },
  { key: 'top_rated', label: 'Mejor Valoradas' },
  { key: 'upcoming', label: 'Próximos Estrenos' },
];

export default function Home() {
  const router = useRouter();
  const [category, setCategory] = useState<MovieCategory>('popular');
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const { movies, loading, error } = useMovies({ endpoint: category, search });
  const { addMovie: addToWatch, removeMovie: removeFromWatch, isMovieInList } = useMoviesToWatch();
  const { addMovie: addToWatched, removeMovie: removeFromWatched, isMovieWatched } = useMoviesWatched();

  const currentCategory = CATEGORIES.find((c) => c.key === category);
  const isSearching = search.trim().length > 0;

  return (
    <div className="mt-12 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex flex-col gap-4 max-w-full mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isSearching ? `Resultados para "${search}"` : currentCategory?.label || 'Películas'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isSearching ? `${movies.length} ${movies.length > 1 ? 'películas encontradas' : 'película encontrada'}` : 'Descubre las mejores películas'}
          </p>
          
          {/* SearchBar */}
          <div>
            <SearchBar
              value={input}
              onChange={setInput}
              onDebouncedChange={setSearch}
              placeholder="Buscar película..."
            />
          </div>
          
          {/* Category Buttons */}
          {!isSearching && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`cursor-pointer px-6 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 shadow-sm ${
                    category === cat.key
                      ? 'bg-blue-600 text-white shadow-blue-500/30 scale-105'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow-md'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-white dark:bg-gray-800 shadow-sm max-w-full mx-auto px-6">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {movies.map((movie) => {
              const inWatchlist = isMovieInList(movie.id);
              const watched = isMovieWatched(movie.id);
              
              // Determinar el label principal basado en el estado actual
              const getMainLabel = () => {
                if (watched) return '✓ Vista';
                if (inWatchlist) return '✓ En mi lista';
                return 'POR VER';
              };

              // Determinar el variant del botón principal
              const mainVariant = (inWatchlist || watched) ? 'secondary' : 'primary';

              return (
                <Card
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  subtitle={new Date(movie.release_date).getFullYear().toString()}
                  imageUrl={getImageUrl(movie.poster_path)}
                  rating={movie.vote_average}
                  footer={`${movie.vote_count.toLocaleString()} votos`}
                  onClick={() => router.push(`/movies/${createMovieUrl(movie.id, movie.title)}`)}
                  actionButtonWithOptions={{
                    mainLabel: getMainLabel(),
                    mainVariant,
                    options: [
                      {
                        label: 'POR VER',
                        onClick: async () => {
                          // Remover de "Ya vistas" antes de agregar a "Por ver"
                          if (watched) await removeFromWatched(movie.id);
                          
                          await addToWatch({
                            tmdb_id: movie.id,
                            title: movie.title,
                            poster_path: movie.poster_path,
                            description: movie.overview,
                          });
                        },
                      },
                      {
                        label: 'YA VISTA',
                        onClick: async () => {
                          // Remover de "Por ver" antes de agregar a "Ya vistas"
                          if (inWatchlist) await removeFromWatch(movie.id);
                          
                          await addToWatched({
                            tmdb_id: movie.id,
                            title: movie.title,
                            poster_path: movie.poster_path,
                            description: movie.overview,
                          });
                        },
                      },
                    ],
                  }}
                />
              );
            })}
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

