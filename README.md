# Controle de Gastos Residenciais

Um sistema simples para controlar as finanças de uma casa: quem mora nela, quanto cada pessoa ganha e gasta, e qual o saldo de todo mundo junto. Foi feito pensando naquele cenário clássico de "quem deve o quê pra quem" dentro de uma república ou família.

O projeto é dividido em duas partes:

- **`DebtManager`** — a API (.NET), o coração da aplicação. É aqui que fica toda a lógica de negócio, validações e persistência dos dados.
- **`DebtDashboard`** — uma interface web (React + TypeScript) feita para consumir e testar a API visualmente, sem precisar ficar batendo requisições no Swagger o tempo todo.

---

## DebtManager (API)

API REST em **ASP.NET Core (.NET 10)** com **Entity Framework Core** e banco **SQLite**.

### O que ela faz

A API gira em torno de dois conceitos principais:

- **Person (Pessoa)**: alguém cadastrado no sistema, com nome e idade.
- **Transaction (Transação)**: um lançamento financeiro (`EXPENSE` ou `REVENUE`) associado a uma pessoa.

A partir disso, a API calcula automaticamente totais de gastos, receitas e saldo — tanto por pessoa quanto no consolidado geral.

Algumas regras de negócio já implementadas:
- Nome de pessoa precisa ter entre 3 e 50 caracteres, e idade entre 0 e 120.
- Pessoas menores de 18 anos não podem registrar receitas (`REVENUE`), só despesas.
- Valores de transação negativos são normalizados automaticamente (viram positivos).
- Excluir uma pessoa remove também todas as transações vinculadas a ela.
- Existe uma exclusão "segura" (soft delete) que apenas desativa a pessoa (`IsDisabled`), mantendo o histórico no banco mas escondendo ela das listagens.

### Endpoints

**Pessoas** (`/api/person`)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/person` | Lista todas as pessoas ativas |
| `GET` | `/api/person/totals` | Lista pessoas com totais de gastos, receitas e saldo |
| `GET` | `/api/person/people_totals` | Relatório consolidado (todas as pessoas + soma geral) |
| `GET` | `/api/person/transaction/{id}` | Lista as transações de uma pessoa específica |
| `POST` | `/api/person` | Cadastra uma nova pessoa |
| `DELETE` | `/api/person/{id}` | Remove uma pessoa (e suas transações) definitivamente |
| `DELETE` | `/api/person/{id}/disable` | Desativa uma pessoa (soft delete) |

**Transações** (`/api/transaction`)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/transaction` | Lista todas as transações do banco |
| `POST` | `/api/transaction` | Cria uma nova transação vinculada a uma pessoa |

### Como rodar

Pré-requisito: [.NET 10 SDK](https://dotnet.microsoft.com/download).

```bash
cd DebtManager
dotnet restore
dotnet run
```

Ao subir, a API já aplica as migrations automaticamente (`db.Database.Migrate()`) e cria o banco SQLite (`debtmanager.db`) se ele ainda não existir — não precisa rodar nada manual antes.

Por padrão, ela sobe em `http://localhost:5017`. Em ambiente de desenvolvimento, o Swagger fica disponível para explorar e testar os endpoints direto no navegador.

---

## DebtDashboard (Interface)

Aplicação em **React + TypeScript + Vite**, feita como um painel para operar a API de forma visual: cadastrar pessoas, lançar transações e acompanhar os totais em tempo real. Não é o foco do projeto, mas ajuda a validar que a API está se comportando como esperado sem precisar montar requisições na mão.

### Como rodar

Pré-requisito: [Node.js](https://nodejs.org/) (18+).

```bash
cd DebtDashboard
npm install
npm run dev
```

A aplicação espera que a API esteja rodando para funcionar corretamente, já que todo o dado exibido vem de lá.

---

## Rodando tudo junto com Docker

Também é possível subir a API e a interface de uma vez com Docker Compose:

```bash
docker-compose up --build
```

- API: `http://localhost:5017`
- Interface: `http://localhost:80`

Os dados do banco ficam persistidos em um volume Docker (`debtmanager_data`), então não se perdem entre reinicializações do container.
