
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { mockApi, WeeklyScheduleItem } from '../data/mockApi';

const TaskList = () => {
  const [schedule, setSchedule] = useState<WeeklyScheduleItem[]>([]);
  const [selectedTask, setSelectedTask] = useState<WeeklyScheduleItem | null>(null);
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodaySchedule();
  }, []);

  const loadTodaySchedule = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const todayKey = dayNames[today.getDay()] as WeeklyScheduleItem['dayOfWeek'];
      
      const todaySchedule = await mockApi.getScheduleByDay(todayKey);
      setSchedule(todaySchedule);
    } catch (error) {
      console.error('Erro ao carregar agenda do dia:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (id: string) => {
    // Aqui você pode implementar a lógica para salvar as anotações no backend
    console.log('Salvando anotações para:', id, userNotes[id]);
    setSelectedTask(null);
  };

  const handleCheck = (id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getTypeColor = (type: WeeklyScheduleItem['type']) => {
    const colors = {
      study: 'bg-blue-500',
      exercise: 'bg-green-500',
      work: 'bg-purple-500',
      personal: 'bg-orange-500',
      other: 'bg-gray-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="modern-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-card p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Checklist Diário</h2>

      {schedule.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p>Nenhuma atividade programada para hoje</p>
          <p className="text-sm mt-2">Configure sua agenda semanal para ver as tarefas aqui</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-700">
                <th className="py-2 px-3">Horário</th>
                <th className="py-2 px-3">Atividade</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {schedule.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="cursor-pointer hover:bg-slate-700/30 transition-colors"
                >
                  <td className="py-3 px-3 font-medium whitespace-nowrap text-slate-300">
                    {task.startTime} – {task.endTime}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getTypeColor(task.type)}`} />
                      <span className={`text-white ${completed[task.id] ? 'line-through opacity-60' : ''}`}>
                        {task.activity}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${
                        completed[task.id]
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-slate-500 hover:border-emerald-400'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheck(task.id);
                      }}
                    >
                      {completed[task.id] && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedTask && (
        <Dialog open={true} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedTask.activity}</DialogTitle>
              <DialogDescription className="text-slate-300">
                {selectedTask.startTime} – {selectedTask.endTime}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Observações da Atividade
                </label>
                <p className="text-slate-200 text-sm bg-slate-700/50 p-3 rounded border border-slate-600">
                  {selectedTask.notes || 'Nenhuma observação cadastrada'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Suas Anotações
                </label>
                <textarea
                  rows={3}
                  placeholder="Digite suas observações sobre a tarefa..."
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-slate-400"
                  value={userNotes[selectedTask.id] || ''}
                  onChange={(e) =>
                    setUserNotes((prev) => ({ ...prev, [selectedTask.id]: e.target.value }))
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCheck(selectedTask.id)}
                  className={`px-4 py-2 rounded-md text-white font-medium shadow transition-all duration-200 ${
                    completed[selectedTask.id] 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-violet-600 hover:bg-violet-700'
                  }`}
                >
                  {completed[selectedTask.id] ? 'Desmarcar' : 'Marcar como concluída'}
                </button>
                <button
                  onClick={() => handleSave(selectedTask.id)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
                >
                  Salvar Anotações
                </button>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <button
                onClick={() => setSelectedTask(null)}
                className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
              >
                Fechar
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TaskList;
