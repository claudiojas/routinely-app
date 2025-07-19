# Requisitos de Backend para Persistência e Gerenciamento de Semanas

## Contexto
O frontend do Routinely App implementou um sistema de gerenciamento de semanas, permitindo ao usuário:
- Iniciar novas semanas manualmente
- Finalizar semanas (manualmente ou automaticamente)
- Visualizar histórico de semanas finalizadas

Atualmente, essas informações são mantidas apenas em memória local, o que faz com que sejam perdidas ao dar refresh ou sair do app. Para garantir persistência e experiência consistente, o frontend precisa que o backend implemente as seguintes funcionalidades:

---

## ✅ IMPLEMENTAÇÃO CONCLUÍDA

### **🎯 Status da Implementação**
- ✅ **Modelagem do Banco:** Tabela `weeks` criada com Prisma
- ✅ **Endpoints REST:** Todos os 5 endpoints implementados e testados
- ✅ **Autenticação JWT:** Todos os endpoints protegidos
- ✅ **Validação de Dados:** Schemas Zod implementados
- ✅ **Testes:** Todos os endpoints testados e funcionando
- ✅ **Integração:** Rotas registradas no servidor Fastify

---

## Funcionalidades Implementadas

### 1. ✅ Persistência de Semanas
- **Toda semana criada (manual ou automática) é salva no banco de dados.**
- **O status de cada semana (ativa, finalizada) é persistido.**
- **Semanas finalizadas são recuperáveis para histórico.**

### 2. ✅ Endpoints Implementados

#### a) Listar Semanas do Usuário
- **GET `/api/weeks`**
- ✅ **Implementado e Testado**
- Retorna todas as semanas do usuário autenticado (ativas e finalizadas)
- **Headers necessários:** `Authorization: Bearer <token>`
- **Resposta:** Array de objetos Week

#### b) Criar Nova Semana
- **POST `/api/weeks`**
- ✅ **Implementado e Testado**
- Cria uma nova semana para o usuário
- **Headers necessários:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Payload:**
```json
{
  "startDate": "2025-07-20T00:00:00.000Z",
  "endDate": "2025-07-26T23:59:59.999Z",
  "weekNumber": 30
}
```
- **Resposta:** Objeto Week criado (status 201)

#### c) Finalizar Semana
- **PATCH `/api/weeks/:id/complete`**
- ✅ **Implementado e Testado**
- Marca uma semana como finalizada
- **Headers necessários:** `Authorization: Bearer <token>`
- **Resposta:** Objeto Week atualizado com `isCompleted: true` e `completedAt` preenchido

#### d) Listar Semanas Finalizadas
- **GET `/api/weeks/completed?limit=4`**
- ✅ **Implementado e Testado**
- Retorna as últimas semanas finalizadas do usuário
- **Headers necessários:** `Authorization: Bearer <token>`
- **Query params:** `limit` (opcional, padrão: 4)
- **Resposta:** Array de objetos Week finalizados

#### e) Verificação Automática de Expiração
- **GET `/api/weeks/check-expired`**
- ✅ **Implementado e Testado**
- Endpoint para o frontend acionar e o backend finalizar automaticamente semanas expiradas
- **Headers necessários:** `Authorization: Bearer <token>`
- **Resposta:** `{ finalized: number, weeks: Week[] }`

---

## ✅ Estrutura de Dados Implementada

Tabela: `weeks`
- `id` (UUID) ✅
- `user_id` (UUID, FK para users) ✅
- `start_date` (DateTime) ✅
- `end_date` (DateTime) ✅
- `is_active` (BOOLEAN) ✅
- `is_completed` (BOOLEAN) ✅
- `week_number` (INTEGER) ✅
- `created_at` (TIMESTAMP) ✅
- `updated_at` (TIMESTAMP) ✅
- `completed_at` (TIMESTAMP, nullable) ✅

---

## ✅ Fluxos Implementados e Testados

1. **Usuário novo acessa o app:**
   - ✅ Backend retorna array vazio se não existir semanas
2. **Usuário inicia nova semana:**
   - ✅ Backend cria uma nova semana com dados fornecidos
3. **Usuário finaliza semana:**
   - ✅ Backend marca a semana como finalizada e registra o timestamp
4. **Usuário faz refresh ou retorna depois:**
   - ✅ Backend retorna todas as semanas do usuário, preservando o histórico e status
