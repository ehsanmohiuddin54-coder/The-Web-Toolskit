
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
    return 'SEO & Text Toolkit';
  };

  const visibleNavItems = navItems.filter(item => {
    if (item.path === '/') return true;
    if (item.path === '/blog') return isAdmin;
    return enabledTools.includes(item.path) || isAdmin;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900">
      {/* Sidebar Navigation */}
      <aside className={`w-full md:w-64 bg-white border-r border-slate-200 sticky top-0 md:h-screen flex flex-col z-20 transition-all ${isMobileMenuOpen ? 'h-screen' : ''}`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200">
              T
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">Text Toolkit</span>
          </Link>
          <button 
            className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        <nav className={`flex-1 p-4 space-y-1 overflow-y-auto ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          {visibleNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          
          <div className="pt-6 mt-6 border-t border-slate-100 md:hidden flex flex-col gap-2">
            {isAdmin && (
              <button 
                onClick={() => { navigate('/blog-admin'); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium"
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
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-slate-900 text-white rounded-xl font-medium"
              >
                <span>🔑 Login</span>
              </button>
            )}
          </div>
        </nav>

        <div className={`p-4 border-t border-slate-100 text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          Secure Browser Environment
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar flex flex-col">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10 hidden md:flex">
          <h1 className="text-lg font-medium text-slate-800">
            {getPageTitle()}
          </h1>
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <button 
                onClick={() => navigate('/blog-admin')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  location.pathname === '/blog-admin' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                Admin Panel
              </button>
            )}
            
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-slate-600">Hi, {user.name.split(' ')[0]}</span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-black transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </header>
        <div className="p-4 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </div>
        <footer className="py-8 px-8 text-center text-slate-400 text-sm border-t border-slate-100 bg-white">
          &copy; {new Date().getFullYear()} SEO & Text Toolkit. Built for Privacy & Speed.
        </footer>
      </main>
    </div>
  );
};
