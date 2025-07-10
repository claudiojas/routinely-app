# Routinely - Informações Técnicas Detalhadas

## 🏗️ Arquitetura do Projeto

### Padrão de Arquitetura
O projeto segue o padrão **Component-Based Architecture** com separação clara de responsabilidades:

```
src/
├── components/     # Componentes reutilizáveis (UI)
├── pages/         # Páginas/rotas da aplicação
├── store/         # Gerenciamento de estado global
├── data/          # Camada de dados e APIs
├── hooks/         # Hooks customizados
└── lib/           # Utilitários e helpers
```

### Fluxo de Dados
```
User Action → Component → Store Action → API → Store Update → UI Re-render
```

## 📦 Gerenciamento de Estado

### Zustand Store Structure

#### Estado Principal
```typescript
interface Store {
  // Dados
  tasks: Task[]
  timeBlocks: TimeBlock[]
  notes: Note[]
  selectedDate: string
  weeklySchedule: WeeklyScheduleItem[]
  
  // Ações
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  addTaskNote: (id: string, note: string) => void
  
  // ... outras ações
}
```

#### Padrões de Uso
```typescript
// Em componentes
const { tasks, addTask, updateTask } = useStore()

// Ações assíncronas
const { loadWeeklySchedule, addScheduleItem } = useStore()
await loadWeeklySchedule()
```

### Vantagens do Zustand
- ✅ Simplicidade de API
- ✅ TypeScript nativo
- ✅ Performance otimizada
- ✅ Bundle size pequeno
- ✅ DevTools integrado

## 🎨 Sistema de Design

### Design Tokens
```css
/* Cores primárias */
--violet-600: #7c3aed
--emerald-500: #10b981
--slate-900: #0f172a

/* Espaçamentos */
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem

/* Border radius */
--radius-sm: 0.375rem
--radius-md: 0.5rem
--radius-lg: 0.75rem
--radius-xl: 1rem
```

### Componentes Base (shadcn/ui)
```typescript
// Button
<Button variant="default" size="sm">
  Ação
</Button>

// Input
<Input placeholder="Digite aqui..." />

// Card
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo
  </CardContent>
</Card>
```

### Responsividade
```css
/* Mobile First */
.container {
  @apply px-4 sm:px-6 lg:px-8
}

.grid {
  @apply grid-cols-1 md:grid-cols-2 lg:grid-cols-3
}
```

## 🔌 APIs e Integrações

### Mock API Structure
```typescript
export const mockApi = {
  // CRUD Operations
  getWeeklySchedule: async (): Promise<WeeklyScheduleItem[]>
  createScheduleItem: async (item: Omit<WeeklyScheduleItem, 'id'>): Promise<WeeklyScheduleItem>
  updateScheduleItem: async (id: string, updates: Partial<WeeklyScheduleItem>): Promise<WeeklyScheduleItem>
  deleteScheduleItem: async (id: string): Promise<void>
  
  // Query Operations
  getScheduleByDay: async (dayOfWeek: WeeklyScheduleItem['dayOfWeek']): Promise<WeeklyScheduleItem[]>
}
```

### Padrão de Error Handling
```typescript
try {
  const data = await mockApi.getWeeklySchedule()
  set({ weeklySchedule: data })
} catch (error) {
  console.error('Erro ao carregar agenda semanal:', error)
  // TODO: Implementar toast de erro
}
```

### Simulação de Delay
```typescript
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Uso
await delay(500) // Simula delay de rede
```

## 📱 PWA Implementation

### Service Worker (`public/sw.js`)
```javascript
// Cache Strategy
const CACHE_NAME = 'routinely-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
]

// Install Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  )
})

// Fetch Event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  )
})
```

### Manifest Configuration
```json
{
  "name": "Routinely - Agenda e Produtividade",
  "short_name": "Routinely",
  "description": "Aplicação de agenda semanal, tarefas e notas para produtividade",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F9FAFC",
  "theme_color": "#4A90E2",
  "orientation": "portrait-primary"
}
```

## 🛠️ Build e Deploy

### Vite Configuration
```typescript
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))
```

### Scripts de Build
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

### Otimizações
- **Tree Shaking**: Automático com Vite
- **Code Splitting**: Por rota
- **Minificação**: CSS e JS
- **Compressão**: Gzip/Brotli

## 🧪 Testing Strategy

### Estrutura de Testes (Planejada)
```
tests/
├── unit/           # Testes unitários
│   ├── components/
│   ├── store/
│   └── utils/
├── integration/    # Testes de integração
└── e2e/           # Testes end-to-end
```

### Ferramentas Recomendadas
- **Jest**: Testes unitários
- **React Testing Library**: Testes de componentes
- **Cypress**: Testes E2E
- **MSW**: Mock de APIs

## 📊 Performance

### Métricas Importantes
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

### Otimizações Implementadas
```typescript
// Lazy Loading
const WeeklyScheduleManager = lazy(() => import('./pages/WeeklyScheduleManager'))

// Memoização
const MemoizedComponent = memo(Component)

// Debounce em inputs
const debouncedSearch = useMemo(
  () => debounce(searchFunction, 300),
  [searchFunction]
)
```

## 🔒 Segurança

### Boas Práticas Implementadas
- ✅ Sanitização de inputs
- ✅ Validação com Zod
- ✅ HTTPS obrigatório
- ✅ CSP headers
- ✅ XSS protection

### Autenticação (Planejada)
```typescript
// JWT Token Management
interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
}

// Protected Routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}
```

## 📱 Responsividade

### Breakpoints
```css
/* Tailwind Breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Mobile-First Approach
```typescript
// Hook para detectar mobile
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}
```

## 🔧 Configurações de Desenvolvimento

### ESLint Configuration
```javascript
module.exports = {
  extends: [
    '@eslint/js',
    'typescript-eslint',
    'plugin:react-hooks/recommended',
    'plugin:react-refresh/recommended'
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
}
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## 📈 Analytics e Monitoring

### Estrutura de Logging
```typescript
// Logger utility
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data)
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error)
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data)
  }
}
```

### Error Boundary
```typescript
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', { error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

## 🚀 Deploy e CI/CD

### Estrutura de Deploy (Planejada)
```yaml
# GitHub Actions
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
```

### Variáveis de Ambiente
```env
# Development
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-client-id

# Production
VITE_API_URL=https://api.routinely.com
VITE_GOOGLE_CLIENT_ID=your-production-client-id
```

## 📝 Convenções de Código

### Nomenclatura
```typescript
// Componentes: PascalCase
const TaskList = () => {}

// Hooks: camelCase com prefixo 'use'
const useStore = () => {}

// Constantes: UPPER_SNAKE_CASE
const API_ENDPOINTS = {}

// Interfaces: PascalCase com prefixo 'I' (opcional)
interface ITask {}
interface Task {} // Preferido
```

### Estrutura de Arquivos
```
ComponentName/
├── index.tsx          # Componente principal
├── ComponentName.tsx  # Implementação
├── ComponentName.test.tsx # Testes
└── ComponentName.styles.ts # Estilos (se necessário)
```

### Imports
```typescript
// Ordem de imports
import React from 'react'                    // React
import { useNavigate } from 'react-router'   // Third-party
import { Button } from '@/components/ui'     // Internal
import { useStore } from '@/store'           // Store
import './styles.css'                        // Styles
```

---

**Documento Técnico**  
**Versão**: 1.0  
**Última atualização**: Dezembro 2024  
**Mantido por**: Equipe de Desenvolvimento 