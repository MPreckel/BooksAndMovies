'use client'

import AuthForm from '@/components/auth/AuthForm'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <AuthForm 
          mode="signin" 
          onSuccess={() => router.push('/')}
        />
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          ¿No tienes cuenta?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
