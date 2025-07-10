
import React, { useState } from 'react';
import { Check, Trash2, StickyNote } from 'lucide-react';
import { useStore } from '../store/useStore';
import { 
  useWeeklySchedule, 
  useUpdateScheduleItem, 
  useDeleteScheduleItem 
} from '../hooks/useApi';
import { WeeklyScheduleItem } from '../data/mockApi';

const TaskList = () => {
  const { selectedDate, getTodayScheduleItems } = useStore();
  const { data: weeklySchedule = [], isLoading } = useWeeklySchedule();
  const updateScheduleItem = useUpdateScheduleItem();
  const deleteScheduleItem = useDeleteScheduleItem();
  
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<WeeklyScheduleItem | null>(null);
  const [noteText, setNoteText] = useState('');

  const todayScheduleItems = getTodayScheduleItems(weeklySchedule, selectedDate);

  const typeLabels = {
    study: 'Estudo',
    exercise: 'Exercício',
    work: 'Trabalho',
    personal: 'Pessoal',
    other: 'Outro',
  };

  const typeColors = {
    study: 'text-blue-600',
    exercise: 'text-green-600',
    work: 'text-purple-600',
    personal: 'text-pink-600',
    other: 'text-gray-600',
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      await updateScheduleItem.mutateAsync({
        id,
        updates: { completed: !completed }
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await deleteScheduleItem.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
      }
    }
  };

  const handleAddNote = (task: WeeklyScheduleItem) => {
    setSelectedTask(task);
    setNoteText(task.notes || '');
    setShowNoteModal(true);
  };

  const handleSaveNote = async () => {
    if (selectedTask) {
      try {
        await updateScheduleItem.mutateAsync({
          id: selectedTask.id,
          updates: { notes: noteText }
        });
        setShowNoteModal(false);
        setSelectedTask(null);
        setNoteText('');
      } catch (error) {
        console.error('Erro ao salvar anotação:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8 text-gray-500">
          Carregando tarefas do dia...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Tarefas do Dia</h2>
      </div>

      <div className="space-y-3">
        {todayScheduleItems.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nenhuma tarefa para hoje. Configure sua agenda semanal para ver as tarefas aqui.
          </p>
        ) : (
          todayScheduleItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded-lg transition-all ${
                item.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => handleToggleComplete(item.id, item.completed || false)}
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    item.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-blue-300 hover:border-blue-400'
                  }`}
                >
                  {item.completed && <Check className="h-3 w-3" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className={`font-medium ${
                      item.completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {item.activity}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>
                  
                  {item.notes && (
                    <p className={`text-sm mb-2 ${
                      item.completed ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      📝 {item.notes}
                    </p>
                  )}
                  
                  <span className={`text-xs font-medium ${typeColors[item.type]}`}>
                    {typeLabels[item.type]}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAddNote(item)}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                    title="Adicionar anotação"
                  >
                    <StickyNote className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Excluir tarefa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Anotação */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Adicionar Anotação
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                {selectedTask?.activity}
              </p>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Digite sua anotação aqui..."
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleSaveNote}
                disabled={updateScheduleItem.isPending}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {updateScheduleItem.isPending ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setSelectedTask(null);
                  setNoteText('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
