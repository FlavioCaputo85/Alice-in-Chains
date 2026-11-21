# Diário de Prompts

Aqui eu registro o que pedi para a IA, o que ela respondeu, o que eu usei e o que eu mudei.

## Como eu uso a IA neste projeto

- A IA é **apoio**: tira dúvidas, revisa, gera casos de teste e sugere trechos de código.
- Eu preciso **saber explicar cada linha** que entra no projeto. O que eu não entendo, não uso.
- Eu peço **explicação antes de código**, e peço **dicas antes da resposta pronta**.
- Eu **confiro** o que a IA disse: testo no navegador e no banco e comparo com o material de apoio.
- Eu mantenho a arquitetura do projeto base (rota, controller e model) e só uso tecnologias do material.

## Parte 1. Registro das etapas

### 1. Tema e estrutura inicial
- **Pedi:** ajuda para estruturar um quiz de rock em HTML, CSS e JavaScript, com dashboard em Chart.js, seguindo as restrições da disciplina (`let`, `==`, sem `getElementById`, só `if`, `for` e `while`).
- **A IA fez:** propôs a divisão em arquivos e um primeiro código.
- **O que eu usei:** a divisão em HTML, CSS e JS.
- **O que eu decidi e mudei:** escolhi o tema (Alice in Chains), os 3 álbuns e as músicas favoritas. Mandei o meu layout de página inicial e pedi para a IA seguir as cores e formas dele. Pedi para tirar o login naquele momento, para fazer as coisas devagar.

### 2. API do Arduino (descartada)
- **Pedi:** integrar a API Dat-Acqu-Ino no dashboard.
- **A IA fez:** avisou que não conseguiu confirmar a rota da API pela documentação, deixou o endereço configurável e usou dados simulados quando a API está offline.
- **O que eu decidi:** o projeto não precisa de Arduino. Pedi para recomeçar com os álbuns e um dashboard conceitual, e a API saiu do projeto.

### 3. Adaptar o web-data-viz
- **Pedi:** trabalhar em cima do zip do professor, mudar o mínimo possível e listar tudo o que fosse tirado ou trocado, com um comentário.
- **A IA fez:** adaptou o cadastro e o login (tirou empresa e aquário), criou a rota do quiz seguindo o passo a passo do material e listou as alterações.
- **O que eu fiz:** li as alterações, removi arquivos do AquaTech que não faziam sentido e tirei os comentários, porque o professor não aceita.

### 4. Perguntas do quiz
- **Pedi:** perguntas fáceis, médias e difíceis, focadas nas músicas que eu mais gosto, sem temas polêmicos. No nível difícil, perguntas do tipo "qual música o Flávio mais gosta".
- **A IA fez:** conferiu as listas de faixas dos álbuns na web e montou 24 perguntas.
- **O que eu fiz:** escolhi as músicas e a regra do nível difícil. Revisei as perguntas para não ter erro de fato nem assunto delicado.

### 5. Trello e tamanho das tarefas
- **Pedi:** as tarefas do projeto com Fibonacci e tamanhos P, M, G e GG, e uma descrição curta de cada uma.
- **A IA fez:** montou 44 tarefas por semana, primeiro com a escala 1, 2, 3, 5, 8.
- **O que eu corrigi:** o professor exige pontos 3, 5, 8, 13 ou 21, e eu pedi para a IA refazer.

### 6. MySQL na VM Linux
- **Pedi:** que a IA entendesse o desenho do quadro (host, VM, porta 3307 e 3306) e me explicasse como salvar os dados no servidor.
- **A IA fez:** explicou o redirecionamento de porta e os 3 tipos de acesso, e pediu o texto exato dos erros.
- **O que eu fiz:** testei no Workbench com host `127.0.0.1` e porta `3307` (o CMD deu `mysql is not recognized`, então usei o Workbench). Conferi que o banco era o da VM e que as linhas apareciam no `SELECT`. Aprendi que o usuário do Linux e o usuário do MySQL são coisas diferentes.

