import { useState, useCallback } from 'react';
import { WeekData } from './useWeekPersistence';

/**
 * Hook para fallback local de semanas caso o backend esteja indisponível.
 * Não afeta hooks existentes. Pode ser usado em conjunto com useWeekSync.
 */
export const useWeekBackup = (initialWeeks: WeekData[] = []) => {
  const [backupWeeks, setBackupWeeks] = useState<WeekData[]>(initialWeeks);

  // Adicionar semana localmente
  const addBackupWeek = useCallback((week: WeekData) => {
    setBackupWeeks((prev) => [week, ...prev]);
  }, []);

  // Finalizar semana localmente
  const completeBackupWeek = useCallback((weekId: string) => {
    setBackupWeeks((prev) =>
      prev.map((w) =>
        w.id === weekId ? { ...w, isActive: false, isCompleted: true, completedAt: new Date().toISOString() } : w
      )
    );
  }, []);

  // Resetar backup
  const resetBackupWeeks = useCallback(() => {
    setBackupWeeks([]);
  }, []);

  return {
    backupWeeks,
    setBackupWeeks,
    addBackupWeek,
    completeBackupWeek,
    resetBackupWeeks,
  };
}; 