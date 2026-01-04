'use client'

import { useState, useEffect } from 'react'
import { useBookReviews } from '@/hooks/useBookReviews'
import { EditIcon } from '../icons/EditIcon'
import { DeleteIcon } from '../icons/DeleteIcon'
import { StarIcon } from '../icons/StarIcon'

interface BookReviewFormProps {
  bookId: string
  bookTitle: string
  authors?: string[]
  thumbnail?: string
}

export default function BookReviewForm({ bookId, bookTitle, authors, thumbnail }: BookReviewFormProps) {
  const { getReview, createReview, updateReview, deleteReview, loading } = useBookReviews()
  const existingReview = getReview(bookId)

  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hoveredRating, setHoveredRating] = useState<number>(0)

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 0)
      setComment(existingReview.comment || '')
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }, [existingReview])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0 && !comment.trim()) {
      alert('Por favor agrega una calificación o un comentario')
      return
    }

    setIsSaving(true)
    try {
      if (existingReview) {
        const result = await updateReview(bookId, { 
          rating: rating || null, 
          comment: comment.trim() || null 
        })
        if (result.error) {
          alert(result.error)
        } else {
          setIsEditing(false)
        }
      } else {
        const result = await createReview({
          google_books_id: bookId,
          title: bookTitle,
          authors: authors || null,
          thumbnail: thumbnail || null,
          rating: rating || null,
          comment: comment.trim() || null,
        })
        if (result.error) {
          alert(result.error)
        } else {
          setIsEditing(false)
        }
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta review?')) {
      return
    }

    setIsSaving(true)
    try {
      const result = await deleteReview(bookId)
      if (result.error) {
        alert(result.error)
      } else {
        setRating(0)
        setComment('')
        setIsEditing(true)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (existingReview) {
      setRating(existingReview.rating || 0)
      setComment(existingReview.comment || '')
      setIsEditing(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {existingReview ? 'Tu Review' : 'Deja tu Review'}
        </h2>
        {existingReview && !isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 dark:text-blue-400 text-sm font-medium cursor-pointer"
            >
              <EditIcon size={24} />
            </button>
            <button
              onClick={handleDelete}
              disabled={isSaving}
              className="text-red-600 dark:text-red-400 text-sm font-medium disabled:opacity-50 cursor-pointer"
            >
              <DeleteIcon size={24} />
            </button>
          </div>
        )}
      </div>

      {!isEditing && existingReview ? (
        <div className="space-y-4">
          {existingReview.rating && (
            <div className="flex items-center gap-2">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Tu calificación:</span>
              <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-md">
                <span className="text-yellow-600 dark:text-yellow-400">⭐</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {existingReview.rating.toFixed(1)}
                </span>
                <span className="text-gray-600 dark:text-gray-400">/10</span>
              </div>
            </div>
          )}
          {existingReview.comment && (
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Tu comentario:</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                {existingReview.comment}
              </p>
            </div>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {existingReview.updated_at && existingReview.updated_at !== existingReview.created_at
              ? `Actualizada: ${new Date(existingReview.updated_at).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}`
              : `Creada: ${new Date(existingReview.created_at).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}`
            }
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-3">
              Calificación (opcional)
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-3xl transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                >
                  <StarIcon 
                    size={32} 
                    color={star <= (hoveredRating || rating) ? "#FBBF24" : "#D1D5DB"}
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2">
              {rating > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Calificación: <span className="font-bold text-gray-900 dark:text-white">{rating}/10</span>
                </p>
              )}
              {rating > 0 && (
                <button
                  type="button"
                  onClick={() => setRating(0)}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Comentario (opcional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              placeholder="¿Qué te pareció el libro? Comparte tu opinión..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSaving || (rating === 0 && !comment.trim())}
              className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Guardando...' : existingReview ? 'Actualizar Review' : 'Guardar Review'}
            </button>
            {existingReview && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="cursor-pointer px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
