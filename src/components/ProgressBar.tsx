
import React from 'react';
import { TrendingUp, Target } from 'lucide-react';
import { useStore } from '../store/useStore';

const ProgressBar = () => {
  const { tasks, getWeeklyProgress } = useStore();
  const progress = getWeeklyProgress();
  
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  
  const weekTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    return taskDate >= weekStart;
  });
  
  const completedTasks = weekTasks.filter(task => task.completed);
  const totalTasks = weekTasks.length;

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressMessage = (progress: number) => {
    if (progress >= 90) return 'Excelente semana! 🎉';
    if (progress >= 70) return 'Ótimo progresso! 👏';
    if (progress >= 50) return 'Bom trabalho! 💪';
    if (progress >= 30) return 'Continue assim! 🚀';
    return 'Vamos começar! ✨';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Progresso Semanal</h2>
            <p className="text-sm text-gray-500">
              {completedTasks} de {totalTasks} tarefas concluídas
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{progress}%</div>
          <div className="text-sm text-gray-500">completo</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso</span>
          <span className="text-sm text-gray-500">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Target className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {getProgressMessage(progress)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <div className="text-sm text-green-600">Concluídas</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalTasks - completedTasks}</div>
            <div className="text-sm text-blue-600">Pendentes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
