import Image from 'next/image';
import { CardProps } from './Card.interface';
import ActionButtonWithDropdown from './ActionButtonWithDropdown';

export default function Card({
  title,
  imageUrl,
  onClick,
  actionButton,
  actionButtonWithOptions,
}: CardProps) {
  const getButtonStyles = (variant: 'primary' | 'secondary' | 'danger' = 'primary') => {
    const baseStyles = 'w-full py-2 px-4 rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
      danger: 'bg-blue-500 hover:bg-blue-400 text-white',
    };
    return `${baseStyles} ${variants[variant]}`;
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg dark:border-gray-700"
    >
      {/* Imagen */}
      {imageUrl && (
        <div 
          className="relative w-full aspect-[2/3] bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 dark:border-gray-700"
          onClick={onClick}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="flex flex-col p-4">
        {/* Título y Rating */}
        {/* <div className="flex justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 ">
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
        </div> */}

        {/* Subtítulo
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {subtitle}
          </p>
        )} */}

        {/* Descripción */}
        {/* {description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">
            {description}
          </p>
        )} */}

        {/* Footer */}
        {/* {footer && (
          <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        )} */}

        {/* Action Button */}
        {actionButton && !actionButtonWithOptions && (
          <div className="mt-auto pt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                actionButton.onClick(e);
              }}
              disabled={actionButton.disabled}
              className={getButtonStyles(actionButton.variant)}
            >
              {actionButton.label}
            </button>
          </div>
        )}

        {/* Action Button with Dropdown */}
        {actionButtonWithOptions && (
          <div className="flex justify-center mt-auto pt-3">
            <ActionButtonWithDropdown
              options={actionButtonWithOptions.options}
              defaultOption={actionButtonWithOptions.defaultOption}
              disabled={actionButtonWithOptions.disabled}
              mainLabel={actionButtonWithOptions.mainLabel}
              mainVariant={actionButtonWithOptions.mainVariant}
            />
          </div>
        )}
      </div>
    </div>
  );
}
