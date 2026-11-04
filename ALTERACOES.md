# O que foi TIRADO ou TROCADO do código original (web-data-viz)

Cada item abaixo tem, no código, um comentário `ALTERADO:` no lugar da mudança.

## Backend
| Arquivo | O que mudou |
|---|---|
| `app.js` | **Só acrescentei** 2 linhas (importar e usar a rota `/quiz`). Nada foi tirado. |
| `src/controllers/usuarioController.js` | **Tirei** a busca de aquários no login (`aquarioModel.buscarAquariosPorEmpresa`) e a variável `fkEmpresa` do cadastro (com a validação dela). |
| `src/models/usuarioModel.js` | **Tirei** `fk_empresa` do SELECT do login e do INSERT do cadastro. |
| `src/database/script-tabelas.sql` | **Troquei** as tabelas do AquaTech (empresa, aviso, aquario, medida) pelas do quiz (usuario, tentativa, resposta). |

Não mexi nos outros arquivos de `src/` (avisos, aquários, empresas, medidas). Eles continuam no projeto, mas o site não usa.

## Frontend
| Arquivo | O que mudou |
|---|---|
| `public/css/estilo.css` | **Troquei** as cores fixas por variáveis (`var(--...)`), **tirei** as imagens de fundo das águas-vivas e mudei o `width` do `.navbar` de 300px para auto. |
| `public/index.html` | **Troquei** o conteúdo: o banner do AquaTech virou a escolha de álbuns, "Missão/Visão/Valores" virou "Como funciona", e adicionei "Sobre mim". |
| `public/login.html` | **Troquei** textos do cabeçalho/rodapé e o link "Simulador" por "Quiz". **Tirei** a linha `sessionStorage.AQUARIOS`. Depois do login, vai para `index.html` (antes: `dashboard/cards.html`). |
| `public/cadastro.html` | **Tirei** o campo "Código de ativação", a validação de empresas (array e `for`), a função `listar()` e o `onload="listar()"`. |
| `public/dashboard/dashboard.html` | **Troquei** a página inteira (era o dashboard de temperatura do AquaTech). |

## Arquivos removidos (eram só do AquaTech)
`public/simulador.html`, `public/dashboard/cards.html`, `public/dashboard/mural.html`, `public/dashboard/edicao-aviso.html`, `public/js/alerta.js` e `public/css/dashboards.css`.

## Arquivos novos
`public/css/albuns.css`, `public/js/tema.js`, `public/js/home.js`, `public/js/quiz.js`, `public/js/dashboard.js`, `public/dashboard/quiz.html`, `src/routes/quiz.js`, `src/controllers/quizController.js` e `src/models/quizModel.js`.

## Mantido sem alteração
`public/js/sessao.js`, `src/database/config.js`, `.env.dev`, `package.json`, `DOCUMENTOS_DE_APOIO/` e o restante do backend legado.
