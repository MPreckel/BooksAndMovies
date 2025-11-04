'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'
import type { Database } from '@/lib/supabase/database.types'

type BookReading = Database['public']['Tables']['books_reading']['Row']
type BookReadingInsert = Database['public']['Tables']['books_reading']['Insert']

export function useBooksReading() {
  const [books, setBooks] = useState<BookReading[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  // Cargar libros que está leyendo
  const fetchBooks = async () => {
    if (!user) {
      setBooks([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('books_reading')
        .select('*')
        .eq('user_id', user.id)
        .order('started_date', { ascending: false })

      if (error) throw error
      setBooks(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar libros')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [user?.id])

  // Agregar libro que está leyendo
  const addBook = async (bookData: Omit<BookReadingInsert, 'user_id' | 'id' | 'created_at' | 'started_date'>) => {
    if (!user) {
      throw new Error('Debes iniciar sesión para agregar libros')
    }

    try {
      const { data, error } = await supabase
        .from('books_reading')
        .insert({
          user_id: user.id,
          current_page: 0,
          ...bookData,
        })
        .select()
        .single()

      if (error) throw error
      
      // Actualizar lista local
      setBooks(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agregar libro'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  // Actualizar progreso de lectura
  const updateProgress = async (googleBooksId: string, currentPage: number) => {
    if (!user) {
      throw new Error('Debes iniciar sesión')
    }

    try {
      const { data, error } = await supabase
        .from('books_reading')
        .update({ current_page: currentPage })
        .eq('user_id', user.id)
        .eq('google_books_id', googleBooksId)
        .select()
        .single()

      if (error) throw error

      // Actualizar lista local
      setBooks(prev => prev.map(b => b.google_books_id === googleBooksId ? data : b))
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar progreso'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  // Eliminar libro de la lista
  const removeBook = async (googleBooksId: string) => {
    if (!user) {
      throw new Error('Debes iniciar sesión')
    }

    try {
      const { error } = await supabase
        .from('books_reading')
        .delete()
        .eq('user_id', user.id)
        .eq('google_books_id', googleBooksId)

      if (error) throw error

      // Actualizar lista local
      setBooks(prev => prev.filter(b => b.google_books_id !== googleBooksId))
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar libro'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  // Verificar si un libro está en la lista
  const isBookReading = (googleBooksId: string) => {
    return books.some(b => b.google_books_id === googleBooksId)
  }

  // Obtener progreso de un libro
  const getProgress = (googleBooksId: string) => {
    const book = books.find(b => b.google_books_id === googleBooksId)
    if (!book || !book.total_pages) return 0
    return Math.round(((book.current_page || 0) / book.total_pages) * 100)
  }

  return {
    books,
    loading,
    error,
    addBook,
    updateProgress,
    removeBook,
    isBookReading,
    getProgress,
    refetch: fetchBooks,
  }
}
