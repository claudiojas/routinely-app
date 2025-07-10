
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

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  date: string;
  type: 'study' | 'exercise' | 'work' | 'personal' | 'other';
  isGoogleSynced?: boolean;
  createdAt: Date;
  notes?: string;
}

export interface Note {
  id: string;
  content: string;
  date: string;
  createdAt: Date;
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

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Revisar código do projeto',
    description: 'Verificar se tudo está funcionando corretamente',
    completed: false,
    date: new Date().toISOString().split('T')[0],
    type: 'work',
    createdAt: new Date(),
    notes: 'Focar na parte de autenticação',
  },
  {
    id: '2',
    title: 'Estudar React Query',
    description: 'Aprender sobre cache e invalidação',
    completed: true,
    date: new Date().toISOString().split('T')[0],
    type: 'study',
    createdAt: new Date(),
  },
];

const mockNotes: Note[] = [
  {
    id: '1',
    content: 'Lembrar de revisar o código do projeto',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date(),
  },
  {
    id: '2',
    content: 'Ideia: implementar notificações push',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date(),
  },
];

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
  // ===== WEEKLY SCHEDULE =====
  
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

  // ===== TASKS =====

  // Buscar todas as tarefas
  getTasks: async (): Promise<Task[]> => {
    await delay(400);
    return [...mockTasks];
  },

  // Buscar tarefas por data
  getTasksByDate: async (date: string): Promise<Task[]> => {
    await delay(200);
    return mockTasks.filter(task => task.date === date);
  },

  // Criar tarefa
  createTask: async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    await delay(300);
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    mockTasks.push(newTask);
    return newTask;
  },

  // Atualizar tarefa
  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    await delay(300);
    const index = mockTasks.findIndex(task => task.id === id);
    if (index === -1) throw new Error('Tarefa não encontrada');
    
    mockTasks[index] = { ...mockTasks[index], ...updates };
    return mockTasks[index];
  },

  // Deletar tarefa
  deleteTask: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockTasks.findIndex(task => task.id === id);
    if (index === -1) throw new Error('Tarefa não encontrada');
    
    mockTasks.splice(index, 1);
  },

  // Toggle tarefa (completar/descompletar)
  toggleTask: async (id: string): Promise<Task> => {
    await delay(200);
    const index = mockTasks.findIndex(task => task.id === id);
    if (index === -1) throw new Error('Tarefa não encontrada');
    
    mockTasks[index].completed = !mockTasks[index].completed;
    return mockTasks[index];
  },

  // ===== NOTES =====

  // Buscar todas as notas
  getNotes: async (): Promise<Note[]> => {
    await delay(400);
    return [...mockNotes];
  },

  // Buscar notas por data
  getNotesByDate: async (date: string): Promise<Note[]> => {
    await delay(200);
    return mockNotes.filter(note => note.date === date);
  },

  // Criar nota
  createNote: async (note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> => {
    await delay(300);
    const newNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    mockNotes.push(newNote);
    return newNote;
  },

  // Atualizar nota
  updateNote: async (id: string, content: string): Promise<Note> => {
    await delay(300);
    const index = mockNotes.findIndex(note => note.id === id);
    if (index === -1) throw new Error('Nota não encontrada');
    
    mockNotes[index].content = content;
    return mockNotes[index];
  },

  // Deletar nota
  deleteNote: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockNotes.findIndex(note => note.id === id);
    if (index === -1) throw new Error('Nota não encontrada');
    
    mockNotes.splice(index, 1);
  },
};
