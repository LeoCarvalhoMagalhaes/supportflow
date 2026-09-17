# SUPPORTFLOW

Sistema Full Stack de gerenciamento de tickets de suporte ao cliente.

O SUPPORTFLOW permite que usuários criem, acompanhem, editem e concluam chamados de suporte através de uma interface web com autenticação e suporte a múltiplos idiomas.

---

## 🚀 Funcionalidades

### Autenticação

- Cadastro de usuários
- Login com e-mail e senha
- Autenticação baseada em JWT
- Proteção de rotas
- Controle de acesso aos tickets por usuário
- Logout
- Redirecionamento automático para usuários autenticados

### Gerenciamento de tickets

- Criação de tickets
- Listagem de tickets
- Visualização dos próprios tickets
- Edição de tickets
- Exclusão de tickets
- Alteração de status
- Alteração de prioridade

### Status

O sistema utiliza três status principais:

- Aberto
- Em andamento
- Concluído

### Prioridades

- Baixa
- Média
- Alta

### Dashboard

O dashboard apresenta:

- Total de tickets
- Tickets abertos
- Tickets em andamento
- Tickets concluídos
- Filtro por status
- Filtro por prioridade

### Internacionalização

Interface disponível em:

- 🇧🇷 Português
- 🇺🇸 Inglês

A preferência de idioma é mantida através do `localStorage`.

---

## 🛠️ Tecnologias

### Backend

- Python
- FastAPI
- SQLAlchemy
- SQLite para desenvolvimento
- PostgreSQL para produção
- JWT
- Argon2
- Pydantic
- Uvicorn

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router
- i18next
- react-i18next

### Ferramentas

- Git
- GitHub
- Visual Studio Code

---

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura separando frontend e backend:

```text
SUPPORTFLOW
│
├── backend
│   ├── app
│   │   ├── routers
│   │   │   ├── auth.py
│   │   │   └── tickets.py
│   │   │
│   │   ├── auth.py
│   │   ├── database.py
│   │   ├── models.py
│   │   └── schemas.py
│   │
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── i18n
│   │   ├── pages
│   │   └── types
│   │
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md