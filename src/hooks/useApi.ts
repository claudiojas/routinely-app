import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi, WeeklyScheduleItem, Task, Note } from '../data/mockApi';

// Weekly Schedule Hooks
export const useWeeklySchedule = () => {
  return useQuery({
    queryKey: ['weeklySchedule'],
    queryFn: mockApi.getWeeklySchedule,
  });
};

export const useWeeklyScheduleByDay = (dayOfWeek: WeeklyScheduleItem['dayOfWeek']) => {
  return useQuery({
    queryKey: ['weeklySchedule', 'byDay', dayOfWeek],
    queryFn: () => mockApi.getScheduleByDay(dayOfWeek),
    enabled: !!dayOfWeek,
  });
};

export const useCreateScheduleItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (item: Omit<WeeklyScheduleItem, 'id'>) => mockApi.createScheduleItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklySchedule'] });
    },
  });
};

export const useUpdateScheduleItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<WeeklyScheduleItem> }) =>
      mockApi.updateScheduleItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklySchedule'] });
    },
  });
};

export const useDeleteScheduleItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => mockApi.deleteScheduleItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklySchedule'] });
    },
  });
};

// Tasks Hooks
export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: mockApi.getTasks,
  });
};

export const useTasksByDate = (date: string) => {
  return useQuery({
    queryKey: ['tasks', 'byDate', date],
    queryFn: () => mockApi.getTasksByDate(date),
    enabled: !!date,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (task: Omit<Task, 'id' | 'createdAt'>) => mockApi.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      mockApi.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => mockApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useToggleTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => mockApi.toggleTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// Notes Hooks
export const useNotes = () => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: mockApi.getNotes,
  });
};

export const useNotesByDate = (date: string) => {
  return useQuery({
    queryKey: ['notes', 'byDate', date],
    queryFn: () => mockApi.getNotesByDate(date),
    enabled: !!date,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (note: Omit<Note, 'id' | 'createdAt'>) => mockApi.createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      mockApi.updateNote(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => mockApi.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}; 