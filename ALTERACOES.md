# Guia do código e alterações

Este arquivo serve para eu entender e explicar o projeto. Está organizado do geral para o detalhe.

## 1. O caminho de uma requisição

Tudo funciona no mesmo caminho:

**Tela (HTML + JS) → `fetch` → rota → controller → model → MySQL → JSON → tela**

| Camada | Pasta | Responsabilidade |
|---|---|---|
| Frontend | `public/` | Mostrar as telas, validar o formulário e chamar a API com `fetch`. |
| Rota | `src/routes/` | Ligar um endereço (ex.: `POST /quiz/salvar`) a uma função do controller. |
| Controller | `src/controllers/` | Conferir os dados que chegaram e decidir a resposta (200, 400, 500...). |
| Model | `src/models/` | Escrever o comando SQL e mandar o `config.js` executar. |
| Banco | `src/database/` | `config.js` abre a conexão, e o `script-tabelas.sql` cria o banco. |

## 2. O que foi removido do web-data-viz

Eram partes do projeto original (AquaTech) que não fazem sentido para o quiz.

| Removido | Por quê |
|---|---|
| Empresa e aquário (controllers, models e rotas) | O quiz não tem empresas nem aquários. |
| Avisos e medidas (controllers, models e rotas) | Eram do mural de avisos e do sensor do AquaTech. O `medidaController` ainda chamava o `medidaModel`, que já tinha sido apagado, então o servidor nem subia. |
| `routes/index.js` | Usava `res.render`, mas o projeto não tem motor de views. O `index.html` já é servido pela pasta `public`. |
| `simulador.html`, `cards.html`, `mural.html`, `edicao-aviso.html` | Telas do AquaTech. |
| `alerta.js` e `dashboards.css` | Só serviam às telas do AquaTech. |
| GIFs de "aguarde" e as imagens do AquaTech | Não são mais usados. |
| `albuns.css` | Foi juntado ao `estilo.css`: agora existe um CSS só. |
| Todos os comentários | O professor não aceita comentários no código. |

## 3. O que foi mantido do original

| Mantido | Observação |
|---|---|
| `src/database/config.js` | É a conexão do projeto base. Só tirei os comentários. |
| Padrão rota → controller → model | Todas as rotas novas seguem o `PASSO_A_PASSO_CRIAR_ROTA_NA_API`. |
| `.env.dev` | Guarda a conexão com o banco. Não vai para o Git. O modelo é o `.env.dev.example`. |
| `package.json` e `LICENSE` | Sem mudanças. |

## 4. O que foi alterado nos arquivos originais

| Arquivo | O que mudou |
|---|---|
| `app.js` | Só carrega as rotas `usuarios` e `quiz`. Usa `let` e `if` no lugar de `var` e `===`. |
| `usuarioController.js` | Valida e-mail e senha antes do banco, responde 409 para e-mail repetido e tem a função `albumFavorito`. |
| `usuarioModel.js` | O cadastro agora também cria o `perfil` do usuário, o login traz o álbum favorito e existe `atualizarAlbumFavorito`. |
| `sessao.js` | Usa `let` e o `id` do elemento direto (ex.: `b_usuario.innerHTML`). Ficaram só `validarSessao` e `limparSessao`. |
| `estilo.css` | Reescrito, mais simples, com 4 temas (padrão, Facelift, Dirt e Jar of Flies). Depois ganhou o estilo do toca-discos, da carteirinha e da seção "Minha história". |
| `tema.js` | Ganhou a função `salvarAlbumFavorito`, usada pela home, pelo toca-discos e pela carteirinha. |
| `home.js` | Perdeu a função `salvarAlbumFavorito`, que foi para o `tema.js`. |
| `login.html` e `cadastro.html` | Mais simples. O JavaScript foi para `login.js` e `cadastro.js`. |

## 5. Arquivos novos e para que servem

