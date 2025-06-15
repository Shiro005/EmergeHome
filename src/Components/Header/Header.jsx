import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Home, Box } from 'lucide-react';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`backdrop-blur-lg bg-gray-900 shadow-xl sticky top-0 z-50 border-b border-gray-800 transition-all duration-300 ${isScrolled ? 'py-0' : 'py-1'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Hidden on mobile except for icon */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex items-center">
              <img 
                src="https://emergeconstruction.in/logo.png" 
                alt="logo" 
                className='h-8 w-7 transition-transform group-hover:scale-110' 
              />
              <span className="hidden md:inline-block text-white text-2xl font-bold tracking-tight ml-2">
                <span className="text-white">Emerge</span> Homes
              </span>
            </div>
          </Link>

          {/* Search Bar - Always visible on desktop, conditional on mobile */}
          <div className={`${isMenuOpen ? 'hidden' : 'flex'} md:flex flex-1 max-w-xl mx-4 md:mx-8`}>
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Discover premium home essentials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-2.5 pr-12 text-gray-900 bg-white/90 border-0 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-sm placeholder-gray-500 transition-all duration-200 hover:bg-white"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <Search className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="text-white hover:bg-gray-800/60 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Home className="w-5 h-5" strokeWidth={2.5} />
              Home
            </Link>
            <Link
              to="/products"
              className="text-white hover:bg-gray-800/60 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Box className="w-5 h-5" strokeWidth={2.5} />
              Products
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            {!isMenuOpen && (
              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-white hover:text-orange-500 p-2 transition-all transform hover:scale-110"
              >
                <Menu className="w-6 h-6" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://emergeconstruction.in/logo.png" 
                  alt="logo" 
                  className='h-8 w-7' 
                />
                <span className="text-white text-xl font-bold tracking-tight">
                  <span className="text-white">Emerge</span> Homes
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-orange-500 p-2 transition-all transform hover:scale-110"
              >
                <X className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </div>
            
            {/* Mobile Search - Only shown in menu */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-2.5 pr-12 text-gray-900 bg-white border-0 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <Search className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:bg-gray-800/60 block px-4 py-3 rounded-lg text-base font-medium flex items-center gap-3 transition-all"
              >
                <Home className="w-5 h-5" strokeWidth={2.5} />
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:bg-gray-800/60 block px-4 py-3 rounded-lg text-base font-medium flex items-center gap-3 transition-all"
              >
                <Box className="w-5 h-5" strokeWidth={2.5} />
                Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;