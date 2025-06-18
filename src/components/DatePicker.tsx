
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';

const DatePicker = () => {
  const { selectedDate, setSelectedDate } = useStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const changeDate = (days: number) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + days);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => changeDate(-1)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold text-gray-900">
            {formatDate(selectedDate)}
          </span>
          {!isToday && (
            <button
              onClick={goToToday}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
            >
              Hoje
            </button>
          )}
        </div>
        
        <button
          onClick={() => changeDate(1)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default DatePicker;
