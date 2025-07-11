# 🔗 Guia de Integração Frontend-Backend - Routinely

Este guia explica como a integração entre frontend e backend foi implementada e como usar a aplicação.

## 🚀 Funcionalidades Implementadas

### ✅ Autenticação Completa
- **SignUp**: Criação de conta com validação
- **Login**: Autenticação com JWT
- **Logout**: Encerramento de sessão
- **Proteção de Rotas**: Acesso restrito a usuários autenticados

### ✅ Validação de Formulários
- Validação em tempo real
- Feedback visual de erros
- Mensagens de erro específicas
- Limpeza automática de erros

### ✅ Experiência do Usuário
- Loading states durante operações
- Toast notifications para feedback
- Redirecionamento inteligente
- Interface responsiva

## 🛠️ Como Usar

### 1. Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
VITE_ENV=development
```

### 2. Iniciar a Aplicação

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev
```

### 3. Fluxo de Autenticação

#### Criar Conta (SignUp)
1. Acesse `/signup`
2. Preencha nome, email e senha
3. Validação automática dos campos
4. Após sucesso, redirecionamento para `/login`

#### Fazer Login
1. Acesse `/login`
2. Digite email e senha
3. Após autenticação, acesso às rotas protegidas

#### Logout
1. Clique no avatar no header
2. Selecione "Sair"
3. Redirecionamento para `/login`

## 🏗️ Arquitetura Implementada

### Contexto de Autenticação
```typescript
// src/contexts/AuthContext.tsx
- Gerenciamento global do estado de autenticação
- Persistência de token e dados do usuário
- Funções de login/logout centralizadas
```

### Proteção de Rotas
```typescript
// src/components/ProtectedRoute.tsx
- Verificação de autenticação
- Redirecionamento automático
- Loading state durante verificação
```

### Validação de Formulários
```typescript
// src/utils/validation.ts
- Validação de email, senha e nome
- Mensagens de erro customizadas
- Validação em tempo real
```

## 📡 Integração com API

### Endpoints Utilizados
- `POST /user` - Criar conta
- `POST /userLogin` - Fazer login
- `GET /activities` - Listar atividades (protegido)
- `POST /activities` - Criar atividade (protegido)

### Configuração de Requisições
```typescript
// src/hooks/useApi.ts
- Interceptor automático para token JWT
- Tratamento de erros 401 (token expirado)
- Redirecionamento automático em caso de erro
```

## 🎨 Componentes de UI

### Formulários
- Validação visual com bordas vermelhas
- Mensagens de erro abaixo dos campos
- Loading states nos botões
- Feedback de sucesso/erro via toast

### Header com Menu do Usuário
- Avatar com iniciais do usuário
- Menu dropdown responsivo
- Informações do usuário logado
- Botão de logout com loading

## 🔒 Segurança

### Token JWT
- Armazenamento seguro no localStorage
- Inclusão automática em requisições
- Limpeza automática em logout
- Verificação de expiração

### Validação
- Validação client-side para UX
- Validação server-side para segurança
- Sanitização de dados de entrada

## 🚨 Tratamento de Erros

### Tipos de Erro
- **Validação**: Erros de formulário
- **Rede**: Problemas de conexão
- **Autenticação**: Token inválido/expirado
- **Servidor**: Erros da API

### Feedback ao Usuário
- Toast notifications para erros
- Mensagens específicas por tipo de erro
- Loading states durante operações
- Redirecionamento automático

## 📱 Responsividade

### Mobile First
- Design adaptativo
- Menu mobile no header
- Formulários otimizados para touch
- Feedback visual adequado

## 🔄 Estados da Aplicação

### Loading
- Spinner durante carregamento
- Botões desabilitados
- Feedback visual claro

### Sucesso
- Toast de confirmação
- Redirecionamento automático
- Limpeza de formulários

### Erro
- Mensagens específicas
- Campos destacados em vermelho
- Opção de tentar novamente

## 🧪 Testando a Integração

### 1. Criar Conta
```bash
# Acesse http://localhost:5173/signup
# Preencha os dados
# Verifique redirecionamento para login
```

### 2. Fazer Login
```bash
# Acesse http://localhost:5173/login
# Use as credenciais criadas
# Verifique acesso às rotas protegidas
```

### 3. Testar Proteção
```bash
# Tente acessar / sem estar logado
# Verifique redirecionamento para login
# Faça login e verifique acesso
```

## 🚀 Próximos Passos

### Funcionalidades Futuras
1. **Refresh Token** - Renovação automática
2. **Recuperação de Senha** - Reset via email
3. **Perfil do Usuário** - Edição de dados
4. **Atividades** - CRUD completo
5. **Notificações** - Sistema de alertas

### Melhorias Técnicas
1. **Testes** - Unit e integration tests
2. **PWA** - Progressive Web App
3. **Offline** - Funcionalidade offline
4. **Performance** - Otimizações

---

**A integração está completa e funcional! 🎉** 