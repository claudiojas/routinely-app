# Progresso da Integração OAuth Google (Login + Calendar)

## Última atualização: [preencher data ao retomar]

---

## Backend
- ✅ Endpoints de OAuth Google implementados:
  - /api/auth/google (inicia login)
  - /api/auth/google/callback (processa callback, gera JWT, salva tokens do Google)
- ✅ Integração com Google Calendar já solicita escopo correto
- ✅ Redireciona para o frontend com JWT em /auth/callback?token=...
- ✅ Variáveis de ambiente (.env) configuradas
- ⚠️ App ainda em modo de teste no Google Cloud Console
- ⚠️ Usuários de teste precisam ser cadastrados na tela de consentimento

---

## Frontend
- ✅ Botão "Entrar com Google" redireciona para /api/auth/google
- ✅ Página /auth/callback implementada: captura token da URL, salva e autentica usuário
- ✅ Proxy do Vite configurado para /api
- ✅ Fluxo de login tradicional mantido
- ⚠️ Falta integração do token JWT salvo com o contexto global de autenticação (opcional)
- ⚠️ Falta feedback visual para erros de OAuth (opcional)

---

## Pendências/Próximos Passos
- [ ] Corrigir erro de autorização do Google (provavelmente relacionado a usuários de teste ou tela de consentimento)
- [ ] Testar login com Google após ajuste
- [ ] (Opcional) Integrar token JWT salvo ao contexto global de auth
- [ ] (Opcional) Melhorar UX de loading/erros na tela de callback
- [ ] (Futuro) Usar tokens do Google salvos para criar/listar eventos no Google Calendar

---

**Resumo:**
- O fluxo completo de login com Google + permissão do Calendar está implementado, mas bloqueado por restrição do Google para apps não verificados.
- Retomar a partir da correção do erro de autorização no Google Cloud Console. 