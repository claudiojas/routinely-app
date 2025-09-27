# Routinely - Documento de Contexto do Projeto

## 📋 Visão Geral

**Routinely** é uma aplicação web de produtividade e organização de rotinas desenvolvida em React com TypeScript. O projeto foi criado usando a plataforma Lovable e utiliza tecnologias modernas para oferecer uma experiência de usuário fluida e responsiva.

### 🎯 Objetivo Principal
A aplicação visa ajudar usuários a organizar suas rotinas semanais, gerenciar tarefas diárias, fazer anotações e acompanhar seu progresso de produtividade.

## 🏗️ Arquitetura e Tecnologias

### Stack Tecnológico
- **Frontend**: React 18.3.1 + TypeScript 5.5.3
- **Build Tool**: Vite 5.4.1
- **Styling**: Tailwind CSS 3.4.11 + shadcn/ui
- **State Management**: Zustand 5.0.5
- **Routing**: React Router DOM 6.26.2
- **HTTP Client**: TanStack Query 5.56.2
- **UI Components**: Radix UI + Lucide React
- **PWA**: Service Worker + Manifest
- **Form Handling**: React Hook Form 7.53.0 + Zod 3.23.8

### Estrutura do Projeto
```
routinely-app/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes base do shadcn/ui
│   │   ├── Header.tsx      # Header com navegação
│   │   ├── TaskList.tsx    # Lista de tarefas do dia
│   │   ├── WeeklySchedule.tsx # Componente de agenda semanal
│   │   ├── GoogleSyncButton.tsx # Sincronização Google Calendar
│   │   ├── InstallPWA.tsx  # Instalação PWA
│   │   └── ...
│   ├── pages/              # Páginas da aplicação
│   │   ├── Index.tsx       # Dashboard principal
│   │   ├── Login.tsx       # Página de login
│   │   ├── SignUp.tsx      # Página de cadastro
│   │   └── WeeklyScheduleManager.tsx # Gerenciador de agenda
│   ├── store/              # Gerenciamento de estado
│   │   └── useStore.ts     # Store Zustand principal
│   ├── data/               # Dados e APIs
│   │   └── mockApi.ts      # API mock para desenvolvimento
│   ├── hooks/              # Hooks customizados
│   └── lib/                # Utilitários
├── public/                 # Arquivos estáticos
│   ├── manifest.json       # Manifest PWA
│   ├── sw.js              # Service Worker
│   └── icons/             # Ícones PWA
└── doc/                   # Documentação
```

## 🎨 Design System

### Paleta de Cores
- **Primária**: Violet (600-900) + Emerald (500-600)
- **Neutra**: Slate (100-900) para textos e backgrounds
- **Estados**: Verde para sucesso, Vermelho para erro, Amarelo para alerta

### Componentes UI
- Sistema baseado em shadcn/ui com Radix UI
- Componentes customizados para funcionalidades específicas
- Design responsivo com breakpoints mobile-first
- Animações suaves com Tailwind CSS Animate

## 📱 Funcionalidades Implementadas

### ✅ Funcionalidades Concluídas

#### 1. **Sistema de Autenticação**
- Páginas de Login e SignUp com design moderno
- Formulários com validação visual
- Navegação entre páginas de auth
- **OAuth Google implementado e funcionando**
- **Status**: ✅ Autenticação OAuth Google 100% funcional

#### 2. **Dashboard Principal**
- Layout responsivo com grid system
- Exibe **apenas as tarefas do dia**, barra de progresso e bloco de notas
- **Status**: Atualizado para foco total em rotina diária

#### 3. **Gerenciamento de Agenda Semanal**
- Interface completa para criar/editar/excluir atividades
- Organização por dias da semana
- Categorização por tipo (estudo, exercício, trabalho, pessoal, outro)
- Horários de início e fim
- Sistema de anotações por atividade
- Status de conclusão das tarefas
- **Status:** Criação de atividades funcionando. Edição e deleção ainda não implementadas.

#### 4. **Sistema de Tarefas**
- Lista de tarefas do dia com status de conclusão
- Categorização por tipo
- Sistema de anotações por tarefa
- Funcionalidade de marcar como concluída
- Exclusão de tarefas

#### 5. **Progressive Web App (PWA)**
- Manifest configurado
- Service Worker implementado
- Instalação nativa em dispositivos móveis
- Ícones em diferentes tamanhos
- Funcionalidade offline básica

### 🔄 Funcionalidades em Desenvolvimento

#### 1. **Sistema de Notas**
- Componente NotePad implementado
- CRUD básico de notas
- **Status**: Funcional, mas pode ser expandido

