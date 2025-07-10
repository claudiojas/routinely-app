
import React, { useState } from 'react';
import { Plus, Calendar, Clock, Save, X, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { WeeklyScheduleItem } from '../data/mockApi';
import { 
  useWeeklySchedule, 
  useCreateScheduleItem, 
  useUpdateScheduleItem, 
  useDeleteScheduleItem 
} from '../hooks/useApi';

const DAYS = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
] as const;

const ACTIVITY_TYPES = [
  { value: 'study', label: '📚 Estudo', color: 'bg-blue-500' },
  { value: 'exercise', label: '💪 Exercício', color: 'bg-green-500' },
  { value: 'work', label: '💼 Trabalho', color: 'bg-purple-500' },
  { value: 'personal', label: '🏠 Pessoal', color: 'bg-orange-500' },
  { value: 'other', label: '📝 Outro', color: 'bg-gray-500' },
] as const;

const WeeklyScheduleManager = () => {
  const { data: weeklySchedule = [], isLoading } = useWeeklySchedule();
  const createScheduleItem = useCreateScheduleItem();
  const updateScheduleItem = useUpdateScheduleItem();
  const deleteScheduleItem = useDeleteScheduleItem();
  
  const [selectedDay, setSelectedDay] = useState<(typeof DAYS)[number]['key']>('monday');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<WeeklyScheduleItem | null>(null);
  
  const [formData, setFormData] = useState({
    activity: '',
    startTime: '',
    endTime: '',
    notes: '',
    type: 'personal' as WeeklyScheduleItem['type'],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await updateScheduleItem.mutateAsync({
          id: editingItem.id,
          updates: {
            ...formData,
            dayOfWeek: selectedDay,
          }
        });
      } else {
        await createScheduleItem.mutateAsync({
          ...formData,
          dayOfWeek: selectedDay,
          isActive: true,
        });
      }
      
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
    }
  };

  const handleEdit = (item: WeeklyScheduleItem) => {
    setEditingItem(item);
    setFormData({
      activity: item.activity,
      startTime: item.startTime,
      endTime: item.endTime,
      notes: item.notes,
      type: item.type,
    });
    setSelectedDay(item.dayOfWeek);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await deleteScheduleItem.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao deletar item:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      activity: '',
      startTime: '',
      endTime: '',
      notes: '',
      type: 'personal',
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const getScheduleForDay = (day: (typeof DAYS)[number]['key']) => {
    return weeklySchedule
      .filter(item => item.dayOfWeek === day && item.isActive)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getTypeColor = (type: WeeklyScheduleItem['type']) => {
    return ACTIVITY_TYPES.find(t => t.value === type)?.color || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Carregando agenda...</div>
      </div>
    );
  }

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

        {/* Day Selector */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
            {DAYS.map(day => (
              <button
                key={day.key}
                onClick={() => setSelectedDay(day.key)}
                className={`p-3 rounded-xl font-medium transition-all ${
                  selectedDay === day.key
                    ? 'bg-violet-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {day.label}
              </button>
            ))}
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
          {getScheduleForDay(selectedDay).map(item => (
            <div
              key={item.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getTypeColor(item.type)}`} />
                    <span className="text-sm text-slate-400">
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>
                  <h3 className="text-white font-medium mb-1">{item.activity}</h3>
                  {item.notes && (
                    <p className="text-slate-300 text-sm">{item.notes}</p>
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
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {getScheduleForDay(selectedDay).length === 0 && (
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
                    value={formData.activity}
                    onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as WeeklyScheduleItem['type'] })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                  >
                    {ACTIVITY_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Observações
                  </label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Detalhes sobre a atividade..."
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                    disabled={createScheduleItem.isPending || updateScheduleItem.isPending}
                  >
                    {createScheduleItem.isPending || updateScheduleItem.isPending ? (
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
    </div>
  );
};

export default WeeklyScheduleManager;
