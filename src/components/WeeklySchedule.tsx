import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

type ScheduleItem = {
  id: number;
  startTime: string;
  endTime: string;
  activity: string;
  notes: string;
};

const initialSchedule: ScheduleItem[] = [
  {
    id: 1,
    startTime: "05:00",
    endTime: "05:30",
    activity: "🌅 Despertar + higiene + café leve",
    notes: "Momento de despertar tranquilo e preparar o corpo para o dia",
  },
  {
    id: 2,
    startTime: "05:30",
    endTime: "07:00",
    activity: "🧠 Estudo de Inglês",
    notes:
      "Foque em compreensão oral, leitura e fala. Use apps como Anki, Duolingo ou shadowing.",
  },
  // adicione mais se quiser...
];

const WeeklyAgenda = () => {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  const handleUpdate = (updatedItem: ScheduleItem) => {
    setSchedule((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setIsEditing(false);
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    setSchedule((prev) => prev.filter((item) => item.id !== id));
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        📆 Agenda Semanal (05h00 – 17h00)
      </h2>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
          <tr>
            <th className="px-4 py-2">Horário</th>
            <th className="px-4 py-2">Atividade</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item) => (
            <tr
              key={item.id}
              onClick={() => {
                setSelectedItem(item);
                setIsEditing(false);
                setOpen(true);
              }}
              className="border-b cursor-pointer hover:bg-gray-50 transition"
            >
              <td className="px-4 py-2 whitespace-nowrap">
                {item.startTime} – {item.endTime}
              </td>
              <td className="px-4 py-2">{item.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Bloco" : "Detalhes do Bloco"}
            </DialogTitle>
            <DialogDescription>
              Visualize ou edite as informações do seu agendamento
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <>
              {isEditing ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const updated: ScheduleItem = {
                      ...selectedItem,
                      startTime: form.startTime.value,
                      endTime: form.endTime.value,
                      activity: form.activity.value,
                      notes: form.notes.value,
                    };
                    handleUpdate(updated);
                  }}
                  className="space-y-4 text-gray-900"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 block mb-1">
                        Início
                      </label>
                      <input
                        name="startTime"
                        defaultValue={selectedItem.startTime}
                        type="time"
                        required
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 block mb-1">
                        Fim
                      </label>
                      <input
                        name="endTime"
                        defaultValue={selectedItem.endTime}
                        type="time"
                        required
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Atividade
                    </label>
                    <input
                      name="activity"
                      defaultValue={selectedItem.activity}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Observações
                    </label>
                    <textarea
                      name="notes"
                      defaultValue={selectedItem.notes}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>

                  <DialogFooter className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Salvar
                    </button>
                  </DialogFooter>
                </form>
              ) : (
                <div className="text-sm space-y-3">
                  <p>
                    <strong className="text-gray-600">Horário:</strong>{" "}
                    {selectedItem.startTime} – {selectedItem.endTime}
                  </p>
                  <p>
                    <strong className="text-gray-600">Atividade:</strong>{" "}
                    {selectedItem.activity}
                  </p>
                  <p>
                    <strong className="text-gray-600">Observações:</strong>{" "}
                    {selectedItem.notes}
                  </p>

                  <DialogFooter className="pt-4 gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-700"
                    >
                      <Pencil className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(selectedItem.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  </DialogFooter>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyAgenda;
