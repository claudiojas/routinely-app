import { useState, useEffect, useMemo } from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, isSameWeek, isToday, isSaturday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Week, WeekDay, WeekManagementState } from '../types/weekManagement';

const MAX_WEEKS = 4;

export const useWeekManagement = () => {
  const [state, setState] = useState<WeekManagementState>({
    weeks: [],
    currentWeekIndex: 0,
    maxWeeks: MAX_WEEKS,
  });

  // Gerar semanas iniciais
  useEffect(() => {
    const today = new Date();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 }); // Domingo
    
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
  }, []);

  // Verificar se deve mostrar botão "Finalizar Semana"
  const shouldShowFinalizeButton = useMemo(() => {
    const today = new Date();
    const currentWeek = state.weeks.find(week => week.isActive);
    
    if (!currentWeek) return false;
    
    // Só mostra aos sábados e se a semana atual contém hoje
    return isSaturday(today) && isSameWeek(today, currentWeek.startDate, { weekStartsOn: 0 });
  }, [state.weeks]);

  // Finalizar semana atual
  const finalizeCurrentWeek = () => {
    setState(prev => {
      const updatedWeeks = [...prev.weeks];
      
      // Marcar semana atual como finalizada
      const currentWeekIndex = updatedWeeks.findIndex(week => week.isActive);
      if (currentWeekIndex !== -1) {
        updatedWeeks[currentWeekIndex] = {
          ...updatedWeeks[currentWeekIndex],
          isActive: false,
          isCompleted: true,
        };
      }

      // Criar nova semana
      const lastWeekStart = updatedWeeks[0].startDate;
      const newWeekStart = addWeeks(lastWeekStart, 1);
      
      const newWeek: Week = {
        id: `week-${format(newWeekStart, 'yyyy-MM-dd')}`,
        startDate: newWeekStart,
        endDate: endOfWeek(newWeekStart, { weekStartsOn: 0 }),
        isActive: true,
        isCompleted: false,
        weekNumber: 1,
      };

      // Adicionar nova semana no início
      updatedWeeks.unshift(newWeek);

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
    weeks: state.weeks,
    activeWeek: getActiveWeek(),
    completedWeeks: getCompletedWeeks(),
    shouldShowFinalizeButton,
    finalizeCurrentWeek,
    getWeekDays,
    maxWeeks: MAX_WEEKS,
  };
}; 