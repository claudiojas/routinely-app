import { useState } from 'react';
import { Pencil, Trash2, Save, X } from 'lucide-react';

const initialSchedule = [
  {
    id: 1,
    time: '05h00 – 05h30',
    activity: '🌅 Despertar + higiene + café leve',
    notes: 'Momento de despertar tranquilo e preparar o corpo para o dia'
  },
  {
    id: 2,
    time: '05h30 – 07h00',
    activity: '🧠 Estudo de Inglês',
    notes: 'Foque em compreensão oral, leitura e fala. Use apps como Anki, Duolingo, ou aulas no YouTube com shadowing'
  },
  {
    id: 3,
    time: '07h00 – 08h00',
    activity: '🏋️‍♂️ Musculação (treino em casa ou academia)',
    notes: 'Comece o dia com foco na saúde física'
  },
  {
    id: 4,
    time: '08h00 – 08h30',
    activity: '🍽️ Café da manhã reforçado',
    notes: 'Pós-treino, essencial para recuperação'
  },
  {
    id: 5,
    time: '08h30 – 10h30',
    activity: '💻 Estudo de Go',
    notes: 'Prática com exercícios, vídeos e leitura de código'
  },
  {
    id: 6,
    time: '10h30 – 12h00',
    activity: '🎓 Estudo da faculdade (ADS)',
    notes: 'Leia materiais, faça anotações e pratique'
  },
  {
    id: 7,
    time: '12h00 – 14h00',
    activity: '🥗 Almoço + descanso',
    notes: 'Inclui tempo para comer e descansar (power nap ou leitura leve)'
  },
  {
    id: 8,
    time: '14h00 – 15h00',
    activity: '🚶 Caminhada leve ou alongamento',
    notes: 'Pode ser ao ar livre para recarregar a mente'
  },
  {
    id: 9,
    time: '15h00 – 16h00',
    activity: '🧠 Estudo de Inglês (conversação ou escrita)',
    notes: 'Faça anotações, escreva textos e pratique falar em voz alta'
  },
  {
    id: 10,
    time: '16h00 – 17h00',
    activity: '📚 Revisão do dia / Tarefas acadêmicas',
    notes: 'Use este tempo para revisar Go, inglês ou assuntos da faculdade'
  },
];

const WeeklyAgendaTable = () => {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState({ time: '', activity: '', notes: '' });

  const startEditing = (item: typeof schedule[0]) => {
    setEditingId(item.id);
    setDraft({ time: item.time, activity: item.activity, notes: item.notes });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraft({ time: '', activity: '', notes: '' });
  };

  const saveEditing = (id: number) => {
    setSchedule(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...draft } : item
      )
    );
    cancelEditing();
  };

  const deleteRow = (id: number) => {
    setSchedule(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">📆 Agenda de Segunda a Sexta (05h00 – 17h00)</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-sm font-medium">
              <th className="px-4 py-2 text-left border-b">Horário</th>
              <th className="px-4 py-2 text-left border-b">Atividade</th>
              <th className="px-4 py-2 text-left border-b">Observações</th>
              <th className="px-4 py-2 text-right border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map(item => (
              <tr key={item.id} className="text-sm text-gray-800">
                <td className="px-4 py-2 border-b align-top">
                  {editingId === item.id ? (
                    <input
                      value={draft.time}
                      onChange={(e) => setDraft(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full border px-2 py-1 rounded-md text-sm"
                    />
                  ) : (
                    item.time
                  )}
                </td>
                <td className="px-4 py-2 border-b align-top">
                  {editingId === item.id ? (
                    <input
                      value={draft.activity}
                      onChange={(e) => setDraft(prev => ({ ...prev, activity: e.target.value }))}
                      className="w-full border px-2 py-1 rounded-md text-sm"
                    />
                  ) : (
                    item.activity
                  )}
                </td>
                <td className="px-4 py-2 border-b align-top">
                  {editingId === item.id ? (
                    <textarea
                      value={draft.notes}
                      onChange={(e) => setDraft(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full border px-2 py-1 rounded-md text-sm"
                    />
                  ) : (
                    item.notes
                  )}
                </td>
                <td className="px-4 py-2 border-b align-top text-right space-x-2">
                  {editingId === item.id ? (
                    <>
                      <button
                        onClick={() => saveEditing(item.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Save className="inline w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="inline w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(item)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Pencil className="inline w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteRow(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="inline w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyAgendaTable;
