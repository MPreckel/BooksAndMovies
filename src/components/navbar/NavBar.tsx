import Link from "next/link";
import UserMenu from "@/components/auth/UserMenu";

export default function NavBar() {
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400">
          Películas
        </Link>
        <Link href="/books" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
          Libros
        </Link>
        <div className="ml-auto">
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
