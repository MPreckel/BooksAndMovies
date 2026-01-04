import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import BookReviewForm from '@/components/reviews/BookReviewForm';

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

interface BookDetailPageProps {
  searchParams: Promise<{ id?: string }>;
}

async function fetchBookDetails(bookId: string): Promise<BookDetails> {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${bookId}`,
    {
      next: { revalidate: 3600 }, // Revalidar cada hora
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error('Error al cargar los detalles del libro');
  }

  return response.json();
}

export default async function BookDetailPage({ searchParams }: BookDetailPageProps) {
  const params = await searchParams;
  const bookId = params.id;

  if (!bookId) {
    notFound();
  }

  const book = await fetchBookDetails(bookId);

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
            <Link
              href="/books"
              className="mb-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Volver
            </Link>

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
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-8">
          <BookReviewForm
            bookId={book.id}
            bookTitle={volumeInfo.title}
            authors={volumeInfo.authors}
            thumbnail={thumbnail}
          />
        </div>
      </div>
    </div>
  );
}
