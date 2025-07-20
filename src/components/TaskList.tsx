
import React, { useState } from 'react';
import { Check, Trash2, Edit } from 'lucide-react';
import { useStore } from '../store/useStore';
import { 
  useActivities, 
  useUpdateActivity, 
  useDeleteActivity,
  useToggleActivity
} from '../hooks/useApi';
import { Activity } from '../hooks/useApi';
import { EditActivityDialog } from './EditActivityDialog';
import { useToast } from './ui/use-toast';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

// Tipo para compatibilidade com o componente existente
type WeeklyScheduleItem = {
  id: string;
  activity: string;
  startTime: string;
  endTime: string;
  type: string;
  completed?: boolean;
  notes?: string;
  date: string;
};

const TaskList = () => {
  const { toast } = useToast();
  const { selectedDate } = useStore();
  const { data: activities = [], isLoading } = useActivities();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();
  const toggleActivity = useToggleActivity();
  
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    activityId: string;
    activityName: string;
  }>({
    isOpen: false,
    activityId: '',
    activityName: '',
  });

  // Converter atividades para o formato esperado pelo componente
  const weeklySchedule: WeeklyScheduleItem[] = activities.map(activity => ({
    id: activity.id,
    activity: activity.title,
    startTime: activity.startTime || '09:00',
    endTime: activity.endTime || '10:00',
    type: activity.type.toLowerCase(),
    completed: activity.completed || false, // Usar campo completed da API
    notes: activity.description,
    date: activity.date, // Adicionar data para filtrar
  }));

  // Filtrar apenas as atividades do dia selecionado
  const todayScheduleItems = weeklySchedule.filter(item => item.date === selectedDate);
  
  // Debug: verificar se o filtro está funcionando
  console.log('selectedDate:', selectedDate);
  console.log('total activities:', activities.length);
  console.log('filtered activities:', todayScheduleItems.length);

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
    console.log('Tentando fazer toggle para atividade:', id, 'completed:', completed);
    try {
      const result = await toggleActivity.mutateAsync(id);
      console.log('Resposta da API:', result);
      
      toast({
        title: completed ? '❌ Tarefa desmarcada' : '✅ Tarefa concluída',
        description: completed ? 'Tarefa foi desmarcada como concluída.' : 'Tarefa foi marcada como concluída!',
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      
      toast({
        title: '❌ Erro ao atualizar tarefa',
        description: error instanceof Error ? error.message : 'Não foi possível atualizar a tarefa. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string, activityName: string) => {
    setDeleteDialog({
      isOpen: true,
      activityId: id,
      activityName: activityName,
    });
  };

  const confirmDelete = async () => {
      try {
      await deleteActivity.mutateAsync(deleteDialog.activityId);
      
      toast({
        title: '✅ Tarefa excluída com sucesso!',
        description: `"${deleteDialog.activityName}" foi removida da sua agenda.`,
      });
      
      setDeleteDialog({ isOpen: false, activityId: '', activityName: '' });
      } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
      
      toast({
        title: '❌ Erro ao excluir tarefa',
        description: error instanceof Error ? error.message : 'Não foi possível excluir a tarefa. Tente novamente.',
        variant: 'destructive',
      });
      
      setDeleteDialog({ isOpen: false, activityId: '', activityName: '' });
    }
  };

  const handleEdit = (task: WeeklyScheduleItem) => {
    // Encontrar a atividade correspondente
    const activity = activities.find(a => a.id === task.id);
    if (activity) {
      setEditingActivity(activity);
      setShowEditDialog(true);
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
        <p className="text-sm text-gray-500">Clique no ícone de edição para modificar as tarefas</p>
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
                    onClick={() => handleEdit(item)}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                    title="Editar tarefa"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.activity)}
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

      {/* Dialog de Edição */}
      <EditActivityDialog
        activity={editingActivity}
        isOpen={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setEditingActivity(null);
        }}
      />

      {/* Dialog de Confirmação de Deleção */}
      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, activityId: '', activityName: '' })}
        onConfirm={confirmDelete}
        title="Excluir Tarefa"
        description={`Tem certeza que deseja excluir "${deleteDialog.activityName}"?`}
        isLoading={deleteActivity.isPending}
      />
    </div>
  );
};

export default TaskList;
