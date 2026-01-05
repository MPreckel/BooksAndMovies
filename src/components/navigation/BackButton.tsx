'use client'

import { useRouter } from 'next/navigation'

interface BackButtonProps {
  fallbackUrl?: string
  label?: string
  className?: string
}

export default function BackButton({ 
  fallbackUrl = '/', 
  label = '← Volver',
  className = 'mb-4 inline-block text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackUrl)
    }
  }

  return (
    <button
      onClick={handleBack}
      className={className}
    >
      {label}
    </button>
  )
}
