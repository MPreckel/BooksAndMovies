'use client'

import { useBooksReading } from '@/hooks/useBooksReading'
import { useAuth } from '@/hooks/useAuth'
import Card from '@/components/card/Card'
import Link from 'next/link'

export default function BooksReadingPage() {
  const { user, loading: authLoading } = useAuth()
  const { books, loading, error, removeBook, getProgress } = useBooksReading()

  if (authLoading) {
    return (
      <div className="mt-12 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mt-12 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Inicia sesión para ver tus libros
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Necesitas una cuenta para guardar libros
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
    <div className="mt-12 min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Leyendo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
           Leyendo {books.length} {books.length === 1 ? 'libro' : 'libros'}  actualmente
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
              const progress = getProgress(book.google_books_id);
              return (
                <Card
                  key={book.id}
                  id={book.google_books_id}
                  description={book.description || ''}
                  title={book.title}
                  subtitle={book.authors?.join(', ') || 'Autor desconocido'}
                  imageUrl={book.thumbnail || undefined}
                  footer={
                    <div>
                      <div className="mb-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs mt-1">
                          {progress}% - Página {book.current_page || 0} de {book.total_pages || 0}
                        </p>
                      </div>
                    </div>
                  }
                  actionButton={{
                    label: 'Quitar de leyendo',
                    onClick: async () => {
                      await removeBook(book.google_books_id)
                    },
                    variant: 'danger',
                  }}
                />
              );
            })}
          </div>
        )}

        {!loading && !error && books.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No estás leyendo ningún libro
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Marca los libros que estás leyendo actualmente
            </p>
            <Link
              href="/books"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Explorar Libros
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
