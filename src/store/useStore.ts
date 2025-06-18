
import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  date: string;
  type: 'study' | 'exercise' | 'work' | 'personal' | 'other';
  isGoogleSynced?: boolean;
  createdAt: Date;
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
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  
  // Time block actions
  addTimeBlock: (block: Omit<TimeBlock, 'id'>) => void;
  updateTimeBlock: (id: string, updates: Partial<TimeBlock>) => void;
  deleteTimeBlock: (id: string) => void;
  
  // Note actions
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  
  // UI actions
  setSelectedDate: (date: string) => void;
  
  // Progress calculation
  getWeeklyProgress: () => number;
}

export const useStore = create<Store>((set, get) => ({
  tasks: [
    {
      id: '1',
      title: 'Estudar React Hooks',
      description: 'Revisar useState e useEffect',
      completed: false,
      date: new Date().toISOString().split('T')[0],
      type: 'study',
      isGoogleSynced: true,
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Exercício matinal',
      completed: true,
      date: new Date().toISOString().split('T')[0],
      type: 'exercise',
      createdAt: new Date(),
    }
  ],
  timeBlocks: [
    {
      id: '1',
      title: 'Reunião de equipe',
      type: 'work',
      day: 'monday',
      startTime: '09:00',
      endTime: '10:00',
      isGoogleSynced: true,
    }
  ],
  notes: [
    {
      id: '1',
      content: 'Lembrar de revisar o código do projeto',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
    }
  ],
  selectedDate: new Date().toISOString().split('T')[0],
  
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
}));
