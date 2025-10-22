'use client';

import { useBooks } from '@/hooks/useBooks';

export default function BooksPage() {
  const { books, loading, error } = useBooks({ q: 'harry potter', perPage: 10 });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Libros</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Resultados desde Google Books</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">Cargando libros...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-600 dark:text-red-400">{error}</div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((it) => {
              const title = it.volumeInfo?.title ?? 'Sin título';
              const authors = it.volumeInfo?.authors ?? [];
              const thumbnail = it.volumeInfo?.imageLinks?.thumbnail || it.volumeInfo?.imageLinks?.smallThumbnail || null;
              return (
                <div key={it.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                  {thumbnail ? (
                    // Usamos img directa para evitar configurar domains de next/image
                    <img src={thumbnail} alt={title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
                  )}
                  <div className="p-4">
                    <h2 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {authors.length ? authors.join(', ') : 'Autor desconocido'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}


