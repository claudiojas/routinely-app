
import { Calendar, Settings, User, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-violet-600 to-emerald-500 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Routinely
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/weekly-schedule-manager"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/weekly-schedule-manager'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Agenda Semanal
            </Link>
          </nav>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <User className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700/50 py-4">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/'
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/weekly-schedule-manager"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/weekly-schedule-manager'
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Agenda Semanal
              </Link>
              
              {/* Mobile User Actions */}
              <div className="border-t border-slate-700/50 pt-4 mt-4">
                <button className="w-full flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
                  <Settings className="h-5 w-5 mr-3" />
                  Configurações
                </button>
                <button className="w-full flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
                  <User className="h-5 w-5 mr-3" />
                  Perfil
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
