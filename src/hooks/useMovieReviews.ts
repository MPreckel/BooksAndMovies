'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'
import type { Database } from '@/lib/supabase/database.types'

type MovieReview = Database['public']['Tables']['movie_reviews']['Row']
type MovieReviewInsert = Database['public']['Tables']['movie_reviews']['Insert']
type MovieReviewUpdate = Database['public']['Tables']['movie_reviews']['Update']

export function useMovieReviews() {
  const [reviews, setReviews] = useState<MovieReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  // Cargar reviews del usuario
  const fetchReviews = async () => {
    if (!user) {
      setReviews([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('movie_reviews')
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

  // Crear review
  const createReview = async (reviewData: Omit<MovieReviewInsert, 'user_id' | 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      throw new Error('Debes iniciar sesión para crear una review')
    }

    try {
      const { data, error } = await supabase
        .from('movie_reviews')
        .insert({
          user_id: user.id,
          ...reviewData,
        })
        .select()
        .single()

      if (error) throw error
      
      // Actualizar lista local
      setReviews(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear review'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  // Actualizar review
  const updateReview = async (tmdbId: number, updates: Pick<MovieReviewUpdate, 'rating' | 'comment'>) => {
    if (!user) {
      throw new Error('Debes iniciar sesión')
    }

    try {
      const { data, error } = await supabase
        .from('movie_reviews')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('tmdb_id', tmdbId)
        .select()
        .single()

      if (error) throw error

      // Actualizar lista local
      setReviews(prev => prev.map(r => r.tmdb_id === tmdbId ? data : r))
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar review'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  // Eliminar review
  const deleteReview = async (tmdbId: number) => {
    if (!user) {
      throw new Error('Debes iniciar sesión')
    }

    try {
      const { error } = await supabase
        .from('movie_reviews')
        .delete()
        .eq('user_id', user.id)
        .eq('tmdb_id', tmdbId)

      if (error) throw error

      // Actualizar lista local
      setReviews(prev => prev.filter(r => r.tmdb_id !== tmdbId))
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar review'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  // Obtener review de una película específica
  const getReview = (tmdbId: number) => {
    return reviews.find(r => r.tmdb_id === tmdbId)
  }

  // Verificar si existe review para una película
  const hasReview = (tmdbId: number) => {
    return reviews.some(r => r.tmdb_id === tmdbId)
  }

  return {
    reviews,
    loading,
    error,
    createReview,
    updateReview,
    deleteReview,
    getReview,
    hasReview,
    refetch: fetchReviews,
  }
}