#### 2. **Sistema de Progresso**
- Cálculo de progresso semanal
- Barra de progresso visual
- **Status**: Implementado, pode ser melhorado

## 🗄️ Gerenciamento de Estado

### Zustand Store (`useStore.ts`)
```typescript
interface Store {
  // Dados
  tasks: Task[]
  timeBlocks: TimeBlock[]
  notes: Note[]
  selectedDate: string
  weeklySchedule: WeeklyScheduleItem[]
  
  // Ações de Tarefas
  addTask, updateTask, deleteTask, toggleTask, addTaskNote
  
  // Ações de Blocos de Tempo
  addTimeBlock, updateTimeBlock, deleteTimeBlock
  
  // Ações de Agenda Semanal
  loadWeeklySchedule, addScheduleItem, updateScheduleItem, deleteScheduleItem
  
  // Ações de Notas
  addNote, updateNote, deleteNote
  
  // UI e Utilitários
  setSelectedDate, getWeeklyProgress, getTodayScheduleItems
}
```

### Tipos de Dados
```typescript
interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  date: string
  type: 'study' | 'exercise' | 'work' | 'personal' | 'other'
  isGoogleSynced?: boolean
  createdAt: Date
  notes?: string
}

interface WeeklyScheduleItem {
  id: string
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  startTime: string
  endTime: string
  activity: string
  notes: string
  type: 'study' | 'exercise' | 'work' | 'personal' | 'other'
  isActive: boolean
  completed?: boolean
}
```

## 🔌 APIs e Dados

### Mock API (`mockApi.ts`)
- Simulação de chamadas HTTP com delays
- Dados de exemplo para agenda semanal
- CRUD completo para WeeklyScheduleItem
- **Status**: Funcional para desenvolvimento

### Dados de Exemplo
```typescript
const mockWeeklySchedule = [
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
  },
  // ... mais itens
]
```

## 🚀 Scripts e Comandos

### Desenvolvimento
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run build:dev    # Build para desenvolvimento
npm run preview      # Preview do build
npm run lint         # Linting do código
```

### Configuração do Vite
- Host: `::` (IPv6)
- Porta: `8080`
- Alias: `@` → `./src`
- Plugin Lovable para desenvolvimento

## 📱 PWA Features

### Manifest (`public/manifest.json`)
- Nome: "Routinely - Agenda e Produtividade"
- Display: standalone
- Orientação: portrait-primary
- Ícones: 192x192 e 512x512
- Cores: Background #F9FAFC, Theme #4A90E2

### Service Worker
- Cache de recursos estáticos
- Funcionalidade offline básica
- **Status**: Implementado

## 🎯 Estado Atual do Desenvolvimento

### ✅ Concluído
1. **Estrutura base do projeto**
2. **Sistema de roteamento**
3. **Gerenciamento de estado com Zustand**
4. **Interface de usuário completa**
5. **Funcionalidades CRUD para agenda semanal**
6. **Sistema de tarefas diárias**
7. **PWA configurado**
8. **Design responsivo**

### 🔄 Em Desenvolvimento
1. **Persistência de dados**
2. **Banco de Dados** - Escolher e implementar (SQLite, PostgreSQL, etc.)
3. **Deploy** - Configurar ambiente de produção
4. **Testes** - Implementar testes unitários e E2E
5. **Analytics** - Implementar tracking de uso
6. **Notificações** - Sistema de lembretes
7. **Export/Import** - Funcionalidade de backup

### 📋 Próximos Passos
1. **Implementar edição de atividades semanais**
2. **Implementar deleção de atividades semanais**
3. **Persistência de dados**
4. **Banco de Dados** - Escolher e implementar (SQLite, PostgreSQL, etc.)
5. **Deploy** - Configurar ambiente de produção
6. **Testes** - Implementar testes unitários e E2E
7. **Analytics** - Implementar tracking de uso
8. **Notificações** - Sistema de lembretes
9. **Export/Import** - Funcionalidade de backup

## 🛠️ Configurações Técnicas

### Dependências Principais
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.5.3",
  "vite": "^5.4.1",
  "tailwindcss": "^3.4.11",
  "zustand": "^5.0.5",
  "react-router-dom": "^6.26.2",
  "@tanstack/react-query": "^5.56.2",
  "react-hook-form": "^7.53.0",
  "zod": "^3.23.8"
}
```

### Configuração Tailwind
- Dark mode habilitado
- Cores customizadas (violet, emerald, slate, dark)
- Animações personalizadas
- Sistema de grid responsivo

