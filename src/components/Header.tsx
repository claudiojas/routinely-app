import { Calendar, Settings, User, Menu, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
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

          {/* Navigation */}
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
              to="/add-daily-task"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/add-daily-task'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Nova Tarefa
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

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <User className="h-5 w-5" />
            </button>
            <button className="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
