'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'
import type { Database } from '@/lib/supabase/database.types'

type BookRead = Database['public']['Tables']['books_read']['Row']
type BookReadInsert = Database['public']['Tables']['books_read']['Insert']

export function useBooksRead() {
  const [books, setBooks] = useState<BookRead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  // Cargar libros leídos
  const fetchBooks = async () => {
    if (!user) {
      setBooks([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('books_read')
        .select('*')
        .eq('user_id', user.id)
        .order('finished_date', { ascending: false })

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

  // Agregar libro leído
  const addBook = async (bookData: Omit<BookReadInsert, 'user_id' | 'id' | 'created_at' | 'finished_date'>) => {
    if (!user) {
      throw new Error('Debes iniciar sesión para agregar libros')
    }

    try {
      const { data, error } = await supabase
        .from('books_read')
        .insert({
          user_id: user.id,
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

  // Eliminar libro leído
  const removeBook = async (googleBooksId: string) => {
    if (!user) {
      throw new Error('Debes iniciar sesión')
    }

    try {
      const { error } = await supabase
        .from('books_read')
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
  const isBookRead = (googleBooksId: string) => {
    return books.some(b => b.google_books_id === googleBooksId)
  }

  return {
    books,
    loading,
    error,
    addBook,
    removeBook,
    isBookRead,
    refetch: fetchBooks,
  }
}
