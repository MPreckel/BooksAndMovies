'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'
import type { Database } from '@/lib/supabase/database.types'

type BookReview = Database['public']['Tables']['book_reviews']['Row']
type BookReviewInsert = Database['public']['Tables']['book_reviews']['Insert']
type BookReviewUpdate = Database['public']['Tables']['book_reviews']['Update']

export function useBookReviews() {
  const [reviews, setReviews] = useState<BookReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const fetchReviews = async () => {
    if (!user) {
      setReviews([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('book_reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [user?.id])

  const createReview = async (reviewData: Omit<BookReviewInsert, 'user_id' | 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Debes iniciar sesión')

    try {
      const { data, error } = await supabase
        .from('book_reviews')
        .insert({ user_id: user.id, ...reviewData })
        .select()
        .single()

      if (error) throw error
      setReviews(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear review'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const updateReview = async (googleBooksId: string, updates: Pick<BookReviewUpdate, 'rating' | 'comment'>) => {
    if (!user) throw new Error('Debes iniciar sesión')

    try {
      const { data, error } = await supabase
        .from('book_reviews')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('google_books_id', googleBooksId)
        .select()
        .single()

      if (error) throw error
      setReviews(prev => prev.map(r => r.google_books_id === googleBooksId ? data : r))
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar review'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const deleteReview = async (googleBooksId: string) => {
    if (!user) throw new Error('Debes iniciar sesión')

    try {
      const { error } = await supabase
        .from('book_reviews')
        .delete()
        .eq('user_id', user.id)
        .eq('google_books_id', googleBooksId)

      if (error) throw error
      setReviews(prev => prev.filter(r => r.google_books_id !== googleBooksId))
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar review'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  const getReview = (googleBooksId: string) => reviews.find(r => r.google_books_id === googleBooksId)
  const hasReview = (googleBooksId: string) => reviews.some(r => r.google_books_id === googleBooksId)

  return { reviews, loading, error, createReview, updateReview, deleteReview, getReview, hasReview, refetch: fetchReviews }
}
