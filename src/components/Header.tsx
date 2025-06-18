
import React from 'react';
import { Calendar, Bell } from 'lucide-react';
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
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Routinely</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {formatDate(selectedDate)}
            </span>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
