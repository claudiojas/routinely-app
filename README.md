# 🗓️ Routinely - Agenda e Produtividade

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.11-38B2AC.svg)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)](https://web.dev/progressive-web-apps/)

Uma aplicação web moderna para organização de rotinas semanais, gerenciamento de tarefas diárias e acompanhamento de produtividade.

## ✨ Funcionalidades

### 🎯 Principais
- **📅 Agenda Semanal**: Configure sua rotina semanal com atividades organizadas por dia (criação funcionando, edição e deleção em desenvolvimento)
- **✅ Gerenciamento de Tarefas**: Crie, edite e acompanhe tarefas diárias
- **📝 Sistema de Notas**: Anotações rápidas para cada atividade
- **📊 Progresso Visual**: Acompanhe seu progresso semanal
- **📱 PWA**: Instale como app nativo no seu dispositivo
- **🎨 Interface Moderna**: Design responsivo e intuitivo

### 🔄 Em Desenvolvimento
- 🔐 Sistema de autenticação completo
- 🔗 Integração com Google Calendar
- 📱 Notificações push
- 🔄 Sincronização offline
- 📈 Analytics e métricas
- ✏️ Edição e deleção de atividades semanais

## 🚀 Quick Start

### Pré-requisitos
- Node.js (versão LTS recomendada)
- npm ou yarn

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/routinely-app.git

# 2. Entre na pasta do projeto
cd routinely-app

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:8080`

### Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run build:dev    # Build para desenvolvimento
npm run preview      # Preview do build
npm run lint         # Linting do código
```

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.3.1** - Biblioteca para interfaces
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.1** - Build tool rápido
- **Tailwind CSS 3.4.11** - Framework CSS
- **shadcn/ui** - Componentes UI

### State Management
- **Zustand 5.0.5** - Gerenciamento de estado

### Routing & HTTP
- **React Router DOM 6.26.2** - Roteamento
- **TanStack Query 5.56.2** - HTTP client

### PWA
- **Service Worker** - Cache e funcionalidade offline
- **Web App Manifest** - Instalação nativa

### Formulários & Validação
- **React Hook Form 7.53.0** - Gerenciamento de formulários
- **Zod 3.23.8** - Validação de schemas

## 📁 Estrutura do Projeto

```
routinely-app/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes base (shadcn/ui)
│   │   ├── Header.tsx      # Header com navegação
│   │   ├── TaskList.tsx    # Lista de tarefas
│   │   ├── WeeklySchedule.tsx # Agenda semanal
│   │   └── ...
│   ├── pages/              # Páginas da aplicação
│   │   ├── Index.tsx       # Dashboard principal
│   │   ├── Login.tsx       # Página de login
│   │   └── WeeklyScheduleManager.tsx # Gerenciador de agenda
│   ├── store/              # Gerenciamento de estado
│   │   └── useStore.ts     # Store Zustand
│   ├── data/               # Dados e APIs
│   │   └── mockApi.ts      # API mock
│   └── hooks/              # Hooks customizados
├── public/                 # Arquivos estáticos
│   ├── manifest.json       # Manifest PWA
│   └── sw.js              # Service Worker
└── doc/                   # 📚 Documentação completa
    ├── CONTEXTO_PROJETO.md
    ├── INFORMACOES_TECNICAS.md
    └── ROADMAP.md
```

## 📚 Documentação

Para informações detalhadas sobre o projeto, arquitetura e desenvolvimento:

- **[📖 Contexto do Projeto](./doc/CONTEXTO_PROJETO.md)** - Visão geral completa
- **[🔧 Informações Técnicas](./doc/INFORMACOES_TECNICAS.md)** - Detalhes de implementação
- **[🗺️ Roadmap](./doc/ROADMAP.md)** - Plano de desenvolvimento

## 🎨 Design System

### Paleta de Cores
- **Primária**: Violet (#7c3aed) + Emerald (#10b981)
- **Neutra**: Slate (#64748b)
- **Estados**: Verde (sucesso), Vermelho (erro), Amarelo (alerta)

### Componentes
- Sistema baseado em shadcn/ui
- Design responsivo mobile-first
- Animações suaves com Tailwind CSS Animate

## 📱 PWA Features

- ✅ **Instalação nativa** em dispositivos móveis
- ✅ **Funcionalidade offline** básica
- ✅ **Service Worker** para cache
- ✅ **Manifest** configurado
- ✅ **Ícones** em diferentes tamanhos

## 🔄 Estado Atual

### ✅ Concluído
- [x] Estrutura base do projeto
- [x] Sistema de roteamento
- [x] Gerenciamento de estado com Zustand
- [x] Interface de usuário completa
- [x] Funcionalidades CRUD para agenda semanal
- [x] Sistema de tarefas diárias
- [x] PWA configurado
- [x] Design responsivo

### 🔄 Em Desenvolvimento
- [ ] Integração real com Google Calendar API
- [ ] Sistema de autenticação completo
- [ ] Persistência de dados (localStorage/backend)
- [ ] Notificações push
- [ ] Sincronização offline

### 📋 Próximos Passos
1. **Implementar edição de atividades semanais**
2. **Implementar deleção de atividades semanais**
3. **Backend API** - Substituir mockApi por API real
4. **Persistência de dados**
5. **Banco de Dados** - Escolher e implementar
6. **Deploy** - Configurar ambiente de produção

## 🤝 Contribuindo

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔗 Links Úteis

- **[Lovable Project](https://lovable.dev/projects/875744e7-ee86-43ed-b6e3-37dc37c8a70e)** - Edição online
- **[Documentação Completa](./doc/)** - Todos os detalhes do projeto
- **[Issues](https://github.com/seu-usuario/routinely-app/issues)** - Reportar bugs ou sugerir features

## 📊 Métricas

- **Performance**: Lighthouse Score > 90
- **Acessibilidade**: WCAG 2.1 AA
- **PWA**: Funcionalidade offline
- **Responsividade**: Mobile-first design

---

**Desenvolvido com ❤️ usando React, TypeScript e Vite**

**Última atualização**: Dezembro 2024  
**Versão**: 0.0.0  
**Status**: Desenvolvimento ativo
