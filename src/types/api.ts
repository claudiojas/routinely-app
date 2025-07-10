// Tipos base para APIs
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  status: number
  code?: string
}

// Tipos para usuário
export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
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

// Tipos para agenda semanal (já existentes, mas organizados)
export interface WeeklyScheduleItem {
  id: string
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  startTime: string
  endTime: string
  activity: string
  notes: string
  type: 'study' | 'exercise' | 'work' | 'personal' | 'other'
  isActive: boolean
  completed?: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateWeeklyScheduleRequest {
  dayOfWeek: WeeklyScheduleItem['dayOfWeek']
  startTime: string
  endTime: string
  activity: string
  notes: string
  type: WeeklyScheduleItem['type']
  isActive?: boolean
}

export interface UpdateWeeklyScheduleRequest extends Partial<CreateWeeklyScheduleRequest> {
  completed?: boolean
}

// Tipos para tarefas
export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  date: string
  type: 'study' | 'exercise' | 'work' | 'personal' | 'other'
  isGoogleSynced?: boolean
  createdAt: string
  updatedAt: string
  notes?: string
  userId: string
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

// Tipos para notas
export interface Note {
  id: string
  content: string
  date: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface CreateNoteRequest {
  content: string
  date: string
}

export interface UpdateNoteRequest {
  content: string
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
  dayOfWeek?: WeeklyScheduleItem['dayOfWeek']
  type?: WeeklyScheduleItem['type']
  isActive?: boolean
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