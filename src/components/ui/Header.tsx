// src/components/ui/Header.tsx
import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';

interface HeaderProps {
  title: string;
  showAuthControls?: boolean;
  onAuthAction?: () => void;
  authButtonText?: string;
}

export default function Header({ 
  title, 
  showAuthControls = false, 
  onAuthAction, 
  authButtonText = 'Sign In' 
}: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {title}
              </h1>
            </Link>
            <nav className="ml-6 flex space-x-8">
              <Link 
                href="/dashboard" 
                className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 px-1 pt-1 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/meals" 
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 px-1 pt-1 text-sm font-medium"
              >
                Meals
              </Link>
              <Link 
                href="/planner" 
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 px-1 pt-1 text-sm font-medium"
              >
                Planner
              </Link>
              <Link 
                href="/households" 
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 px-1 pt-1 text-sm font-medium"
              >
                Households
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {showAuthControls && onAuthAction && (
              <button
                onClick={onAuthAction}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {authButtonText}
              </button>
            )}
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}