
// Mock API para simular chamadas do backend
export interface WeeklyScheduleItem {
  id: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  activity: string;
  notes: string;
  type: 'study' | 'exercise' | 'work' | 'personal' | 'other';
  isActive: boolean;
  completed?: boolean;
}

// Mock data - simula dados que viriam da API
const mockWeeklySchedule: WeeklyScheduleItem[] = [
  {
    id: '1',
    dayOfWeek: 'monday',
    startTime: '05:00',
    endTime: '05:30',
    activity: '🌅 Despertar + higiene + café leve',
    notes: 'Momento de despertar tranquilo e preparar o corpo para o dia',
    type: 'personal',
    isActive: true,
    completed: false,
  },
  {
    id: '2',
    dayOfWeek: 'monday',
    startTime: '05:30',
    endTime: '07:00',
    activity: '🧠 Estudo de Inglês',
    notes: 'Foque em compreensão oral, leitura e fala. Use apps como Anki, Duolingo ou shadowing.',
    type: 'study',
    isActive: true,
    completed: false,
  },
  {
    id: '3',
    dayOfWeek: 'tuesday',
    startTime: '06:00',
    endTime: '07:00',
    activity: '💪 Exercício físico',
    notes: 'Treino de força ou cardio',
    type: 'exercise',
    isActive: true,
    completed: false,
  },
];

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
  // Buscar agenda semanal
  getWeeklySchedule: async (): Promise<WeeklyScheduleItem[]> => {
    await delay(500);
    return [...mockWeeklySchedule];
  },

  // Criar item na agenda
  createScheduleItem: async (item: Omit<WeeklyScheduleItem, 'id'>): Promise<WeeklyScheduleItem> => {
    await delay(300);
    const newItem = {
      ...item,
      id: Date.now().toString(),
    };
    mockWeeklySchedule.push(newItem);
    return newItem;
  },

  // Atualizar item da agenda
  updateScheduleItem: async (id: string, updates: Partial<WeeklyScheduleItem>): Promise<WeeklyScheduleItem> => {
    await delay(300);
    const index = mockWeeklySchedule.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Item não encontrado');
    
    mockWeeklySchedule[index] = { ...mockWeeklySchedule[index], ...updates };
    return mockWeeklySchedule[index];
  },

  // Deletar item da agenda
  deleteScheduleItem: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockWeeklySchedule.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Item não encontrado');
    
    mockWeeklySchedule.splice(index, 1);
  },

  // Buscar itens por dia da semana
  getScheduleByDay: async (dayOfWeek: WeeklyScheduleItem['dayOfWeek']): Promise<WeeklyScheduleItem[]> => {
    await delay(200);
    return mockWeeklySchedule.filter(item => item.dayOfWeek === dayOfWeek && item.isActive);
  },
};
