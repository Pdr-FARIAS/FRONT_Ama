This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.AMA Financeiro - Dashboard de Gerenciamento Pessoal

Um dashboard full-stack de gerenciamento financeiro construído com Next.js (App Router), Node.js/Express e Prisma. O projeto permite que usuários gerenciem suas finanças pessoais, registrem transações, visualizem gráficos interativos e gerenciem seus perfis de usuário de forma segura.

Funcionalidades

🔐 Autenticação e Segurança

Login e Registro: Sistema de autenticação completo com hashing de senhas (bcrypt).

Rotas Protegidas: O dashboard (/dashboard/*) é protegido por um Middleware do Next.js que valida o JWT.

Timer de Sessão: Implementação de um hook (useAuthTimer) que monitora a expiração do JWT e redireciona automaticamente o usuário para a tela de login 10 segundos antes do token expirar, prevenindo erros de API.

👤 Gerenciamento de Usuário (Integrado na NavBar)

Visualizar Perfil: Modal de "Detalhes da Conta" (somente leitura) que busca os dados mais recentes do usuário (GET /user/:id).

Editar Perfil: Modal "Editar Perfil" (PUT /user) que permite ao usuário atualizar nome, e-mail, agência/conta e senha (opcional).

Deletar Conta: Modal de confirmação (DELETE /user/user/:id) para exclusão segura da conta.

📊 Dashboard Principal (/dashboard)

Cards de Resumo: Exibição dos totais de Entradas, Saídas e Saldo Atual (GET /extrato/entradas, GET /extrato/saidas).

Gráfico de Balanço Líquido: Um gráfico de barras (recharts) que mostra o balanço líquido (Entradas - Saídas) de cada dia. Barras positivas (lucro) são verdes e para cima; barras negativas (prejuízo) são vermelhas e para baixo.

Agregação de Dados: A página soma todos os lançamentos do dia (GET /extrato/grafico) para exibir um balanço diário consolidado no gráfico.

💰 Transações e Extratos

Criar Lançamento Manual (/dashboard/novo-lancamento): Formulário completo (usando react-hook-form e zod) para registrar novas entradas (Crédito) ou saídas (Débito) (POST /extrato/manual).

Listar Extratos (/dashboard/extratos): Página com uma DataTable (Shadcn/UI + TanStack Table) que lista todos os lançamentos do usuário.

Filtragem de Extratos: A tabela permite filtragem por data (início/fim) e busca por descrição.

Deletar Todos os Extratos: Botão com modal de confirmação (AlertDialog) para limpar o histórico financeiro (DELETE /extrato/).

📅 Eventos (Bônus)

Criar Evento (/dashboard/criar-evento): Formulário para registrar um evento financeiro futuro (POST /evento).

🛠️ Tecnologias Utilizadas

Este é um projeto monorepo ou dois repositórios separados (frontend/backend).

Frontend (Cliente)

<div>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Next.js-000000%3Fstyle%3Dfor-the-badge%26logo%3Dnextdotjs%26logoColor%3Dwhite" alt="Next.js" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/React-20232A%3Fstyle%3Dfor-the-badge%26logo%3Dreact%26logoColor%3D61DAFB" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Tailwind_CSS-38B2AC%3Fstyle%3Dfor-the-badge%26logo%3Dtailwind-css%26logoColor%3Dwhite" alt="Tailwind CSS" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/shadcn%252Fui-000000%3Fstyle%3Dfor-the-badge%26logo%3Dshadcnui%26logoColor%3Dwhite" alt="Shadcn/UI" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Zod-3E67B1%3Fstyle%3Dfor-the-badge%26logo%3Dzod%26logoColor%3Dwhite" alt="Zod" />
</div>

Framework: Next.js 14+ (App Router)

UI: Tailwind CSS + Shadcn/UI

Gerenciamento de Estado: Zustand

Formulários: React Hook Form + Zod (para validação no cliente)

Gráficos: Recharts

Requisições API: Axios (com interceptor para JWT)

Autenticação (Cliente): js-cookie para armazenamento do token

Backend (Servidor)

<div>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Node.js-339933%3Fstyle%3Dfor-the-badge%26logo%3Dnodedotjs%26logoColor%3Dwhite" alt="Node.js" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Express-000000%3Fstyle%3Dfor-the-badge%26logo%3Dexpress%26logoColor%3Dwhite" alt="Express" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Prisma-2D3748%3Fstyle%3Dfor-the-badge%26logo%3Dprisma%26logoColor%3Dwhite" alt="Prisma" />
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/JWT-000000%3Fstyle%3Dfor-the-badge%26logo%3Djsonwebtokens%26logoColor%3Dwhite" alt="JWT" />
</div>

Runtime: Node.js

Framework: Express.js

ORM: Prisma

Banco de Dados: MySQL

Autenticação: JSON Web Tokens (JWT)

Validação: Zod (para validação de schema no servidor)

Segurança: bcrypt (para hashing de senhas), CORS

🚀 Como Começar

Pré-requisitos

Node.js (v18 ou superior)

Um servidor MySQL rodando (localmente ou em um serviço de nuvem)

npm ou yarn

1. Configurando o Backend (Servidor)

O backend (ama-managen) lida com o banco de dados e a lógica de negócios.

# 1. Navegue até a pasta do backend (ex: ama-managen)
cd ama-managen

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Crie um arquivo .env na raiz do backend
# (Seu schema Prisma está em prisma/schema.prisma, então talvez precise de um .env em prisma/ também)

# .env
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/AMA_DB"
JWT_SECRET="SEU_SEGREDO_JWT_MUITO_FORTE"
PORT=3000

# (Adicione também as credenciais do BB_CLIENT_ID e BB_CLIENT_SECRET se necessário)

# 4. Rode as migrações do Prisma para criar as tabelas no banco
npx prisma migrate dev

# 5. Inicie o servidor
npm run dev # (ou 'node server.js')
# O servidor estará rodando em http://localhost:3000


2. Configurando o Frontend (Cliente)

O frontend (ama-web) é a aplicação React/Next.js.

# 1. Navegue até a pasta do frontend (ex: ama-web)
cd ama-web

# 2. Instale as dependências
npm install

# 3. Instale os componentes Shadcn/UI (se ainda não o fez)
npx shadcn-ui@latest add table
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add textarea
# (Adicione outros componentes que faltarem)

# 4. Verifique a URL da API
# (Certifique-se que 'lib/api.ts' está apontando para http://localhost:3000)

# 5. Inicie o cliente
npm run dev
# A aplicação estará disponível em http://localhost:3002 (ou a porta padrão do Next)


🗺️ Rotas da API (Endpoints)

O servidor Express (http://localhost:3000) expõe as seguintes rotas:

Autenticação (/user)

Método

Rota

Descrição

POST

/user/login

Autentica o usuário e retorna um JWT.

POST

/user/register

Cria um novo usuário.

Usuário (/user - Autenticado)

Método

Rota

Descrição

GET

/user/:id

Busca os detalhes completos de um usuário (usado no Modal de Detalhes).

PUT

/user

Atualiza o perfil do usuário logado (ID lido do token).

DELETE

/user/user/:id

Deleta o usuário (usado no Modal de Deleção).

Extratos (/extrato - Autenticado)

Método

Rota

Descrição

GET

/extrato/extrato

Lista todos os lançamentos do usuário (para a Tabela de Extrato).

GET

/extrato/grafico

Lista os dados brutos para o gráfico do dashboard.

GET

/extrato/entradas

Retorna o total de entradas (para os Cards).

GET

/extrato/saidas

Retorna o total de saídas (para os Cards).

POST

/extrato/manual

Cria um novo lançamento financeiro manual.

DELETE

/extrato/

Deleta todos os extratos do usuário logado.

Eventos (/evento - Autenticado)

Método

Rota

Descrição

POST

/evento

Cria um novo evento financeiro.
