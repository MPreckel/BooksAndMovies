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
  };
}

interface GoogleBooksResponse {
  totalItems: number;
  items?: GoogleBooksVolume[];
}

interface UseBooksOptions {
  q?: string; // consulta de búsqueda
  page?: number; // página 1-based
  perPage?: number; // maxResults (hasta 40)
}

interface UseBooksReturn {
  books: GoogleBooksVolume[];
  loading: boolean;
  error: string | null;
  totalItems: number;
}

const GOOGLE_BOOKS_BASE = "https://www.googleapis.com/books/v1/volumes";

export function useBooks({
  q = "harry potter",
  page = 1,
  perPage = 10,
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
        // Google Books usa startIndex (0-based) y maxResults (1-40)
        const startIndex = Math.max(0, (page - 1) * perPage);
        const maxResults = Math.min(Math.max(perPage, 1), 40);
        const url = `${GOOGLE_BOOKS_BASE}?q=${encodeURIComponent(
          q
        )}&startIndex=${startIndex}&maxResults=${maxResults}`;

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const data: GoogleBooksResponse = await res.json();
        console.log("data", data);
        setBooks(data.items || []);
        setTotalItems(data.totalItems || 0);
      } catch (err) {
        if ((err as any).name === "AbortError") return;
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
  }, [q, page, perPage]);

  return { books, loading, error, totalItems };
}
