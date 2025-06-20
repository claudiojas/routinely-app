import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// Tipagem local de exemplo
interface ScheduleItem {
  id: number;
  startTime: string;
  endTime: string;
  activity: string;
  notes: string;
}

const initialSchedule: ScheduleItem[] = [
  {
    id: 1,
    startTime: '05:00',
    endTime: '05:30',
    activity: '🌅 Despertar + higiene + café leve',
    notes: 'Momento de despertar tranquilo e preparar o corpo para o dia',
  },
  {
    id: 2,
    startTime: '05:30',
    endTime: '07:00',
    activity: '🧠 Estudo de Inglês',
    notes:
      'Foque em compreensão oral, leitura e fala. Use apps como Anki, Duolingo ou shadowing.',
  },
];

const TaskList = () => {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [selectedTask, setSelectedTask] = useState<ScheduleItem | null>(null);
  const [userNotes, setUserNotes] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  const handleSave = (id: number, editedTask: Partial<ScheduleItem>) => {
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...editedTask } : item))
    );
    setSelectedTask(null);
  };

  const handleCheck = (id: number) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Checklist Diário</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2 px-3">Horário</th>
              <th className="py-2 px-3">Atividade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schedule.map((task) => (
              <tr
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <td className="py-2 px-3 font-medium whitespace-nowrap">
                  {task.startTime} – {task.endTime}
                </td>
                <td
                  className={`py-2 px-3 ${
                    completed[task.id] ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}
                >
                  {task.activity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTask && (
        <Dialog open={true} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedTask.activity}</DialogTitle>
              <DialogDescription>
                {selectedTask.startTime} – {selectedTask.endTime}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Observações
                </label>
                <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded border">
                  {selectedTask.notes}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Suas Anotações
                </label>
                <textarea
                  rows={3}
                  placeholder="Digite suas observações sobre a tarefa..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
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
                    completed[selectedTask.id] ? 'bg-green-600' : 'bg-gray-600 hover:bg-blue-600'
                  }`}
                >
                  {completed[selectedTask.id] ? 'Desmarcar' : 'Marcar como concluída'}
                </button>
                <button
                  onClick={() => handleSave(selectedTask.id, {})}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Salvar Anotações
                </button>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <button
                onClick={() => setSelectedTask(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
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
