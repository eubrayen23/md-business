# Cangundoo Imóveis 👷‍♀️

Aplicativo mobile em React Native (Expo + TypeScript) focado na compra e venda de imóveis em Angola, com integração Supabase e IA DeepSeek para descrições automáticas e assistência em negociações.

## Stack

- Expo 51 (managed) + Expo Router
- React Native Paper (UI), React Hook Form + Zod
- Supabase (Auth, Postgres, Storage, Realtime, Edge Functions)
- DeepSeek (descrição de imóveis & chat assistido)
- Expo Notifications (push), Sentry (sugerido)
- Zustand + React Query para estado/queries

## Estrutura de Pastas

```
app/                    # Expo Router (layouts + telas)
components/             # UI compartilhada (ex.: PropertyCard)
features/               # Domínios (auth, properties, chat, profile, notifications)
layout/                 # Providers globais
lib/                    # Tema, hooks, utils, config
services/               # Supabase client, AI, storage, notifications
store/                  # Zustand stores
supabase/               # Migrations & Edge Functions
types/                  # Tipos compartilhados
assets/                 # Ícones, splash, sons
```

## Setup

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Variáveis de ambiente**
   - Copie `.env.example` para `.env` e preencha:
     ```
     EXPO_PUBLIC_SUPABASE_URL=
     EXPO_PUBLIC_SUPABASE_ANON_KEY=
     SUPABASE_URL=
     SUPABASE_SERVICE_ROLE_KEY=
     DEEPSEEK_API_URL=
     DEEPSEEK_API_KEY=
     EXPO_PUBLIC_APP_ENV=development
     ```

3. **Supabase**
   ```bash
   supabase start          # inicia stack local
   supabase migration up   # aplica migrations (supabase/migrations)
   supabase functions serve --env-file .env --import-map supabase/functions/import_map.json
   ```

4. **Executar app**
   ```bash
   npm run start
   ```

5. **Testes e qualidade**
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   ```

## Fluxos Implementados

- Onboarding (`/(public)/onboarding`)
- Autenticação (login, signup, recuperação de senha via Supabase Auth)
- Listagem com filtros (cidade, tipo, faixa de preço em Kz)
- Detalhe do imóvel com favoritar, chat e IA de negociação
- Chat comprador ↔ vendedor em tempo real (Supabase Realtime)
- Publicar imóvel com upload para Supabase Storage + descrição automática DeepSeek
- Perfil com gestão de anúncios, edição e logout
- Registro automático de push token (Expo Notifications + Supabase)

## Edge Functions

- `generate-description`: gera texto com DeepSeek para novos imóveis.
- `chat-assistant`: devolve sugestões de mensagens para negociação.
- `send-notification`: dispara push via Expo para tokens armazenados.

> Rodar via `supabase functions deploy <name>` após configurar secrets (`DEEPSEEK_*`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`).

## Próximos Passos Recomendados

- Ajustar UI com design system (Figma) e substituir assets placeholders (`assets/`).
- Habilitar Sentry e logs analíticos.
- Cobertura Detox para fluxos críticos (login, filtros, chat, publicação).
- Configurar triggers Supabase → `send-notification` (new message, novo favorito).
- Criar seeds com imóveis de exemplo (`supabase/seed.sql`).
- Preparar pipelines GitHub Actions (lint/test/eas build preview).

## Scripts Úteis

- `npm run start`: Expo dev client
- `npm run lint` / `npm run typecheck` / `npm run test`
- `supabase:start` / `supabase:stop` / `supabase:migrate`

## Contato & Suporte

Documente segredos no 1Password, mantenha `.env` fora do Git. Merge requests devem rodar `npm run lint && npm run typecheck && npm run test`. Para dúvidas, alinhar com o Product Owner e o time de engenharia antes de alterar fluxos críticos.
