
import React, { useState } from 'react';
import { Plus, Clock, Trash2 } from 'lucide-react';
import { useStore, TimeBlock } from '../store/useStore';

const WeeklySchedule = () => {
  const { timeBlocks, addTimeBlock, deleteTimeBlock } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  
  const days = [
    { key: 'monday', label: 'Segunda' },
    { key: 'tuesday', label: 'Terça' },
    { key: 'wednesday', label: 'Quarta' },
    { key: 'thursday', label: 'Quinta' },
    { key: 'friday', label: 'Sexta' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  const typeColors = {
    study: 'bg-blue-100 text-blue-800 border-blue-200',
    exercise: 'bg-green-100 text-green-800 border-green-200',
    work: 'bg-purple-100 text-purple-800 border-purple-200',
    personal: 'bg-pink-100 text-pink-800 border-pink-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const handleAddBlock = (day: string) => {
    setSelectedDay(day);
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newBlock: Omit<TimeBlock, 'id'> = {
      title: formData.get('title') as string,
      type: formData.get('type') as TimeBlock['type'],
      day: selectedDay,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
    };
    
    addTimeBlock(newBlock);
    setShowAddForm(false);
    e.currentTarget.reset();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Agenda Semanal</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day.key} className="border border-gray-200 rounded-lg p-3 min-h-[200px]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-900 text-sm">{day.label}</h3>
              <button
                onClick={() => handleAddBlock(day.key)}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              {timeBlocks
                .filter(block => block.day === day.key)
                .map((block) => (
                  <div
                    key={block.id}
                    className={`p-2 rounded border ${typeColors[block.type]} relative group`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-xs mb-1">{block.title}</p>
                        <div className="flex items-center text-xs opacity-75">
                          <Clock className="h-3 w-3 mr-1" />
                          {block.startTime} - {block.endTime}
                        </div>
                        {block.isGoogleSynced && (
                          <div className="mt-1">
                            <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full"></span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteTimeBlock(block.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-all"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Adicionar Bloco de Tempo</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  name="type"
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="study">Estudo</option>
                  <option value="exercise">Exercício</option>
                  <option value="work">Trabalho</option>
                  <option value="personal">Pessoal</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Início
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fim
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklySchedule;
