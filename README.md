# 💼 AMA Finanças — Backend (Node.js + Prisma + Express)

API desenvolvida para gerenciamento financeiro e controle de extratos bancários com integração ao **Banco do Brasil Open Finance**, além de módulos de usuários, eventos e registros.

---

## 🚀 Tecnologias Utilizadas

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-671ddf?style=for-the-badge&logo=axios&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-1B1F24?style=for-the-badge&logo=zod&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

---

## 📂 Estrutura de Pastas

```
├── prisma/                  # Schema do banco de dados (Prisma ORM)
├── src/
│   ├── controller/          # Controladores (lógica das rotas)
│   ├── service/             # Regras de negócio e integração externa
│   ├── middlewares/         # Autenticação, permissões, validações
│   ├── router/              # Definições de rotas Express
│   ├── utils/               # Schemas Zod e funções auxiliares
│   └── error/               # Classes de erro personalizadas
├── .env                     # Variáveis de ambiente
├── package.json
├── serve.js                 # Inicialização do servidor Express
└── README.md
```

---

## ⚙️ Configuração e Execução

### 🔧 Pré-requisitos
- Node.js (v18+)
- PostgreSQL
- Conta Sandbox do **Banco do Brasil Open Finance** (para testes)

### 🧩 Instalação

```bash
# Clone o repositório
git clone https://github.com/Pdr-FARIAS/Ama-managen.git

# Acesse o diretório
cd Ama-managen

# Instale as dependências
npm install
```

### ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz com as variáveis:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/ama_financeiro"
PORT=3000
JWT_SECRET="seu_token_jwt_super_seguro"
GW_DEV_APP_KEY="sua_chave_api_bb"
```

### 🚀 Executando o Servidor

```bash
# Rodar migrações do Prisma
npx prisma migrate dev

# Iniciar servidor
npm start
```

A API será executada em:
```
http://localhost:3000
```

---

## 🔐 Autenticação e Autorização

- A autenticação é baseada em **JWT (JSON Web Token)**.
- Ao fazer login (`POST /user/login`), o servidor retorna um token que deve ser enviado no header:
  ```
  Authorization: Bearer {token}
  ```
- Middleware `authentication` garante que apenas usuários autenticados acessem rotas protegidas.
- O middleware `authorizeRole("ADMIN")` restringe o acesso a administradores.

---

## 📡 Principais Rotas

### 👤 Usuários
| Método | Rota | Descrição |
|:-------|:------|:-----------|
| `POST` | `/user/register` | Cadastra novo usuário |
| `POST` | `/user/login` | Realiza login e gera JWT |
| `GET` | `/user/:id` | Retorna informações do usuário |
| `PUT` | `/user/user` | Atualiza nome, e-mail, senha, agência ou conta |
| `DELETE` | `/user/user/:id` | Remove o usuário |

---

### 💳 Extratos
| Método | Rota | Descrição |
|:-------|:------|:-----------|
| `POST` | `/extrato/manual` | Cria lançamento manual |
| `GET` | `/extrato` | Lista todos os lançamentos |
| `GET` | `/extrato/grafico` | Retorna dados formatados para gráfico |
| `DELETE` | `/extrato/:id` | Exclui lançamento específico |
| `DELETE` | `/extrato` | Exclui todos os lançamentos do usuário |

---

### 📊 Gráficos e Entradas/Saídas
- `GET /extrato/grafico`: retorna movimentações financeiras formatadas (`{ data, valor }`)
- As saídas vêm com valores negativos para cálculo automático de saldo
- Integração com **Recharts** ou **Chart.js** no front-end

---

### 🎉 Eventos
| Método | Rota | Descrição |
|:-------|:------|:-----------|
| `GET` | `/evento` | Lista todos os eventos |
| `POST` | `/evento` | Cria um novo evento |
| `PUT` | `/evento/:id` | Atualiza um evento existente |
| `DELETE` | `/evento/:id` | Exclui um evento |

---

### 🏠 Endereços
| Método | Rota | Descrição |
|:-------|:------|:-----------|
| `GET` | `/endereco` | Lista todos os endereços |
| `GET` | `/endereco/search` | Busca endereços pelo nome |
| `POST` | `/endereco` | Cadastra novo endereço |
| `PUT` | `/endereco/:id` | Atualiza endereço existente |
| `DELETE` | `/endereco/:id` | Exclui endereço |

---

### 🧾 Registros
| Método | Rota | Descrição |
|:-------|:------|:-----------|
| `GET` | `/registro` | Lista todos os registros |
| `POST` | `/registro` | Cria novo registro vinculado a evento e endereço |
| `PUT` | `/registro/:id` | Atualiza um registro |
| `DELETE` | `/registro/:id` | Exclui um registro |

---

## 🔌 Integração com o Front-end

O projeto front consome as rotas REST da API via **Axios**, e autentica o usuário via token armazenado em **Cookies** ou **localStorage**.  
Além disso, o **Socket.IO** é usado para:
- Notificar o status de importação de extratos
- Atualizar o dashboard em tempo real
- Emitir alertas de eventos e registros

---

## 👨‍💻 Autor

**Pedro Gabriel Farias**  
💼 Desenvolvedor Full Stack | 📧 [pedrogabrielgam13@gmail.com](mailto:pedrogabrielgam13@gmail.com)  
🌐 [github.com/Pdr-FARIAS](https://github.com/Pdr-FARIAS)

---

✨ *“Transformando dados financeiros em controle e autonomia.”*
