# 📋 Implementação de Persistência de Semanas

## 🎯 Objetivo

Implementar persistência de dados de semanas no backend **sem quebrar** as funcionalidades existentes, seguindo o contexto do arquivo `CONTEXT_TO_IMPLEMENT.md`.

## 🔧 Hooks Criados

### 1. `useWeekPersistence.ts` - Hooks Isolados de Backend
```typescript
// Buscar semanas do backend
const { data: weeks, isLoading, error } = useWeeksFromBackend();

// Criar semana no backend
const createWeek = useCreateWeekInBackend();

// Finalizar semana no backend
const completeWeek = useCompleteWeekInBackend();
```

### 2. `useWeekSync.ts` - Sincronização Local ↔ Backend
```typescript
// Sincronizar estado local com backend
const { backendWeeks, createAndSyncWeek, completeAndSyncWeek } = useWeekSync(localWeeks, setLocalWeeks);
```

### 3. `useWeekBackup.ts` - Backup Local
```typescript
// Backup local quando backend está offline
const { backupWeeks, addBackupWeek, completeBackupWeek } = useWeekBackup();
```

### 4. `useWeekPersistenceManager.ts` - Hook Integrado (Opcional)
```typescript
// Hook que combina persistência + compatibilidade
const {
  weeks, activeWeek, completedWeeks,
  startNewWeek, finalizeCurrentWeek,
  isLoading, error, hasBackendData, hasBackupData
} = useWeekPersistenceManager();
```

## 🚀 Como Usar (Opcional)

### Opção 1: Usar Hook Integrado (Recomendado)
```typescript
// Em qualquer componente
import { useWeekPersistenceManager } from '../hooks/useWeekPersistenceManager';

const MyComponent = () => {
  const {
    weeks, activeWeek,
    startNewWeek, finalizeCurrentWeek,
    isLoading, hasBackendData
  } = useWeekPersistenceManager();

  // Usar exatamente como useWeekManagement
  // + dados adicionais de persistência
};
```

### Opção 2: Usar Hooks Isolados
```typescript
// Para casos específicos
import { useWeeksFromBackend, useCreateWeekInBackend } from '../hooks/useWeekPersistence';

const MyComponent = () => {
  const { data: backendWeeks } = useWeeksFromBackend();
  const createWeek = useCreateWeekInBackend();
  
  // Usar apenas quando necessário
};
```

## 🛡️ Garantias de Segurança

### ✅ Não Quebra Funcionalidades Existentes
- Todos os hooks são **isolados**
- Não modificam `useWeekManagement.ts`
- Não afetam componentes existentes
- Podem ser usados **opcionalmente**

### ✅ Fallback Automático
- Se backend estiver offline → usa backup local
- Se backup local não existir → usa dados locais
- Sempre mantém funcionalidade básica

### ✅ Compatibilidade Total
- Mesma interface do `useWeekManagement`
- Mesmos tipos de dados
- Mesmas funções e propriedades

## 📊 Fluxo de Dados

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Backend       │    │   Backup Local  │    │   Estado Local  │
│   (Online)      │◄──►│   (Offline)     │◄──►│   (Fallback)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
   Dados Reais            Dados Temporários        Dados Iniciais
```

## 🎮 Componente de Demonstração

```typescript
// src/components/WeekPersistenceDemo.tsx
import { WeekPersistenceDemo } from '../components/WeekPersistenceDemo';

// Usar em qualquer página para testar
<WeekPersistenceDemo />
```

## 🔄 Migração Gradual

### Fase 1: Teste (Atual)
- Usar `WeekPersistenceDemo` para testar
- Verificar se backend está funcionando
- Validar persistência de dados

### Fase 2: Integração Opcional
- Substituir `useWeekManagement` por `useWeekPersistenceManager` em componentes específicos
- Manter funcionalidades existentes intactas

### Fase 3: Migração Completa (Futuro)
- Quando backend estiver 100% funcional
- Migrar todos os componentes gradualmente

## 🚨 Pontos de Atenção

### ⚠️ Backend Necessário
- Endpoints devem estar implementados
- Autenticação deve funcionar
- Dados devem ser compatíveis

### ⚠️ Tratamento de Erros
- Sempre há fallback local
- Usuário é notificado de problemas
- Funcionalidade nunca para

### ⚠️ Performance
- Queries são otimizadas (5min cache)
- Backup local é rápido
- Sincronização assíncrona

## 📝 Exemplo de Uso Completo

```typescript
// Em WeeklyScheduleManager.tsx (opcional)
import { useWeekPersistenceManager } from '../hooks/useWeekPersistenceManager';

const WeeklyScheduleManager = () => {
  const {
    weeks, activeWeek, completedWeeks,
    shouldShowFinalizeButton, canStartNewWeek,
    startNewWeek, finalizeCurrentWeek, getWeekDays,
    isLoading, error, hasBackendData
  } = useWeekPersistenceManager();

  // Resto do código permanece igual
  // + dados de persistência disponíveis
};
```

## ✅ Status da Implementação

- [x] Hooks isolados criados
- [x] Backup local implementado
- [x] Sincronização implementada
- [x] Hook integrado criado
- [x] Componente de demo criado
- [x] Documentação criada
- [ ] Backend implementado (pendente)
- [ ] Testes realizados (pendente)

## 🎯 Próximos Passos

1. **Implementar backend** com endpoints de semanas
2. **Testar persistência** com dados reais
3. **Migrar gradualmente** componentes existentes
4. **Monitorar performance** e estabilidade 