# 🚀 Guia de Uso do React Query (TanStack Query)

Este guia explica como usar o React Query no projeto Routinely para consumo de APIs de forma eficiente e com cache inteligente.

## 📋 Índice

- [Configuração](#configuração)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Hooks Disponíveis](#hooks-disponíveis)
- [Como Usar](#como-usar)
- [Boas Práticas](#boas-práticas)
- [Exemplos](#exemplos)

## ⚙️ Configuração

### QueryClient Configurado

O QueryClient já está configurado em `src/lib/queryClient.ts` com as seguintes otimizações:

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos
      staleTime: 5 * 60 * 1000,
      // Cache em background por 10 minutos
      gcTime: 10 * 60 * 1000,
      // Retry automático (máximo 3 tentativas)
      retry: (failureCount, error) => {
        // Não retry em erros 4xx (exceto 408, 429)
        if (error instanceof Error && 'status' in error) {
          const status = (error as Error & { status?: number }).status
          if (status && status >= 400 && status < 500 && status !== 408 && status !== 429) {
            return false
          }
        }
        return failureCount < 3
      },
      // Não refetch em foco da janela
      refetchOnWindowFocus: false,
      // Refetch em reconexão
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})
```

### Cliente HTTP

O cliente HTTP está configurado em `src/lib/api.ts` com:

- ✅ Interceptors para autenticação
- ✅ Refresh token automático
- ✅ Tratamento de erros
- ✅ Tipagem TypeScript

## 📁 Estrutura de Arquivos

```
src/
├── lib/
│   ├── queryClient.ts    # Configuração do QueryClient
│   └── api.ts           # Cliente HTTP base
├── hooks/
│   └── useApi.ts        # Hooks customizados para APIs
├── types/
│   └── api.ts           # Tipos TypeScript para APIs
└── components/
    └── TaskListWithApi.tsx  # Exemplo de uso
```

## 🎣 Hooks Disponíveis

### Agenda Semanal

```typescript
// Buscar agenda semanal completa
const { data, isLoading, error } = useWeeklySchedule(filters?)

// Buscar agenda por dia específico
const { data, isLoading, error } = useWeeklyScheduleByDay(dayOfWeek)

// Criar item na agenda
const createMutation = useCreateWeeklySchedule()

// Atualizar item da agenda
const updateMutation = useUpdateWeeklySchedule()

// Deletar item da agenda
const deleteMutation = useDeleteWeeklySchedule()
```

### Tarefas

```typescript
// Buscar tarefas com filtros
const { data, isLoading, error } = useTasks(filters?)

// Buscar tarefas por data
const { data, isLoading, error } = useTasksByDate(date)

// Criar tarefa
const createMutation = useCreateTask()

// Atualizar tarefa
const updateMutation = useUpdateTask()

// Deletar tarefa
const deleteMutation = useDeleteTask()

// Toggle tarefa (marcar/desmarcar)
const toggleMutation = useToggleTask()
```

### Notas

```typescript
// Buscar notas
const { data, isLoading, error } = useNotes(date?)

// Criar nota
const createMutation = useCreateNote()

// Atualizar nota
const updateMutation = useUpdateNote()

// Deletar nota
const deleteMutation = useDeleteNote()
```

### Autenticação

```typescript
// Login
const loginMutation = useLogin()

// Registro
const registerMutation = useRegister()

// Logout
const logoutMutation = useLogout()

// Dados do usuário
const { data: user, isLoading } = useUser()

// Perfil do usuário
const { data: profile, isLoading } = useUserProfile()
```

### Analytics

```typescript
// Dados de analytics
const { data, isLoading, error } = useAnalytics(dateRange?)
```

### Google Calendar

```typescript
// Sincronização com Google Calendar
const syncMutation = useGoogleCalendarSync()
```

## 🚀 Como Usar

### 1. Query (Buscar Dados)

```typescript
import { useWeeklySchedule } from '@/hooks/useApi'

const MyComponent = () => {
  const { 
    data: scheduleItems = [], 
    isLoading, 
    error,
    refetch 
  } = useWeeklySchedule()

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error.message}</div>

  return (
    <div>
      {scheduleItems.map(item => (
        <div key={item.id}>{item.activity}</div>
      ))}
      <button onClick={() => refetch()}>Recarregar</button>
    </div>
  )
}
```

### 2. Mutation (Modificar Dados)

```typescript
import { useCreateWeeklySchedule } from '@/hooks/useApi'

const CreateScheduleForm = () => {
  const createMutation = useCreateWeeklySchedule()

  const handleSubmit = async (formData) => {
    try {
      await createMutation.mutateAsync(formData)
      // Sucesso! Cache será invalidado automaticamente
    } catch (error) {
      console.error('Erro ao criar:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* campos do formulário */}
      <button 
        type="submit" 
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  )
}
```

### 3. Estados de Loading e Error

```typescript
const MyComponent = () => {
  const { data, isLoading, error } = useWeeklySchedule()
  const updateMutation = useUpdateWeeklySchedule()

  // Loading state
  if (isLoading) {
    return <div>Carregando dados...</div>
  }

  // Error state
  if (error) {
    return (
      <div>
        <p>Erro: {error.message}</p>
        <button onClick={() => refetch()}>Tentar novamente</button>
      </div>
    )
  }

  // Success state
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>
          {item.activity}
          <button 
            onClick={() => updateMutation.mutate({ id: item.id, data: { completed: true } })}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Salvando...' : 'Marcar como concluída'}
          </button>
        </div>
      ))}
    </div>
  )
}
```

## ✅ Boas Práticas

### 1. Query Keys Organizadas

```typescript
// ✅ Boas práticas para query keys
['weeklySchedule']                    // Lista completa
['weeklySchedule', 'byDay', 'monday'] // Por dia
['tasks', { date: '2024-12-01' }]    // Com filtros
['user', 'profile']                   // Dados aninhados
```

### 2. Invalidação de Cache

```typescript
// ✅ Usar as funções de invalidação pré-definidas
import { invalidateQueries } from '@/lib/queryClient'

