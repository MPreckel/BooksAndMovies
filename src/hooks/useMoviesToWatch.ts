'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'
import type { Database } from '@/lib/supabase/database.types'

type MovieToWatch = Database['public']['Tables']['movies_to_watch']['Row']

export function useMoviesToWatch() {
  const [movies, setMovies] = useState<MovieToWatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  // Cargar películas por ver
  const fetchMovies = async () => {
    if (!user) {
      setMovies([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('movies_to_watch')
        .select('*')
        .eq('user_id', user.id)
        .order('added_date', { ascending: false })

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

  // Agregar película a la lista
  const addMovie = async (movieData: {
    tmdb_id: number
    title: string
    poster_path?: string | null
    description?: string | null
  }) => {
    if (!user) {
      throw new Error('Debes iniciar sesión para agregar películas')
    }

    try {
      const { data, error } = await supabase
        .from('movies_to_watch')
        // @ts-expect-error - Supabase type inference issue with insert
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

  // Eliminar película de la lista
  const removeMovie = async (tmdbId: number) => {
    if (!user) {
      throw new Error('Debes iniciar sesión')
    }

    try {
      const { error } = await supabase
        .from('movies_to_watch')
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
  const isMovieInList = (tmdbId: number) => {
    return movies.some(m => m.tmdb_id === tmdbId)
  }

  return {
    movies,
    loading,
    error,
    addMovie,
    removeMovie,
    isMovieInList,
    refetch: fetchMovies,
  }
}
