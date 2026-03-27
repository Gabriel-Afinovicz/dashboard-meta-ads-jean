# Meta Clinic Dashboard

Dashboard executivo para monitoramento de investimentos em Meta Ads de clínicas. Exibe dados consolidados de investimento, leads e faturamento estimado por conta de anúncio, consumindo dados diretamente da Meta Marketing API.

---

## Funcionalidades

- Visão consolidada do mês calendário anterior completo
- Cards de resumo: investimento total, leads gerados, faturamento estimado e total de clínicas
- Tabela detalhada por clínica com nome oficial da conta Meta, ID da conta, investimento, leads e faturamento estimado
- Gráfico comparativo investimento × faturamento estimado por clínica
- Dados buscados 100% no servidor (token nunca exposto ao frontend)
- Estados de loading, erro e vazio
- Layout responsivo com sidebar lateral

---

## Regra de negócio: Faturamento estimado

O faturamento estimado **não vem da Meta**. É calculado internamente com um multiplicador fixo:

```
Faturamento estimado = Investimento × 10
```

Exemplo: R$ 5.000 investidos → R$ 50.000 estimados.

---

## Stack

| Tecnologia | Uso |
|---|---|
| Next.js 15 (App Router) | Framework principal |
| TypeScript | Tipagem estática |
| Tailwind CSS | Estilização |
| Recharts | Gráficos |
| Lucide React | Ícones |
| Meta Marketing API | Fonte oficial de dados |

---

## Configuração

### 1. Clonar o repositório

```bash
git clone <url-do-repositório>
cd meta-clinic-dashboard
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus dados:

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local`:

```env
# Token de acesso gerado no Meta for Developers
# Acesse: https://developers.facebook.com/tools/explorer/
META_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxx

# Versão da API (manter v25.0 ou superior)
META_API_VERSION=v25.0

# IDs das contas de anúncio das clínicas (com prefixo act_)
# Separe múltiplas contas por vírgula
META_AD_ACCOUNT_IDS=act_111111111,act_222222222,act_333333333

# Nome da aplicação (exibido no cabeçalho)
NEXT_PUBLIC_APP_NAME=Meta Clinic Dashboard
```

### 4. Como obter o META_ACCESS_TOKEN

1. Acesse [Meta for Developers](https://developers.facebook.com/)
2. Vá em **Tools > Graph API Explorer**
3. Selecione o App desejado
4. Em **Permissions**, adicione: `ads_read`, `read_insights`
5. Clique em **Generate Access Token**
6. Para uso em produção, gere um **System User Token** com permissões de longa duração

> **Atenção:** Nunca compartilhe seu token ou faça commit do `.env.local`.

### 5. Como obter os META_AD_ACCOUNT_IDS

1. Acesse o [Gerenciador de Anúncios da Meta](https://adsmanager.facebook.com/)
2. O ID da conta aparece no topo da página (ex: `act_123456789`)
3. Ou consulte via API: `GET /me/adaccounts?fields=id,name`

### 6. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

### 7. Build para produção

```bash
npm run build
npm start
```

---

## Estrutura do projeto

```
meta-clinic-dashboard/
├── app/
│   ├── api/
│   │   └── dashboard/
│   │       └── route.ts          # API route server-side
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── dashboard/
│   │   ├── dashboard-view.tsx    # Componente principal (client)
│   │   ├── summary-cards.tsx     # Cards de resumo
│   │   ├── clinics-table.tsx     # Tabela de clínicas
│   │   ├── investment-chart.tsx  # Gráfico de barras
│   │   └── error-state.tsx       # Estado de erro
│   ├── layout/
│   │   ├── app-shell.tsx         # Shell responsivo
│   │   ├── sidebar.tsx           # Sidebar lateral
│   │   └── topbar.tsx            # Topbar mobile
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── skeleton.tsx
├── lib/
│   ├── meta/
│   │   ├── fetch-meta-insights.ts   # Comunicação com a Meta API
│   │   ├── normalize-meta-data.ts   # Normalização e extração de leads
│   │   └── get-last-month-range.ts  # Cálculo do período
│   └── utils.ts
├── services/
│   └── dashboard-service.ts      # Orquestração dos dados
├── types/
│   └── meta.ts                   # Tipagem TypeScript
├── utils/
│   ├── format-currency.ts
│   ├── format-number.ts
│   └── calculate-revenue.ts
├── .env.example
├── .env.local                    # NÃO commitar
└── README.md
```

---

## Como os leads são calculados

A Meta retorna métricas de ação com diferentes `action_type`. O sistema mapeia os seguintes tipos como "lead":

| action_type | Descrição |
|---|---|
| `lead` | Lead genérico |
| `leadgen_grouped` | Lead via formulário nativo |
| `onsite_conversion.lead_grouped` | Lead onsite agrupado |
| `offsite_conversion.fb_pixel_lead` | Lead via pixel offsite |
| `contact` | Contato iniciado |
| `schedule` | Agendamento |
| `submit_application` | Envio de formulário |

Se nenhum desses tipos for retornado para uma conta, o valor de leads será `0`.

---

## Observações de segurança

- O `META_ACCESS_TOKEN` é lido exclusivamente no servidor
- Nenhuma chamada à Meta API é feita no cliente (browser)
- A API route `/api/dashboard` é o único ponto de saída dos dados
- O arquivo `.env.local` está no `.gitignore` por padrão