| Arquivo | Para que serve |
|---|---|
| `script-tabelas.sql` | Cria as 5 tabelas e insere as 24 perguntas (com as opções na própria tabela `pergunta`). |
| `routes/quiz.js`, `controllers/quizController.js`, `models/quizModel.js` | A API do quiz e do dashboard. |
| `js/validacao.js` | Valida nome, e-mail e senha com `if`, `for` e `while`. Também é usado pelo servidor. |
| `js/tema.js` | Aplica o tema do álbum ao abrir a página. |
| `js/home.js` | Troca o tema ao clicar no álbum e salva o álbum favorito. |
| `js/quiz.js` | Busca as perguntas no banco e controla o jogo. |
| `js/dashboard.js` | Busca os indicadores e monta os gráficos. |
| `toca-discos.html` e `js/toca-discos.js` | O disco de vinil: ao clicar em um álbum, o disco acende, gira e toca uma música. |
| `dashboard/carteirinha.html` e `js/carteirinha.js` | A carteirinha de fã. |

## 6. Modelagem lógica explicada

Os três relacionamentos pedidos:

- **1:1, `usuario` e `perfil`.** Cada usuário tem exatamente um perfil. A chave primária do `perfil` é a própria chave estrangeira `fk_usuario`, então não dá para ter dois perfis do mesmo usuário. O perfil guarda o álbum favorito.
- **1:N, `usuario` e `tentativa`.** Um usuário joga várias partidas, e cada partida é de um usuário só. A chave estrangeira `fk_usuario` fica na tabela do lado "N".
- **N:N, `tentativa` e `pergunta`.** Uma partida tem várias perguntas e uma pergunta aparece em várias partidas. Um banco relacional não guarda N:N direto, então se cria a tabela associativa `resposta`, com chave primária composta (`fk_tentativa`, `fk_pergunta`). Ela também guarda a opção escolhida (`escolha`, de 1 a 4) e se acertou.

O modelo foi simplificado para 5 tabelas: o álbum, o nível, os pontos e as 4 opções viraram colunas da `pergunta`, e o álbum favorito do `perfil` é guardado como texto (`facelift`, `dirt` ou `jarofflies`). Os pontos continuam vindo do banco (coluna `pontos` da pergunta).

## 7. Fluxos passo a passo

**Cadastro.** `cadastro.js` valida o formulário e chama `POST /usuarios/cadastrar` → o controller valida de novo → o model insere em `usuario` e depois em `perfil`. Se o e-mail já existe, o MySQL recusa (coluna `UNIQUE`) e o controller responde 409.

**Login.** `login.js` chama `POST /usuarios/autenticar` → o model faz `SELECT` com `LEFT JOIN` em `perfil` → o JS guarda id, nome e álbum favorito no `sessionStorage` e aplica o tema salvo.

**Jogar.** `quiz.js` chama `GET /quiz/perguntas/:nivel`. O banco devolve uma linha por pergunta, já com `opcao_a` a `opcao_d` e o número da `correta`.

**Salvar a partida.** `POST /quiz/salvar` recebe o id do usuário, o nível, o vetor com os ids das perguntas e o vetor com as escolhas (1 a 4). O controller chama 3 funções do model, uma depois da outra: `criarTentativa`, `salvarRespostas` (o `acertou` é calculado pelo banco comparando a `escolha` com a `correta`) e `calcularPontos` (acertos e pontos com `SUM` e `COUNT`). Se uma pergunta não for do nível, o `acertou` fica nulo, o MySQL recusa (`NOT NULL`) e o controller chama `apagarTentativa`. Os pontos nunca vêm do navegador.

**Dashboard.** `dashboard.js` chama 7 rotas, uma para cada KPI e uma para cada gráfico/lista. Cada uma roda um `SELECT` e devolve JSON. Não há KPI de média (média engana).

| Indicador | Rota | SQL | Variação mostrada |
|---|---|---|---|
| Pontuação total | `/quiz/kpi-pontos/:id` | `SUM(pontos)` e os pontos da última partida (`ORDER BY id DESC LIMIT 1`) | ▲ pontos ganhos na última partida |
| Colocação no ranking | `/quiz/kpi-ranking` | `SUM(pontos)` de cada jogador com `GROUP BY`. Um `for` no JS conta quantos têm mais pontos que eu, agora e antes da última partida | ▲ subiu / ▼ caiu / manteve |
| Acertos na última partida | `/quiz/kpi-acertos/:id` | `acertos` e `total` das 2 últimas partidas (`LIMIT 2`) | ▲ / ▼ acertos a mais ou a menos que a anterior |
| Desempenho por álbum (gráfico) | `/quiz/albuns/:id` | `SUM(acertou)` e `COUNT(*)` com `GROUP BY album`. O JS calcula a % com `Math.round(acertos * 100 / respostas)` | |
| Perguntas mais difíceis (lista) | `/quiz/dificeis` | acertos e respostas por pergunta, `ORDER BY` do menor aproveitamento e `LIMIT 3`. O JS calcula a % | |

