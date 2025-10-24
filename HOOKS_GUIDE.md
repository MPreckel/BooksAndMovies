# Guía de Hooks - Literature App

## 📚 Hooks Disponibles

### 🎬 Películas

#### `useMoviesWatched()`
Gestiona las películas que el usuario ha visto.

```typescript
import { useMoviesWatched } from '@/hooks'

const { movies, loading, addMovie, removeMovie, isMovieWatched } = useMoviesWatched()

// Agregar película vista
await addMovie({
  tmdb_id: 550,
  title: 'Fight Club',
  poster_path: '/path/to/poster.jpg'
})

// Verificar si una película fue vista
const watched = isMovieWatched(550)

// Eliminar de la lista
await removeMovie(550)
```

**Retorna:**
- `movies`: Array de películas vistas
- `loading`: Estado de carga
- `error`: Mensaje de error si existe
- `addMovie(data)`: Agregar película
- `removeMovie(tmdbId)`: Eliminar película
- `isMovieWatched(tmdbId)`: Verificar si está en la lista
- `refetch()`: Recargar datos

---

#### `useMoviesToWatch()`
Gestiona las películas que el usuario quiere ver.

```typescript
import { useMoviesToWatch } from '@/hooks'

const { movies, addMovie, removeMovie, isMovieInList } = useMoviesToWatch()

// Agregar a la lista
await addMovie({
  tmdb_id: 13,
  title: 'Forrest Gump',
  poster_path: '/path/to/poster.jpg'
})

// Verificar si está en la lista
if (isMovieInList(13)) {
  console.log('Ya está en tu lista')
}
```

**Retorna:**
- `movies`: Array de películas por ver
- `loading`: Estado de carga
- `error`: Mensaje de error
- `addMovie(data)`: Agregar película
- `removeMovie(tmdbId)`: Eliminar película
- `isMovieInList(tmdbId)`: Verificar si está en la lista
- `refetch()`: Recargar datos

---

#### `useMovieReviews()`
Gestiona las reviews de películas del usuario.

```typescript
import { useMovieReviews } from '@/hooks'

const { reviews, createReview, updateReview, deleteReview, getReview, hasReview } = useMovieReviews()

// Crear review
await createReview({
  tmdb_id: 157336,
  title: 'Interstellar',
  poster_path: '/path/to/poster.jpg',
  rating: 9.5,
  comment: 'Una obra maestra del cine de ciencia ficción'
})

// Actualizar review existente
await updateReview(157336, {
  rating: 10,
  comment: 'Después de verla de nuevo, es perfecta'
})

// Obtener review específica
const review = getReview(157336)

// Verificar si existe review
if (hasReview(157336)) {
  console.log('Ya revieweaste esta película')
}

// Eliminar review
await deleteReview(157336)
```

**Retorna:**
- `reviews`: Array de reviews
- `loading`: Estado de carga
- `error`: Mensaje de error
- `createReview(data)`: Crear review
- `updateReview(tmdbId, updates)`: Actualizar review
- `deleteReview(tmdbId)`: Eliminar review
- `getReview(tmdbId)`: Obtener review específica
- `hasReview(tmdbId)`: Verificar si existe review
- `refetch()`: Recargar datos

---

### 📖 Libros

#### `useBooksRead()`
Gestiona los libros que el usuario ha leído.

```typescript
import { useBooksRead } from '@/hooks'

const { books, addBook, removeBook, isBookRead } = useBooksRead()

// Agregar libro leído
await addBook({
  google_books_id: 'abc123',
  title: '1984',
  authors: ['George Orwell'],
  thumbnail: 'https://...'
})

// Verificar si un libro fue leído
const read = isBookRead('abc123')

// Eliminar de la lista
await removeBook('abc123')
```

**Retorna:**
- `books`: Array de libros leídos
- `loading`: Estado de carga
- `error`: Mensaje de error
- `addBook(data)`: Agregar libro
- `removeBook(googleBooksId)`: Eliminar libro
- `isBookRead(googleBooksId)`: Verificar si está en la lista
- `refetch()`: Recargar datos

---

#### `useBooksReading()`
Gestiona los libros que el usuario está leyendo actualmente.

```typescript
import { useBooksReading } from '@/hooks'

const { books, addBook, updateProgress, removeBook, isBookReading, getProgress } = useBooksReading()

// Agregar libro que estás leyendo
await addBook({
  google_books_id: 'def456',
  title: 'El Señor de los Anillos',
  authors: ['J.R.R. Tolkien'],
  thumbnail: 'https://...',
  total_pages: 500
})

// Actualizar progreso de lectura
await updateProgress('def456', 250) // Página 250 de 500

// Obtener porcentaje de progreso
const progress = getProgress('def456') // Retorna 50

// Verificar si está leyendo un libro
if (isBookReading('def456')) {
  console.log('Estás leyendo este libro')
}

// Terminar de leer (eliminar de la lista)
await removeBook('def456')
```

**Retorna:**
- `books`: Array de libros leyendo
- `loading`: Estado de carga
- `error`: Mensaje de error
- `addBook(data)`: Agregar libro
- `updateProgress(googleBooksId, currentPage)`: Actualizar progreso
- `removeBook(googleBooksId)`: Eliminar libro
- `isBookReading(googleBooksId)`: Verificar si está leyendo
- `getProgress(googleBooksId)`: Obtener % de progreso
- `refetch()`: Recargar datos

