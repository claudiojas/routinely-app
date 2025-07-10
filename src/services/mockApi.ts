// Mock da API que simula um backend real
import {
  WeeklyScheduleItem,
  CreateScheduleItemRequest,
  UpdateScheduleItemRequest,
  WeeklyTask,
  CreateWeeklyTaskRequest,
  UpdateWeeklyTaskRequest,
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
  ScheduleFilters,
  WeeklyTaskFilters,
  TaskFilters,
  NoteFilters,
  WeekInfo,
  DayInfo,
} from '../types/api';

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função para obter o início da semana atual
const getCurrentWeekStart = (): string => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Segunda = 0, Domingo = 6
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysToSubtract);
  return monday.toISOString().split('T')[0];
};

// Função para obter informações da semana
const getWeekInfo = (date: string = new Date().toISOString().split('T')[0]): WeekInfo => {
  const targetDate = new Date(date);
  const dayOfWeek = targetDate.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(targetDate);
  monday.setDate(targetDate.getDate() - daysToSubtract);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  const weekNumber = Math.ceil((monday.getTime() - new Date(monday.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  
  return {
    startDate: monday.toISOString().split('T')[0],
    endDate: sunday.toISOString().split('T')[0],
    weekNumber,
    year: monday.getFullYear(),
  };
};

// Função para obter informações do dia
const getDayInfo = (date: string): DayInfo => {
  const targetDate = new Date(date);
  const today = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  return {
    date,
    dayOfWeek: days[targetDate.getDay()] as WeeklyTask['dayOfWeek'],
    isToday: date === today.toISOString().split('T')[0],
    isWeekend: targetDate.getDay() === 0 || targetDate.getDay() === 6,
  };
};

// Dados mock persistentes (simula banco de dados)
class MockDatabase {
  private static instance: MockDatabase;
  
  // Dados em memória (simula tabelas do banco)
  private weeklySchedule: WeeklyScheduleItem[] = [
    {
      id: '1',
      dayOfWeek: 'monday',
      startTime: '05:00',
      endTime: '05:30',
      activity: '🌅 Despertar + higiene + café leve',
      notes: 'Momento de despertar tranquilo e preparar o corpo para o dia',
      type: 'personal',
      isActive: true,
      completed: false,
      userId: 'user1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      dayOfWeek: 'monday',
      startTime: '05:30',
      endTime: '07:00',
      activity: '🧠 Estudo de Inglês',
      notes: 'Foque em compreensão oral, leitura e fala. Use apps como Anki, Duolingo ou shadowing.',
      type: 'study',
      isActive: true,
      completed: false,
      userId: 'user1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      dayOfWeek: 'tuesday',
      startTime: '06:00',
      endTime: '07:00',
      activity: '💪 Exercício físico',
      notes: 'Treino de força ou cardio',
      type: 'exercise',
      isActive: true,
      completed: false,
      userId: 'user1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '4',
      dayOfWeek: 'wednesday',
      startTime: '08:00',
      endTime: '12:00',
      activity: '💼 Trabalho',
      notes: 'Foco em desenvolvimento e reuniões',
      type: 'work',
      isActive: true,
      completed: false,
      userId: 'user1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '5',
      dayOfWeek: 'thursday',
      startTime: '19:00',
      endTime: '20:00',
      activity: '📚 Leitura',
      notes: 'Ler livro técnico ou ficção',
      type: 'study',
      isActive: true,
      completed: false,
      userId: 'user1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  private weeklyTasks: WeeklyTask[] = [
    {
      id: '1',
      title: 'Revisar código do projeto',
      description: 'Fazer code review e refatorar se necessário',
      completed: false,
      dayOfWeek: 'monday',
      weekStartDate: getCurrentWeekStart(),
      priority: 'high',
      category: 'work',
      estimatedTime: 120,
      notes: 'Prioridade alta - deadline próxima',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Estudar React Query',
      description: 'Aprender sobre cache e invalidação',
      completed: true,
      dayOfWeek: 'monday',
      weekStartDate: getCurrentWeekStart(),
      priority: 'medium',
      category: 'study',
      estimatedTime: 90,
      notes: 'Muito útil para o projeto',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Fazer exercícios',
      description: 'Treino de força - pernas',
      completed: false,
      dayOfWeek: 'tuesday',
      weekStartDate: getCurrentWeekStart(),
      priority: 'medium',
      category: 'health',
      estimatedTime: 60,
      notes: 'Focar em agachamentos',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      title: 'Reunião com cliente',
      description: 'Apresentar progresso do projeto',
      completed: false,
      dayOfWeek: 'wednesday',
      weekStartDate: getCurrentWeekStart(),
      priority: 'high',
      category: 'work',
      estimatedTime: 60,
      notes: 'Preparar slides e demo',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      title: 'Ler livro técnico',
      description: 'Continuar leitura do Clean Code',
      completed: false,
      dayOfWeek: 'thursday',
      weekStartDate: getCurrentWeekStart(),
      priority: 'low',
      category: 'study',
      estimatedTime: 45,
      notes: 'Capítulo 5 - Nomes Significativos',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '6',
      title: 'Limpar casa',
      description: 'Organizar quarto e cozinha',
      completed: false,
      dayOfWeek: 'friday',
      weekStartDate: getCurrentWeekStart(),
      priority: 'medium',
      category: 'personal',
      estimatedTime: 90,
      notes: 'Incluir trocar lençóis',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '7',
      title: 'Planejar próxima semana',
      description: 'Definir metas e objetivos',
      completed: false,
      dayOfWeek: 'sunday',
      weekStartDate: getCurrentWeekStart(),
      priority: 'high',
      category: 'personal',
      estimatedTime: 30,
      notes: 'Usar método OKR',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  private tasks: Task[] = [
    {
      id: '1',
      title: 'Revisar código do projeto',
      description: 'Fazer code review e refatorar se necessário',
      completed: false,
      date: '2024-01-15',
      type: 'work',
      notes: 'Prioridade alta',
      userId: 'user1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      title: 'Estudar React Query',
      description: 'Aprender sobre cache e invalidação',
      completed: true,
      date: '2024-01-15',
      type: 'study',
      notes: 'Muito útil para o projeto',
      userId: 'user1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '3',
      title: 'Fazer exercícios',
      description: 'Treino de força - pernas',
      completed: false,
      date: '2024-01-15',
      type: 'exercise',
      notes: 'Focar em agachamentos',
      userId: 'user1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
  ];

  private notes: Note[] = [
    {
      id: '1',
      content: 'Lembrar de revisar o código do projeto',
      date: '2024-01-15',
      userId: 'user1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      content: 'Ideia: implementar sistema de notificações',
      date: '2024-01-15',
      userId: 'user1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
  ];

  private timeBlocks: TimeBlock[] = [
    {
      id: '1',
      title: 'Desenvolvimento',
      type: 'work',
      day: '2024-01-15',
      startTime: '09:00',
      endTime: '12:00',
      userId: 'user1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      title: 'Almoço',
      type: 'personal',
      day: '2024-01-15',
      startTime: '12:00',
      endTime: '13:00',
      userId: 'user1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
  ];

  private users: User[] = [
    {
      id: 'user1',
      email: 'usuario@exemplo.com',
      name: 'Usuário Exemplo',
      preferences: {
        theme: 'system',
        notifications: true,
        timezone: 'America/Sao_Paulo',
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  private currentUser: User | null = this.users[0];

  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  // Métodos para acessar dados
  getWeeklySchedule(userId: string = 'user1'): WeeklyScheduleItem[] {
    return this.weeklySchedule.filter(item => item.userId === userId);
  }

  getWeeklyTasks(userId: string = 'user1', weekStartDate?: string): WeeklyTask[] {
    const tasks = this.weeklyTasks.filter(task => task.userId === userId);
    if (weekStartDate) {
      return tasks.filter(task => task.weekStartDate === weekStartDate);
    }
    return tasks;
  }

  getTasks(userId: string = 'user1'): Task[] {
    return this.tasks.filter(task => task.userId === userId);
  }

  getNotes(userId: string = 'user1'): Note[] {
    return this.notes.filter(note => note.userId === userId);
  }

  getTimeBlocks(userId: string = 'user1'): TimeBlock[] {
    return this.timeBlocks.filter(block => block.userId === userId);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Métodos para modificar dados
  addWeeklyScheduleItem(item: WeeklyScheduleItem): void {
    this.weeklySchedule.push(item);
  }

  updateWeeklyScheduleItem(id: string, updates: Partial<WeeklyScheduleItem>): void {
    const index = this.weeklySchedule.findIndex(item => item.id === id);
    if (index !== -1) {
      this.weeklySchedule[index] = {
        ...this.weeklySchedule[index],
        ...updates,
        updatedAt: new Date(),
      };
    }
  }

  deleteWeeklyScheduleItem(id: string): void {
    this.weeklySchedule = this.weeklySchedule.filter(item => item.id !== id);
  }

  addWeeklyTask(task: WeeklyTask): void {
    this.weeklyTasks.push(task);
  }

  updateWeeklyTask(id: string, updates: Partial<WeeklyTask>): void {
    const index = this.weeklyTasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.weeklyTasks[index] = {
        ...this.weeklyTasks[index],
        ...updates,
        updatedAt: new Date(),
      };
    }
  }

  deleteWeeklyTask(id: string): void {
    this.weeklyTasks = this.weeklyTasks.filter(task => task.id !== id);
  }

  clearWeeklyTasks(weekStartDate: string): void {
    console.log('🔍 Debug clearWeeklyTasks:');
    console.log('  - weekStartDate recebido:', weekStartDate);
    console.log('  - Total de tarefas antes:', this.weeklyTasks.length);
    console.log('  - weekStartDates disponíveis:', [...new Set(this.weeklyTasks.map(t => t.weekStartDate))]);
    
    const tasksToRemove = this.weeklyTasks.filter(task => task.weekStartDate === weekStartDate);
    console.log('  - Tarefas encontradas para remover:', tasksToRemove.length);
    
    if (tasksToRemove.length === 0) {
      console.log('  - ⚠️ Nenhuma tarefa encontrada para a semana:', weekStartDate);
      return;
    }
    
    this.weeklyTasks = this.weeklyTasks.filter(task => task.weekStartDate !== weekStartDate);
    console.log('  - ✅ Tarefas removidas com sucesso. Restantes:', this.weeklyTasks.length);
  }

  addTask(task: Task): void {
    this.tasks.push(task);
  }

  updateTask(id: string, updates: Partial<Task>): void {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.tasks[index] = {
        ...this.tasks[index],
        ...updates,
        updatedAt: new Date(),
      };
    }
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  addNote(note: Note): void {
    this.notes.push(note);
  }

  updateNote(id: string, updates: Partial<Note>): void {
    const index = this.notes.findIndex(note => note.id === id);
    if (index !== -1) {
      this.notes[index] = {
        ...this.notes[index],
        ...updates,
        updatedAt: new Date(),
      };
    }
  }

  deleteNote(id: string): void {
    this.notes = this.notes.filter(note => note.id !== id);
  }

  addTimeBlock(block: TimeBlock): void {
    this.timeBlocks.push(block);
  }

  updateTimeBlock(id: string, updates: Partial<TimeBlock>): void {
    const index = this.timeBlocks.findIndex(block => block.id === id);
    if (index !== -1) {
      this.timeBlocks[index] = {
        ...this.timeBlocks[index],
        ...updates,
        updatedAt: new Date(),
      };
    }
  }

  deleteTimeBlock(id: string): void {
    this.timeBlocks = this.timeBlocks.filter(block => block.id !== id);
  }
}

// Mock da API que simula o serviço real
class MockApiService {
  private db: MockDatabase;

  constructor() {
    this.db = MockDatabase.getInstance();
  }

  // ===== AUTENTICAÇÃO =====
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    await delay(800);
    
    const user = this.db.getCurrentUser();
    if (!user || credentials.email !== user.email) {
      throw new Error('Credenciais inválidas');
    }

    return {
      user,
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
  }

  async signUp(userData: SignUpRequest): Promise<AuthResponse> {
    await delay(1000);
    
    const newUser: User = {
      id: 'user' + Date.now(),
      email: userData.email,
      name: userData.name,
      preferences: {
        theme: 'system',
        notifications: true,
        timezone: 'America/Sao_Paulo',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      user: newUser,
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
  }

  async getCurrentUser(): Promise<User> {
    await delay(300);
    const user = this.db.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');
    return user;
  }

  // ===== TAREFAS SEMANAIS =====
  async getWeeklyTasks(filters?: WeeklyTaskFilters): Promise<WeeklyTask[]> {
    await delay(500);
    let tasks = this.db.getWeeklyTasks(filters?.userId, filters?.weekStartDate);

    if (filters?.dayOfWeek) {
      tasks = tasks.filter(task => task.dayOfWeek === filters.dayOfWeek);
    }
    if (filters?.completed !== undefined) {
      tasks = tasks.filter(task => task.completed === filters.completed);
    }
    if (filters?.priority) {
      tasks = tasks.filter(task => task.priority === filters.priority);
    }
    if (filters?.category) {
      tasks = tasks.filter(task => task.category === filters.category);
    }

    return tasks;
  }

  async getWeeklyTasksByDay(dayOfWeek: WeeklyTask['dayOfWeek'], weekStartDate?: string): Promise<WeeklyTask[]> {
    await delay(200);
    const currentWeek = weekStartDate || getCurrentWeekStart();
    return this.db.getWeeklyTasks().filter(
      task => task.dayOfWeek === dayOfWeek && task.weekStartDate === currentWeek
    );
  }

  async createWeeklyTask(task: CreateWeeklyTaskRequest): Promise<WeeklyTask> {
    await delay(300);
    
    const newTask: WeeklyTask = {
      id: Date.now().toString(),
      ...task,
      completed: false,
      priority: task.priority || 'medium',
      category: task.category || 'other',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.db.addWeeklyTask(newTask);
    return newTask;
  }

  async updateWeeklyTask(id: string, updates: UpdateWeeklyTaskRequest): Promise<WeeklyTask> {
    await delay(300);
    
    this.db.updateWeeklyTask(id, updates);
    const tasks = this.db.getWeeklyTasks();
    const updatedTask = tasks.find(task => task.id === id);
    
    if (!updatedTask) throw new Error('Tarefa não encontrada');
    return updatedTask;
  }

  async deleteWeeklyTask(id: string): Promise<void> {
    await delay(300);
    this.db.deleteWeeklyTask(id);
  }

  async clearWeeklyTasks(weekStartDate: string): Promise<void> {
    await delay(300);
    this.db.clearWeeklyTasks(weekStartDate);
  }

  async getWeekInfo(date?: string): Promise<WeekInfo> {
    await delay(100);
    return getWeekInfo(date);
  }

  async getDayInfo(date: string): Promise<DayInfo> {
    await delay(100);
    return getDayInfo(date);
  }

  // ===== AGENDA SEMANAL =====
  async getWeeklySchedule(filters?: ScheduleFilters): Promise<WeeklyScheduleItem[]> {
    await delay(500);
    let items = this.db.getWeeklySchedule(filters?.userId);

    if (filters?.dayOfWeek) {
      items = items.filter(item => item.dayOfWeek === filters.dayOfWeek);
    }
    if (filters?.type) {
      items = items.filter(item => item.type === filters.type);
    }
    if (filters?.isActive !== undefined) {
      items = items.filter(item => item.isActive === filters.isActive);
    }

    return items;
  }

  async getScheduleByDay(dayOfWeek: WeeklyScheduleItem['dayOfWeek']): Promise<WeeklyScheduleItem[]> {
    await delay(200);
    return this.db.getWeeklySchedule().filter(
      item => item.dayOfWeek === dayOfWeek && item.isActive
    );
  }

  async createScheduleItem(item: CreateScheduleItemRequest): Promise<WeeklyScheduleItem> {
    await delay(300);
    
    const newItem: WeeklyScheduleItem = {
      id: Date.now().toString(),
      ...item,
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.db.addWeeklyScheduleItem(newItem);
    return newItem;
  }

  async updateScheduleItem(id: string, updates: UpdateScheduleItemRequest): Promise<WeeklyScheduleItem> {
    await delay(300);
    
    this.db.updateWeeklyScheduleItem(id, updates);
    const items = this.db.getWeeklySchedule();
    const updatedItem = items.find(item => item.id === id);
    
    if (!updatedItem) throw new Error('Item não encontrado');
    return updatedItem;
  }

  async deleteScheduleItem(id: string): Promise<void> {
    await delay(300);
    this.db.deleteWeeklyScheduleItem(id);
  }

  // ===== TAREFAS =====
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    await delay(400);
    let tasks = this.db.getTasks(filters?.userId);

    if (filters?.date) {
      tasks = tasks.filter(task => task.date === filters.date);
    }
    if (filters?.type) {
      tasks = tasks.filter(task => task.type === filters.type);
    }
    if (filters?.completed !== undefined) {
      tasks = tasks.filter(task => task.completed === filters.completed);
    }

    return tasks;
  }

  async getTasksByDate(date: string): Promise<Task[]> {
    await delay(200);
    return this.db.getTasks().filter(task => task.date === date);
  }

  async createTask(task: CreateTaskRequest): Promise<Task> {
    await delay(300);
    
    const newTask: Task = {
      id: Date.now().toString(),
      ...task,
      completed: false,
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.db.addTask(newTask);
    return newTask;
  }

  async updateTask(id: string, updates: UpdateTaskRequest): Promise<Task> {
    await delay(300);
    
    this.db.updateTask(id, updates);
    const tasks = this.db.getTasks();
    const updatedTask = tasks.find(task => task.id === id);
    
    if (!updatedTask) throw new Error('Tarefa não encontrada');
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    await delay(300);
    this.db.deleteTask(id);
  }

  async toggleTask(id: string): Promise<Task> {
    await delay(200);
    
    const tasks = this.db.getTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Tarefa não encontrada');
    
    this.db.updateTask(id, { completed: !task.completed });
    return { ...task, completed: !task.completed, updatedAt: new Date() };
  }

  // ===== BLOCO DE TEMPO =====
  async getTimeBlocks(filters?: { day?: string; type?: TimeBlock['type'] }): Promise<TimeBlock[]> {
    await delay(300);
    let blocks = this.db.getTimeBlocks();

    if (filters?.day) {
      blocks = blocks.filter(block => block.day === filters.day);
    }
    if (filters?.type) {
      blocks = blocks.filter(block => block.type === filters.type);
    }

    return blocks;
  }

  async createTimeBlock(block: CreateTimeBlockRequest): Promise<TimeBlock> {
    await delay(300);
    
    const newBlock: TimeBlock = {
      id: Date.now().toString(),
      ...block,
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.db.addTimeBlock(newBlock);
    return newBlock;
  }

  async updateTimeBlock(id: string, updates: UpdateTimeBlockRequest): Promise<TimeBlock> {
    await delay(300);
    
    this.db.updateTimeBlock(id, updates);
    const blocks = this.db.getTimeBlocks();
    const updatedBlock = blocks.find(block => block.id === id);
    
    if (!updatedBlock) throw new Error('Bloco não encontrado');
    return updatedBlock;
  }

  async deleteTimeBlock(id: string): Promise<void> {
    await delay(300);
    this.db.deleteTimeBlock(id);
  }

  // ===== NOTAS =====
  async getNotes(filters?: NoteFilters): Promise<Note[]> {
    await delay(300);
    let notes = this.db.getNotes(filters?.userId);

    if (filters?.date) {
      notes = notes.filter(note => note.date === filters.date);
    }

    return notes;
  }

  async getNotesByDate(date: string): Promise<Note[]> {
    await delay(200);
    return this.db.getNotes().filter(note => note.date === date);
  }

  async createNote(note: CreateNoteRequest): Promise<Note> {
    await delay(300);
    
    const newNote: Note = {
      id: Date.now().toString(),
      ...note,
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.db.addNote(newNote);
    return newNote;
  }

  async updateNote(id: string, updates: UpdateNoteRequest): Promise<Note> {
    await delay(300);
    
    this.db.updateNote(id, updates);
    const notes = this.db.getNotes();
    const updatedNote = notes.find(note => note.id === id);
    
    if (!updatedNote) throw new Error('Nota não encontrada');
    return updatedNote;
  }

  async deleteNote(id: string): Promise<void> {
    await delay(300);
    this.db.deleteNote(id);
  }

  // ===== GOOGLE CALENDAR =====
  async syncGoogleCalendar(syncRequest: GoogleCalendarSyncRequest): Promise<void> {
    await delay(1000);
    console.log('Sincronizando com Google Calendar:', syncRequest);
  }

  async getGoogleCalendarEvents(): Promise<GoogleCalendarEvent[]> {
    await delay(800);
    return [
      {
        id: 'google-1',
        summary: 'Reunião de Equipe',
        description: 'Discussão sobre o projeto',
        start: { dateTime: '2024-01-15T10:00:00Z', timeZone: 'America/Sao_Paulo' },
        end: { dateTime: '2024-01-15T11:00:00Z', timeZone: 'America/Sao_Paulo' },
      },
    ];
  }

  // ===== ANALYTICS =====
  async getAnalytics(): Promise<AnalyticsData> {
    await delay(600);
    const tasks = this.db.getTasks();
    const completedTasks = tasks.filter(task => task.completed);
    
    return {
      weeklyProgress: Math.round((completedTasks.length / tasks.length) * 100) || 0,
      completedTasks: completedTasks.length,
      totalTasks: tasks.length,
      studyHours: 12,
      exerciseHours: 6,
      workHours: 40,
      personalHours: 8,
    };
  }

  async getWeeklyStats(): Promise<WeeklyStats> {
    await delay(500);
    return {
      totalTasks: 15,
      completedTasks: 12,
      completionRate: 80,
      studyHours: 12,
      exerciseHours: 6,
      workHours: 40,
      personalHours: 8,
      mostProductiveDay: 'quarta-feira',
      averageDailyTasks: 3,
    };
  }

  async getMonthlyStats(): Promise<MonthlyStats> {
    await delay(500);
    return {
      totalTasks: 60,
      completedTasks: 48,
      completionRate: 80,
      totalStudyHours: 48,
      totalExerciseHours: 24,
      totalWorkHours: 160,
      totalPersonalHours: 32,
      streakDays: 7,
      averageWeeklyProgress: 75,
    };
  }

  // ===== USUÁRIO =====
  async updateUser(updates: { name?: string; avatar?: string; preferences?: Partial<User['preferences']> }): Promise<User> {
    await delay(400);
    const user = this.db.getCurrentUser();
    if (!user) throw new Error('Usuário não encontrado');
    
    const updatedPreferences = updates.preferences 
      ? { ...user.preferences, ...updates.preferences }
      : user.preferences;
    
    return {
      ...user,
      ...updates,
      preferences: updatedPreferences,
      updatedAt: new Date(),
    };
  }
}

// Instância singleton do mock da API
export const mockApiService = new MockApiService();
export default mockApiService; 