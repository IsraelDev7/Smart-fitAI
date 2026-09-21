# SmartFit AI Platform

Monorepo de uma plataforma de fitness e nutrição: aplicativo móvel e web
**dividindo o mesmo contrato de tipos**, banco com migrações versionadas,
cobrança com webhook e integração transparente para as chamadas de IA.

**Stack:** pnpm workspaces · Next.js (App Router) · Expo / React Native ·
TypeScript · Supabase (Postgres + RLS) · Stripe

---

## O que este projeto demonstra

Os outros projetos deste portfólio provam entrega. Este prova **organização
de sistema** — a pergunta que uma empresa faz antes de contratar alguém para
mexer numa base que outras pessoas vão manter:

| Decisão | Por que ela importa fora do código |
|---|---|
| Tipos compartilhados em `packages/shared` | Mobile e web não podem discordar sobre o que é um treino. Um contrato só, em um lugar só |
| Migrações SQL versionadas | O banco tem histórico, revisão e reversão — como o código |
| Webhook de cobrança separado do checkout | Pagamento confirma pelo provedor, não pela volta do navegador. É a diferença entre cobrar e achar que cobrou |
| CI em cada push | `lint` e `typecheck` antes de qualquer merge |
| Documentação de arquitetura escrita antes | Nove documentos em `docs/architecture`, versionados junto |

---

## Estrutura

```
apps/
  web/                 Next.js App Router (PWA)
    app/api/
      ai/nutri-muzy    contrato das chamadas de IA
      avatar/jobs      fila de geração de avatar
      billing/checkout início da assinatura
      billing/webhook  confirmação vinda do Stripe
      community/feed   feed social
      health           verificação de saúde
    lib/
      billing/         precificação e persistência
      stripe/server    cliente do lado do servidor
      supabase/        cliente do navegador e cliente administrativo
  mobile/              Expo — Auth · Home · Workout · Nutrition ·
                       Progress · Community

packages/shared/       tipos, contratos e constantes usados pelos dois apps

infra/supabase/
  migrations/          esquema versionado
  seed.sql             dados de exemplo

docs/
  architecture/        nove documentos (em inglês)
  product/mvp-scope.md
```

---

## Decisões técnicas que valem explicação

### 1. Um pacote de tipos, dois aplicativos

O erro mais caro num produto com mobile e web é os dois divergirem sobre o
formato dos dados. Não quebra na hora: quebra semanas depois, num campo que
um lado passou a mandar e o outro nunca leu.

`packages/shared` é a fonte única. Quem mudar o contrato quebra o
`typecheck` dos dois aplicativos no mesmo commit — que é exatamente onde o
problema deve aparecer.

### 2. O webhook é separado do checkout

O retorno do navegador depois do pagamento **não é** confirmação: a pessoa
pode fechar a aba, perder rede ou voltar antes da hora. A confirmação
autoritativa vem do provedor, pelo webhook, num endpoint próprio.

Confundir os dois é o defeito mais comum em integração de pagamento — e o que
produz o pior tipo de erro: pedido pago que o sistema acha que não foi, ou o
inverso.

### 3. Dois clientes de Supabase, de propósito

`lib/supabase/client.ts` roda no navegador e respeita as políticas de
segurança em nível de linha. `lib/supabase/admin.ts` usa a chave de serviço e
**nunca** pode chegar ao navegador. Separar em arquivos diferentes torna a
confusão visível: importar o errado fica óbvio na revisão, em vez de virar
vazamento silencioso.

### 4. Supabase em vez de backend próprio

Autenticação, banco e políticas de acesso resolvidos por uma peça só, com RLS
aplicado no banco e não na aplicação. Para um MVP multi-inquilino, isso
elimina a categoria inteira de erro em que uma consulta esquece o filtro de
inquilino.

---

## Como rodar

```bash
pnpm install
pnpm dev:web        # Next.js
pnpm dev:mobile     # Expo
pnpm lint
pnpm typecheck
```

Variáveis em `.env.example`, na raiz e em cada aplicativo.

---

## Estado atual

Este é um **MVP em construção**, e vale dizer com clareza o que já existe e o
que ainda não:

**Pronto** — estrutura do monorepo, contrato de tipos compartilhado, esquema
do banco com migrações, rotas de API desenhadas, telas do mobile e do web
navegáveis, CI passando.

**Em andamento** — várias telas ainda leem de `lib/mock-data.ts` e
`src/data/mock.ts`. A troca por dados reais é feita rota a rota, e os arquivos
de mock estão nomeados para que ninguém confunda os dois.

**Planejado** — Edge Functions do Supabase, a camada de moderação das
chamadas de IA e o pipeline de geração de avatar.

---

## Limites conhecidos

- **CI sem teste.** `lint` e `typecheck` provam que compila, não que funciona.
  Os primeiros testes que valem são os da precificação (`lib/billing/pricing`)
  e o da assinatura inválida no webhook — é onde há dinheiro.
- **Sem deploy vivo.** O campo de homepage apontava para um endereço que
  respondia 404; foi removido até haver um ambiente de verdade. Link quebrado
  é pior que campo vazio.
- **Documentação de arquitetura em inglês**, enquanto este README está em
  português. Consistente com a origem dos documentos, inconsistente no
  conjunto — vale unificar.

---

## Histórico de correções relevantes

- **O repositório se chamava `conversor-tech`** e a descrição dizia
  "Conversor Tech Mobile App" — nada disso tem relação com o produto. Quem
  abria achava que tinha errado o link.
- **Artefatos de build versionados.** `packages/shared/dist/` e
  `apps/web/tsconfig.tsbuildinfo` estavam no índice. São gerados: entraram no
  `.gitignore` e saíram do repositório.

---

Construído por [Israel Passos](https://github.com/IsraelDev7) · Smart LABS
