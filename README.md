# Alice in Chains Quiz

Projeto individual desenvolvido na SPTech. O **Alice in Chains Quiz** é uma aplicação web temática sobre três trabalhos da banda: *Facelift* (1990), *Dirt* (1992) e *Jar of Flies* (1994).

O usuário pode criar uma conta, escolher um álbum favorito, responder a perguntas em três níveis de dificuldade e acompanhar seu desempenho em um dashboard. O projeto também possui uma página de toca-discos e uma carteirinha de fã.

O sistema foi desenvolvido com base no projeto **web-data-viz**, mantendo a organização em rotas, controllers e models, com Node.js, Express e MySQL.

## Funcionalidades

- **Página inicial:** apresenta o projeto, os três álbuns e a história do desenvolvedor com o rock. A escolha de um álbum altera o tema visual do site.
- **Cadastro e login:** criação de conta e autenticação de usuários, com validações de nome, e-mail e senha.
- **Quiz:** três níveis de dificuldade — fácil, médio e difícil — com oito perguntas por nível. As perguntas são consultadas no MySQL.
- **Registro de partidas:** ao finalizar o quiz, a aplicação envia as perguntas respondidas e as escolhas para a API, que registra a tentativa e calcula os pontos.
- **Dashboard:** apresenta indicadores de desempenho, evolução das pontuações, desempenho por álbum, ranking e perguntas com menor índice de acerto.
- **Toca-discos:** interface temática para selecionar um álbum e navegar pelas faixas. A reprodução depende dos arquivos de áudio locais.
- **Carteirinha de fã:** exibe o nome, número de fã, álbum favorito e classificação baseada na pontuação acumulada.

## Tecnologias utilizadas

| Camada | Tecnologia | Utilização |
|---|---|---|
| Frontend | HTML5 | Estrutura das páginas |
| Frontend | CSS3 | Layout, temas dos álbuns e animações |
| Frontend | JavaScript | Validações, interações, quiz e chamadas à API |
| Frontend | Chart.js | Gráficos do dashboard |
| Backend | Node.js | Ambiente de execução |
| Backend | Express | Servidor e rotas da API |
| Backend | mysql2 | Comunicação com o MySQL |
| Backend | dotenv | Leitura das variáveis de ambiente |
| Banco de dados | MySQL | Armazenamento dos usuários, perguntas, tentativas e respostas |
| Infraestrutura | Lubuntu em VM (VirtualBox) | Execução do banco de dados |
| Ferramentas | MySQL Workbench, GitHub e Trello | Administração do banco, versionamento e organização |

## Banco de dados

O banco utilizado é `quiz_aic` e possui **cinco tabelas**:

| Tabela | Responsabilidade |
|---|---|
| `usuario` | Armazena os dados de cadastro e login |
| `perfil` | Armazena o álbum favorito de cada usuário |
| `pergunta` | Armazena o enunciado, álbum, nível, pontuação, opções e alternativa correta |
| `tentativa` | Registra cada partida realizada por um usuário |
| `resposta` | Registra as perguntas respondidas em cada tentativa, a escolha e se houve acerto |

### Relacionamentos

- **1:1 — `usuario` e `perfil`:** cada usuário possui um perfil. A coluna `perfil.fk_usuario` é, ao mesmo tempo, chave primária e chave estrangeira.
- **1:N — `usuario` e `tentativa`:** um usuário pode realizar várias partidas. A chave estrangeira `fk_usuario` fica em `tentativa`.
- **N:N — `tentativa` e `pergunta`:** uma tentativa contém várias perguntas, e uma pergunta pode aparecer em várias tentativas. A tabela associativa `resposta` implementa esse relacionamento com a chave primária composta (`fk_tentativa`, `fk_pergunta`).

O script `src/database/script-tabelas.sql` cria o banco, as cinco tabelas e insere as 24 perguntas (oito por nível).

## Como a aplicação funciona

O fluxo principal de comunicação é:

**Frontend (HTML, CSS e JavaScript) → `fetch` → rota → controller → model → MySQL → resposta JSON → frontend**

- **Rotas (`src/routes/`):** recebem as requisições e direcionam para os controllers.
- **Controllers (`src/controllers/`):** validam os dados recebidos e definem a resposta HTTP.
- **Models (`src/models/`):** executam as consultas SQL.
- **Banco (`src/database/`):** contém a configuração de conexão e o script de criação das tabelas.

### Principais rotas da API

