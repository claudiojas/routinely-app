import { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, isSameWeek, isToday, isSaturday, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Week, WeekDay, WeekManagementState } from '../types/weekManagement';
import { useWeeksFromBackend, useCreateWeekInBackend, useCompleteWeekInBackend, WeekData as BackendWeekData, CreateWeekData } from './useWeekPersistence';
import { useWeekBackup } from './useWeekBackup';

const MAX_WEEKS = 4;

/**
 * Hook que adiciona persistência ao sistema de semanas existente.
 * Mantém total compatibilidade com useWeekManagement.
 * Pode ser usado como alternativa opcional.
 */
export const useWeekPersistenceManager = () => {
  // Estado local (compatível com useWeekManagement)
  const [state, setState] = useState<WeekManagementState>({
    weeks: [],
    currentWeekIndex: 0,
    maxWeeks: MAX_WEEKS,
  });

  // Hooks de persistência
  const { data: backendWeeks = [], isLoading, error, refetch } = useWeeksFromBackend();
  const createWeek = useCreateWeekInBackend();
  const completeWeek = useCompleteWeekInBackend();
  
  // Backup local
  const { backupWeeks, addBackupWeek, completeBackupWeek, resetBackupWeeks } = useWeekBackup();

  // Converter dados do backend para formato local
  const convertBackendToLocal = useCallback((backendWeek: BackendWeekData): Week => ({
    id: backendWeek.id,
    startDate: new Date(backendWeek.startDate),
    endDate: new Date(backendWeek.endDate),
    isActive: backendWeek.isActive,
    isCompleted: backendWeek.isCompleted,
    weekNumber: backendWeek.weekNumber,
  }), []);

  // Converter dados locais para formato do backend
  const convertLocalToBackend = useCallback((localWeek: Week): CreateWeekData => ({
    startDate: localWeek.startDate.toISOString(),
    endDate: localWeek.endDate.toISOString(),
    weekNumber: localWeek.weekNumber,
  }), []);

  // Sincronizar com backend quando disponível
  useEffect(() => {
    if (!isLoading && backendWeeks.length > 0) {
      const localWeeks = backendWeeks.map(convertBackendToLocal);
      setState(prev => ({
        ...prev,
        weeks: localWeeks,
      }));
    }
  }, [backendWeeks, isLoading, convertBackendToLocal]);

  // Fallback para dados locais se backend não estiver disponível
  useEffect(() => {
    if (!isLoading && backendWeeks.length === 0 && backupWeeks.length > 0) {
      const localWeeks = backupWeeks.map(convertBackendToLocal);
      setState(prev => ({
        ...prev,
        weeks: localWeeks,
      }));
    }
  }, [backupWeeks, isLoading, backendWeeks.length, convertBackendToLocal]);

  // Gerar semanas iniciais se não houver dados
  useEffect(() => {
    if (!isLoading && state.weeks.length === 0 && backupWeeks.length === 0) {
      const today = new Date();
      const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });
      
      const initialWeeks: Week[] = [];
      
      // Semana atual
      initialWeeks.push({
        id: `week-${format(currentWeekStart, 'yyyy-MM-dd')}`,
        startDate: currentWeekStart,
        endDate: endOfWeek(currentWeekStart, { weekStartsOn: 0 }),
        isActive: true,
        isCompleted: false,
        weekNumber: 1,
      });

      // 3 semanas anteriores
      for (let i = 1; i <= 3; i++) {
        const weekStart = addWeeks(currentWeekStart, -i);
        initialWeeks.push({
          id: `week-${format(weekStart, 'yyyy-MM-dd')}`,
          startDate: weekStart,
          endDate: endOfWeek(weekStart, { weekStartsOn: 0 }),
          isActive: false,
          isCompleted: true,
          weekNumber: i + 1,
        });
      }

      setState(prev => ({
        ...prev,
        weeks: initialWeeks,
      }));
    }
  }, [isLoading, state.weeks.length, backupWeeks.length]);

  // Verificar automaticamente se a semana atual expirou
  useEffect(() => {
    const checkExpiredWeek = () => {
      const today = new Date();
      const activeWeek = state.weeks.find(week => week.isActive);
      
      if (activeWeek && isAfter(today, activeWeek.endDate)) {
        finalizeCurrentWeek();
      }
    };

    const interval = setInterval(checkExpiredWeek, 60 * 60 * 1000);
    checkExpiredWeek();

    return () => clearInterval(interval);
  }, [state.weeks]);

  // Verificar se deve mostrar botão "Finalizar Semana"
  const shouldShowFinalizeButton = state.weeks.some(week => {
    const today = new Date();
    return week.isActive && isSaturday(today) && isSameWeek(today, week.startDate, { weekStartsOn: 0 });
  });

  // Verificar se pode iniciar nova semana
  const canStartNewWeek = state.weeks.some(week => 
    week.isActive && !week.isCompleted
  );

  // Iniciar nova semana com persistência
  const startNewWeek = async () => {
    const activeWeek = state.weeks.find(week => week.isActive);
    
    if (!activeWeek) return;
    
    // Criar nova semana localmente
    const newWeekStart = addWeeks(activeWeek.startDate, 1);
    const newWeek: Week = {
      id: `week-${format(newWeekStart, 'yyyy-MM-dd')}`,
      startDate: newWeekStart,
      endDate: endOfWeek(newWeekStart, { weekStartsOn: 0 }),
      isActive: true,
      isCompleted: false,
      weekNumber: 1,
    };

    // Atualizar estado local
    setState(prev => {
      const updatedWeeks = [newWeek, ...prev.weeks];
      
      // Atualizar números das semanas
      updatedWeeks.forEach((week, index) => {
        week.weekNumber = index + 1;
      });

      // Remover semana mais antiga se exceder o limite
      if (updatedWeeks.length > MAX_WEEKS) {
        updatedWeeks.pop();
      }

      return {
        ...prev,
        weeks: updatedWeeks,
        currentWeekIndex: 0,
      };
    });

    // Tentar persistir no backend
    try {
      const backendData = convertLocalToBackend(newWeek);
      await createWeek.mutateAsync(backendData);
      await refetch();
    } catch (error) {
      // Se falhar, salvar no backup local
      addBackupWeek({
        id: newWeek.id,
        userId: 'local',
        startDate: newWeek.startDate.toISOString(),
        endDate: newWeek.endDate.toISOString(),
        isActive: newWeek.isActive,
        isCompleted: newWeek.isCompleted,
        weekNumber: newWeek.weekNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: null,
      });
    }
  };

  // Finalizar semana atual com persistência
  const finalizeCurrentWeek = async () => {
    const currentWeek = state.weeks.find(week => week.isActive);
    
    if (!currentWeek) return;

    // Atualizar estado local
    setState(prev => {
      const updatedWeeks = prev.weeks.map(week => 
        week.isActive 
          ? { ...week, isActive: false, isCompleted: true }
          : week
      );

      // Atualizar números das semanas
      updatedWeeks.forEach((week, index) => {
        week.weekNumber = index + 1;
      });

      return {
        ...prev,
        weeks: updatedWeeks,
        currentWeekIndex: 0,
      };
    });

    // Tentar persistir no backend
    try {
      await completeWeek.mutateAsync(currentWeek.id);
      await refetch();
    } catch (error) {
      // Se falhar, salvar no backup local
      completeBackupWeek(currentWeek.id);
    }
  };

  // Gerar dias da semana para uma semana específica
  const getWeekDays = (week: Week): WeekDay[] => {
    const days: WeekDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(week.startDate);
      date.setDate(date.getDate() + i);
      
      days.push({
        date,
        dayOfWeek: format(date, 'EEE', { locale: ptBR }),
        isToday: isToday(date),
        isCurrentWeek: week.isActive,
        isPastWeek: !week.isActive,
      });
    }
    
    return days;
  };

  // Obter semana ativa
  const getActiveWeek = () => state.weeks.find(week => week.isActive);

  // Obter semanas finalizadas
  const getCompletedWeeks = () => state.weeks.filter(week => week.isCompleted);

  return {
    // Dados compatíveis com useWeekManagement
    weeks: state.weeks,
    activeWeek: getActiveWeek(),
    completedWeeks: getCompletedWeeks(),
    shouldShowFinalizeButton,
    canStartNewWeek,
    finalizeCurrentWeek,
    startNewWeek,
    getWeekDays,
    maxWeeks: MAX_WEEKS,
    
    // Dados adicionais de persistência
    isLoading,
    error,
    hasBackendData: backendWeeks.length > 0,
    hasBackupData: backupWeeks.length > 0,
    refetchWeeks: refetch,
    resetBackup: resetBackupWeeks,
  };
}; 