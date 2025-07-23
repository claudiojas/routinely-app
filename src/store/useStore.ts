import { create } from 'zustand';
import { Task, Note, WeeklyScheduleItem as BaseWeeklyScheduleItem, TimeBlock, Store } from '../types/api';
// Tipo para compatibilidade
type WeeklyScheduleItem = BaseWeeklyScheduleItem & { isActive?: boolean; activity?: string; dayOfWeek?: string; notes?: string };

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useStore = create<Store>((set, get) => ({
  selectedDate: getCurrentDate(),
  
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  getWeeklyProgress: (tasks) => {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    
    const weekTasks = tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate >= weekStart;
    });
    
    if (weekTasks.length === 0) return 0;
    
    const completedTasks = weekTasks.filter(task => task.completed);
    return Math.round((completedTasks.length / weekTasks.length) * 100);
  },

  getTodayScheduleItems: (weeklySchedule, date) => {
    const dayOfWeek = (() => {
      const dateObj = new Date(date + 'T12:00:00');
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      return days[dateObj.getDay()];
    })();

    return weeklySchedule
      .filter(item => item.dayOfWeek === dayOfWeek && item.isActive)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  },
}));
