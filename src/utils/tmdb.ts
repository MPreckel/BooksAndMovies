/**
 * Utilidades para TMDB (The Movie Database)
 * Funciones del lado del servidor
 */

/**
 * Genera la URL completa para una imagen de TMDB
 * @param path - Ruta de la imagen (ej: "/abc123.jpg")
 * @param size - Tamaño de la imagen ('w500', 'w780', 'original')
 * @returns URL completa de la imagen o placeholder si no hay path
 */
export function getImageUrl(path: string | null, size: 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) return '/placeholder-movie.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
