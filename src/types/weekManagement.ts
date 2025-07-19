export interface Week {
  id: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isCompleted: boolean;
  weekNumber: number;
}

export interface WeekDay {
  date: Date;
  dayOfWeek: string;
  isToday: boolean;
  isCurrentWeek: boolean;
  isPastWeek: boolean;
}

export interface WeekManagementState {
  weeks: Week[];
  currentWeekIndex: number;
  maxWeeks: number;
}

export interface FinalizeWeekRequest {
  weekId: string;
  completedAt: Date;
} 