// Em mutations
const updateMutation = useUpdateWeeklySchedule()
updateMutation.mutate(data, {
  onSuccess: () => {
    invalidateQueries.weeklySchedule()
    invalidateQueries.weeklyScheduleByDay()
  }
})
```

### 3. Tratamento de Erros

```typescript
// ✅ Usar o hook de tratamento de erros
import { useApiError } from '@/hooks/useApi'

const MyComponent = () => {
  const handleApiError = useApiError()
  
  const handleAction = async () => {
    try {
      await mutation.mutateAsync(data)
    } catch (error) {
      handleApiError(error)
    }
  }
}
```

### 4. Otimistic Updates

```typescript
// ✅ Para melhor UX, usar optimistic updates
const updateMutation = useUpdateWeeklySchedule()

updateMutation.mutate(
  { id, data: { completed: true } },
  {
    onMutate: async (variables) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ['weeklySchedule'] })
      
      // Snapshot do estado anterior
      const previousData = queryClient.getQueryData(['weeklySchedule'])
      
      // Otimistic update
      queryClient.setQueryData(['weeklySchedule'], (old) => 
        old?.map(item => 
          item.id === variables.id 
            ? { ...item, ...variables.data }
            : item
        )
      )
      
      return { previousData }
    },
    onError: (err, variables, context) => {
      // Reverter em caso de erro
      if (context?.previousData) {
        queryClient.setQueryData(['weeklySchedule'], context.previousData)
      }
    },
    onSettled: () => {
      // Sempre refetch para garantir sincronização
      queryClient.invalidateQueries({ queryKey: ['weeklySchedule'] })
    },
  }
)
```

## 📝 Exemplos Práticos

### Exemplo 1: Lista de Tarefas com React Query

```typescript
import { useTasksByDate, useToggleTask, useDeleteTask } from '@/hooks/useApi'

const TaskList = ({ date }) => {
  const { data: tasks = [], isLoading, error } = useTasksByDate(date)
  const toggleMutation = useToggleTask()
  const deleteMutation = useDeleteTask()

  const handleToggle = async (id, completed) => {
    try {
      await toggleMutation.mutateAsync({ id, completed: !completed })
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Tem certeza?')) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error('Erro ao deletar tarefa:', error)
      }
    }
  }

  if (isLoading) return <div>Carregando tarefas...</div>
  if (error) return <div>Erro: {error.message}</div>

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleToggle(task.id, task.completed)}
            disabled={toggleMutation.isPending}
          />
          <span>{task.title}</span>
          <button 
            onClick={() => handleDelete(task.id)}
            disabled={deleteMutation.isPending}
          >
            Deletar
          </button>
        </div>
      ))}
    </div>
  )
}
```

### Exemplo 2: Formulário de Login

```typescript
import { useLogin } from '@/hooks/useApi'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const navigate = useNavigate()
  const loginMutation = useLogin()

  const handleSubmit = async (formData) => {
    try {
      const result = await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password
      })
      
      // Login bem-sucedido
      navigate('/')
    } catch (error) {
      console.error('Erro no login:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button 
        type="submit" 
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
```

### Exemplo 3: Dashboard com Múltiplas Queries

```typescript
import { useWeeklySchedule, useTasks, useAnalytics } from '@/hooks/useApi'

const Dashboard = () => {
  const { data: schedule, isLoading: scheduleLoading } = useWeeklySchedule()
  const { data: tasks, isLoading: tasksLoading } = useTasks()
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics()

  const isLoading = scheduleLoading || tasksLoading || analyticsLoading

  if (isLoading) return <div>Carregando dashboard...</div>

  return (
    <div>
      <div>
        <h3>Agenda Semanal</h3>
        <p>{schedule?.length || 0} atividades</p>
      </div>
      
      <div>
        <h3>Tarefas</h3>
        <p>{tasks?.data?.length || 0} tarefas</p>
      </div>
      
      <div>
        <h3>Analytics</h3>
        <p>Progresso: {analytics?.weeklyProgress || 0}%</p>
      </div>
    </div>
  )
}
```

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente

```env
# .env.local
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### Configuração do Vite

```typescript
// vite.config.ts
export default defineConfig({
  // ... outras configs
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  },
})
```

## 🐛 Debugging

### React Query DevTools

Para desenvolvimento, você pode adicionar o React Query DevTools:

```bash
npm install @tanstack/react-query-devtools
```

```typescript
// App.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* ... resto da app */}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)
```

### Logs de Debug

```typescript
// Para debug, você pode logar as queries
queryClient.setDefaultOptions({
  queries: {
    onSuccess: (data, query) => {
      console.log('Query success:', query.queryKey, data)
    },
    onError: (error, query) => {
      console.error('Query error:', query.queryKey, error)
    },
  },
})
```

## 📚 Recursos Adicionais

- [Documentação oficial do TanStack Query](https://tanstack.com/query/latest)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)
- [Guia de migração v4 para v5](https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5)

---

**Última atualização**: Dezembro 2024  
**Versão**: TanStack Query v5.56.2 