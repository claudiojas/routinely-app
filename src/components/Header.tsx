import { Calendar, Bell, Menu } from 'lucide-react';
import { useStore } from '../store/useStore';

const Header = () => {
  const selectedDate = useStore((state) => state.selectedDate);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-lg border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e data */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Routinely
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">
                  {formatDate(selectedDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 sm:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
