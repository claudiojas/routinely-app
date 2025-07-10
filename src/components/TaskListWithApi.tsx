import React, { useState } from 'react';
import { Check, Trash2, StickyNote, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { 
  useWeeklyScheduleByDay, 
  useUpdateWeeklySchedule, 
  useDeleteWeeklySchedule,
  useApiError 
} from '../hooks/useApi';
import { WeeklyScheduleItem } from '@/types/api';

const TaskListWithApi = () => {
  const { selectedDate } = useStore();
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<WeeklyScheduleItem | null>(null);
  const [noteText, setNoteText] = useState('');

  // Usar os hooks da API
  const { 
    data: todayScheduleItems = [], 
    isLoading, 
    error 
  } = useWeeklyScheduleByDay(selectedDate);

  const updateScheduleMutation = useUpdateWeeklySchedule();
  const deleteScheduleMutation = useDeleteWeeklySchedule();
  const handleApiError = useApiError();

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
      await updateScheduleMutation.mutateAsync({
        id,
        data: { completed: !completed }
      });
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await deleteScheduleMutation.mutateAsync(id);
      } catch (error) {
        handleApiError(error);
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
        await updateScheduleMutation.mutateAsync({
          id: selectedTask.id,
          data: { notes: noteText }
        });
        setShowNoteModal(false);
        setSelectedTask(null);
        setNoteText('');
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          Carregando tarefas do dia...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8 text-red-500">
          <p>Erro ao carregar tarefas</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-blue-500 hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Tarefas do Dia</h2>
        {(updateScheduleMutation.isPending || deleteScheduleMutation.isPending) && (
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        )}
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
                  disabled={updateScheduleMutation.isPending}
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    item.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-blue-300 hover:border-blue-400'
                  } ${updateScheduleMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    disabled={updateScheduleMutation.isPending}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
                    title="Adicionar anotação"
                  >
                    <StickyNote className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleteScheduleMutation.isPending}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
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
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setSelectedTask(null);
                  setNoteText('');
                }}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={updateScheduleMutation.isPending}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNote}
                disabled={updateScheduleMutation.isPending}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {updateScheduleMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Salvar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskListWithApi; 