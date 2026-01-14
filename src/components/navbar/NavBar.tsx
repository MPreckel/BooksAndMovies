'use client'

import Link from "next/link";
import UserMenu from "@/components/auth/UserMenu";
import { useState, useRef, useEffect } from "react";

export default function NavBar() {
  const [showMoviesMenu, setShowMoviesMenu] = useState(false);
  const [showBooksMenu, setShowBooksMenu] = useState(false);
  const [showMyMoviesSubmenu, setShowMyMoviesSubmenu] = useState(false);
  const [showMyBooksSubmenu, setShowMyBooksSubmenu] = useState(false);
  
  const moviesModalRef = useRef<HTMLDivElement>(null);
  const moviesTitleRef = useRef<HTMLButtonElement>(null);
  const booksModalRef = useRef<HTMLDivElement>(null);
  const booksTitleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMoviesMenu &&
          moviesModalRef.current &&
          moviesTitleRef.current &&
          !moviesModalRef.current.contains(event.target as Node) &&
          !moviesTitleRef.current.contains(event.target as Node)) {
        setShowMoviesMenu(false);
        setShowMyMoviesSubmenu(false);
      }
      
      if (showBooksMenu &&
          booksModalRef.current &&
          booksTitleRef.current &&
          !booksModalRef.current.contains(event.target as Node) &&
          !booksTitleRef.current.contains(event.target as Node)) {
        setShowBooksMenu(false);
        setShowMyBooksSubmenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoviesMenu, showBooksMenu]);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-full mx-auto px-4 h-14 flex items-center gap-6">
        {/* Películas con dropdown */}
        <div className="relative">
          <button
            ref={moviesTitleRef}
            onClick={() => {
              setShowMoviesMenu(!showMoviesMenu);
              setShowBooksMenu(false);
            }}
            className="cursor-pointer text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
          >
            Películas
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showMoviesMenu && (
            <div ref={moviesModalRef} className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 min-w-[150px]">
              <Link href="/" onClick={() => setShowMoviesMenu(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Explorar
              </Link>
              <div 
                className="relative"
                onMouseEnter={() => setShowMyMoviesSubmenu(true)}
                onMouseLeave={() => setShowMyMoviesSubmenu(false)}
              >
                <div className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between">
                  Mis Películas
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                {showMyMoviesSubmenu && (
                  <div className="absolute left-full top-0 ml-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[150px]">
                    <Link href="/movies/watchlist" onClick={() => { setShowMoviesMenu(false); setShowMyMoviesSubmenu(false); }} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
                      Por Ver
                    </Link>
                    <Link href="/movies/watched" onClick={() => { setShowMoviesMenu(false); setShowMyMoviesSubmenu(false); }} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
                      Ya Vistas
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Libros con dropdown */}
        <div className="relative">
          <button
            ref={booksTitleRef}
            onClick={() => {
              setShowBooksMenu(!showBooksMenu);
              setShowMoviesMenu(false);
            }}
            className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
          >
            Libros
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showBooksMenu && (
            <div ref={booksModalRef} className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 min-w-[150px]">
              <Link href="/books" onClick={() => setShowBooksMenu(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Explorar
              </Link>
              <div 
                className="relative"
                onMouseEnter={() => setShowMyBooksSubmenu(true)}
                onMouseLeave={() => setShowMyBooksSubmenu(false)}
              >
                <div className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between">
                  Mis Libros
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                {showMyBooksSubmenu && (
                  <div className="absolute left-full top-0 ml-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[150px]">
                    <Link href="/books/to-read" onClick={() => { setShowBooksMenu(false); setShowMyBooksSubmenu(false); }} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
                      Por Leer
                    </Link>
                    <Link href="/books/reading" onClick={() => { setShowBooksMenu(false); setShowMyBooksSubmenu(false); }} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
                      Leyendo
                    </Link>
                    <Link href="/books/read" onClick={() => { setShowBooksMenu(false); setShowMyBooksSubmenu(false); }} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
                      Leídos
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="ml-auto">
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
