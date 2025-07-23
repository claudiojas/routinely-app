// Tipos base para APIs
export type ActivityType = 'PESSOAL' | 'TRABALHO' | 'ESTUDO' | 'SAUDE' | 'OUTRO';
export type CreateActivityRequest = {
  title: string;
  description?: string;
  type: ActivityType;
  startTime: string;
  endTime: string;
  date: string; // formato YYYY-MM-DD
};
export type WeeklyScheduleItem = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: ActivityType;
  completed?: boolean;
  description?: string;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  status: number
  code?: string
}

// Usuário
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    theme: 'light' | 'dark' | 'auto';
    language: 'pt-BR' | 'en-US' | 'es';
    notifications: boolean;
    timezone?: string;
    dateFormat?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}


export interface CreateWeeklyScheduleRequest {
  startTime: string
  endTime: string
  activity: string
  notes: string
  type: WeeklyScheduleItem['type']
  date: string // formato YYYY-MM-DD
  isActive?: boolean
}

export interface UpdateWeeklyScheduleRequest extends Partial<CreateWeeklyScheduleRequest> {
  completed?: boolean
}

export interface UpdateActivityRequest {
  title?: string;
  description?: string;
  type?: 'PESSOAL' | 'TRABALHO' | 'ESTUDO' | 'SAUDE' | 'OUTRO';
  startTime?: string;
  endTime?: string;
  date: string; // ⚠️ OBRIGATÓRIO - formato YYYY-MM-DD
}

// Task
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  date: string;
  type: 'study' | 'exercise' | 'work' | 'personal' | 'other';
  isGoogleSynced?: boolean;
  createdAt: string;
  notes?: string;
}

export interface CreateTaskRequest {
  title: string
  description?: string
  date: string
  type: Task['type']
  notes?: string
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  completed?: boolean
  isGoogleSynced?: boolean
}

// Note
export interface Note {
  id: string;
  content: string;
  date: string;
  createdAt: string;
}

export interface CreateNoteRequest {
  content: string
  date: string
}

export interface UpdateNoteRequest {
  content: string
}

// Week
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

// Tipos para paginação
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Tipos para filtros
export interface TaskFilters extends PaginationParams {
  date?: string
  type?: Task['type']
  completed?: boolean
  search?: string
}

export interface WeeklyScheduleFilters {
  date?: string;
  type?: WeeklyScheduleItem['type'];
  isActive?: boolean;
}

// Tipos para Google Calendar
export interface GoogleCalendarEvent {
  id: string
  summary: string
  description?: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  location?: string
  attendees?: Array<{
    email: string
    displayName?: string
  }>
}

export interface GoogleCalendarSyncRequest {
  events: GoogleCalendarEvent[]
  syncDirection: 'import' | 'export' | 'bidirectional'
}

// Tipos para analytics
export interface AnalyticsData {
  totalTasks: number
  completedTasks: number
  completionRate: number
  weeklyProgress: number
  mostProductiveDay: string
  averageTasksPerDay: number
}

// Tipos para notificações
export interface Notification {
  id: string
  title: string
  body: string
  type: 'task' | 'reminder' | 'progress' | 'system'
  read: boolean
  createdAt: string
  scheduledFor?: string
}

export interface CreateNotificationRequest {
  title: string
  body: string
  type: Notification['type']
  scheduledFor?: string
}

export interface WeekDayComment {
  id: string;
  weekId: string;
  dayOfWeek: number; // 0=Domingo, ... 6=Sábado
  comment: string;
  createdAt: string;
  updatedAt: string;
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
  activeWeek?: Week;
}

export interface FinalizeWeekRequest {
  weekId: string;
  completedAt: Date;
}

export interface TimeBlock {
  id: string;
  title: string;
  type: 'study' | 'exercise' | 'work' | 'personal' | 'other';
  day: string;
  startTime: string;
  endTime: string;
  isGoogleSynced?: boolean;
}

export interface Store {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  getWeeklyProgress: (tasks: Task[]) => number;
  getTodayScheduleItems: (weeklySchedule: WeeklyScheduleItem[], date: string) => WeeklyScheduleItem[];
}

export interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isLoading?: boolean;
} 