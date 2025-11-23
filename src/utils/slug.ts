/**
 * Genera un slug amigable para URLs a partir de un título
 * @param title - El título a convertir en slug
 * @returns Un slug en minúsculas separado por guiones
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD') // Normaliza caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .replace(/[^a-z0-9\s-]/g, '') // Elimina caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Reemplaza espacios con guiones
    .replace(/-+/g, '-'); // Elimina guiones duplicados
}

/**
 * Crea una URL completa para películas con slug y query param
 * @param id - ID de la película
 * @param title - Título de la película
 * @returns URL en formato "/movies/titulo-de-pelicula?id=123"
 */
export function createMovieUrl(id: number, title: string): string {
  const slug = generateSlug(title);
  return `${slug}?id=${id}`;
}

/**
 * Crea una URL completa para libros con slug y query param
 * @param id - ID del libro
 * @param title - Título del libro
 * @returns URL en formato "/books/titulo-del-libro?id=abc123"
 */
export function createBookUrl(id: string, title: string): string {
  const slug = generateSlug(title);
  return `${slug}?id=${id}`;
}
