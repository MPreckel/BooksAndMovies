'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'
import type { Database } from '@/lib/supabase/database.types'

type MovieWatched = Database['public']['Tables']['movies_watched']['Row']
type MovieWatchedInsert = Database['public']['Tables']['movies_watched']['Insert']

export function useMoviesWatched() {
  const [movies, setMovies] = useState<MovieWatched[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  // Cargar películas vistas
  const fetchMovies = async () => {
    if (!user) {
      setMovies([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('movies_watched')
        .select('*')
        .eq('user_id', user.id)
        .order('watched_date', { ascending: false })

      if (error) throw error
      setMovies(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar películas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [user?.id])

  // Agregar película vista
  const addMovie = async (movieData: Omit<MovieWatchedInsert, 'user_id' | 'id' | 'created_at' | 'watched_date'>) => {
    if (!user) {
      throw new Error('Debes iniciar sesión para agregar películas')
    }

    try {
      const { data, error } = await supabase
        .from('movies_watched')
        // @ts-expect-error - No se puede tipar correctamente
        .insert({
          user_id: user.id,
          ...movieData,
        })
        .select()
        .single()

      if (error) throw error
      
      // Actualizar lista local
      setMovies(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agregar película'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  // Eliminar película vista
  const removeMovie = async (tmdbId: number) => {
    if (!user) {
      throw new Error('Debes iniciar sesión')
    }

    try {
      const { error } = await supabase
        .from('movies_watched')
        .delete()
        .eq('user_id', user.id)
        .eq('tmdb_id', tmdbId)

      if (error) throw error

      // Actualizar lista local
      setMovies(prev => prev.filter(m => m.tmdb_id !== tmdbId))
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar película'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  // Verificar si una película está en la lista
  const isMovieWatched = (tmdbId: number) => {
    return movies.some(m => m.tmdb_id === tmdbId)
  }

  return {
    movies,
    loading,
    error,
    addMovie,
    removeMovie,
    isMovieWatched,
    refetch: fetchMovies,
  }
}
