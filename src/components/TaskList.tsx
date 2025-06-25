
import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Edit2 } from 'lucide-react';
import { useStore, Task } from '../store/useStore';
import { mockApi, WeeklyScheduleItem } from '../data/mockApi';

const TaskList = () => {
  const { tasks, selectedDate, addTask, updateTask, deleteTask, toggleTask } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const todayTasks = tasks.filter(task => task.date === selectedDate);

  useEffect(() => {
    loadWeeklySchedule();
  }, []);

  const loadWeeklySchedule = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getWeeklySchedule();
      setWeeklySchedule(data);
    } catch (error) {
      console.error('Erro ao carregar agenda semanal:', error);
    } finally {
      setLoading(false);
    }
  };

  // Converter data selecionada para dia da semana
  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()] as WeeklyScheduleItem['dayOfWeek'];
  };

  // Obter tarefas da agenda semanal para o dia selecionado
  const getTodayScheduleItems = () => {
    const dayOfWeek = getDayOfWeek(selectedDate);
    return weeklySchedule
      .filter(item => item.dayOfWeek === dayOfWeek && item.isActive)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const taskData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as Task['type'],
      date: selectedDate,
      completed: false,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      addTask(taskData);
    }
    
    setShowAddForm(false);
    e.currentTarget.reset();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowAddForm(true);
  };

  const todayScheduleItems = getTodayScheduleItems();
  const allTodayItems = [...todayTasks, ...todayScheduleItems];

  if (loading) {
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
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar</span>
        </button>
      </div>

      <div className="space-y-3">
        {allTodayItems.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nenhuma tarefa para hoje. Que tal adicionar uma?
          </p>
        ) : (
          <>
            {/* Tarefas da agenda semanal */}
            {todayScheduleItems.map((item) => (
              <div
                key={`schedule-${item.id}`}
                className="p-4 border rounded-lg bg-blue-50 border-blue-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded border-2 border-blue-300 bg-blue-100 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900">
                        {item.activity}
                      </h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {item.startTime} - {item.endTime}
                      </span>
                    </div>
                    
                    {item.notes && (
                      <p className="text-sm text-gray-600 mb-2">
                        {item.notes}
                      </p>
                    )}
                    
                    <span className={`text-xs font-medium ${typeColors[item.type]}`}>
                      {typeLabels[item.type]}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Tarefas manuais */}
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 border rounded-lg transition-all ${
                  task.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {task.completed && <Check className="h-3 w-3" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-medium ${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      {task.isGoogleSynced && (
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      )}
                    </div>
                    
                    {task.description && (
                      <p className={`text-sm mb-2 ${
                        task.completed ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {task.description}
                      </p>
                    )}
                    
                    <span className={`text-xs font-medium ${typeColors[task.type]}`}>
                      {typeLabels[task.type]}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingTask?.title || ''}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingTask?.description || ''}
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
                  defaultValue={editingTask?.type || 'other'}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="study">Estudo</option>
                  <option value="exercise">Exercício</option>
                  <option value="work">Trabalho</option>
                  <option value="personal">Pessoal</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingTask(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editingTask ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
