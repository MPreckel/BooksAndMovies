# Guía de Supabase - Literature App

## 📚 Configuración Completada

### ✅ Base de Datos
- Tablas creadas en Supabase con Row Level Security (RLS)
- Autenticación integrada
- Trigger automático para crear perfiles de usuario

### ✅ Código Implementado
- Cliente de Supabase configurado
- Tipos TypeScript generados
- Hooks de autenticación
- Componentes de login/registro
- Middleware para gestión de sesiones

---

## 🚀 Cómo Usar

### Autenticación

#### Registrar un usuario
```typescript
import { useAuth } from '@/hooks/useAuth'

const { signUp } = useAuth()

await signUp('email@example.com', 'password', {
  username: 'usuario123',
  full_name: 'Nombre Completo'
})
```

#### Iniciar sesión
```typescript
const { signIn } = useAuth()
await signIn('email@example.com', 'password')
```

#### Cerrar sesión
```typescript
const { signOut } = useAuth()
await signOut()
```

#### Obtener usuario actual
```typescript
const { user, loading } = useAuth()

if (loading) return <div>Cargando...</div>
if (!user) return <div>No autenticado</div>

return <div>Hola {user.email}</div>
```

---

## 📊 Trabajar con Datos

### Películas Vistas

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Agregar película vista
const { data, error } = await supabase
  .from('movies_watched')
  .insert({
    user_id: user.id,
    tmdb_id: 123,
    title: 'Inception',
    poster_path: '/path/to/poster.jpg'
  })

// Obtener películas vistas del usuario
const { data, error } = await supabase
  .from('movies_watched')
  .select('*')
  .eq('user_id', user.id)
  .order('watched_date', { ascending: false })

// Eliminar película vista
const { error } = await supabase
  .from('movies_watched')
  .delete()
  .eq('user_id', user.id)
  .eq('tmdb_id', 123)
```

### Películas por Ver

```typescript
// Agregar película a la lista
const { data, error } = await supabase
  .from('movies_to_watch')
  .insert({
    user_id: user.id,
    tmdb_id: 456,
    title: 'The Matrix',
    poster_path: '/path/to/poster.jpg'
  })

// Obtener lista de películas por ver
const { data, error } = await supabase
  .from('movies_to_watch')
  .select('*')
  .eq('user_id', user.id)
```

### Reviews de Películas

```typescript
// Crear review
const { data, error } = await supabase
  .from('movie_reviews')
  .insert({
    user_id: user.id,
    tmdb_id: 789,
    title: 'Interstellar',
    poster_path: '/path/to/poster.jpg',
    rating: 9.5,
    comment: 'Increíble película sobre el espacio y el tiempo'
  })

// Actualizar review
const { data, error } = await supabase
  .from('movie_reviews')
  .update({
    rating: 10,
    comment: 'La mejor película de ciencia ficción'
  })
  .eq('user_id', user.id)
  .eq('tmdb_id', 789)

// Obtener reviews del usuario
const { data, error } = await supabase
  .from('movie_reviews')
  .select('*')
  .eq('user_id', user.id)
```

### Libros Leídos

```typescript
// Agregar libro leído
const { data, error } = await supabase
  .from('books_read')
  .insert({
    user_id: user.id,
    google_books_id: 'abc123',
    title: '1984',
    authors: ['George Orwell'],
    thumbnail: 'https://...'
  })

// Obtener libros leídos
const { data, error } = await supabase
  .from('books_read')
  .select('*')
  .eq('user_id', user.id)
```

### Libros Leyendo

```typescript
// Agregar libro que estás leyendo
const { data, error } = await supabase
  .from('books_reading')
  .insert({
    user_id: user.id,
    google_books_id: 'def456',
    title: 'El Señor de los Anillos',
    authors: ['J.R.R. Tolkien'],
    thumbnail: 'https://...',
    current_page: 150,
    total_pages: 500
  })

// Actualizar progreso
const { data, error } = await supabase
  .from('books_reading')
  .update({ current_page: 200 })
  .eq('user_id', user.id)
  .eq('google_books_id', 'def456')
```

### Libros por Leer

```typescript
// Agregar libro a la lista
const { data, error } = await supabase
  .from('books_to_read')
  .insert({
    user_id: user.id,
    google_books_id: 'ghi789',
    title: 'Cien Años de Soledad',
    authors: ['Gabriel García Márquez'],
    thumbnail: 'https://...'
  })
```

### Reviews de Libros

```typescript
// Crear review de libro
const { data, error } = await supabase
  .from('book_reviews')
  .insert({
    user_id: user.id,
    google_books_id: 'jkl012',
    title: 'Don Quijote',
    authors: ['Miguel de Cervantes'],
    thumbnail: 'https://...',
    rating: 8.5,
    comment: 'Un clásico imprescindible de la literatura española'
  })
```

---

## 🔐 Seguridad

- **Row Level Security (RLS)** está habilitado en todas las tablas
- Cada usuario solo puede ver y modificar sus propios datos
- Las credenciales están en `.env.local` (no se suben a Git)
- La `ANON_KEY` es segura para el frontend gracias a RLS
