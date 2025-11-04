'use client'

import { useState, useRef, useEffect } from 'react'

export interface ActionOption {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
}

interface ActionButtonWithDropdownProps {
  options: ActionOption[]
  defaultOption?: number
  disabled?: boolean
  mainLabel?: string
  mainVariant?: 'primary' | 'secondary' | 'danger'
}

export default function ActionButtonWithDropdown({
  options,
  defaultOption = 0,
  disabled = false,
  mainLabel,
  mainVariant,
}: ActionButtonWithDropdownProps) {
  const [selectedIndex, setSelectedIndex] = useState(defaultOption)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options[selectedIndex]
  const displayLabel = mainLabel ?? selectedOption.label
  const displayVariant = mainVariant ?? selectedOption.variant

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const getButtonStyles = (variant: 'primary' | 'secondary' | 'danger' = 'primary') => {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    }
    return variants[variant]
  }

  const handleMainClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled) {
      // Si hay mainLabel, no ejecutar ninguna acción al hacer click principal
      // El usuario debe usar el dropdown para seleccionar una acción
      if (!mainLabel) {
        selectedOption.onClick()
      } else {
        setShowDropdown(!showDropdown)
      }
    }
  }

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled) {
      setShowDropdown(!showDropdown)
    }
  }

  const handleOptionSelect = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedIndex(index)
    setShowDropdown(false)
    options[index].onClick()
  }

  return (
    <div className="relative w-40" ref={dropdownRef}>
      <div className="flex gap-0">
        {/* Main Button */}
        <button
          onClick={handleMainClick}
          disabled={disabled}
          className={`cursor-pointer flex-1 py-2 px-4 rounded-l-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyles(
            displayVariant
          )}`}
        >
          {displayLabel}
        </button>

        {/* Dropdown Toggle */}
        <button
          onClick={handleDropdownToggle}
          disabled={disabled}
          className={`cursor-pointer p-2 rounded-r-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none ${getButtonStyles(
            displayVariant
          )}`}
        >
          <svg
            className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute z-50 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {options
            .map((option, index) => ({ option, index }))
            .filter(({ index }) => mainLabel ? true : index !== selectedIndex)
            .map(({ option, index }) => (
              <button
                key={index}
                onClick={(e) => handleOptionSelect(index, e)}
                className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {option.label}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}
