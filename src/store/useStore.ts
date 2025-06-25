import { create } from 'zustand';
import { mockApi, WeeklyScheduleItem } from '../data/mockApi';

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

export interface TimeBlock {
  id: string;
  title: string;
  type: 'study' | 'exercise' | 'work' | 'personal' | 'other';
  day: string;
  startTime: string;
  endTime: string;
  isGoogleSynced?: boolean;
}

export interface Note {
  id: string;
  content: string;
  date: string;
  createdAt: Date;
}

interface Store {
  tasks: Task[];
  timeBlocks: TimeBlock[];
  notes: Note[];
  selectedDate: string;
  weeklySchedule: WeeklyScheduleItem[];
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addTaskNote: (id: string, note: string) => void;
  
  // Time block actions
  addTimeBlock: (block: Omit<TimeBlock, 'id'>) => void;
  updateTimeBlock: (id: string, updates: Partial<TimeBlock>) => void;
  deleteTimeBlock: (id: string) => void;
  
  // Weekly schedule actions
  loadWeeklySchedule: () => Promise<void>;
  addScheduleItem: (item: Omit<WeeklyScheduleItem, 'id'>) => Promise<void>;
  updateScheduleItem: (id: string, updates: Partial<WeeklyScheduleItem>) => Promise<void>;
  deleteScheduleItem: (id: string) => Promise<void>;
  
  // Note actions
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  
  // UI actions
  setSelectedDate: (date: string) => void;
  
  // Progress calculation
  getWeeklyProgress: () => number;
  getTodayScheduleItems: (date: string) => WeeklyScheduleItem[];
}

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useStore = create<Store>((set, get) => ({
  tasks: [],
  timeBlocks: [],
  notes: [
    {
      id: '1',
      content: 'Lembrar de revisar o código do projeto',
      date: getCurrentDate(),
      createdAt: new Date(),
    }
  ],
  selectedDate: getCurrentDate(),
  weeklySchedule: [],
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    }]
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    )
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),
  
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    )
  })),

  addTaskNote: (id, note) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, notes: note } : task
    )
  })),
  
  addTimeBlock: (block) => set((state) => ({
    timeBlocks: [...state.timeBlocks, {
      ...block,
      id: Date.now().toString(),
    }]
  })),
  
  updateTimeBlock: (id, updates) => set((state) => ({
    timeBlocks: state.timeBlocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    )
  })),
  
  deleteTimeBlock: (id) => set((state) => ({
    timeBlocks: state.timeBlocks.filter(block => block.id !== id)
  })),

  loadWeeklySchedule: async () => {
    try {
      const data = await mockApi.getWeeklySchedule();
      set({ weeklySchedule: data });
    } catch (error) {
      console.error('Erro ao carregar agenda semanal:', error);
    }
  },

  addScheduleItem: async (item) => {
    try {
      const newItem = await mockApi.createScheduleItem(item);
      set((state) => ({
        weeklySchedule: [...state.weeklySchedule, newItem]
      }));
    } catch (error) {
      console.error('Erro ao adicionar item da agenda:', error);
    }
  },

  updateScheduleItem: async (id, updates) => {
    try {
      const updated = await mockApi.updateScheduleItem(id, updates);
      set((state) => ({
        weeklySchedule: state.weeklySchedule.map(item => 
          item.id === id ? updated : item
        )
      }));
    } catch (error) {
      console.error('Erro ao atualizar item da agenda:', error);
    }
  },

  deleteScheduleItem: async (id) => {
    try {
      await mockApi.deleteScheduleItem(id);
      set((state) => ({
        weeklySchedule: state.weeklySchedule.filter(item => item.id !== id)
      }));
    } catch (error) {
      console.error('Erro ao deletar item da agenda:', error);
    }
  },
  
  addNote: (note) => set((state) => ({
    notes: [...state.notes, {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date(),
    }]
  })),
  
  updateNote: (id, content) => set((state) => ({
    notes: state.notes.map(note =>
      note.id === id ? { ...note, content } : note
    )
  })),
  
  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter(note => note.id !== id)
  })),
  
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  getWeeklyProgress: () => {
    const state = get();
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    
    const weekTasks = state.tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate >= weekStart;
    });
    
    if (weekTasks.length === 0) return 0;
    
    const completedTasks = weekTasks.filter(task => task.completed);
    return Math.round((completedTasks.length / weekTasks.length) * 100);
  },

  getTodayScheduleItems: (date) => {
    const state = get();
    const dayOfWeek = (() => {
      const dateObj = new Date(date + 'T12:00:00');
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      return days[dateObj.getDay()] as WeeklyScheduleItem['dayOfWeek'];
    })();

    return state.weeklySchedule
      .filter(item => item.dayOfWeek === dayOfWeek && item.isActive)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  },
}));
