import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navItems } from '../App';
import { useAuth } from './AuthContext';
import { getSettings } from '../utils/settings-store';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [enabledTools, setEnabledTools] = useState<string[]>([]);

  useEffect(() => {
    setEnabledTools(getSettings().enabledTools);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPageTitle = () => {
    const item = navItems.find(i => i.path === location.pathname);
    if (item) return item.label;
    if (location.pathname.startsWith('/blog/')) return 'Reading Blog Post';
    if (location.pathname === '/blog-admin') return 'Admin Control Center';
    if (location.pathname === '/login') return 'Account Login';
    if (location.pathname === '/signup') return 'Create Account';
    return 'The Web Toolskit';
  };

  const visibleNavItems = navItems.filter(item => {
    if (item.path === '/') return true;
    if (item.path === '/blog') return isAdmin;
    return enabledTools.includes(item.path) || isAdmin;
  });

  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';

  // Don't show sidebar layout on homepage - show clean layout
  if (isHomePage) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  // For all other pages, show the sidebar layout
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900">
      {/* Sidebar Navigation - Only shown on non-home pages */}
      <aside className={`w-full md:w-64 bg-white border-r border-slate-200 sticky top-0 md:h-screen flex flex-col z-20 transition-all ${isMobileMenuOpen ? 'h-screen' : ''}`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200">
              <span className="text-lg">⚡</span>
            </div>
            <div>
              <span className="text-lg font-bold text-slate-800 tracking-tight">Web Toolskit</span>
              <p className="text-xs text-slate-500 mt-0.5">Free Online Tools</p>
            </div>
          </Link>
          <button 
            className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <span className="text-xl">✕</span>
            ) : (
              <span className="text-xl">☰</span>
            )}
          </button>
        </div>

        <nav className={`flex-1 p-4 space-y-1 overflow-y-auto ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          {/* Home Link */}
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              location.pathname === '/'
                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-indigo-600">🏠</span>
            </div>
            <div>
              <span className="font-medium">Homepage</span>
              <p className="text-xs text-slate-500 mt-0.5">Back to main page</p>
            </div>
          </Link>
          
          {/* Tools Section Header */}
          <div className="pt-4 mt-2 border-t border-slate-100">
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">TOOLS</p>
            </div>
          </div>
          
          {/* Tool Links */}
          {visibleNavItems
            .filter(item => item.path !== '/' && item.path !== '/blog')
            .map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  location.pathname === item.path 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                    : 'bg-slate-100 group-hover:bg-slate-200 text-slate-600'
                }`}>
                  <span className="text-sm">{item.icon}</span>
                </div>
                <div>
                  <span className="font-medium">{item.label}</span>
                  {item.path === '/pdf-editor' && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">NEW</span>
                  )}
                  {item.path === '/word-counter' && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">POPULAR</span>
                  )}
                </div>
              </Link>
            ))}
          
          {/* Admin/Blog Link */}
          {isAdmin && visibleNavItems.find(item => item.path === '/blog') && (
            <>
              <div className="pt-4 mt-2 border-t border-slate-100">
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ADMIN</p>
                </div>
              </div>
              <Link
                to="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  location.pathname === '/blog'
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-amber-600">✍️</span>
                </div>
                <div>
                  <span className="font-medium">Blog Admin</span>
                  <p className="text-xs text-slate-500 mt-0.5">Manage blog posts</p>
                </div>
              </Link>
            </>
          )}
          
          {/* Mobile Auth Buttons */}
          <div className="pt-6 mt-6 border-t border-slate-100 md:hidden flex flex-col gap-2">
            {isAdmin && (
              <button 
                onClick={() => { navigate('/blog-admin'); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-sm"
              >
                <span>⚙️ Admin Panel</span>
              </button>
            )}
            {user ? (
               <button 
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-slate-900 text-white rounded-xl font-medium"
              >
                <span>🚪 Logout</span>
              </button>
            ) : (
              <button 
                onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-medium"
              >
                <span>🔑 Login / Sign Up</span>
              </button>
            )}
          </div>
        </nav>

        <div className={`p-4 border-t border-slate-100 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 mb-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Secure Browser Processing</span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Your Data Never Leaves
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar flex flex-col">
        {/* Desktop Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-6 md:px-8 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <span className="text-xl">✕</span>
              ) : (
                <span className="text-xl">☰</span>
              )}
            </button>
            <h1 className="text-lg font-semibold text-slate-800">
              {getPageTitle()}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/"
              className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 hover:from-indigo-100 hover:to-purple-100 rounded-lg text-sm font-medium transition-all"
            >
              <span>←</span>
              <span>Back to Home</span>
            </Link>
            
            {isAdmin && (
              <button 
                onClick={() => navigate('/blog-admin')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  location.pathname === '/blog-admin' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                  : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 hover:from-indigo-100 hover:to-purple-100'
                }`}
              >
                Admin Panel
              </button>
            )}
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-slate-700">Hi, {user.name.split(' ')[0]}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg text-sm font-semibold hover:from-slate-900 hover:to-black transition-all shadow-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </header>
        
        {/* Content */}
        <div className="p-4 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="py-6 px-6 md:px-8 text-center border-t border-slate-100 bg-white">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-slate-600 mb-2">
              &copy; {new Date().getFullYear()} The Web Toolskit. All tools process data locally in your browser.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};