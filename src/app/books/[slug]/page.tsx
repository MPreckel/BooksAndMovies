'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface BookDetails {
  id: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
    };
    language?: string;
    previewLink?: string;
    infoLink?: string;
  };
}

export default function BookDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get('id');
  const [book, setBook] = useState<BookDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        );
        
        if (!response.ok) {
          throw new Error('Error al cargar los detalles del libro');
        }
        
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

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

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error</h3>
          <p className="text-red-600 dark:text-red-300">{error || 'Libro no encontrado'}</p>
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

  const { volumeInfo } = book;
  const thumbnail = volumeInfo.imageLinks?.large || 
                    volumeInfo.imageLinks?.medium || 
                    volumeInfo.imageLinks?.small || 
                    volumeInfo.imageLinks?.thumbnail;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cover */}
          {thumbnail && (
            <div className="flex-shrink-0">
              <div className="relative w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={thumbnail}
                  alt={volumeInfo.title}
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
              {volumeInfo.title}
            </h1>

            {volumeInfo.subtitle && (
              <h2 className="text-2xl text-gray-600 dark:text-gray-400 mb-4">
                {volumeInfo.subtitle}
              </h2>
            )}

            {volumeInfo.authors && volumeInfo.authors.length > 0 && (
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                Por {volumeInfo.authors.join(', ')}
              </p>
            )}

            <div className="flex flex-wrap gap-4 mb-6">
              {volumeInfo.averageRating && (
                <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-md">
                  <span className="text-yellow-600 dark:text-yellow-400">⭐</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {volumeInfo.averageRating.toFixed(1)}
                  </span>
                  {volumeInfo.ratingsCount && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({volumeInfo.ratingsCount.toLocaleString()} votos)
                    </span>
                  )}
                </div>
              )}

              {volumeInfo.publishedDate && (
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">
                  <span className="text-gray-900 dark:text-white">
                    {new Date(volumeInfo.publishedDate).getFullYear()}
                  </span>
                </div>
              )}

              {volumeInfo.pageCount && (
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">
                  <span className="text-gray-900 dark:text-white">
                    {volumeInfo.pageCount} páginas
                  </span>
                </div>
              )}
            </div>

            {volumeInfo.categories && volumeInfo.categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Categorías
                </h3>
                <div className="flex flex-wrap gap-2">
                  {volumeInfo.categories.map((category, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {volumeInfo.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Descripción
                </h3>
                <div 
                  className="text-gray-700 dark:text-gray-300 leading-relaxed prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: volumeInfo.description }}
                />
              </div>
            )}

            {volumeInfo.publisher && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Editorial
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {volumeInfo.publisher}
                </p>
              </div>
            )}

            {(volumeInfo.previewLink || volumeInfo.infoLink) && (
              <div className="flex gap-4 mt-6">
                {volumeInfo.previewLink && (
                  <a
                    href={volumeInfo.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Vista previa
                  </a>
                )}
                {volumeInfo.infoLink && (
                  <a
                    href={volumeInfo.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Más información
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
