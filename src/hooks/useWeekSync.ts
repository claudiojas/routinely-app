import { useEffect } from 'react';
import { useWeeksFromBackend, useCreateWeekInBackend, useCompleteWeekInBackend, WeekData, CreateWeekData } from './useWeekPersistence';

/**
 * Hook para sincronizar o estado local de semanas com o backend.
 * Não afeta hooks existentes. Pode ser usado de forma opcional em componentes que desejam persistência real.
 */
export const useWeekSync = (localWeeks: WeekData[], setLocalWeeks: (weeks: WeekData[]) => void) => {
  // Buscar semanas do backend
  const { data: backendWeeks = [], isLoading, error, refetch } = useWeeksFromBackend();
  const createWeek = useCreateWeekInBackend();
  const completeWeek = useCompleteWeekInBackend();

  // Sincronizar local com backend ao carregar
  useEffect(() => {
    if (!isLoading && backendWeeks.length > 0) {
      setLocalWeeks(backendWeeks);
    }
  }, [backendWeeks, isLoading, setLocalWeeks]);

  // Função para criar semana no backend e sincronizar local
  const createAndSyncWeek = async (data: CreateWeekData) => {
    await createWeek.mutateAsync(data);
    await refetch();
  };

  // Função para finalizar semana no backend e sincronizar local
  const completeAndSyncWeek = async (weekId: string) => {
    await completeWeek.mutateAsync(weekId);
    await refetch();
  };

  return {
    backendWeeks,
    isLoading,
    error,
    createAndSyncWeek,
    completeAndSyncWeek,
    refetchWeeks: refetch,
  };
}; 