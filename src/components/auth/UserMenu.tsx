'use client'

import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import Link from 'next/link'

export default function UserMenu() {
  const { user, loading, signOut } = useAuth()
  const [showMenu, setShowMenu] = useState(false)

  if (loading) {
    return (
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
    )
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        Iniciar Sesión
      </Link>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
      >
        {user.email?.[0].toUpperCase()}
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </>
      )}
    </div>
  )
}