| Método | Rota | Finalidade |
|---|---|---|
| POST | `/usuarios/cadastrar` | Cadastra um usuário e cria seu perfil |
| POST | `/usuarios/autenticar` | Autentica o usuário |
| POST | `/usuarios/album-favorito` | Atualiza o álbum favorito |
| GET | `/quiz/perguntas/:nivel` | Consulta as perguntas de um nível |
| POST | `/quiz/salvar` | Registra uma tentativa e suas respostas |
| GET | `/quiz/kpi-pontos/:idUsuario` | Consulta partidas e pontuação acumulada |
| GET | `/quiz/kpi-ranking` | Consulta a pontuação acumulada dos jogadores para calcular a posição |
| GET | `/quiz/kpi-acertos/:idUsuario` | Consulta os acertos das partidas mais recentes |
| GET | `/quiz/evolucao/:idUsuario` | Consulta os pontos das últimas partidas |
| GET | `/quiz/albuns/:idUsuario` | Consulta acertos e respostas agrupados por álbum |
| GET | `/quiz/ranking` | Retorna os cinco primeiros colocados |
| GET | `/quiz/dificeis` | Retorna as três perguntas com menor índice de acerto |

## Executar o projeto

### Pré-requisitos

- Node.js e npm instalados.
- MySQL em execução na VM Linux.
- MySQL Workbench ou outra ferramenta para executar o script SQL.
- Configuração de rede do VirtualBox permitindo que o computador acesse o MySQL da VM. No ambiente utilizado no projeto, a porta `3307` do computador é redirecionada para a porta `3306` da VM.

### 1. Criar o banco

No MySQL Workbench, conecte-se ao banco e execute:

`src/database/script-tabelas.sql`

### 2. Configurar as variáveis de ambiente

Crie um arquivo `.env.dev` na raiz do projeto. Use a estrutura abaixo e preencha com os dados do seu ambiente:

```env
AMBIENTE_PROCESSO=desenvolvimento

DB_HOST=127.0.0.1
DB_DATABASE=quiz_aic
DB_USER=SEU_USUARIO
DB_PASSWORD=SUA_SENHA
DB_PORT=3307

APP_PORT=3333
APP_HOST=localhost
```

Não compartilhe nem envie o arquivo `.env.dev` ao GitHub. Ele contém credenciais de acesso ao banco de dados.

### 3. Instalar as dependências

No terminal, dentro da pasta do projeto, execute:

```bash
npm install
```

### 4. Iniciar o servidor

```bash
npm start
```

Depois, acesse:

`http://localhost:3333`

## Organização das pastas

```text
Alice-in-Chains/
├── app.js
├── package.json
├── README.md
├── ALTERACOES.md
├── DIARIO_DE_PROMPTS.md
├── modelagem/
│   └── modelQuizAic.mwb
├── public/
│   ├── index.html
│   ├── cadastro.html
│   ├── login.html
│   ├── toca-discos.html
│   ├── dashboard/
│   │   ├── quiz.html
│   │   ├── dashboard.html
│   │   └── carteirinha.html
│   ├── css/
│   │   └── estilo.css
│   ├── js/
│   │   ├── cadastro.js
│   │   ├── login.js
│   │   ├── quiz.js
│   │   ├── dashboard.js
│   │   ├── carteirinha.js
│   │   ├── toca-discos.js
│   │   ├── home.js
│   │   ├── tema.js
│   │   ├── sessao.js
│   │   └── validacao.js
│   └── assets/
│       ├── icon/
│       └── imgs/
└── src/
    ├── controllers/
    │   ├── quizController.js
    │   └── usuarioController.js
    ├── database/
    │   ├── config.js
    │   └── script-tabelas.sql
    ├── models/
    │   ├── quizModel.js
    │   └── usuarioModel.js
    └── routes/
        ├── quiz.js
        └── usuarios.js
```

## Documentos complementares

- `Documentação do Projeto Individual.docx`: descrição detalhada dos objetivos, funcionalidades, modelagem, indicadores, testes e relação com os ODS.
- `ALTERACOES.md`: resumo das adaptações realizadas no projeto-base e explicações dos principais fluxos do código.
- `DIARIO_DE_PROMPTS.md`: registro do uso de inteligência artificial durante o desenvolvimento.
- `modelagem/modelQuizAic.mwb`: arquivo de modelagem do banco de dados.

## Observações

- O toca-discos utiliza arquivos de áudio locais. Para reproduzir as faixas, os arquivos MP3 devem estar na estrutura de pastas esperada pelo `public/js/toca-discos.js`, dentro de `public/assets/audio/`.
- O projeto não utiliza APIs externas para obter músicas ou dados dos álbuns.
- A aplicação foi desenvolvida para fins acadêmicos. Algumas decisões de segurança e autenticação são simplificadas em relação a um sistema de produção.
