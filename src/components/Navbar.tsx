import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ShoppingCart, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import Cart from './Cart';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSiteSettings();
  const { items } = useCart();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Ana Sayfa' },
    { path: '/about', label: 'Hakkımızda' },
    { path: '/services', label: 'Hizmetler' },
    { path: '/products', label: 'Ürünler' },
    { path: '/gallery', label: 'Galeri' },
    { path: '/contact', label: 'İletişim' }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md fixed w-full z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            {settings?.logo_url ? (
              <img 
                src={settings.logo_url} 
                alt={settings.company_name}
                className="h-8 w-auto"
              />
            ) : (
              <Shield className="h-8 w-8 text-blue-600" />
            )}
            <span className="ml-2 text-xl font-bold text-gray-900">
              {settings?.company_name || 'TGuard'}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {isActive(item.path) && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-blue-50 rounded-lg"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {item.label}
              </Link>
            ))}

            {/* User & Cart */}
            <div className="flex items-center gap-2 ml-4">
              <Link
                to={user ? "/account" : "/auth/login"}
                className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative"
              >
                <User className="h-5 w-5" />
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {items.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to={user ? "/account" : "/auth/login"}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {items.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden"
          >
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
}

export default Navbar;