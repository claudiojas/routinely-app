# Integração OAuth Google – Backend Routinely

## Status da Implementação

✅ **Backend pronto para integração com o frontend!**

- Todas as rotas e lógica necessárias para login social com Google já estão implementadas.
- O backend já realiza todo o fluxo OAuth, cria/atualiza usuário no banco, gera JWT e redireciona para o frontend.

---

## 1. Variáveis de Ambiente Necessárias

Adicione ao `.env` do backend:
```
GOOGLE_CLIENT_ID=694810699857-q080hq49g04ifajhk9465rnj7beqffhf.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GOOGLE_REDIRECT_URI_FRONTEND=http://localhost:5173
JWT_SECRET=bb4c8f032e5d9c7a1f6b8e3d0a2c5f7e9b1d3e5f7a9c1b3d5e7f9a1c3b5d7e9f
```

---

## 2. Endpoints Implementados

### a) Iniciar OAuth
- **Rota:** `GET /api/auth/google`
- **Ação:** Redireciona o usuário para o consentimento do Google, solicitando os escopos:
  - `openid`
  - `email`
  - `profile`
  - `https://www.googleapis.com/auth/calendar`

### b) Callback do Google
- **Rota:** `GET /api/auth/google/callback`
- **Ação:**
  1. Recebe o `code` do Google
  2. Troca o `code` por tokens de acesso/refresh
  3. Usa o token para buscar dados do usuário (Google People API ou endpoint de profile)
  4. Cria/atualiza usuário no banco de dados
  5. Salva tokens de acesso/refresh para uso futuro (integração calendar)
  6. Gera JWT da aplicação para manter sessão
  7. Redireciona para o frontend em `/auth/callback?token=SEU_JWT`

---

## 3. Fluxo Esperado (Frontend)

1. Usuário clica em “Entrar com Google” no frontend
2. Frontend redireciona para `/api/auth/google`
3. Backend redireciona para o Google (com escopos de login + calendar)
4. Usuário autoriza
5. Google redireciona para `/api/auth/google/callback?code=...`
6. Backend autentica, gera JWT e redireciona para o frontend:
   - Exemplo: `http://localhost:5173/auth/callback?token=SEU_JWT`
7. Frontend deve capturar o token da URL, salvar e autenticar o usuário normalmente

---

## 4. Observações Técnicas
- O JWT retornado é compatível com o restante da API (mesmo segredo).
- O backend já salva tokens de integração do Google para uso futuro (ex: Google Calendar).
- O frontend só precisa tratar o callback e armazenar o token.
- O fluxo é seguro e não expõe segredos sensíveis ao frontend.

---

## 5. Exemplo de Redirecionamento para o Google (Node.js/Express)
```js
const params = new URLSearchParams({
  client_id: process.env.GOOGLE_CLIENT_ID,
  redirect_uri: process.env.GOOGLE_REDIRECT_URI,
  response_type: 'code',
  scope: [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/calendar'
  ].join(' '),
  access_type: 'offline',
  prompt: 'consent'
});
res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
```

---

## 6. Links Úteis
- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [Google Calendar API](https://developers.google.com/calendar/api/guides/auth)
- [google-auth-library (npm)](https://www.npmjs.com/package/google-auth-library)
- [passport-google-oauth20 (npm)](http://www.passportjs.org/packages/passport-google-oauth20/)

---

**Dúvidas?**
O backend está pronto para integração. Qualquer dúvida ou ajuste, fale com o responsável pelo backend. 