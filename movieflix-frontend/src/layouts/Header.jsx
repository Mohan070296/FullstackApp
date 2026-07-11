import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-red-600 font-bold text-2xl md:text-4xl tracking-tighter">
          MOVIEFLIX
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <Link to="/movies" className="hover:text-gray-300 transition-colors">Movies</Link>
          <Link to="/series" className="hover:text-gray-300 transition-colors">TV Shows</Link>
          <Link to="/my-list" className="hover:text-gray-300 transition-colors">My List</Link>
        </nav>

        {/* Search & User Menu */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex relative">
            <input
              type="text"
              placeholder="Movies, people, genres"
              className="bg-[#2a2a2a] text-white px-4 py-1.5 rounded-sm focus:outline-none focus:ring-1 focus:ring-white text-sm w-48 lg:w-64"
            />
          </div>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="text-gray-300 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={user?.profilePhoto || '/default-profile.png'}
                    alt="Profile"
                    className="w-8 h-8 rounded"
                  />
                  <span className="text-sm font-medium">👤</span>
                </button>

                {/* Dropdown Menu */}
                {isMobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded-sm shadow-lg py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                      Profile
                    </Link>
                    <Link to="/my-list" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                      My List
                    </Link>
                    {user?.role === 'ROLE_ADMIN' && (
                      <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-red-600 text-white px-4 py-1.5 rounded-sm text-sm hover:bg-red-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-b border-gray-800">
          <div className="px-4 py-4 space-y-4">
            <Link to="/" className="block text-gray-300 hover:text-white">Home</Link>
            <Link to="/movies" className="block text-gray-300 hover:text-white">Movies</Link>
            <Link to="/series" className="block text-gray-300 hover:text-white">TV Shows</Link>
            <Link to="/my-list" className="block text-gray-300 hover:text-white">My List</Link>
            <div className="pt-4 border-t border-gray-800">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-gray-300 hover:text-white"
                >
                  Sign Out
                </button>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" className="block text-gray-300 hover:text-white">Sign In</Link>
                  <Link to="/register" className="block text-gray-300 hover:text-white">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;