---

#### `useBooksToRead()`
Gestiona los libros que el usuario quiere leer.

```typescript
import { useBooksToRead } from '@/hooks'

const { books, addBook, removeBook, isBookInList } = useBooksToRead()

// Agregar a la lista
await addBook({
  google_books_id: 'ghi789',
  title: 'Cien Años de Soledad',
  authors: ['Gabriel García Márquez'],
  thumbnail: 'https://...'
})

// Verificar si está en la lista
if (isBookInList('ghi789')) {
  console.log('Ya está en tu lista')
}
```

**Retorna:**
- `books`: Array de libros por leer
- `loading`: Estado de carga
- `error`: Mensaje de error
- `addBook(data)`: Agregar libro
- `removeBook(googleBooksId)`: Eliminar libro
- `isBookInList(googleBooksId)`: Verificar si está en la lista
- `refetch()`: Recargar datos

---

#### `useBookReviews()`
Gestiona las reviews de libros del usuario.

```typescript
import { useBookReviews } from '@/hooks'

const { reviews, createReview, updateReview, deleteReview, getReview, hasReview } = useBookReviews()

// Crear review
await createReview({
  google_books_id: 'jkl012',
  title: 'Don Quijote',
  authors: ['Miguel de Cervantes'],
  thumbnail: 'https://...',
  rating: 8.5,
  comment: 'Un clásico imprescindible'
})

// Actualizar review
await updateReview('jkl012', {
  rating: 9,
  comment: 'Cada vez lo aprecio más'
})

// Obtener review específica
const review = getReview('jkl012')

// Verificar si existe review
if (hasReview('jkl012')) {
  console.log('Ya revieweaste este libro')
}

// Eliminar review
await deleteReview('jkl012')
```

**Retorna:**
- `reviews`: Array de reviews
- `loading`: Estado de carga
- `error`: Mensaje de error
- `createReview(data)`: Crear review
- `updateReview(googleBooksId, updates)`: Actualizar review
- `deleteReview(googleBooksId)`: Eliminar review
- `getReview(googleBooksId)`: Obtener review específica
- `hasReview(googleBooksId)`: Verificar si existe review
- `refetch()`: Recargar datos

---

## 💡 Ejemplos de Uso

### Ejemplo: Botón para marcar película como vista

```typescript
'use client'

import { useMoviesWatched } from '@/hooks'
import { Movie } from '@/types/tmdb'

export default function MovieCard({ movie }: { movie: Movie }) {
  const { isMovieWatched, addMovie, removeMovie, loading } = useMoviesWatched()
  
  const watched = isMovieWatched(movie.id)
  
  const handleToggle = async () => {
    if (watched) {
      await removeMovie(movie.id)
    } else {
      await addMovie({
        tmdb_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path
      })
    }
  }
  
  return (
    <div>
      <h3>{movie.title}</h3>
      <button onClick={handleToggle} disabled={loading}>
        {watched ? '✓ Vista' : 'Marcar como vista'}
      </button>
    </div>
  )
}
```

### Ejemplo: Formulario de review

```typescript
'use client'

import { useState } from 'react'
import { useMovieReviews } from '@/hooks'

export default function ReviewForm({ movieId, title, posterPath }: any) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const { createReview, getReview, updateReview } = useMovieReviews()
  
  const existingReview = getReview(movieId)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (existingReview) {
      await updateReview(movieId, { rating, comment })
    } else {
      await createReview({
        tmdb_id: movieId,
        title,
        poster_path: posterPath,
        rating,
        comment
      })
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        min="0"
        max="10"
        step="0.1"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Escribe tu review..."
      />
      <button type="submit">
        {existingReview ? 'Actualizar' : 'Crear'} Review
      </button>
    </form>
  )
}
```

### Ejemplo: Barra de progreso de lectura

```typescript
'use client'

import { useBooksReading } from '@/hooks'

export default function ReadingProgress({ bookId }: { bookId: string }) {
  const { getProgress, updateProgress, books } = useBooksReading()
  
  const progress = getProgress(bookId)
  const book = books.find(b => b.google_books_id === bookId)
  
  if (!book) return null
  
  const handlePageUpdate = async (newPage: number) => {
    await updateProgress(bookId, newPage)
  }
  
  return (
    <div>
      <div className="progress-bar">
        <div style={{ width: `${progress}%` }} />
      </div>
      <p>{progress}% completado</p>
      <p>Página {book.current_page} de {book.total_pages}</p>
      <input
        type="number"
        value={book.current_page || 0}
        onChange={(e) => handlePageUpdate(Number(e.target.value))}
        max={book.total_pages || 0}
      />
    </div>
  )
}
```

---

## 🔄 Patrón de Uso Común

Todos los hooks siguen el mismo patrón:

1. **Cargan datos automáticamente** cuando el usuario está autenticado
2. **Actualizan el estado local** inmediatamente después de operaciones
3. **Retornan funciones async** que puedes await
4. **Incluyen `refetch()`** para recargar datos manualmente
5. **Manejan errores** y los exponen en el estado `error`

```typescript
const { data, loading, error, addItem, removeItem, refetch } = useHook()

// Siempre verifica loading y error
if (loading) return <div>Cargando...</div>
if (error) return <div>Error: {error}</div>

// Usa las funciones con await
const handleAdd = async () => {
  const { error } = await addItem(data)
  if (error) {
    alert(error)
  }
}
```
