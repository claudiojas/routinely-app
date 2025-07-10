import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tempo de cache padrão (5 minutos)
      staleTime: 5 * 60 * 1000,
      // Tempo de cache em background (10 minutos)
      gcTime: 10 * 60 * 1000,
      // Retry automático em caso de erro
      retry: (failureCount, error) => {
        // Não retry em erros 4xx (exceto 408, 429)
        if (error instanceof Error && 'status' in error) {
          const status = (error as Error & { status?: number }).status
          if (status && status >= 400 && status < 500 && status !== 408 && status !== 429) {
            return false
          }
        }
        // Máximo 3 tentativas
        return failureCount < 3
      },
      // Refetch em foco da janela
      refetchOnWindowFocus: false,
      // Refetch em reconexão
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry para mutations
      retry: 1,
    },
  },
})

// Função para invalidar queries relacionadas
export const invalidateQueries = {
  // Agenda semanal
  weeklySchedule: () => queryClient.invalidateQueries({ queryKey: ['weeklySchedule'] }),
  weeklyScheduleByDay: (dayOfWeek?: string) => 
    queryClient.invalidateQueries({ queryKey: ['weeklySchedule', 'byDay', dayOfWeek] }),
  
  // Tarefas
  tasks: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  tasksByDate: (date?: string) => 
    queryClient.invalidateQueries({ queryKey: ['tasks', 'byDate', date] }),
  
  // Notas
  notes: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  notesByDate: (date?: string) => 
    queryClient.invalidateQueries({ queryKey: ['notes', 'byDate', date] }),
  
  // Usuário
  user: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
  userProfile: () => queryClient.invalidateQueries({ queryKey: ['user', 'profile'] }),
} 