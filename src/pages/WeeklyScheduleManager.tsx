
import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Save, X, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EditActivityDialog } from '@/components/EditActivityDialog';
import { useToast } from '@/components/ui/use-toast';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
// Tipo para compatibilidade

import { 
  useActivities, 
  useCreateActivity, 
  useUpdateActivity, 
  useDeleteActivity,
  useDaysOfWeek,
  useActivityTypes,
  Activity
} from '../hooks/useApi';
import { ActivityType, CreateActivityRequest, WeeklyScheduleItem } from '../types/api';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const WeeklyScheduleManager = () => {
  const { toast } = useToast();
  const { data: activities = [], isLoading: isLoadingSchedule } = useActivities();
  const { isLoading: isLoadingDays } = useDaysOfWeek();
  const { isLoading: isLoadingTypes } = useActivityTypes();
  
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();
  
  const getToday = () => format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<WeeklyScheduleItem | null>(null);
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
  
  const [formData, setFormData] = useState<CreateActivityRequest>({
    title: '',
    startTime: '',
    endTime: '',
    type: 'PESSOAL',
    description: '',
    date: selectedDate,
  });

  // Sincronizar a data do formulário com a data selecionada
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      date: selectedDate,
    }));
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await updateActivity.mutateAsync({
          id: editingItem.id,
          data: {
            title: formData.title,
            description: formData.description,
            type: formData.type,
            date: formData.date,
          }
        });
        
        toast({
          title: '✅ Atividade atualizada!',
          description: `"${formData.title}" foi editada com sucesso.`,
        });
      } else {
        const payload = {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          startTime: formData.startTime,
          endTime: formData.endTime,
          date: formData.date,
        };
        await createActivity.mutateAsync(payload);
        
        toast({
          title: '✅ Atividade criada!',
          description: `"${formData.title}" foi adicionada à sua agenda.`,
        });
      }
      
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      
      toast({
        title: '❌ Erro ao salvar atividade',
        description: error instanceof Error ? error.message : 'Não foi possível salvar a atividade. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (item: WeeklyScheduleItem) => {
    // Converter WeeklyScheduleItem para Activity para usar o novo diálogo
    const activity: Activity = {
      id: item.id,
      userId: item.userId,
      title: item.title,
      description: item.description,
      type: item.type,
      startTime: item.startTime,
      endTime: item.endTime,
      date: item.date,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    };
    
    setEditingActivity(activity);
    setShowEditDialog(true);
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
        title: '✅ Atividade excluída com sucesso!',
        description: `"${deleteDialog.activityName}" foi removida da sua agenda semanal.`,
      });
      
      setDeleteDialog({ isOpen: false, activityId: '', activityName: '' });
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      
      toast({
        title: '❌ Erro ao excluir atividade',
        description: error instanceof Error ? error.message : 'Não foi possível excluir a atividade. Tente novamente.',
        variant: 'destructive',
      });
      
      setDeleteDialog({ isOpen: false, activityId: '', activityName: '' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      startTime: '',
      endTime: '',
      description: '',
      type: 'PESSOAL',
      date: selectedDate,
    });
    setEditingItem(null);
    setShowForm(false);
  };

  // Corrigir o mapeamento de atividades para usar o campo correto de dayOfWeek
  const weeklySchedule: WeeklyScheduleItem[] = activities.map(activity => ({
    id: activity.id,
    title: activity.title,
    startTime: activity.startTime || '09:00',
    endTime: activity.endTime || '10:00',
    type: activity.type,
    date: String(activity.date),
    description: activity.description || '',
    userId: activity.userId,
    createdAt: String(activity.createdAt),
    updatedAt: String(activity.updatedAt),
  }));

  const getScheduleForDate = (date: string) => {
    return weeklySchedule
      .filter(item => item.date === date)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const typeLabels: Record<ActivityType, string> = {
    PESSOAL: '🏠 Pessoal',
    TRABALHO: '📝 Trabalho',
    ESTUDO: '📚 Estudo',
    SAUDE: '💪 Saúde',
    OUTRO: '📝 Outro',
  };

  const isLoading = isLoadingSchedule || isLoadingDays || isLoadingTypes;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Carregando agenda...</div>
      </div>
    );
  }

  // UI para selecionar a semana e o dia
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // Domingo
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const currentYear = today.getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Gerenciar Agenda Semanal
          </h1>
          <p className="text-slate-300">
            Configure sua rotina semanal para manter seus dias organizados
          </p>
        </div>

        {/* Ano no topo */}
        <div className="text-center text-slate-400 text-lg mb-2">{currentYear}</div>
        {/* Day Selector */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
            {weekDates.map(dateObj => {
              const dateStr = format(dateObj, 'yyyy-MM-dd');
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`p-3 rounded-xl font-medium transition-all ${
                    selectedDate === dateStr
                      ? 'bg-violet-600 text-white shadow-lg'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  {format(dateObj, "EEE. dd/MM", { locale: ptBR })}
                  {isSameDay(dateObj, today) && (
                    <span className="ml-2 text-xs text-emerald-400">(hoje)</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Atividade
          </Button>
        </div>

        {/* Schedule List */}
        <div className="grid gap-4 mb-8">
          {getScheduleForDate(selectedDate).map(item => (
            <div
              key={item.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${item.type === 'PESSOAL' ? 'bg-orange-500' : item.type === 'TRABALHO' ? 'bg-purple-500' : item.type === 'ESTUDO' ? 'bg-blue-500' : item.type === 'SAUDE' ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className="text-sm text-slate-400">
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>
                  <h3 className="text-white font-medium mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-slate-300 text-sm">{item.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(item)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item.id, item.title)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {getScheduleForDate(selectedDate).length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma atividade cadastrada para este dia</p>
            </div>
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-medium">
                  {editingItem ? 'Editar Atividade' : 'Nova Atividade'}
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={resetForm}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Atividade
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Exercício matinal"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Início
                    </label>
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Fim
                    </label>
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ActivityType })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                  >
                    {Object.entries(typeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Observações
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detalhes sobre a atividade..."
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                    disabled={createActivity.isPending || updateActivity.isPending}
                  >
                    {createActivity.isPending || updateActivity.isPending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {editingItem ? 'Atualizar' : 'Salvar'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
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
        title="Excluir Atividade"
        description={`Tem certeza que deseja excluir "${deleteDialog.activityName}"?`}
        isLoading={deleteActivity.isPending}
      />
    </div>
  );
};

export default WeeklyScheduleManager;
