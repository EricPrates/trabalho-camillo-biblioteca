# Sistema de Biblioteca

API REST completa para gerenciamento de biblioteca escolar, com controle de acesso por perfil de usuário, empréstimos, devoluções, multas automáticas e relatórios gerenciais.

> Projeto em produção: [Deploy →](https://trabalho-camillo-biblioteca-ludy.vercel.app)

---

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express** — framework HTTP
- **Sequelize** — ORM com suporte a múltiplos bancos
- **SQLite** — banco de dados relacional
- **JWT (jsonwebtoken)** — autenticação stateless com access + refresh token
- **bcrypt** — hash de senhas
- **dotenv** — variáveis de ambiente

---

## 🏗️ Arquitetura

```
src/
├── config/
│   └── database.ts             # Configuração do Sequelize (dialect, storage, logging)
├── controllers/
│   ├── authController.ts       # Login, logout e refresh token
│   ├── usuarioController.ts    # CRUD de usuários
│   ├── livroController.ts      # CRUD + busca e disponibilidade de livros
│   ├── emprestimoController.ts # Criação e listagem de empréstimos
│   ├── devolucaoController.ts  # Registro de devoluções + cálculo de atraso
│   ├── multaController.ts      # Gestão completa de multas
│   ├── relatoriosControler.ts  # Relatórios e dashboard gerencial
│   └── utils/
│       └── authUtils.ts        # Geração de JWT
├── middlewares/
│   └── auth.ts                 # tokenValidated · verifyAdmin · verifyAdminOrBibliotecario
│                               # verificarBloqueioUsuarioSeTiverMultas
├── models/
│   ├── index.ts                # Instância do Sequelize + definição dos relacionamentos
│   ├── usuarioModel.ts
│   ├── LivroModel.ts
│   ├── EmprestimoModel.ts
│   ├── multaModel.ts
│   └── types/
│       └── types.ts            # Interfaces TypeScript (IUsuario, ILivro, IEmprestimo, IMulta...)
└── db/
    └── seed.ts                 # Seed com usuários padrão (admin, bibliotecário, aluno)
```

---

## 👥 Perfis de Acesso

O sistema possui três perfis com permissões distintas:

| Perfil          | Permissões principais                                                       |
|-----------------|-----------------------------------------------------------------------------|
| `admin`         | Tudo — cria/deleta usuários, gerencia livros, empréstimos, multas e relatórios |
| `bibliotecario` | Gerencia livros, empréstimos, devoluções e multas. Não cria/deleta usuários |
| `aluno`         | Consulta seus próprios dados, empréstimos e multas                          |

---

## 🔐 Autenticação

O sistema usa **JWT** com dois tokens:

- **Access Token** — válido por 60 minutos, enviado no header `Authorization: Bearer <token>`
- **Refresh Token** — válido por 7 dias, persiste no banco e permite renovar o access token sem novo login

O payload do token carrega `id`, `nome`, `email`, `tipo` e `matricula` do usuário, propagado via `req.headers['user']` pelos middlewares.

### Middlewares de autenticação

| Middleware                              | Proteção                                      |
|-----------------------------------------|-----------------------------------------------|
| `tokenValidated`                        | Qualquer usuário autenticado                  |
| `verifyAdmin`                           | Apenas `admin`                                |
| `verifyAdminOrBibliotecario`            | `admin` ou `bibliotecario`                    |
| `verificarBloqueioUsuarioSeTiverMultas` | Bloqueia empréstimo se há multas pendentes    |

---

## 📋 Endpoints

### Autenticação

| Método | Rota             | Acesso  | Descrição                              |
|--------|------------------|---------|----------------------------------------|
| POST   | `/auth/login`    | Público | Login via Basic Auth (base64). Retorna access + refresh token |
| POST   | `/auth/logout`   | Autenticado | Invalida o refresh token             |
| POST   | `/auth/refresh`  | Público | Renova o access token via refresh token |

### Usuários

| Método | Rota                  | Acesso              | Descrição                        |
|--------|-----------------------|---------------------|----------------------------------|
| POST   | `/usuarios`           | Admin               | Cadastra novo usuário            |
| GET    | `/usuarios`           | Admin               | Lista todos os usuários          |
| GET    | `/usuarios/:id`       | Admin               | Busca usuário por ID             |
| PUT    | `/usuarios/:id`       | Admin / Bibliotecário | Atualiza dados do usuário      |
| DELETE | `/usuarios/:id`       | Admin               | Remove usuário                   |
| GET    | `/usuarios/me`        | Autenticado         | Dados do próprio usuário         |

### Livros

| Método | Rota                              | Acesso              | Descrição                            |
|--------|-----------------------------------|---------------------|--------------------------------------|
| POST   | `/livros`                         | Admin / Bibliotecário | Cadastra novo livro                |
| GET    | `/livros`                         | Autenticado         | Lista todos os livros                |
| GET    | `/livros/:id`                     | Autenticado         | Busca livro por ID                   |
| PUT    | `/livros/:id`                     | Admin / Bibliotecário | Atualiza livro                     |
| DELETE | `/livros/:id`                     | Admin               | Remove livro                         |
| GET    | `/livros/busca/:query`            | Autenticado         | Busca por título ou autor            |
| GET    | `/livros/categoria/:categoria`    | Autenticado         | Filtra por categoria                 |
| GET    | `/livros/disponibilidade/:id`     | Autenticado         | Verifica disponibilidade de um livro |
| GET    | `/livros/disponiveis`             | Autenticado         | Lista livros disponíveis com filtros opcionais (`?titulo=&autor=&categoria=`) |

### Empréstimos

| Método | Rota                              | Acesso              | Descrição                                 |
|--------|-----------------------------------|---------------------|-------------------------------------------|
| POST   | `/emprestimos`                    | Admin / Bibliotecário | Cria empréstimo (bloqueia se há multas) |
| GET    | `/emprestimos`                    | Admin / Bibliotecário | Lista todos os empréstimos              |
| GET    | `/emprestimos/:id`                | Admin / Bibliotecário | Busca empréstimo por ID                 |
| GET    | `/emprestimos/usuario/:usuarioId` | Admin / Bibliotecário | Lista empréstimos de um usuário         |
| GET    | `/emprestimos/meus`               | Aluno               | Empréstimos do aluno logado              |

### Devoluções

| Método | Rota                | Acesso              | Descrição                                                    |
|--------|---------------------|---------------------|--------------------------------------------------------------|
| POST   | `/devolucoes`       | Admin / Bibliotecário | Registra devolução, calcula atraso e gera multa automaticamente |
| GET    | `/devolucoes`       | Admin / Bibliotecário | Lista todas as devoluções                                   |

### Multas

| Método | Rota                                  | Acesso              | Descrição                             |
|--------|---------------------------------------|---------------------|---------------------------------------|
| GET    | `/multas`                             | Admin / Bibliotecário | Lista todas as multas                |
| GET    | `/multas/detalhes`                    | Admin / Bibliotecário | Lista multas com empréstimo e livro  |
| GET    | `/multas/:id`                         | Admin / Bibliotecário | Busca multa por ID                   |
| GET    | `/multas/:id/detalhes`                | Admin / Bibliotecário | Multa com relacionamentos            |
| PUT    | `/multas/:id/status`                  | Admin / Bibliotecário | Atualiza status da multa             |
| PUT    | `/multas/:id/pagar`                   | Admin / Bibliotecário | Registra pagamento                   |
| DELETE | `/multas/:id`                         | Admin               | Remove multa                          |
| GET    | `/multas/usuario/:id`                 | Admin / Bibliotecário | Multas de um usuário                 |
| GET    | `/multas/usuario/:id/pendentes`       | Admin / Bibliotecário | Multas pendentes de um usuário       |
| GET    | `/multas/usuario/:id/total`           | Admin / Bibliotecário | Total de multas pendentes            |
| GET    | `/multas/status/:status`              | Admin / Bibliotecário | Filtra por status                    |
| GET    | `/multas/minhas`                      | Aluno               | Multas do aluno logado                |

### Relatórios

| Método | Rota                          | Acesso | Descrição                            |
|--------|-------------------------------|--------|--------------------------------------|
| GET    | `/relatorios/ativos`          | Admin  | Empréstimos ativos                   |
| GET    | `/relatorios/atrasados`       | Admin  | Empréstimos com atraso               |
| GET    | `/relatorios/mais-emprestados`| Admin  | Top 10 livros mais emprestados       |
| GET    | `/relatorios/dashboard`       | Admin  | Totais gerais (livros, usuários, empréstimos ativos, multas pendentes) |

---

## ⚙️ Regras de Negócio

- **Multa automática**: calculada na devolução a **R$ 2,00 por dia de atraso**
- **Bloqueio de empréstimo**: usuário com multas pendentes não pode realizar novo empréstimo
- **Estoque**: `quantidadeDisponivel` é decrementada no empréstimo e incrementada na devolução automaticamente
- **Data de devolução**: deve ser obrigatoriamente futura no momento do empréstimo
- **Matrícula**: obrigatória apenas para usuários do tipo `aluno`
- **Senha**: armazenada com hash bcrypt (salt rounds: 10)
- **Usuário inativo**: não consegue realizar login mesmo com credenciais corretas

---

## ▶️ Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm

### Instalação

```bash
git clone https://github.com/EricPrates/trabalho-camillo-biblioteca.git
cd trabalho-camillo-biblioteca
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
PRIVATE_KEY=sua_chave_secreta_aqui
PORT=3000
```

### Banco de dados e seed

```bash
# Popula o banco com usuários padrão
npm run seed
```

Usuários criados pelo seed:

| Tipo          | Email                           | Senha      |
|---------------|---------------------------------|------------|
| Admin         | admin@biblioteca.com            | admin123   |
| Bibliotecário | bibliotecario@biblioteca.com    | biblio123  |
| Aluno         | aluno@biblioteca.com            | aluno123   |

### Rodando

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build && npm start
```

---

## 🔑 Como autenticar

O login usa **HTTP Basic Auth** com email e senha codificados em base64:

```bash
# Gerar o header manualmente
echo -n "admin@biblioteca.com:admin123" | base64
# → YWRtaW5AYmlibGlvdGVjYS5jb206YWRtaW4xMjM=

# Fazer login
curl -X POST http://localhost:3000/auth/login \
  -H "Authorization: Basic YWRtaW5AYmlibGlvdGVjYS5jb206YWRtaW4xMjM="
```

Resposta:
```json
{
  "token": "<access_token>",
  "refreshToken": "<refresh_token>"
}
```

Use o `token` nas próximas requisições:
```
Authorization: Bearer <access_token>
```

---

## 📌 Status do Projeto

- [x] Autenticação JWT com access + refresh token
- [x] Controle de acesso por perfil (admin / bibliotecário / aluno)
- [x] CRUD completo de usuários, livros, empréstimos e multas
- [x] Cálculo automático de multas por atraso
- [x] Bloqueio de empréstimo por multas pendentes
- [x] Relatórios e dashboard gerencial
- [x] Seed de dados iniciais
- [ ] Testes unitários
- [ ] Documentação Swagger

---

## 👨‍💻 Autor

**Eric Prates**
[LinkedIn](https://linkedin.com/in/eric-prates-dev) · [GitHub](https://github.com/EricPrates) · [Deploy](https://trabalho-camillo-biblioteca-ludy.vercel.app)