### ESLint
- Configuração para React + TypeScript
- Regras para hooks e refresh
- Integração com Lovable

## 📊 Métricas e Performance

### Bundle Size
- Vite com otimizações automáticas
- Tree shaking habilitado
- Code splitting por rota

### Performance
- Lazy loading de componentes
- Otimizações de imagem
- Service Worker para cache

## 🔧 Ambiente de Desenvolvimento

### Requisitos
- Node.js (versão LTS recomendada)
- npm ou yarn
- Git

### Setup
```bash
git clone <repository>
cd routinely-app
npm install
npm run dev
```

### URLs de Desenvolvimento
- **Local**: http://localhost:8080
- **Lovable**: https://lovable.dev/projects/875744e7-ee86-43ed-b6e3-37dc37c8a70e

## 📝 Notas de Desenvolvimento

### Decisões Técnicas
1. **Zustand** escolhido por simplicidade e performance
2. **shadcn/ui** para consistência visual e acessibilidade
3. **PWA** para experiência mobile nativa
4. **TypeScript** para type safety e melhor DX
5. **Vite** para build rápido e HMR eficiente

### Padrões de Código
- Componentes funcionais com hooks
- TypeScript strict mode
- ESLint + Prettier
- Convenções de nomenclatura consistentes
- Documentação inline

### Arquitetura de Componentes
- Componentes atômicos reutilizáveis
- Separação clara entre UI e lógica
- Props tipadas com TypeScript
- Composição sobre herança

## 🎨 Design e UX

### Princípios de Design
- **Simplicidade**: Interface limpa e intuitiva
- **Consistência**: Padrões visuais uniformes
- **Responsividade**: Funciona em todos os dispositivos
- **Acessibilidade**: Suporte a screen readers e navegação por teclado

### Paleta de Cores
- **Primária**: Violet (#7c3aed) + Emerald (#10b981)
- **Neutra**: Slate (#64748b)
- **Estados**: Verde (#22c55e), Vermelho (#ef4444), Amarelo (#eab308)

### Tipografia
- Sistema de fontes do Tailwind
- Hierarquia clara de títulos
- Legibilidade otimizada

## 🔮 Roadmap Futuro

### Fase 1 - MVP Completo
- [ ] Backend API funcional
- [ ] Autenticação real
- [ ] Persistência de dados
- [ ] Deploy em produção

### Fase 2 - Funcionalidades Avançadas
- [ ] Notificações push
- [ ] Sincronização offline
- [ ] Analytics e métricas
- [ ] Export/import de dados

### Fase 3 - Expansão
- [ ] Equipes e colaboração
- [ ] Integração com mais calendários
- [ ] API pública
- [ ] Mobile apps nativos

---

## 🚦 Status Atual do Projeto

- **MVP concluído:**
  - Funcionalidades principais implementadas (agenda semanal, tarefas, notas, progresso, autenticação, PWA, deleção e múltiplas semanas ativas)
  - Persistência real no backend
  - Interface moderna, responsiva e pronta para uso
  - Documentação clara e visão de produto
  - Marca da Agência Estudio Code em destaque
- **Aguardando:**
  - Validação final de usabilidade
  - Feedback de usuários reais
  - Preparação para deploy e divulgação

---

## 🛣️ Próximos Passos

1. **Deploy da Aplicação**
   - Avaliar as melhores plataformas para deploy (Vercel, Netlify, Render, AWS, GCP, Azure, etc.)
   - Decidir entre opções gratuitas (para MVP/testes) ou pagas (para produção, escalabilidade e domínio próprio)
   - Configurar domínio, HTTPS e variáveis de ambiente

2. **Login Google para Todos**
   - Ajustar as configurações do projeto Google Cloud Console
   - Permitir que qualquer usuário com conta Google possa autenticar (remover restrição de e-mails/testes)
   - Revisar políticas de privacidade e consentimento

3. **Melhorias de Segurança e Qualidade**
   - Implementar pipeline de CI/CD (integração e deploy contínuos)
   - Adicionar testes automatizados (unitários e E2E)
   - Implementar feature de cookies para autenticação e consentimento
   - Revisar headers de segurança, CORS e proteção contra XSS/CSRF

---

Esses passos garantirão que o Routinely evolua de MVP para um produto robusto, seguro e pronto para escalar.

---

**Última atualização**: Dezembro 2024  
**Versão do projeto**: 0.0.0  
**Status**: Desenvolvimento ativo  
**Plataforma**: Lovable + GitHub 