### 7. Validação de e-mail e senha
- **Pedi:** um sistema simples, com laços de repetição e condicionais, para validar e-mail e senha segura.
- **A IA fez:** criou o `validacao.js` (sem regex) e testou vários cenários, inclusive tentativas de injeção de SQL.
- **O que eu fiz:** copiei o arquivo para a pasta errada e deu o erro `Cannot find module`. Li o erro, vi o caminho que o servidor procurava e coloquei o arquivo em `public/js`.

### 8. Modelagem lógica e simplificação
- **Pedi:** modelagem com um 1:1, um 1:N e um N:N que faça sentido para o projeto, e simplificar o código.
- **A IA fez:** propôs 8 tabelas, escreveu o script SQL, testou em um MariaDB e simplificou os arquivos JS.
- **O que eu fiz:** [preencher: o que você entendeu e o que mudou ou escolheu sozinho].

## Parte 2. Perguntas boas para fazer à IA

Para cada pergunta, a IA ajuda a estudar e conferir, e eu continuo fazendo o trabalho.

| # | Pergunta que eu faço | Por que vale usar a IA | O que a IA não deve fazer | O que eu faço depois |
|---|---|---|---|---|
| 1 | "Explique a diferença entre relacionamento 1:1, 1:N e N:N com um exemplo fora do meu projeto." | É um conceito. Ela explica, e eu aplico. | Modelar o meu banco por mim. | Identifico no meu projeto onde cada um aparece. |
| 2 | "Por que um N:N precisa de tabela associativa? O que dá errado se eu guardar uma lista de ids em uma coluna?" | Me faz entender o motivo, não decorar. | Dar só a tabela pronta. | Explico com as minhas palavras. |
| 3 | "Revise o meu modelo lógico (colei abaixo). Liste o que está errado ou faltando, sem reescrever." | A IA vê erros que eu não vejo. | Reescrever o modelo. | Corrijo por conta própria. |
| 4 | "Meu `JOIN` devolveu linhas repetidas. Me dê 3 hipóteses, sem me dar a consulta pronta." | Eu treino a depuração. | Entregar o SQL final. | Testo cada hipótese no Workbench. |
| 5 | "Quais cenários de erro posso ter em um cadastro? Só liste." | Evita eu esquecer casos. | Escrever o código. | Implemento cada caso com `if` e `else`. |
| 6 | "Gere 8 entradas de teste para a minha validação de senha, com o resultado esperado." | Teste é um bom uso de IA. | Corrigir o meu código. | Rodo, comparo e ajusto. |
| 7 | "Explique o caminho de um `fetch` até o MySQL. Depois me faça 5 perguntas para eu treinar explicar." | Eu preparo a apresentação. | Responder as perguntas por mim. | Respondo em voz alta e confiro. |
| 8 | "Recebi este erro (colei o texto). Liste as causas prováveis, da mais para a menos comum. Não altere meu código." | Acelera a leitura de erros. | Mexer no meu arquivo. | Testo as causas uma a uma. |
| 9 | "Que indicadores fazem sentido para o usuário em um quiz? Dê 3 ideias, com a função de agregação de cada uma (`AVG`, `MAX`...)." | É brainstorm, e eu escolho. | Montar o dashboard. | Escolho, escrevo o `SELECT` e valido no Workbench. |
| 10 | "Qual a diferença entre `var` e `let`? Mostre um exemplo pequeno." | Esclarece uma regra da disciplina. | Reescrever o projeto. | Troco no meu código e entendo cada troca. |
| 11 | "Por que não posso montar um SQL juntando texto? O que é injeção de SQL? Dê um exemplo." | Segurança é conteúdo novo. | Esconder o risco. | Decido o que proibir no formulário. |
| 12 | "Revise a minha descrição de requisitos: tem algum requisito que não dá para testar?" | Revisão de texto. | Reescrever o documento. | Reescrevo os requisitos vagos. |

## Parte 3. Modelo para novas entradas

```
### Etapa
- Pedi:
- A IA fez:
- O que eu usei:
- O que eu mudei ou decidi sozinho:
- O que eu aprendi:
```

## Parte 4. Reflexão final

- **Onde a IA mais ajudou:** [preencher]
- **O que eu recusei ou mudei do que ela sugeriu:** [preencher]
- **O que eu ainda preciso estudar:** [preencher]
