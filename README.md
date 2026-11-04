# 🎸 Alice in Chains · Quiz

Projeto individual (SPTech): um quiz sobre as músicas de **Facelift**, **Dirt** e **Jar of Flies**, com login, ranking e dashboard em Chart.js.
Feito em cima do projeto base **web-data-viz** (Node.js + Express + MySQL), mantendo a arquitetura dele.

> A lista completa do que foi **tirado ou trocado** do código original está em [`ALTERACOES.md`](./ALTERACOES.md).
> No código, cada mudança tem um comentário `ALTERADO:` ou `ADICIONADO:`.

## O que o site tem

| Tela | Arquivo | O que faz |
|---|---|---|
| Home | `public/index.html` | Explica o site, mostra os 3 álbuns (clicar muda a estética) e tem a seção "Sobre mim". |
| Cadastro / Login | `public/cadastro.html`, `public/login.html` | Cria a conta e entra (só o usuário logado joga). |
| Quiz | `public/dashboard/quiz.html` | 3 níveis (fácil, médio, difícil), 8 perguntas cada. Os pontos por acerto são 10, 20 e 30. |
| Dashboard | `public/dashboard/dashboard.html` | KPIs e gráficos com dados do MySQL. |

### Tema por álbum
Ao clicar em um álbum na home, o `<body>` ganha uma classe (`tema-facelift`, `tema-dirt` ou `tema-jarofflies`) e as cores do site mudam com transição suave.
A escolha fica salva no `localStorage`, então vale para todas as páginas. As animações (entrada dos cards, hover, brilho do álbum escolhido, resposta certa e errada) estão explicadas, uma a uma, em `public/css/albuns.css`.

### Dashboard (dados vindos do MySQL)
- **KPIs:** partidas (`COUNT`), média de pontos (`AVG`), melhor partida (`MAX`), menor pontuação (`MIN`), posição no ranking e álbum que o usuário mais domina.
- **Gráficos:** evolução dos pontos (linha), % de acerto por álbum (barras) e ranking dos 5 melhores jogadores (barras horizontais).

## Arquitetura (frontend → API → banco)

```
public/ (HTML, CSS, JS)  --fetch-->  src/routes  ->  src/controllers  ->  src/models  -->  MySQL
```

- **Frontend:** `public/js/quiz.js` e `public/js/dashboard.js` chamam a API com `fetch`.
- **API (rota nova `/quiz`):** `src/routes/quiz.js`, `src/controllers/quizController.js` e `src/models/quizModel.js`.
- **Banco:** `src/database/script-tabelas.sql` (tabelas `usuario`, `tentativa` e `resposta`).

## Como rodar

1. Rode o script `src/database/script-tabelas.sql` no MySQL.
2. Preencha o `.env.dev` com os dados do seu banco (`DB_DATABASE='quiz_aic'`, usuário e senha).
3. Instale e inicie:
   ```bash
   npm install
   npm start
   ```
4. Abra `http://localhost:3333`.

### Imagens (opcional, mas recomendado)
- Foto de perfil: `public/assets/imgs/perfil.png`
- Capas dos álbuns: `public/assets/imgs/albuns/facelift.jpg`, `dirt.jpg` e `jarofflies.jpg`.

Se as capas não existirem, o site mostra um quadrado colorido com o nome do álbum.

## Tecnologias
HTML, CSS, JavaScript, Node.js, Express, MySQL e Chart.js.
