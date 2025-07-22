# 💬 API de Comentários por Dia da Semana

Esta documentação descreve como utilizar os endpoints REST para adicionar, editar, listar e remover comentários em dias específicos de uma semana no Routinely API.

---

## 📋 Visão Geral
- Cada semana (`Week`) pode ter até 1 comentário por dia (Domingo a Sábado).
- Apenas o usuário dono da semana pode manipular os comentários.
- Todos os endpoints exigem autenticação JWT.

---

## Endpoints

### 1. Listar Comentários de Todos os Dias da Semana
**GET /weeks/:weekId/comments**
- **Headers:** `Authorization: Bearer <token>`
- **Resposta:**
```json
{
  "data": [
    { "id": "1", "weekId": "abc", "dayOfWeek": 0, "comment": "Domingo!", ... },
    { "id": "2", "weekId": "abc", "dayOfWeek": 1, "comment": "Segunda-feira", ... }
    // ...até 6 (sábado)
  ]
}
```

---

### 2. Criar ou Sobrescrever Comentário de um Dia
**POST /weeks/:weekId/comments**
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "dayOfWeek": 2,      // 0=Domingo, 1=Segunda, ..., 6=Sábado
  "comment": "Terça-feira animada!"
}
```
- **Resposta:**
```json
{
  "data": {
    "id": "3",
    "weekId": "abc",
    "dayOfWeek": 2,
    "comment": "Terça-feira animada!",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 3. Editar Comentário de um Dia
**PUT /weeks/:weekId/comments/:dayOfWeek**
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "comment": "Novo texto para a terça-feira"
}
```
- **Resposta:**
```json
{
  "data": {
    "id": "3",
    "weekId": "abc",
    "dayOfWeek": 2,
    "comment": "Novo texto para a terça-feira",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 4. Remover Comentário de um Dia
**DELETE /weeks/:weekId/comments/:dayOfWeek**
- **Headers:** `Authorization: Bearer <token>`
- **Resposta:**
```json
{
  "message": "Comentário removido com sucesso"
}
```

---

## Parâmetros
- **weekId:** ID da semana (string)
- **dayOfWeek:** Número do dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado)
- **comment:** Texto do comentário (até 255 caracteres)

---

## Fluxo Sugerido no Frontend
1. **Listar comentários ao abrir a semana:**
   - Chame `GET /weeks/:weekId/comments` e exiba os comentários nos campos de cada dia.
2. **Adicionar/editar comentário:**
   - Use `POST` para criar ou sobrescrever, ou `PUT` para editar um comentário existente.
3. **Remover comentário:**
   - Use `DELETE` para remover o comentário de um dia.

---

## Observações
- Só é permitido um comentário por dia/semana.
- O usuário só pode manipular comentários das suas próprias semanas.
- Todos os endpoints retornam erro 400 para parâmetros inválidos ou 401 para autenticação inválida.

---

**Routinely API** — Comentários diários para uma rotina mais organizada! 