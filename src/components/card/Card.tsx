import Image from 'next/image';
import { CardProps } from './Card.interface';

export default function Card({
  title,
  subtitle,
  description,
  imageUrl,
  rating,
  footer,
  onClick,
}: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      {/* Imagen */}
      {imageUrl && (
        <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-700">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="p-4">
        {/* Título y Rating */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 flex-1">
            {title}
          </h3>
          {rating !== undefined && (
            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded-md flex-shrink-0">
              <span className="text-yellow-600 dark:text-yellow-400">⭐</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Subtítulo */}
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {subtitle}
          </p>
        )}

        {/* Descripción */}
        {description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">
            {description}
          </p>
        )}

        {/* Footer */}
        {footer && (
          <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
