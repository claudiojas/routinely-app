import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isAuthenticated } from './useApi';

// Tipos específicos para semanas (isolados dos tipos existentes)
export interface WeekData {
  id: string;
  userId: string;
  startDate: string; // ISO DateTime
  endDate: string;   // ISO DateTime
  isActive: boolean;
  isCompleted: boolean;
  weekNumber: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface CreateWeekData {
  startDate: string; // ISO DateTime
  endDate: string;   // ISO DateTime
  weekNumber: number;
}

// Configuração isolada da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Função isolada para requisições de semanas
async function weekApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  try {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Só adicionar Content-Type se não for DELETE
    if (options.method !== 'DELETE') {
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

// Hook para buscar semanas do backend
export const useWeeksFromBackend = () => {
  return useQuery({
    queryKey: ['weeks-backend'],
    queryFn: async () => {
      const response = await weekApiRequest<WeekData[]>('/api/weeks');
      if (response.error) throw new Error(response.error);
      return response.data || [];
    },
    enabled: isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para criar semana no backend
export const useCreateWeekInBackend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateWeekData) => {
      const response = await weekApiRequest<WeekData>('/api/weeks', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (response.error) throw new Error(response.error);
      return response.data!;
    },
    onSuccess: () => {
      // Invalidate apenas queries de semanas do backend
      queryClient.invalidateQueries({ queryKey: ['weeks-backend'] });
      queryClient.invalidateQueries({ queryKey: ['completed-weeks-backend'] });
    },
  });
};

// Hook para finalizar semana no backend
export const useCompleteWeekInBackend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (weekId: string) => {
      const response = await weekApiRequest<WeekData>(`/api/weeks/${weekId}/complete`, {
        method: 'PATCH',
      });
      if (response.error) throw new Error(response.error);
      return response.data!;
    },
    onSuccess: () => {
      // Invalidate apenas queries de semanas do backend
      queryClient.invalidateQueries({ queryKey: ['weeks-backend'] });
      queryClient.invalidateQueries({ queryKey: ['completed-weeks-backend'] });
    },
  });
};

// Hook para buscar semanas finalizadas do backend
export const useCompletedWeeksFromBackend = (limit: number = 4) => {
  return useQuery({
    queryKey: ['completed-weeks-backend', limit],
    queryFn: async () => {
      const response = await weekApiRequest<WeekData[]>(`/api/weeks/completed?limit=${limit}`);
      if (response.error) throw new Error(response.error);
      return response.data || [];
    },
    enabled: isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para verificar semanas expiradas no backend
export const useCheckExpiredWeeksInBackend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await weekApiRequest<{ finalized: number; weeks: WeekData[] }>(
        '/api/weeks/check-expired'
      );
      if (response.error) throw new Error(response.error);
      return response.data!;
    },
    onSuccess: () => {
      // Invalidate apenas queries de semanas do backend
      queryClient.invalidateQueries({ queryKey: ['weeks-backend'] });
      queryClient.invalidateQueries({ queryKey: ['completed-weeks-backend'] });
    },
  });
}; 