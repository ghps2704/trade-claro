# Trade Claro — Diário de Trades

> Registre seus trades, entenda seus padrões e evolua como trader.

Trade Claro é uma aplicação web para traders brasileiros que querem além de registrar operações — **entender o comportamento por trás delas**. Com insights automáticos sobre emoção, disciplina e padrões de resultado, você toma decisões mais conscientes.

---

## Funcionalidades

- **Diário de trades** — registre data, ativo, direção (Long/Short), resultado, emoção, confiança, plano seguido, notas e tags
- **Dashboard analítico** — KPIs em tempo real: win rate, resultado médio, sequência atual, melhor ativo
- **Gráfico de desempenho** — barras dos últimos 14 trades com tooltip de hover
- **Insights automáticos** — detecção de padrões: revenge trade, impacto do humor, valor da disciplina, melhor dia da semana
- **Análise por emoção** — tabela cruzando faixa emocional × resultado médio × win rate
- **Autenticação segura** — login/cadastro com Supabase Auth + RLS por usuário
- **170+ ativos** — Futuros (WINFUT, DOLFUT…), Ações Ibovespa, ETFs, FIIs, BDRs e Cripto

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + TypeScript |
| Build | Vite |
| Estilo | Tailwind CSS |
| Roteamento | React Router v6 |
| Backend / Auth | Supabase (PostgreSQL + RLS) |
| Deploy | Vercel / Netlify (estático) |

---

## Pré-requisitos

- Node.js 18+
- npm, yarn ou pnpm
- Conta no [Supabase](https://supabase.com) (gratuita)

---

## Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/trade-claro.git
cd trade-claro

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do Supabase

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

Essas chaves estão disponíveis em **Supabase → Project Settings → API**.

---

## Configuração do Supabase

Execute o SQL abaixo no **SQL Editor** do seu projeto Supabase para criar as tabelas e políticas de segurança:

```sql
-- Tabela de trades
create table trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  asset text not null,
  type text check (type in ('Long', 'Short')) not null,
  result numeric not null,
  emotion int check (emotion between 1 and 10) not null,
  confidence int check (confidence between 1 and 10) not null,
  followed_plan boolean not null default false,
  note text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Habilitar RLS
alter table trades enable row level security;

-- Políticas: cada usuário vê/edita apenas seus próprios trades
create policy "Usuário vê seus trades"
  on trades for select using (auth.uid() = user_id);

create policy "Usuário insere seus trades"
  on trades for insert with check (auth.uid() = user_id);

create policy "Usuário atualiza seus trades"
  on trades for update using (auth.uid() = user_id);

create policy "Usuário deleta seus trades"
  on trades for delete using (auth.uid() = user_id);
```

---

## Scripts disponíveis

```bash
npm run dev      # Servidor de desenvolvimento (http://localhost:5173)
npm run build    # Build de produção (pasta dist/)
npm run preview  # Preview do build de produção
npm run lint     # Verificação de lint (ESLint)
```

---

## Estrutura do projeto

```
trade-claro/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx        # Navegação lateral
│   │   │   └── AppLayout.tsx      # Layout base do app
│   │   └── ui/
│   │       ├── KpiCard.tsx        # Card de métrica com cores e trend
│   │       ├── InsightCard.tsx    # Card de insight com severidade
│   │       └── ...
│   ├── hooks/
│   │   └── useTrades.ts           # Hook principal: busca e CRUD de trades
│   ├── lib/
│   │   ├── supabase.ts            # Client Supabase
│   │   └── insights.ts            # Algoritmos de detecção de padrões
│   ├── pages/
│   │   ├── Landing.tsx            # Landing page pública
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx          # Painel analítico principal
│   │   ├── Diary.tsx              # Listagem e cadastro de trades
│   │   └── Insights.tsx           # Insights automáticos
│   ├── types/
│   │   └── index.ts               # Interfaces TypeScript + listas de ativos/tags
│   ├── App.tsx                    # Configuração de rotas
│   └── main.tsx
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── .env                           # Não versionado
```

---

## Rotas

| Rota | Componente | Acesso |
|------|-----------|--------|
| `/` | Landing | Público |
| `/login` | Login | Público |
| `/register` | Register | Público |
| `/dashboard` | Dashboard | Autenticado |
| `/diary` | Diary | Autenticado |
| `/insights` | Insights | Autenticado |

---

## Insights automáticos detectados

| Insight | Lógica |
|---------|--------|
| **Humor afeta resultado** | Compara média de resultado com emoção ≥8 vs ≤4 |
| **Valor da disciplina** | Compara média com plano seguido vs não seguido |
| **Tag recorrente em perdas** | Tag mais frequente em trades negativos (mín. 2 ocorrências) |
| **Melhor/pior dia da semana** | Agrupa trades por dia e compara médias (mín. 2 trades/dia) |
| **Alerta Revenge Trade** | Detecta 2 trades negativos consecutivos mais recentes |

---

## Licença

MIT — use, modifique e distribua livremente.
