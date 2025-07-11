import { TrendingUp, Target, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useActivities, useTasksByDate } from '../hooks/useApi';

const ProgressBar = () => {
  const { data: activities = [], isLoading: isLoadingSchedule } = useActivities();
  const { data: tasks = [], isLoading: isLoadingTasks } = useTasksByDate(useStore().selectedDate);
  
  // Converter atividades para o formato esperado
  const weeklySchedule = activities.map(activity => ({
    id: activity.id,
    activity: activity.title,
    startTime: activity.startTime || '09:00',
    endTime: activity.endTime || '10:00',
    type: activity.type.toLowerCase(),
    dayOfWeek: 'monday', // Simplificado por enquanto
    completed: false, // A API real não tem campo completed
    isActive: true,
  }));
  
  // Calcular progresso baseado na agenda semanal
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  
  // Filtrar itens da semana atual
  const weekItems = weeklySchedule.filter(item => {
    const itemDate = new Date();
    const dayOfWeek = itemDate.getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return item.isActive && days[dayOfWeek] === item.dayOfWeek;
  });
  
  const completedItems = weekItems.filter(item => item.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  const totalItems = weekItems.length + tasks.length;
  const totalCompleted = completedItems.length + completedTasks.length;
  const progress = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-500 to-emerald-600';
    if (progress >= 60) return 'from-blue-500 to-cyan-600';
    if (progress >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-600';
  };

  const getProgressMessage = (progress: number) => {
    if (progress >= 90) return 'Semana incrível! 🎉';
    if (progress >= 70) return 'Muito bem! 👏';
    if (progress >= 50) return 'Bom ritmo! 💪';
    if (progress >= 30) return 'Vamos lá! 🚀';
    return 'Novo começo! ✨';
  };

  if (isLoadingSchedule || isLoadingTasks) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="text-center py-8 text-gray-500">
          Carregando progresso...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Progresso Semanal</h2>
            <p className="text-sm text-gray-500">
              {totalCompleted} de {totalItems} concluídas
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {progress}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(progress)} transition-all duration-700 ease-out`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Progress Message */}
        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Target className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {getProgressMessage(progress)}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-green-600">{totalCompleted}</div>
            <div className="text-xs font-medium text-green-600 uppercase tracking-wide">Concluídas</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-blue-600">{totalItems - totalCompleted}</div>
            <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Pendentes</div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Agenda Semanal:</span>
          <span className="font-medium">{completedItems.length}/{weekItems.length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tarefas Independentes:</span>
          <span className="font-medium">{completedTasks.length}/{tasks.length}</span>
        </div>
      </div>

      {/* Weekly Visualization */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Esta Semana</span>
        </h3>
        <div className="flex space-x-1">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
            <div key={day} className="flex-1 space-y-1">
              <div className="text-xs text-gray-500 text-center">{day}</div>
              <div className={`h-2 rounded-full ${
                index === new Date().getDay() 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                  : 'bg-gray-200'
              }`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
