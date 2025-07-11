
import React, { useState } from 'react';
import { Plus, Calendar, Clock, Save, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
// Tipo para compatibilidade
type WeeklyScheduleItem = {
  id: string;
  activity: string;
  startTime: string;
  endTime: string;
  type: string;
  dayOfWeek: string;
  completed?: boolean;
  notes?: string;
};

const ACTIVITY_TYPES = [
  { value: 'study', label: '📚 Estudo', color: 'bg-blue-500' },
  { value: 'exercise', label: '💪 Exercício', color: 'bg-green-500' },
  { value: 'work', label: '💼 Trabalho', color: 'bg-purple-500' },
  { value: 'personal', label: '🏠 Pessoal', color: 'bg-orange-500' },
  { value: 'other', label: '📝 Outro', color: 'bg-gray-500' },
] as const;

const AddDailyTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    activity: '',
    startTime: '',
    endTime: '',
    notes: '',
    type: 'personal' as WeeklyScheduleItem['type'],
  });

  const getTomorrowDayOfWeek = (): WeeklyScheduleItem['dayOfWeek'] => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return dayNames[tomorrow.getDay()] as WeeklyScheduleItem['dayOfWeek'];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Usar a API real em vez da mock
      console.log('Criando atividade:', formData);
      
      // Redireciona para a tela principal
      navigate('/');
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-violet-500/10 rounded-full blur-3xl top-1/4 left-1/4"></div>
        <div className="absolute w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl bottom-1/4 right-1/4"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="modern-card p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-600 to-emerald-500 rounded-2xl mb-4">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Crie sua primeira tarefa
            </h1>
            <p className="text-slate-300">
              Comece planejando uma atividade para amanhã
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-full">
              <Calendar className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-slate-300 capitalize">
                {getTomorrowDate()}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Qual atividade você quer fazer?
              </label>
              <Input
                value={formData.activity}
                onChange={(e) => setFormData(prev => ({ ...prev, activity: e.target.value }))}
                placeholder="Ex: Exercício matinal, Estudar inglês, Reunião de trabalho..."
                required
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 h-12"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Horário de início
                </label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  required
                  className="bg-slate-700/50 border-slate-600 text-white h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Horário de fim
                </label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  required
                  className="bg-slate-700/50 border-slate-600 text-white h-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tipo de atividade
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ACTIVITY_TYPES.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                    className={`p-3 rounded-xl font-medium transition-all text-left ${
                      formData.type === type.value
                        ? 'bg-violet-600 text-white shadow-lg'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Observações (opcional)
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Detalhes sobre a atividade, objetivos, preparativos..."
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                rows={3}
              />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700 text-white font-semibold"
              >
                {loading ? (
                  'Salvando...'
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Criar tarefa e continuar
                  </>
                )}
              </Button>
              
              <button
                type="button"
                onClick={handleSkip}
                className="w-full h-12 text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                Pular por agora
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Footer hint */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            💡 Você poderá adicionar mais tarefas depois na tela principal
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddDailyTask;
