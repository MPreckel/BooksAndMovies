'use client';

import { useBooks, BookCategory } from '@/hooks/useBooks';
import { useState } from 'react';
import SearchBar from '@/components/searchbar/SearchBar';

const CATEGORIES: { key: BookCategory; label: string }[] = [
  { key: 'fiction', label: 'Ficción' },
  { key: 'science', label: 'Ciencia' },
  { key: 'history', label: 'Historia' },
  { key: 'biography', label: 'Biografías' },
  { key: 'technology', label: 'Tecnología' },
  { key: 'art', label: 'Arte' },
];

export default function BooksPage() {
  const [category, setCategory] = useState<BookCategory>('fiction');
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const { books, loading, error } = useBooks({ category, search });

  const currentCategory = CATEGORIES.find((c) => c.key === category);
  const isSearching = search.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isSearching ? `Resultados para "${search}"` : currentCategory?.label || 'Libros'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isSearching ? `${books.length} ${books.length !== 1 ? 'libros encontrados' : 'libro encontrado'}` : 'Explora nuestra colección de libros'}
          </p>
          <div className="mt-4">
            <SearchBar
              value={input}
              onChange={setInput}
              onDebouncedChange={setSearch}
              placeholder="Buscar libros..."
            />
          </div>
          {!isSearching && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                    category === cat.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Cargando libros...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error al cargar libros</h3>
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </div>
        )}

        {!loading && !error && books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => {
              const title = book.volumeInfo?.title ?? 'Sin título';
              const authors = book.volumeInfo?.authors ?? [];
              const thumbnail = book.volumeInfo?.imageLinks?.thumbnail || book.volumeInfo?.imageLinks?.smallThumbnail || null;
              return (
                <div key={book.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
                  {thumbnail ? (
                    <img src={thumbnail} alt={title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">{title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {authors.length ? authors.join(', ') : 'Autor desconocido'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && books.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No se encontraron libros
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
