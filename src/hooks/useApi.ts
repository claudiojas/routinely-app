import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, ApiException } from '@/lib/api'
import { invalidateQueries } from '@/lib/queryClient'
import {
  WeeklyScheduleItem,
  CreateWeeklyScheduleRequest,
  UpdateWeeklyScheduleRequest,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  Note,
  CreateNoteRequest,
  UpdateNoteRequest,
  User,
  LoginRequest,
  RegisterRequest,
  TaskFilters,
  WeeklyScheduleFilters,
  PaginatedResponse,
  AnalyticsData,
} from '@/types/api'

// ===== HOOKS PARA AGENDA SEMANAL =====

export const useWeeklySchedule = (filters?: WeeklyScheduleFilters) => {
  return useQuery({
    queryKey: ['weeklySchedule', filters],
    queryFn: async () => {
      const params = filters ? { ...filters } : {}
      return api.get<WeeklyScheduleItem[]>('/schedule/weekly', params)
    },
  })
}

export const useWeeklyScheduleByDay = (dayOfWeek: string) => {
  return useQuery({
    queryKey: ['weeklySchedule', 'byDay', dayOfWeek],
    queryFn: async () => {
      return api.get<WeeklyScheduleItem[]>(`/schedule/weekly/${dayOfWeek}`)
    },
    enabled: !!dayOfWeek,
  })
}

export const useCreateWeeklySchedule = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateWeeklyScheduleRequest) => {
      return api.post<WeeklyScheduleItem>('/schedule/weekly', data)
    },
    onSuccess: () => {
      invalidateQueries.weeklySchedule()
    },
  })
}

export const useUpdateWeeklySchedule = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateWeeklyScheduleRequest }) => {
      return api.put<WeeklyScheduleItem>(`/schedule/weekly/${id}`, data)
    },
    onSuccess: (_, { id }) => {
      invalidateQueries.weeklySchedule()
      invalidateQueries.weeklyScheduleByDay()
    },
  })
}

export const useDeleteWeeklySchedule = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/schedule/weekly/${id}`)
    },
    onSuccess: () => {
      invalidateQueries.weeklySchedule()
      invalidateQueries.weeklyScheduleByDay()
    },
  })
}

// ===== HOOKS PARA TAREFAS =====

export const useTasks = (filters?: TaskFilters) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      const params = filters ? { ...filters } : {}
      return api.get<PaginatedResponse<Task>>('/tasks', params)
    },
  })
}

export const useTasksByDate = (date: string) => {
  return useQuery({
    queryKey: ['tasks', 'byDate', date],
    queryFn: async () => {
      return api.get<Task[]>(`/tasks/date/${date}`)
    },
    enabled: !!date,
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateTaskRequest) => {
      return api.post<Task>('/tasks', data)
    },
    onSuccess: () => {
      invalidateQueries.tasks()
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTaskRequest }) => {
      return api.put<Task>(`/tasks/${id}`, data)
    },
    onSuccess: (_, { id }) => {
      invalidateQueries.tasks()
      invalidateQueries.tasksByDate()
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/tasks/${id}`)
    },
    onSuccess: () => {
      invalidateQueries.tasks()
      invalidateQueries.tasksByDate()
    },
  })
}

export const useToggleTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      return api.patch<Task>(`/tasks/${id}/toggle`, { completed })
    },
    onSuccess: () => {
      invalidateQueries.tasks()
      invalidateQueries.tasksByDate()
    },
  })
}

// ===== HOOKS PARA NOTAS =====

export const useNotes = (date?: string) => {
  return useQuery({
    queryKey: ['notes', date],
    queryFn: async () => {
      const params = date ? { date } : {}
      return api.get<Note[]>('/notes', params)
    },
  })
}

export const useCreateNote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateNoteRequest) => {
      return api.post<Note>('/notes', data)
    },
    onSuccess: () => {
      invalidateQueries.notes()
    },
  })
}

export const useUpdateNote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateNoteRequest }) => {
      return api.put<Note>(`/notes/${id}`, data)
    },
    onSuccess: () => {
      invalidateQueries.notes()
    },
  })
}

export const useDeleteNote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/notes/${id}`)
    },
    onSuccess: () => {
      invalidateQueries.notes()
    },
  })
}

// ===== HOOKS PARA AUTENTICAÇÃO =====

export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      return api.post<{ user: User; token: string; refreshToken: string }>('/auth/login', credentials)
    },
    onSuccess: (data) => {
      // Limpar cache ao fazer login
      queryClient.clear()
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      return api.post<{ user: User; token: string; refreshToken: string }>('/auth/register', data)
    },
    onSuccess: () => {
      // Limpar cache ao fazer registro
      queryClient.clear()
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      return api.post('/auth/logout')
    },
    onSuccess: () => {
      // Limpar cache ao fazer logout
      queryClient.clear()
    },
  })
}

// ===== HOOKS PARA USUÁRIO =====

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      return api.get<User>('/auth/me')
    },
    enabled: !!localStorage.getItem('auth_token'),
  })
}

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      return api.get<User>('/auth/profile')
    },
    enabled: !!localStorage.getItem('auth_token'),
  })
}

// ===== HOOKS PARA ANALYTICS =====

export const useAnalytics = (dateRange?: { start: string; end: string }) => {
  return useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: async () => {
      const params = dateRange ? { ...dateRange } : {}
      return api.get<AnalyticsData>('/analytics', params)
    },
  })
}

// ===== HOOKS PARA GOOGLE CALENDAR =====

export const useGoogleCalendarSync = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (direction: 'import' | 'export' | 'bidirectional') => {
      return api.post('/google-calendar/sync', { direction })
    },
    onSuccess: () => {
      // Invalidar queries relacionadas após sincronização
      invalidateQueries.weeklySchedule()
      invalidateQueries.tasks()
    },
  })
}

// ===== HOOKS UTILITÁRIOS =====

export const useApiError = () => {
  return (error: unknown) => {
    if (error instanceof ApiException) {
      // Aqui você pode implementar tratamento específico de erros
      console.error('API Error:', error.message, error.status)
      
      // Exemplo: mostrar toast de erro
      // toast.error(error.message)
      
      return error
    }
    
    console.error('Unknown error:', error)
    return new ApiException(0, 'Erro desconhecido')
  }
} 