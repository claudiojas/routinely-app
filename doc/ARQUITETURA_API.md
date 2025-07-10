# Arquitetura de API Centralizada - Routinely App

## Visão Geral

A aplicação Routinely agora possui uma arquitetura de API centralizada que permite fácil integração com um backend real, mantendo a simulação atual funcionando perfeitamente.

## Estrutura da Arquitetura

### 1. Tipos Centralizados (`src/types/api.ts`)
- **BaseEntity**: Interface base para todas as entidades
- **WeeklyScheduleItem**: Agenda semanal
- **Task**: Tarefas
- **Note**: Notas
- **TimeBlock**: Blocos de tempo
- **User**: Usuário
- **AuthResponse**: Resposta de autenticação
- **GoogleCalendarEvent**: Eventos do Google Calendar
- **AnalyticsData**: Dados de analytics
- **Filtros**: ScheduleFilters, TaskFilters, NoteFilters

### 2. Serviço de API (`src/services/api.ts`)
- **ApiService**: Classe principal que gerencia todas as chamadas HTTP
- **AuthTokenManager**: Gerenciamento de tokens de autenticação
- **Refresh Token**: Renovação automática de tokens
- **Error Handling**: Tratamento centralizado de erros
- **Timeout**: Configuração de timeout para requisições

### 3. Mock da API (`src/services/mockApi.ts`)
- **MockDatabase**: Simula um banco de dados em memória
- **MockApiService**: Implementa a mesma interface da API real
- **Dados Persistentes**: Dados que persistem durante a sessão
- **Delays Simulados**: Simula latência de rede

### 4. Hooks Customizados (`src/hooks/useApi.ts`)
- **React Query Integration**: Hooks que usam React Query
- **Cache Management**: Gerenciamento automático de cache
- **Mutations**: Operações de criação, atualização e exclusão
- **Query Keys**: Chaves organizadas para invalidação de cache
- **Stale Time**: Configuração de tempo de dados obsoletos

## Como Usar

### 1. Usando Hooks da API

```typescript
import { useTodayTasks, useCreateTask, useUpdateTask } from '../hooks/useApi';

const MyComponent = () => {
  // Buscar dados
  const { data: tasks, isLoading, error } = useTodayTasks();
  
  // Mutations
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  
  const handleCreateTask = async () => {
    await createTaskMutation.mutateAsync({
      title: 'Nova tarefa',
      date: '2024-01-15',
      type: 'personal'
    });
  };
  
  // Renderização
  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  
  return (
    <div>
      {tasks?.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
};
```

### 2. Hooks Disponíveis

#### Agenda Semanal
- `useWeeklySchedule(filters?)` - Buscar agenda completa
- `useScheduleByDay(dayOfWeek)` - Buscar por dia da semana
- `useCreateScheduleItem()` - Criar item
- `useUpdateScheduleItem()` - Atualizar item
- `useDeleteScheduleItem()` - Deletar item

#### Tarefas
- `useTasks(filters?)` - Buscar tarefas
- `useTasksByDate(date)` - Buscar por data
- `useCreateTask()` - Criar tarefa
- `useUpdateTask()` - Atualizar tarefa
- `useDeleteTask()` - Deletar tarefa
- `useToggleTask()` - Alternar status

#### Notas
- `useNotes(filters?)` - Buscar notas
- `useNotesByDate(date)` - Buscar por data
- `useCreateNote()` - Criar nota
- `useUpdateNote()` - Atualizar nota
- `useDeleteNote()` - Deletar nota

#### Blocos de Tempo
- `useTimeBlocks(filters?)` - Buscar blocos
- `useCreateTimeBlock()` - Criar bloco
- `useUpdateTimeBlock()` - Atualizar bloco
- `useDeleteTimeBlock()` - Deletar bloco

#### Autenticação
- `useLogin()` - Fazer login
- `useSignUp()` - Criar conta
- `useCurrentUser()` - Buscar usuário atual

#### Analytics
- `useAnalytics()` - Dados gerais
- `useWeeklyStats()` - Estatísticas semanais
- `useMonthlyStats()` - Estatísticas mensais

#### Google Calendar
- `useGoogleCalendarEvents()` - Buscar eventos
- `useSyncGoogleCalendar()` - Sincronizar

