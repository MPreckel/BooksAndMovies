"use client";

import { useEffect, useState } from "react";

export interface GoogleBooksVolume {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
    };
    infoLink?: string;
    publishedDate?: string;
    averageRating?: number;
    ratingsCount?: number;
    categories?: string[];
  };
}

interface GoogleBooksResponse {
  totalItems: number;
  items?: GoogleBooksVolume[];
}

export type BookCategory = 'fiction' | 'science' | 'history' | 'biography' | 'technology' | 'art';

export const BOOK_CATEGORY_QUERIES: Record<BookCategory, string> = {
  fiction: 'subject:fiction',
  science: 'subject:science',
  history: 'subject:history',
  biography: 'subject:biography',
  technology: 'subject:technology',
  art: 'subject:art',
};

interface UseBooksOptions {
  category?: BookCategory;
  search?: string;
  page?: number;
  perPage?: number;
}

interface UseBooksReturn {
  books: GoogleBooksVolume[];
  loading: boolean;
  error: string | null;
  totalItems: number;
}

const GOOGLE_BOOKS_BASE = "https://www.googleapis.com/books/v1/volumes";

export function useBooks({
  category = 'fiction',
  search = '',
  page = 1,
  perPage = 20,
}: UseBooksOptions = {}): UseBooksReturn {
  const [books, setBooks] = useState<GoogleBooksVolume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const startIndex = Math.max(0, (page - 1) * perPage);
        const maxResults = Math.min(Math.max(perPage, 1), 40);
        
        const searchTerm = search.trim();
        let query: string;

        if (searchTerm) {
          query = searchTerm;
        } else {
          query = BOOK_CATEGORY_QUERIES[category];
        }

        const url = `${GOOGLE_BOOKS_BASE}?q=${encodeURIComponent(
          query
        )}&startIndex=${startIndex}&maxResults=${maxResults}&orderBy=relevance`;

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const data: GoogleBooksResponse = await res.json();
        setBooks(data.items || []);
        setTotalItems(data.totalItems || 0);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        const message =
          err instanceof Error
            ? err.message
            : "Error desconocido al cargar libros";
        setError(message);
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
    return () => controller.abort();
  }, [category, search, page, perPage]);

  return { books, loading, error, totalItems };
}
