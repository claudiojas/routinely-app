import React, { useState } from 'react';
import { Plus, Check, Trash2, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useStore } from '../store/useStore';
import { 
  useTasksByDate, 
  useCreateTask, 
  useUpdateTask, 
  useDeleteTask, 
  useToggleTask,
  useActivityTypes
} from '../hooks/useApi';
import { Activity } from '../hooks/useApi';

// Tipo para compatibilidade com o componente existente
type Task = {
  id: string;
  title: string;
  description?: string;
  type: 'pessoal' | 'trabalho' | 'estudo' | 'saude' | 'outro';
  completed?: boolean;
  date?: string;
  notes?: string;
};

const TaskManager = () => {
  const { selectedDate } = useStore();
  const { data: tasks = [], isLoading: isLoadingTasks } = useTasksByDate(selectedDate);
  const { data: activityTypes = [], isLoading: isLoadingTypes } = useActivityTypes();
  
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const toggleTask = useToggleTask();
  
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'personal' as Task['type'],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTask) {
        await updateTask.mutateAsync({
          id: editingTask.id,
          updates: {
            ...formData,
          }
        });
      } else {
        await createTask.mutateAsync({
          ...formData,
        });
      }
      
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      type: task.type,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await deleteTask.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
      }
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTask.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao alternar tarefa:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'pessoal',
    });
    setEditingTask(null);
    setShowForm(false);
  };

  const getTypeColor = (type: Task['type']) => {
    const typeMap: Record<string, string> = {
      'pessoal': 'bg-orange-500',
      'trabalho': 'bg-purple-500',
      'estudo': 'bg-blue-500',
      'saude': 'bg-green-500',
      'outro': 'bg-gray-500',
    };
    return typeMap[type] || 'bg-gray-500';
  };

  const isLoading = isLoadingTasks || isLoadingTypes;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8 text-gray-500">
          Carregando tarefas...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Tarefas Independentes</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nenhuma tarefa para hoje. Adicione uma nova tarefa!
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 border rounded-lg transition-all ${
                task.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => handleToggle(task.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    task.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-blue-300 hover:border-blue-400'
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
                    <div className={`w-2 h-2 rounded-full ${getTypeColor(task.type)}`} />
                  </div>
                  
                  {task.description && (
                    <p className={`text-sm mb-2 ${
                      task.completed ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {task.description}
                    </p>
                  )}
                  
                  {task.notes && (
                    <p className={`text-sm mb-2 ${
                      task.completed ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      📝 {task.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                    title="Editar tarefa"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Estudar React Query"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição (opcional)
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalhes sobre a tarefa..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Task['type'] })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={createTask.isPending || updateTask.isPending}
                >
                  {createTask.isPending || updateTask.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {editingTask ? 'Atualizar' : 'Salvar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager; 