#### Hooks Utilitários
- `useTodaySchedule()` - Agenda de hoje
- `useTodayTasks()` - Tarefas de hoje
- `useTodayNotes()` - Notas de hoje
- `useTodayTimeBlocks()` - Blocos de hoje

### 3. Query Keys

```typescript
import { queryKeys } from '../hooks/useApi';

// Invalidar cache manualmente
queryClient.invalidateQueries({ queryKey: queryKeys.tasks() });
queryClient.invalidateQueries({ queryKey: queryKeys.weeklySchedule() });
```

## Migração para API Real

### 1. Configuração de Ambiente

```typescript
// .env
VITE_API_URL=https://api.routinely.com/api
```

### 2. Substituir Mock por API Real

```typescript
// src/services/api.ts
// Trocar mockApiService por apiService em todos os hooks
import { apiService } from '../services/api';
// import { mockApiService } from '../services/mockApi';
```

### 3. Implementar Backend

O backend deve implementar os seguintes endpoints:

#### Autenticação
- `POST /auth/login` - Login
- `POST /auth/signup` - Registro
- `POST /auth/logout` - Logout
- `GET /auth/me` - Usuário atual
- `POST /auth/refresh` - Renovar token

#### Agenda Semanal
- `GET /weekly-schedule` - Listar agenda
- `GET /weekly-schedule/day/:day` - Por dia
- `POST /weekly-schedule` - Criar item
- `PUT /weekly-schedule/:id` - Atualizar item
- `DELETE /weekly-schedule/:id` - Deletar item

#### Tarefas
- `GET /tasks` - Listar tarefas
- `GET /tasks/date/:date` - Por data
- `POST /tasks` - Criar tarefa
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Deletar tarefa
- `PATCH /tasks/:id/toggle` - Alternar status

#### Notas
- `GET /notes` - Listar notas
- `GET /notes/date/:date` - Por data
- `POST /notes` - Criar nota
- `PUT /notes/:id` - Atualizar nota
- `DELETE /notes/:id` - Deletar nota

#### Blocos de Tempo
- `GET /time-blocks` - Listar blocos
- `POST /time-blocks` - Criar bloco
- `PUT /time-blocks/:id` - Atualizar bloco
- `DELETE /time-blocks/:id` - Deletar bloco

#### Analytics
- `GET /analytics` - Dados gerais
- `GET /analytics/weekly` - Estatísticas semanais
- `GET /analytics/monthly` - Estatísticas mensais

#### Google Calendar
- `GET /google-calendar/events` - Buscar eventos
- `POST /google-calendar/sync` - Sincronizar

## Benefícios da Arquitetura

### 1. **Reatividade**
- Dados atualizados automaticamente
- Cache inteligente
- Invalidação automática

### 2. **Performance**
- Cache de dados
- Stale time configurável
- Background refetch

### 3. **UX**
- Loading states
- Error handling
- Optimistic updates

### 4. **Desenvolvimento**
- TypeScript completo
- IntelliSense
- Debugging fácil

### 5. **Manutenibilidade**
- Código centralizado
- Fácil de testar
- Fácil de estender

## Exemplo de Uso Completo

```typescript
import { useTodayTasks, useCreateTask, useUpdateTask } from '../hooks/useApi';

const TaskManager = () => {
  const { data: tasks, isLoading, error } = useTodayTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const handleCreateTask = async (title: string) => {
    try {
      await createTask.mutateAsync({
        title,
        date: new Date().toISOString().split('T')[0],
        type: 'personal'
      });
      // Cache é invalidado automaticamente
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  const handleToggleTask = async (id: string) => {
    try {
      await updateTask.mutateAsync({
        id,
        updates: { completed: !tasks?.find(t => t.id === id)?.completed }
      });
      // Cache é invalidado automaticamente
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      {tasks?.map(task => (
        <div key={task.id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleToggleTask(task.id)}
          />
          {task.title}
        </div>
      ))}
    </div>
  );
};
```

## Próximos Passos

1. **Implementar Backend Real**
   - Criar API REST
   - Implementar autenticação JWT
   - Configurar banco de dados

2. **Adicionar Testes**
   - Testes unitários para hooks
   - Testes de integração
   - Testes E2E

3. **Melhorar UX**
   - Loading skeletons
   - Error boundaries
   - Toast notifications

4. **Otimizações**
   - Lazy loading
   - Code splitting
   - Bundle optimization

5. **Monitoramento**
   - Error tracking
   - Performance monitoring
   - Analytics 