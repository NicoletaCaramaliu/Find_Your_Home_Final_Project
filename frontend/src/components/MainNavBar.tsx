import { Link } from 'react-router-dom';
import ThemeToggle from "../components/ThemeToggle";

export default function MainNavBar() {
  return (
    <nav className="bg-gray-300 dark:bg-gray-900 py-2 w-full">
      <div className="w-full px-4 flex justify-between items-center">
        {/* Logo or Title */}
        <Link to="/" className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
          <img src="/images/logo.svg" alt="Logo" className="h-8 w-8 mr-2" />
          Find Your Home
        </Link>

        {/* Navigation Links */}
        <div className="flex-1 flex justify-end space-x-6">
          <Link to="/" className="text-gray-900 hover:text-blue-400 dark:text-gray-100 dark:hover:text-blue-400">
            Acasă
          </Link>
          <Link to="/properties" className="text-gray-900 hover:text-blue-400 dark:text-gray-100 dark:hover:text-blue-400">
            Proprietăți
          </Link>
          <Link to="/myAccount" className="text-gray-900 hover:text-blue-400 dark:text-gray-100 dark:hover:text-blue-400">
            Contul Meu
          </Link>
        </div>

        {/* Toggle dark mode */}
        <div className="hidden md:flex justify-end">
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="text-white" aria-label="Open menu">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}
