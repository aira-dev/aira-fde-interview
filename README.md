# Etapa Técnica — Engenheiro de CS (AIRA)

Bem-vindo. Este repositório é o seu ponto de partida para o desafio.

O cenário: você recebe um **tenant da AIRA já configurado** (cliente, recursos, regras de negócio e plano prontos) e uma **base pública de uso real**. Sua missão é transformar essa base em eventos, enviá-los para a AIRA, fazer o faturamento rodar e validar que a fatura fechou no valor esperado.

A história, os planos e os clientes estão descritos na seção abaixo.

---

## Contexto: Bike LTDA

Você é da **Bike LTDA**, uma operadora de bicicletas compartilhadas, e contratou a AIRA para fazer o faturamento da empresa.

**Tenant ID (staging):** `6a324d41-44bf-41f1-b564-3ad2a842a524`

A Bike LTDA cobra de duas formas, somadas: **por corrida** (valor fixo por viagem) e **por duração** (valor por segundo de viagem).

### Planos

Existem dois planos. O plano de cada viagem é dado pela coluna `usertype` da base: `Customer` → plano **Customer**, `Subscriber` → plano **Subscriber**.

| Plano | Preço por corrida | Preço por segundo de duração |
|---|---:|---:|
| `Customer` | R$ 10,00 | R$ 0,50 |
| `Subscriber` | R$ 5,00 | R$ 0,10 |

### Clientes

Os clientes da Bike LTDA são as **estações ativas**. Cada estação é cobrada de acordo com as viagens que partiram dela — cada viagem pertence ao cliente identificado pela sua `start station name`. São **51 clientes**:

<details>
<summary>Ver os 51 clientes</summary>

```
Fairmount Ave
Oakland Ave
Sip Ave
Lincoln Park
Newark Ave
Morris Canal
Paulus Hook
Hamilton Park
Monmouth and 6th
Bergen Ave
Pershing Field
Harborside
City Hall
Glenwood Ave
Hilltop
Marin Light Rail
Christ Hospital
Jackson Square
Van Vorst Park
Liberty Light Rail
Essex Light Rail
Jersey & 6th St
Grand St
York St
Union St
Newport Pkwy
Grove St PATH
Baldwin at Montgomery
Hoboken Ave at Monmouth St
Lafayette Park
Brunswick & 6th
Columbus Dr at Exchange Pl
JC Medical Center
Warren St
Dey St
Columbus Drive
Dixon Mills
Manila & 1st
Jersey & 3rd
Brunswick St
Montgomery St
McGinley Square
Newport PATH
Washington St
Riverview Park
Astor Place
Heights Elevator
Journal Square
Leonard Gordon Park
5 Corners Library
Communipaw & Berry Lane
```

</details>

---

## Acesso à AIRA

### UI (painel)

Use o painel para inspecionar o tenant, o plano, o cliente e a fatura.

- **Ambiente:** https://app.staging.useaira.com
- **Usuário:** `usuario@aira.com`
- **Senha:** `12345678`

### API

A ingestão de eventos e o fluxo de faturamento são feitos via API. Autentique suas requisições com a `API_KEY` (consulte a documentação da AIRA para o formato esperado).

```
API_URL=https://api.staging.useaira.com
API_KEY=0eeec79cd752efa4c0b4b7947d7d1f41f5ac5e5a9d8f6855bde09e1b921d7a0a
```

> Ambiente de **staging**. Cabe a você credenciar essas chaves no seu código, na hora da requisição.

---

## Ponto de partida (servidor)

O repositório já vem com um servidor mínimo em **Fastify + TypeScript** para você não começar do zero.

```bash
npm install
npm run dev          # tsx watch — reinicia ao salvar
curl localhost:3000/health
# {"status":"ok","service":"aira-fde-interview","time":"..."}
```

Scripts disponíveis:

- `npm run dev` — roda com auto-reload (`tsx watch`)
- `npm start` — roda uma vez (`tsx`)
- `npm run typecheck` — só checagem de tipos (`tsc --noEmit`)

Config: `PORT` (default `3000`). Copie `.env.example` para `.env` se precisar ajustar.

---

## Base de dados

Arquivo: [`data/citibike-trips.csv`](data/citibike-trips.csv)

Extrato real de viagens de bicicleta compartilhada (Citi Bike — Jersey City), cobrindo **abril a junho de 2026**. **Cada linha é uma viagem concluída** — essa é a unidade de uso do faturamento.

Colunas:

| Coluna | Descrição |
|---|---|
| `tripduration` | Duração da viagem, em segundos. |
| `starttime` | Data e hora de início da viagem (precisão de sub-segundo). |
| `start station id` | Identificador da estação onde a viagem começou. |
| `start station name` | Nome da estação onde a viagem começou. |
| `start station latitude` | Latitude da estação de início. |
| `start station longitude` | Longitude da estação de início. |
| `bikeid` | Identificador da bicicleta usada. |
| `usertype` | Tipo de quem pedalou: `Customer` (avulso) ou `Subscriber` (assinante). |
| `birth year` | Ano de nascimento informado pelo usuário. |
| `gender` | Gênero informado: `0` = não informado, `1` = masculino, `2` = feminino. |

> Antes de mandar qualquer coisa para a AIRA, vale abrir o arquivo e olhar os dados com calma.

---

## Objetivo

Enviar para a AIRA, a partir deste repositório e usando as credenciais fornecidas, **todas as viagens da base como eventos** — estruturados corretamente para que a AIRA consiga computá-los e fechar o faturamento da Bike LTDA.

Ponto de partida obrigatório: a **documentação da AIRA**, na parte de **eventos**, que explica como a estrutura de eventos funciona e como enviá-los.

**Documentação da AIRA:** https://docs.useaira.com/api-reference/introduction

### 1. Enviar os eventos

- Abrir a AIRA e entender **como o cliente está cadastrado** no tenant.
- Entender **como enviar eventos** para a AIRA.
- Entender **como estruturar o metadado (as propriedades) dos eventos** para que a AIRA consiga lê-los — coerente com a forma como os **recursos** e os **filtros de recurso** do tenant foram configurados.
- Enviar **todas** as viagens da base como eventos para a AIRA.

### 2. Validar e faturar

- Abrir a AIRA e **validar se os eventos chegaram corretamente**.
- **Recalcular todas as faturas.**
- Apresentar o **resultado do faturamento, na dashboard**, para o Diego.

## Critério de sucesso

Dois eixos:

**1. Corretude dos dados.** O faturamento computado pela AIRA tem que **bater com o esperado** — e não só no total: tem que fechar **por mês** e **por plano** (Customer e Subscriber). Num contexto de billing, número errado é dinheiro errado.

**2. Revisão técnica do código.** Haverá uma mini entrevista técnica sobre o código implementado para enviar os eventos. Você vai ter que **explicar o que implementou** — as decisões que tomou, como estruturou os eventos, onde a IA ajudou ou atrapalhou, e o que faria diferente.
