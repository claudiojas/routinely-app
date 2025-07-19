# 📝 Endpoint de Edição de Atividades

## 🎯 Informações Rápidas

**Status:** ✅ **IMPLEMENTADO E FUNCIONAL**  
**Rota:** `PUT /api/activities/:id`  
**Autenticação:** ✅ **OBRIGATÓRIA** (JWT Token)

---

## 📡 Detalhes do Endpoint

### **URL Base**
```
PUT http://localhost:3000/api/activities/:id
```

### **Headers Obrigatórios**
```http
Authorization: Bearer <seu-jwt-token>
Content-Type: application/json
```

### **Parâmetros da URL**
- `:id` - ID da atividade a ser editada (UUID)

---

## 📦 Payload (Request Body)

### **Interface TypeScript**
```typescript
interface UpdateActivityRequest {
  title?: string;
  description?: string;
  type?: 'PESSOAL' | 'TRABALHO' | 'ESTUDO' | 'SAUDE' | 'OUTRO';
  startTime?: string;
  endTime?: string;
  date: string; // ⚠️ OBRIGATÓRIO - formato YYYY-MM-DD
}
```

### **Exemplo de Payload**
```json
{
  "title": "Reunião Atualizada",
  "description": "Nova descrição da reunião",
  "type": "TRABALHO",
  "startTime": "09:30",
  "endTime": "10:30",
  "date": "2024-01-15"
}
```

---

## ✅ Resposta de Sucesso

### **Status Code:** `200 OK`

### **Response Body**
```json
{
  "data": {
    "id": "uuid-da-atividade",
    "userId": "uuid-do-usuario",
    "title": "Reunião Atualizada",
    "description": "Nova descrição da reunião",
    "type": "TRABALHO",
    "startTime": "09:30",
    "endTime": "10:30",
    "date": "2024-01-15",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## ❌ Resposta de Erro

### **Status Code:** `500 Internal Server Error`

### **Response Body**
```json
{
  "error": "Error during update activity!"
}
```

---

## 🔍 Validações do Backend

### **Campos Obrigatórios**
- `date` - Formato: `YYYY-MM-DD` (regex: `/^\d{4}-\d{2}-\d{2}$/`)

### **Campos Opcionais**
- `title` - Mínimo 1 caractere
- `description` - String opcional
- `type` - Enum: `['PESSOAL', 'TRABALHO', 'ESTUDO', 'SAUDE', 'OUTRO']`
- `startTime` - Formato: `HH:MM`
- `endTime` - Formato: `HH:MM`

### **Validações de Segurança**
- ✅ Verifica se a atividade pertence ao usuário
- ✅ Valida formato de data
- ✅ Valida tipos de atividade

---

## 🚀 Exemplo de Implementação Frontend

### **Hook React Query**
```typescript
const useUpdateActivity = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateActivityRequest }) =>
      api.put(`/activities/${id}`, data),
    onSuccess: () => {
      // Invalidate queries para atualizar cache
      queryClient.invalidateQueries(['activities']);
    },
  });
};
```

### **Uso no Componente**
```typescript
const updateActivity = useUpdateActivity();

const handleUpdate = async (activityId: string, data: UpdateActivityRequest) => {
  try {
    await updateActivity.mutateAsync({ 
      id: activityId, 
      data: {
        ...data,
        date: '2024-01-15' // ⚠️ SEMPRE INCLUIR ESTE CAMPO
      } 
    });
    // Sucesso
  } catch (error) {
    // Tratar erro
  }
};
```

---

## ⚠️ Pontos Importantes

### **1. Campo `date` Obrigatório**
O backend **SEMPRE** espera o campo `date` no formato `YYYY-MM-DD`. Se não for enviado, retornará erro.

### **2. Autenticação**
O endpoint requer token JWT válido no header `Authorization`.

### **3. Propriedade da Atividade**
O backend verifica se a atividade pertence ao usuário logado antes de permitir edição.

### **4. Validação de Dados**
Todos os campos são validados no backend com Zod schema.

---

## 🔧 Teste Rápido

### **cURL**
```bash
curl -X PUT http://localhost:3000/api/activities/activity-id \
  -H "Authorization: Bearer seu-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste",
    "type": "PESSOAL",
    "startTime": "10:00",
    "endTime": "11:00",
    "date": "2024-01-15"
  }'
```

### **Postman/Insomnia**
- **Method:** PUT
- **URL:** `http://localhost:3000/api/activities/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** JSON com os campos da interface

---

## 📋 Checklist Frontend

- [ ] Adicionar campo `date` ao `UpdateActivityRequest`
- [ ] Implementar hook `useUpdateActivity`
- [ ] Criar formulário de edição
- [ ] Adicionar validação de campos
- [ ] Implementar tratamento de erros
- [ ] Testar com dados reais
- [ ] Adicionar loading states
- [ ] Implementar feedback visual

---

**🎯 O backend está 100% pronto para integração! Só precisa ajustar o payload do frontend para incluir o campo `date` obrigatório.** 