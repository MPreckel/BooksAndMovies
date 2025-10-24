-- =====================================================
-- SCHEMA PARA SUPABASE - LITERATURE APP
-- =====================================================
-- Este archivo contiene todas las tablas necesarias para:
-- - Autenticación de usuarios
-- - Gestión de películas (vistas y por ver)
-- - Gestión de libros (leídos, leyendo, por leer)
-- - Reviews de películas y libros
-- =====================================================

-- =====================================================
-- 1. TABLA DE PERFILES DE USUARIO
-- =====================================================
-- Extiende la tabla auth.users de Supabase con información adicional
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas: Los usuarios pueden ver todos los perfiles pero solo editar el suyo
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. PELÍCULAS VISTAS
-- =====================================================
CREATE TABLE movies_watched (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tmdb_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  poster_path TEXT,
  watched_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tmdb_id)
);

ALTER TABLE movies_watched ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own watched movies"
  ON movies_watched FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watched movies"
  ON movies_watched FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watched movies"
  ON movies_watched FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 3. PELÍCULAS POR VER
-- =====================================================
CREATE TABLE movies_to_watch (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tmdb_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  poster_path TEXT,
  added_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tmdb_id)
);

ALTER TABLE movies_to_watch ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own movies to watch"
  ON movies_to_watch FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own movies to watch"
  ON movies_to_watch FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own movies to watch"
  ON movies_to_watch FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 4. REVIEWS DE PELÍCULAS
-- =====================================================
CREATE TABLE movie_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tmdb_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  poster_path TEXT,
  rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tmdb_id)
);

ALTER TABLE movie_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own movie reviews"
  ON movie_reviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own movie reviews"
  ON movie_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own movie reviews"
  ON movie_reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own movie reviews"
  ON movie_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 5. LIBROS LEÍDOS
-- =====================================================
CREATE TABLE books_read (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  google_books_id TEXT NOT NULL,
  title TEXT NOT NULL,
  authors TEXT[],
  thumbnail TEXT,
  finished_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, google_books_id)
);

ALTER TABLE books_read ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own read books"
  ON books_read FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own read books"
  ON books_read FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own read books"
  ON books_read FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 6. LIBROS LEYENDO ACTUALMENTE
-- =====================================================
CREATE TABLE books_reading (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  google_books_id TEXT NOT NULL,
  title TEXT NOT NULL,
  authors TEXT[],
  thumbnail TEXT,
  started_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_page INTEGER DEFAULT 0,
  total_pages INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, google_books_id)
);

ALTER TABLE books_reading ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own currently reading books"
  ON books_reading FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own currently reading books"
  ON books_reading FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own currently reading books"
  ON books_reading FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own currently reading books"
  ON books_reading FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 7. LIBROS POR LEER
-- =====================================================
CREATE TABLE books_to_read (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  google_books_id TEXT NOT NULL,
  title TEXT NOT NULL,
  authors TEXT[],
  thumbnail TEXT,
  added_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, google_books_id)
);

ALTER TABLE books_to_read ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own books to read"
  ON books_to_read FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own books to read"
  ON books_to_read FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books to read"
  ON books_to_read FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 8. REVIEWS DE LIBROS
-- =====================================================
CREATE TABLE book_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  google_books_id TEXT NOT NULL,
  title TEXT NOT NULL,
  authors TEXT[],
  thumbnail TEXT,
  rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, google_books_id)
);

ALTER TABLE book_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own book reviews"
  ON book_reviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own book reviews"
  ON book_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own book reviews"
  ON book_reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own book reviews"
  ON book_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 9. FUNCIÓN PARA CREAR PERFIL AUTOMÁTICAMENTE
-- =====================================================
-- Esta función crea automáticamente un perfil cuando un usuario se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función cuando se crea un nuevo usuario
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 10. ÍNDICES PARA MEJORAR PERFORMANCE
-- =====================================================
CREATE INDEX idx_movies_watched_user_id ON movies_watched(user_id);
CREATE INDEX idx_movies_watched_tmdb_id ON movies_watched(tmdb_id);
CREATE INDEX idx_movies_to_watch_user_id ON movies_to_watch(user_id);
CREATE INDEX idx_movie_reviews_user_id ON movie_reviews(user_id);
CREATE INDEX idx_books_read_user_id ON books_read(user_id);
CREATE INDEX idx_books_reading_user_id ON books_reading(user_id);
CREATE INDEX idx_books_to_read_user_id ON books_to_read(user_id);
CREATE INDEX idx_book_reviews_user_id ON book_reviews(user_id);
