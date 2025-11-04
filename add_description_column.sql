-- Script SQL para agregar columna 'description' a las tablas de películas y libros
-- Ejecutar este script en Supabase SQL Editor

-- Agregar columna description a las tablas de películas
ALTER TABLE movies_to_watch 
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE movies_watched 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Agregar columna description a las tablas de libros
ALTER TABLE books_to_read 
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE books_reading 
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE books_read 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('movies_to_watch', 'movies_watched', 'books_to_read', 'books_reading', 'books_read')
  AND column_name = 'description'
ORDER BY table_name;
