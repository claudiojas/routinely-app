import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth as useAuthContext } from '../contexts/AuthContext';
import {
  User,
  Task,
  Note,
  WeeklyScheduleItem,
  WeekDayComment,
  ApiResponse,
  CreateActivityRequest,
  UpdateActivityRequest,
  LoginRequest,
} from '../types/api';

// Configuração da API usando fetch nativo
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Função utilitária para fazer requisições
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Só adicionar Content-Type se tiver body na requisição
    if (options.body) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado ou inválido
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.error || `Erro ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro de conexão';
    return {
      error: errorMessage
    };
  }
}

// Utilitários de autenticação
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// ===== HOOKS DE AUTENTICAÇÃO =====

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { login } = useAuthContext();
  
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiRequest<{ user: User; token: string }>('/userLogin', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if ((response as ApiResponseWithError<{ user: User; token: string }>).error) {
        throw new Error((response as ApiResponseWithError<{ user: User; token: string }>).error);
      }
      
      return response.data!;
    },
    onSuccess: (response) => {
      login(response.user, response.token);
      queryClient.setQueryData(['user'], response.user);
    },
  });
};

export const useSignUp = () => {
  const queryClient = useQueryClient();
  const { login } = useAuthContext();
  
  return useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const response = await apiRequest<{ user: User; token: string }>('/user', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if ((response as ApiResponseWithError<{ user: User; token: string }>).error) {
        throw new Error((response as ApiResponseWithError<{ user: User; token: string }>).error);
      }
      
      return response.data!;
    },
    onSuccess: (response) => {
      login(response.user, response.token);
      queryClient.setQueryData(['user'], response.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => {
      removeAuthToken();
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

// ===== HOOKS DE ATIVIDADES =====

export const useActivities = () => {
  return useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const response = await apiRequest<Task[]>('/activities');
      if ((response as ApiResponseWithError<Task[]>).error) {
        throw new Error((response as ApiResponseWithError<Task[]>).error);
      }
      return response.data || [];
    },
    enabled: isAuthenticated(),
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateActivityRequest) => {
      const response = await apiRequest<Task>('/activities', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if ((response as ApiResponseWithError<Task>).error) {
        throw new Error((response as ApiResponseWithError<Task>).error);
      }
      
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateActivityRequest }) => {
      const response = await apiRequest<Task>(`/activities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      
      if ((response as ApiResponseWithError<Task>).error) {
        throw new Error((response as ApiResponseWithError<Task>).error);
      }
      
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest<void>(`/activities/${id}`, {
        method: 'DELETE',
      });
      
      if ((response as ApiResponseWithError<void>).error) {
        throw new Error((response as ApiResponseWithError<void>).error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

export const useToggleActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest<Task>(`/activities/${id}/toggle`, {
        method: 'PATCH',
      });
      
      if ((response as ApiResponseWithError<Task>).error) {
        throw new Error((response as ApiResponseWithError<Task>).error);
      }
      
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

// ===== HOOKS DE CONFIGURAÇÃO =====

// Tipos de atividade baseados na API real
const ACTIVITY_TYPES = [
  { value: 'PESSOAL', label: '🏠 Pessoal', color: 'bg-orange-500' },
  { value: 'TRABALHO', label: '💼 Trabalho', color: 'bg-purple-500' },
  { value: 'ESTUDO', label: '📚 Estudo', color: 'bg-blue-500' },
  { value: 'SAUDE', label: '💪 Saúde', color: 'bg-green-500' },
  { value: 'OUTRO', label: '📝 Outro', color: 'bg-gray-500' },
] as const;

export const useActivityTypes = () => {
  return useQuery({
    queryKey: ['activityTypes'],
    queryFn: () => Promise.resolve(ACTIVITY_TYPES),
  });
};

// Dias da semana
const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
] as const;

export const useDaysOfWeek = () => {
  return useQuery({
    queryKey: ['daysOfWeek'],
    queryFn: () => Promise.resolve(DAYS_OF_WEEK),
  });
};

// ===== HOOKS DE UTILIDADE =====

export const useAuth = () => {
  return useAuthContext();
};

// ===== HOOKS DE DADOS DO USUÁRIO =====

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await apiRequest<User>('/user/profile');
      if ((response as ApiResponseWithError<User>).error) {
        throw new Error((response as ApiResponseWithError<User>).error);
      }
      return response.data!;
    },
    enabled: isAuthenticated(),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await apiRequest<User>('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      
      if ((response as ApiResponseWithError<User>).error) {
        throw new Error((response as ApiResponseWithError<User>).error);
      }
      
      return response.data!;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user-profile'], updatedUser);
      queryClient.setQueryData(['user'], updatedUser);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await apiRequest<{ message: string }>('/user/password', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      
      if ((response as ApiResponseWithError<{ message: string }>).error) {
        throw new Error((response as ApiResponseWithError<{ message: string }>).error);
      }
      
      return response.data!;
    },
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const response = await apiRequest<UserStats>('/user/stats');
      if ((response as ApiResponseWithError<UserStats>).error) {
        throw new Error((response as ApiResponseWithError<UserStats>).error);
      }
      return response.data!;
    },
    enabled: isAuthenticated(),
  });
};

