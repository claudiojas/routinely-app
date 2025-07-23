import { useWeeks, useCreateWeek, useDeleteWeek } from './useApi';
import { useMemo } from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, isSameWeek, isToday, isSaturday, isAfter, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Week, WeekDay, WeekManagementState } from '../types/api';

const MAX_WEEKS = 4;

export const useWeekManagement = (): WeekManagementState & {
  shouldShowFinalizeButton: boolean;
  canStartNewWeek: boolean;
  finalizeCurrentWeek: () => void;
  startNewWeek: () => Promise<void>;
  getWeekDays: (week: Week) => WeekDay[];
  isLoading: boolean;
  deleteWeek: (id: string) => Promise<void>;
} => {
  const { data: weeks = [], isLoading: isLoadingWeeks } = useWeeks();
  const createWeek = useCreateWeek();
  const deleteWeekMutation = useDeleteWeek();

  // Obter semana ativa
  const activeWeek = useMemo(() => weeks.find(week => week.isActive), [weeks]);

  // Verificar se deve mostrar botão "Finalizar Semana"
  const shouldShowFinalizeButton = useMemo(() => {
    const today = new Date();
    const currentWeek = weeks.find(week => week.isActive);
    if (!currentWeek) return false;
    return isSaturday(today) && isSameWeek(today, parseISO(currentWeek.startDate), { weekStartsOn: 0 });
  }, [weeks]);

  // Verificar se pode iniciar nova semana (permitir várias semanas ativas)
  const canStartNewWeek = useMemo(() => true, [weeks]);

  // Iniciar nova semana
  const startNewWeek = async () => {
    // Basear nova semana na última semana ativa ou na semana atual
    let baseDate = new Date();
    const lastActive = weeks.find(week => week.isActive);
    if (lastActive) {
      baseDate = parseISO(lastActive.startDate);
      baseDate = addWeeks(baseDate, 1);
    } else if (weeks.length > 0) {
      // Se não houver semana ativa, pegar a mais recente
      const sorted = [...weeks].sort((a, b) => parseISO(b.startDate).getTime() - parseISO(a.startDate).getTime());
      baseDate = addWeeks(parseISO(sorted[0].startDate), 1);
    }
    const startDate = startOfWeek(baseDate, { weekStartsOn: 0 });
    const endDate = endOfWeek(startDate, { weekStartsOn: 0 });
    const weekNumber = weeks.length > 0 ? Math.max(...weeks.map(w => w.weekNumber)) + 1 : 1;
    await createWeek.mutateAsync({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      weekNumber,
    });
  };

  // Gerar dias da semana para uma semana específica
  const getWeekDays = (week: Week): WeekDay[] => {
    const days: WeekDay[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(parseISO(week.startDate));
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

  // Finalizar semana atual (NÃO cria nova semana automaticamente)
  // (Implementação futura: PATCH /weeks/:id/complete)
  const finalizeCurrentWeek = () => {
    // TODO: Implementar chamada PATCH /weeks/:id/complete
  };

  const deleteWeek = async (id: string) => {
    await deleteWeekMutation.mutateAsync(id);
  };

  return {
    weeks,
    activeWeek,
    shouldShowFinalizeButton,
    canStartNewWeek,
    finalizeCurrentWeek,
    startNewWeek,
    getWeekDays,
    maxWeeks: MAX_WEEKS,
    isLoading: isLoadingWeeks,
    deleteWeek,
  };
}; 