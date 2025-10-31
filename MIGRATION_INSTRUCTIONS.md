# Instrucciones para Migración de Base de Datos

## Agregar columna `description` a las tablas

### Paso 1: Ejecutar el Script SQL

1. Abre tu proyecto en **Supabase Dashboard**
2. Ve a la sección **SQL Editor**
3. Abre el archivo `add_description_column.sql` que se encuentra en la raíz del proyecto
4. Copia todo el contenido del archivo
5. Pégalo en el SQL Editor de Supabase
6. Haz clic en **Run** para ejecutar el script

### Paso 2: Verificar que las columnas se agregaron

El script incluye una consulta de verificación al final que mostrará todas las columnas `description` agregadas. Deberías ver 5 filas:

- `books_read.description`
- `books_reading.description`
- `books_to_read.description`
- `movies_to_watch.description`
- `movies_watched.description`

### Paso 3: Actualizar los tipos de TypeScript (Ya completado)

Los tipos en `src/lib/supabase/database.types.ts` ya fueron actualizados manualmente para incluir el campo `description` en todas las tablas.

Si en el futuro necesitas regenerar los tipos automáticamente desde Supabase, puedes usar:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/database.types.ts
```

### Cambios realizados en el código

1. **Tipos de base de datos** (`database.types.ts`): Agregado campo `description: string | null` a todas las tablas de películas y libros
2. **Página de películas** (`app/page.tsx`): Los inserts ahora incluyen `description: movie.overview`
3. **Página de libros** (`app/books/page.tsx`): Los inserts ahora incluyen `description: book.volumeInfo?.description`

### Tablas afectadas

- ✅ `movies_to_watch`
- ✅ `movies_watched`
- ✅ `books_to_read`
- ✅ `books_reading`
- ✅ `books_read`

## Notas

- La columna `description` acepta valores `NULL`, por lo que es opcional
- Los datos existentes en las tablas no se verán afectados
- Las nuevas inserciones incluirán automáticamente la descripción cuando esté disponible
