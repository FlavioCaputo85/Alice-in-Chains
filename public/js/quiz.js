let nomesNivel = ["", "Fácil", "Médio", "Difícil"];
let nomesAlbuns = { facelift: "Facelift", dirt: "Dirt", jarofflies: "Jar of Flies" };

let nivel = 0;
let perguntas = [];
let indice = 0;
let acertos = 0;
let pontos = 0;
let idsPerguntas = [];
let escolhas = [];
let respondeu = false;

function escolherNivel(escolhido) {
    nivel = escolhido;
    indice = 0;
    acertos = 0;
    pontos = 0;
    idsPerguntas = [];
    escolhas = [];
    respondeu = false;

    div_niveis_aviso.innerHTML = "Buscando as perguntas...";

    fetch(`/quiz/perguntas/${nivel}`).then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(function (lista) {
                perguntas = lista;

                div_niveis_aviso.innerHTML = "";
                div_niveis.className = "escondido";
                div_fim.className = "painel fim escondido";
                div_jogo.className = "painel";
                mostrarPergunta(-1);
            });
        } else {
            div_niveis_aviso.innerHTML = "Não encontrei perguntas para este nível.";
        }
    }).catch(function (erro) {
        console.log(erro);
        div_niveis_aviso.innerHTML = "Não consegui buscar as perguntas no servidor.";
    });
}

function listarOpcoes(pergunta) {
    let opcoes = [pergunta.opcao_a, pergunta.opcao_b, pergunta.opcao_c];

    if (pergunta.opcao_d != null) {
        opcoes.push(pergunta.opcao_d);
    }
    return opcoes;
}

function mostrarPergunta(escolhida) {
    let pergunta = perguntas[indice];
    let opcoes = listarOpcoes(pergunta);
    let html = "";

    div_progresso.innerHTML = nomesNivel[nivel].toUpperCase() + " · PERGUNTA " + (indice + 1) + " DE " + perguntas.length;
    barra_cheia.style.width = ((indice / perguntas.length) * 100) + "%";

    html += `<p class="pergunta">${pergunta.texto}</p>`;
    html += `<div class="opcoes">`;

    for (let i = 0; i < opcoes.length; i++) {
        let classe = "opcao";

        if (escolhida != -1) {
            if (i + 1 == pergunta.correta) {
                classe = "opcao certa";
            } else if (i == escolhida) {
                classe = "opcao errada";
            }
        }

        html += `<button class="${classe}" onclick="responder(${i})">${opcoes[i]}</button>`;
    }

    html += `</div>`;

    if (escolhida != -1) {
        if (escolhida + 1 == pergunta.correta) {
            html += `<p class="feedback">Acertou! Essa é do álbum ${nomesAlbuns[pergunta.album]}.</p>`;
        } else {
            html += `<p class="feedback">Errou. A resposta certa está em verde (álbum ${nomesAlbuns[pergunta.album]}).</p>`;
        }

        if (indice < perguntas.length - 1) {
            html += `<button class="btn-link" onclick="proxima()">Próxima</button>`;
        } else {
            html += `<button class="btn-link" onclick="proxima()">Ver resultado</button>`;
        }
    }

    div_exibir.innerHTML = html;
}

function responder(escolhida) {
    if (respondeu == false) {
        let pergunta = perguntas[indice];

        respondeu = true;

        if (escolhida + 1 == pergunta.correta) {
            acertos++;
            pontos += pergunta.pontos;
        }

        idsPerguntas.push(pergunta.id);
        escolhas.push(escolhida + 1);
        mostrarPergunta(escolhida);
    }
}

function proxima() {
    respondeu = false;
    indice++;

    if (indice < perguntas.length) {
        mostrarPergunta(-1);
    } else {
        finalizar();
    }
}

function finalizar() {
    barra_cheia.style.width = "100%";
    div_jogo.className = "painel escondido";
    div_fim.className = "painel fim";

    div_fim.innerHTML = `
        <h2>Fim do quiz!</h2>
        <p>Nível ${nomesNivel[nivel]}: você acertou ${acertos} de ${perguntas.length}</p>
        <div class="pontos">${pontos} pts</div>
        <p id="div_salvo">Salvando sua partida...</p>
        <br>
        <div class="acoes">
            <a class="btn-link" href="dashboard.html">Ver meu dashboard</a>
            <a class="btn-link vazio" href="quiz.html">Jogar de novo</a>
        </div>
    `;

    fetch("/quiz/salvar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idUsuarioServer: sessionStorage.ID_USUARIO,
            nivelServer: nivel,
            perguntasServer: idsPerguntas,
            escolhasServer: escolhas
        })
    }).then(function (resposta) {
        if (resposta.ok) {
            div_salvo.innerHTML = "Partida salva! Ela já conta no ranking.";
        } else {
            div_salvo.innerHTML = "Não consegui salvar esta partida no banco.";
        }
    }).catch(function (erro) {
        console.log(erro);
        div_salvo.innerHTML = "Não consegui falar com o servidor.";
    });
}

validarSessao();