5. **Página de semanas finalizadas:**
   - ✅ Backend retorna as últimas semanas finalizadas para exibição
6. **Verificação automática:**
   - ✅ Backend permite finalizar semanas expiradas automaticamente

---

## ✅ Considerações de Segurança Implementadas
- ✅ Todos os endpoints exigem autenticação JWT
- ✅ Usuário só pode acessar/modificar suas próprias semanas
- ✅ Validação de datas e integridade dos dados com Zod
- ✅ Validação de propriedade (usuário só acessa suas semanas)

---

## 📋 Feedback Detalhado para o Frontend

### **🎯 Status: PRONTO PARA INTEGRAÇÃO**

#### **✅ Endpoints Disponíveis:**
1. **GET `/api/weeks`** - Listar todas as semanas do usuário
2. **POST `/api/weeks`** - Criar nova semana
3. **PATCH `/api/weeks/:id/complete`** - Finalizar semana
4. **GET `/api/weeks/completed?limit=4`** - Listar semanas finalizadas
5. **GET `/api/weeks/check-expired`** - Verificar semanas expiradas

#### **🔐 Autenticação:**
- Todos os endpoints requerem header: `Authorization: Bearer <token>`
- Token JWT obtido via login (`POST /userLogin`)

#### **📊 Estrutura de Resposta:**
```typescript
interface Week {
  id: string;
  userId: string;
  startDate: string; // ISO DateTime
  endDate: string;   // ISO DateTime
  isActive: boolean;
  isCompleted: boolean;
  weekNumber: number;
  createdAt: string; // ISO DateTime
  updatedAt: string; // ISO DateTime
  completedAt: string | null; // ISO DateTime
}
```

#### **🚀 Fluxo Recomendado para Frontend:**

1. **Primeiro acesso:**
   ```javascript
   // Verificar se usuário tem semanas
   const weeks = await fetch('/api/weeks', {
     headers: { 'Authorization': `Bearer ${token}` }
   });
   
   if (weeks.length === 0) {
     // Criar semana atual automaticamente
     const currentWeek = await fetch('/api/weeks', {
       method: 'POST',
       headers: { 
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         startDate: getCurrentWeekStart(),
         endDate: getCurrentWeekEnd(),
         weekNumber: getCurrentWeekNumber()
       })
     });
   }
   ```

2. **Criar nova semana:**
   ```javascript
   const newWeek = await fetch('/api/weeks', {
     method: 'POST',
     headers: { 
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       startDate: '2025-07-27T00:00:00.000Z',
       endDate: '2025-08-02T23:59:59.999Z',
       weekNumber: 31
     })
   });
   ```

3. **Finalizar semana:**
   ```javascript
   const completedWeek = await fetch(`/api/weeks/${weekId}/complete`, {
     method: 'PATCH',
     headers: { 'Authorization': `Bearer ${token}` }
   });
   ```

4. **Listar histórico:**
   ```javascript
   const completedWeeks = await fetch('/api/weeks/completed?limit=4', {
     headers: { 'Authorization': `Bearer ${token}` }
   });
   ```

5. **Verificar expiração (opcional):**
   ```javascript
   const expiredCheck = await fetch('/api/weeks/check-expired', {
     headers: { 'Authorization': `Bearer ${token}` }
   });
   // Retorna: { finalized: 0, weeks: [] }
   ```

#### **⚠️ Observações Importantes:**
- **Datas:** Sempre usar formato ISO DateTime (`2025-07-20T00:00:00.000Z`)
- **Autenticação:** Todos os requests precisam do token JWT
- **Validação:** Backend valida automaticamente as datas e dados
- **Segurança:** Usuário só acessa suas próprias semanas
- **Performance:** Endpoints otimizados para resposta rápida

#### **🎉 Benefícios Implementados:**
- ✅ **Persistência completa** - Dados não se perdem após refresh
- ✅ **Histórico preservado** - Semanas finalizadas ficam salvas
- ✅ **Múltiplas semanas** - Suporte a semanas futuras
- ✅ **Expiração automática** - Semanas expiradas são finalizadas
- ✅ **Segurança total** - Autenticação e validação em todos os endpoints

---

**🎯 RESULTADO: O backend está 100% pronto para integração com o frontend!**

**Todos os requisitos foram implementados, testados e estão funcionando perfeitamente. O frontend pode começar a integração imediatamente usando os endpoints documentados acima.** 