## 8. Regras da disciplina

| Regra | Como ficou |
|---|---|
| Sem comentários | Nenhum arquivo tem comentário. |
| `let` no lugar de `var` | Todos os arquivos usam `let`. |
| `==` e `!=` | Sem `===` ou `!==`. |
| Sem `getElementById` | Os elementos são usados pelo `id` direto. |
| Lógica básica | Só `if`, `else if`, `else`, `for` e `while`. |
| Sem `return` | Só nas funções que precisam devolver um valor (`validacao.js`) e nos models, que devolvem a promessa do banco, como no projeto base. |

## 9. Perguntas que o professor pode fazer

| Pergunta | Resposta curta |
|---|---|
| Por que valida no navegador e no servidor? | O navegador pode ser burlado. A validação do servidor é a que protege o banco. |
| Por que `resposta` tem chave composta? | Para a mesma partida não responder duas vezes a mesma pergunta. |
| Por que proibiu aspas na senha e no nome? | O SQL do projeto base é montado juntando texto, e aspas poderiam virar comandos (injeção de SQL). |
| Como o ranking é calculado? | `SUM` dos pontos de cada usuário em `tentativa`, ordenado do maior para o menor. |
| O que é a tabela `perfil`? | O 1:1. Guarda o álbum favorito, que faz o site abrir já no tema do usuário. |
| Onde roda o banco? | Em uma VM Linux. A API acessa pela porta 3307 do computador, redirecionada para a 3306 da VM. |
| O que ainda é fraco? | A senha fica em texto no banco, e o servidor confia no id enviado pelo navegador. Para um projeto real, usaria hash e sessão no servidor. |

## 10. Toca-discos e Carteirinha

Nenhuma das duas mexeu na modelagem. Não usam API de terceiros.

**Toca-discos.** Tudo é CSS e poucas linhas de JavaScript.
- O disco tem três estados, que são só classes: `disco` (apagado e parado), `disco tocando` (aceso e girando) e `disco pausado` (aceso e parado).
- O CSS faz o resto. O brilho muda com `filter: brightness` e `transition`, e o giro é a animação `girar` com `animation-play-state` (pausada ou rodando).
- Ao clicar no álbum, `tocarAlbum()` troca a classe do disco, coloca a capa no centro, troca o tema do site e chama `audio_player.play()`.
- O vetor de dados é o objeto `albuns` (nome, ano, música e arquivo de cada álbum).
- Os áudios ficam em `public/assets/audio/` (`man-in-the-box.mp3`, `them-bones.mp3` e `nutshell.mp3`), e são arquivos meus, não vêm de nenhuma API.

**Carteirinha.** Usa dados que já existem.
- O nome e o número de fã vêm do `sessionStorage`. O número é o id do usuário completado com zeros por um `while`.
- O nível de fã vem de `GET /quiz/kpi-pontos/:id` (o `total_pontos`) e de um `if / else if`: 0 pontos é "Novo fã", até 199 é "Fã em formação", de 200 a 499 é "Fã de carteirinha" e 500 ou mais é "Lenda do rock".
- O álbum favorito é o do `perfil` (o 1:1). Ao clicar em um álbum, `POST /usuarios/album-favorito` atualiza o `perfil`.

**Regra que vale para as duas:** o último álbum que o usuário clicar (na home, no toca-discos ou na carteirinha) vira o álbum favorito dele e o tema do site.

**Perguntas que o professor pode fazer**

| Pergunta | Resposta curta |
|---|---|
| Como o disco gira? | Uma animação de CSS (`@keyframes girar`) ligada pela classe `tocando`. O JavaScript só troca a classe. |
| Como o som toca? | A tag `<audio>` e o método `play()` do navegador, com um arquivo da pasta `assets/audio`. |
| De onde vem o nível de fã? | Da soma de pontos do usuário no banco (`SUM`), classificada por um `if / else if`. |
| Teve mudança no banco? | Não. A carteirinha usa o `perfil` (1:1) e a tabela `tentativa`. |
