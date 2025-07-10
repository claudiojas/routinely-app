// Serviço de API centralizado para toda a aplicação
import {
  WeeklyScheduleItem,
  CreateScheduleItemRequest,
  UpdateScheduleItemRequest,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TimeBlock,
  CreateTimeBlockRequest,
  UpdateTimeBlockRequest,
  Note,
  CreateNoteRequest,
  UpdateNoteRequest,
  User,
  LoginRequest,
  SignUpRequest,
  AuthResponse,
  GoogleCalendarEvent,
  GoogleCalendarSyncRequest,
  AnalyticsData,
  WeeklyStats,
  MonthlyStats,
  ApiResponse,
  PaginatedResponse,
  ScheduleFilters,
  TaskFilters,
  NoteFilters,
  ApiError,
} from '../types/api';

// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 10000; // 10 segundos

// Classe para gerenciar tokens de autenticação
class AuthTokenManager {
  private static instance: AuthTokenManager;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    // Recuperar tokens do localStorage
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  static getInstance(): AuthTokenManager {
    if (!AuthTokenManager.instance) {
      AuthTokenManager.instance = new AuthTokenManager();
    }
    return AuthTokenManager.instance;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

// Classe principal da API
class ApiService {
  private tokenManager: AuthTokenManager;

  constructor() {
    this.tokenManager = AuthTokenManager.getInstance();
  }

  // Método base para fazer requisições HTTP
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.tokenManager.getAccessToken();

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    // Adicionar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Se receber 401, tentar refresh token
      if (response.status === 401 && this.tokenManager.getRefreshToken()) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Re-tentar a requisição original
          return this.request(endpoint, options);
        }
      }

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
          code: `HTTP_${response.status}`,
        }));
        throw new Error(errorData.message);
      }

      const data: ApiResponse<T> = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw new Error('Erro desconhecido na API');
    }
  }

  // Refresh do token de acesso
  private async refreshAccessToken(): Promise<boolean> {
    try {
      const refreshToken = this.tokenManager.getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data: AuthResponse = await response.json();
        this.tokenManager.setTokens(data.accessToken, data.refreshToken);
        return true;
      }
    } catch (error) {
      console.error('Erro ao renovar token:', error);
    }

    // Se falhar, limpar tokens
    this.tokenManager.clearTokens();
    return false;
  }

  // ===== AUTENTICAÇÃO =====
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data) {
      this.tokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    
    return response.data;
  }

  async signUp(userData: SignUpRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data) {
      this.tokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      this.tokenManager.clearTokens();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>('/auth/me');
    return response.data;
  }

  // ===== AGENDA SEMANAL =====
  async getWeeklySchedule(filters?: ScheduleFilters): Promise<WeeklyScheduleItem[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }

    const response = await this.request<WeeklyScheduleItem[]>(
      `/weekly-schedule${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  }

  async getScheduleByDay(dayOfWeek: WeeklyScheduleItem['dayOfWeek']): Promise<WeeklyScheduleItem[]> {
    const response = await this.request<WeeklyScheduleItem[]>(`/weekly-schedule/day/${dayOfWeek}`);
    return response.data;
  }

  async createScheduleItem(item: CreateScheduleItemRequest): Promise<WeeklyScheduleItem> {
    const response = await this.request<WeeklyScheduleItem>('/weekly-schedule', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return response.data;
  }

  async updateScheduleItem(id: string, updates: UpdateScheduleItemRequest): Promise<WeeklyScheduleItem> {
    const response = await this.request<WeeklyScheduleItem>(`/weekly-schedule/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async deleteScheduleItem(id: string): Promise<void> {
    await this.request(`/weekly-schedule/${id}`, { method: 'DELETE' });
  }

  // ===== TAREFAS =====
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }

    const response = await this.request<Task[]>(
      `/tasks${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  }

  async getTasksByDate(date: string): Promise<Task[]> {
    const response = await this.request<Task[]>(`/tasks/date/${date}`);
    return response.data;
  }

  async createTask(task: CreateTaskRequest): Promise<Task> {
    const response = await this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
    return response.data;
  }

  async updateTask(id: string, updates: UpdateTaskRequest): Promise<Task> {
    const response = await this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await this.request(`/tasks/${id}`, { method: 'DELETE' });
  }

  async toggleTask(id: string): Promise<Task> {
    const response = await this.request<Task>(`/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    return response.data;
  }

  // ===== BLOCO DE TEMPO =====
  async getTimeBlocks(filters?: { day?: string; type?: TimeBlock['type'] }): Promise<TimeBlock[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }

    const response = await this.request<TimeBlock[]>(
      `/time-blocks${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  }

  async createTimeBlock(block: CreateTimeBlockRequest): Promise<TimeBlock> {
    const response = await this.request<TimeBlock>('/time-blocks', {
      method: 'POST',
      body: JSON.stringify(block),
    });
    return response.data;
  }

  async updateTimeBlock(id: string, updates: UpdateTimeBlockRequest): Promise<TimeBlock> {
    const response = await this.request<TimeBlock>(`/time-blocks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async deleteTimeBlock(id: string): Promise<void> {
    await this.request(`/time-blocks/${id}`, { method: 'DELETE' });
  }

  // ===== NOTAS =====
  async getNotes(filters?: NoteFilters): Promise<Note[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }

    const response = await this.request<Note[]>(
      `/notes${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  }

  async getNotesByDate(date: string): Promise<Note[]> {
    const response = await this.request<Note[]>(`/notes/date/${date}`);
    return response.data;
  }

  async createNote(note: CreateNoteRequest): Promise<Note> {
    const response = await this.request<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
    return response.data;
  }

  async updateNote(id: string, updates: UpdateNoteRequest): Promise<Note> {
    const response = await this.request<Note>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async deleteNote(id: string): Promise<void> {
    await this.request(`/notes/${id}`, { method: 'DELETE' });
  }

  // ===== GOOGLE CALENDAR =====
  async syncGoogleCalendar(syncRequest: GoogleCalendarSyncRequest): Promise<void> {
    await this.request('/google-calendar/sync', {
      method: 'POST',
      body: JSON.stringify(syncRequest),
    });
  }

  async getGoogleCalendarEvents(): Promise<GoogleCalendarEvent[]> {
    const response = await this.request<GoogleCalendarEvent[]>('/google-calendar/events');
    return response.data;
  }

  // ===== ANALYTICS =====
  async getAnalytics(): Promise<AnalyticsData> {
    const response = await this.request<AnalyticsData>('/analytics');
    return response.data;
  }

  async getWeeklyStats(): Promise<WeeklyStats> {
    const response = await this.request<WeeklyStats>('/analytics/weekly');
    return response.data;
  }

  async getMonthlyStats(): Promise<MonthlyStats> {
    const response = await this.request<MonthlyStats>('/analytics/monthly');
    return response.data;
  }

  // ===== USUÁRIO =====
  async updateUser(updates: { name?: string; avatar?: string; preferences?: unknown }): Promise<User> {
    const response = await this.request<User>('/user', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  // ===== UTILITÁRIOS =====
  isAuthenticated(): boolean {
    return this.tokenManager.isAuthenticated();
  }

  getAuthToken(): string | null {
    return this.tokenManager.getAccessToken();
  }
}

// Instância singleton da API
export const apiService = new ApiService();
export default apiService; 