let perguntas = [
    { texto: "Em que ano foi lançado o álbum DIRT?",
      opcoes: ["1990", "1992", "1994", "1996"], correta: 1 },
    { texto: "Qual é a faixa de abertura de DIRT?",
      opcoes: ["Rooster", "Down in a Hole", "Them Bones", "Angry Chair"], correta: 2 },
    { texto: "De qual cidade americana é a banda?",
      opcoes: ["Seattle", "Los Angeles", "Chicago", "Nova York"], correta: 0 },
    { texto: "Quem foi o vocalista original, falecido em 2002?",
      opcoes: ["Chris Cornell", "Kurt Cobain", "Layne Staley", "Scott Weiland"], correta: 2 },
    { texto: "\"Rooster\" foi inspirada na experiência de quem no Vietnã?",
      opcoes: ["Do pai de Jerry Cantrell", "De Sean Kinney", "De Mike Starr", "De Layne Staley"], correta: 0 },
    { texto: "Qual EP acústico foi lançado em 1992?",
      opcoes: ["Jar of Flies", "Sap", "Facelift", "Unplugged"], correta: 1 },
    { texto: "Qual EP de 1994 estreou em 1º lugar na Billboard 200?",
      opcoes: ["Sap", "Jar of Flies", "Dirt", "Black Gives Way to Blue"], correta: 1 },
    { texto: "Quem assumiu os vocais da banda após a morte de Staley?",
      opcoes: ["William DuVall", "Eddie Vedder", "Mark Lanegan", "Ben Shepherd"], correta: 0 }
];

let indice_atual = 0;
let acertos = 0;
let respondeu = false;

mostrarPergunta(-1);

// escolhida = -1 (ainda não respondeu) ou o índice da opção clicada
function mostrarPergunta(escolhida) {
    let pergunta = perguntas[indice_atual];
    let html = "";
    let porcentagem = (indice_atual / perguntas.length) * 100;

    div_progresso.innerHTML = "PERGUNTA " + (indice_atual + 1) + " / " + perguntas.length;
    barra_cheia.style.width = porcentagem + "%";

    html += "<p class='pergunta'>" + pergunta.texto + "</p>";
    html += "<div class='opcoes'>";

    for (let i = 0; i < pergunta.opcoes.length; i++) {
        let classe = "opcao";

        if (escolhida != -1) {
            if (i == pergunta.correta) {
                classe = "opcao certa";
            } else if (i == escolhida) {
                classe = "opcao errada";
            }
        }

        html += "<button class='" + classe + "' onclick='responder(" + i + ")'>" + pergunta.opcoes[i] + "</button>";
    }

    html += "</div>";

    if (escolhida != -1) {
        if (escolhida == pergunta.correta) {
            html += "<p class='feedback'>Acertou! Isso é rock de verdade.</p>";
        } else {
            html += "<p class='feedback'>Errou... a resposta certa está em verde.</p>";
        }

        if (indice_atual < perguntas.length - 1) {
            html += "<button class='botao' onclick='proxima()'>PRÓXIMA</button>";
        } else {
            html += "<button class='botao' onclick='proxima()'>VER PLACAR</button>";
        }
    }

    div_exibir.innerHTML = html;
}

function responder(escolhida) {
    if (respondeu == true) {
        return;
    }
    respondeu = true;

    if (escolhida == perguntas[indice_atual].correta) {
        acertos++;
    }

    mostrarPergunta(escolhida);
}

function proxima() {
    respondeu = false;
    indice_atual++;

    if (indice_atual < perguntas.length) {
        mostrarPergunta(-1);
    } else {
        finalizar();
    }
}

function finalizar() {
    let texto = localStorage.getItem("HISTORICO_QUIZ");
    let lista = [];

    if (texto != null) {
        lista = JSON.parse(texto);
    }

    lista.push({ acertos: acertos, total: perguntas.length });

    // guarda só as 8 últimas tentativas
    while (lista.length > 8) {
        lista.shift();
    }

    localStorage.setItem("HISTORICO_QUIZ", JSON.stringify(lista));
    window.location = "dashboard.html";
}