// ===== HOOKS COMPATIBILIDADE (para manter componentes existentes) =====

// Mapeamento de tipos da API real para os tipos antigos
const mapActivityToLegacy = (activity: Task) => ({
  id: activity.id,
  title: activity.title,
  description: activity.description || '',
  completed: false, // A API real não tem campo completed
  date: new Date().toISOString().split('T')[0], // Usar data atual
  type: activity.type.toLowerCase() as 'pessoal' | 'trabalho' | 'estudo' | 'saude' | 'outro',
  isGoogleSynced: false,
  createdAt: activity.createdAt,
  notes: activity.description,
});



export const useTasksByDate = (date: string) => {
  const { data: activities = [], isLoading, error } = useActivities();
  
  return {
    data: activities.map(mapActivityToLegacy),
    isLoading,
    error,
  };
};









// ===== HOOKS DE NOTAS (não implementados na API real) =====



export const useNotesByDate = (date: string) => {
  return useQuery({
    queryKey: ['notes', 'byDate', date],
    queryFn: () => Promise.resolve([]),
    enabled: !!date,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (note: { content: string; date?: string }) => Promise.resolve(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      Promise.resolve({ id, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

// ===== HOOKS DE SEMANAS =====

export interface Week {
  id: string;
  userId: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  isActive: boolean;
  isCompleted: boolean;
  weekNumber: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export interface CreateWeekRequest {
  startDate: string; // ISO string
  endDate: string;   // ISO string
  weekNumber: number;
}

export const useWeeks = () => {
  return useQuery({
    queryKey: ['weeks'],
    queryFn: async () => {
      const response = await apiRequest<Week[]>('/weeks');
      if ((response as ApiResponseWithError<Week[]>).error) throw new Error((response as ApiResponseWithError<Week[]>).error);
      return response.data!;
    },
    staleTime: 0,
    gcTime: 0,
    enabled: isAuthenticated(),
  });
};

export const useCreateWeek = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateWeekRequest) => {
      const response = await apiRequest<Week>('/weeks', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if ((response as ApiResponseWithError<Week>).error) throw new Error((response as ApiResponseWithError<Week>).error);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeks'] });
    },
  });
};

export const useDeleteWeek = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest<{ message: string }>(`/weeks/${id}`, {
        method: 'DELETE',
      });
      if ((response as ApiResponseWithError<{ message: string }>).error) throw new Error((response as ApiResponseWithError<{ message: string }>).error);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeks'] });
    },
  });
};

export const useUpsertWeekDayComment = (weekId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { dayOfWeek: number; comment: string }) => {
      if (!weekId) throw new Error('weekId é obrigatório');
      const response = await apiRequest<{ data: WeekDayComment }>(`/weeks/${weekId}/comments`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if ((response as ApiResponseWithError<{ data: WeekDayComment }>).error) throw new Error((response as ApiResponseWithError<{ data: WeekDayComment }>).error);
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['week-comments', weekId] });
    },
  });
};

export const useWeekComments = (weekId?: string) => {
  return useQuery<WeekDayComment[]>({
    queryKey: ['week-comments', weekId],
    queryFn: async () => {
      if (!weekId) return [];
      const response = await apiRequest<WeekDayComment[]>(`/weeks/${weekId}/comments`);
      if ((response as ApiResponseWithError<WeekDayComment[]>).error) throw new Error((response as ApiResponseWithError<WeekDayComment[]>).error);
      return response.data || [];
    },
    enabled: !!weekId,
  });
};