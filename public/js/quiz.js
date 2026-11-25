let bancoDePerguntas = {
    facil: [
        { texto: "De qual álbum é a música \"Man in the Box\"?", opcoes: ["Facelift", "Dirt", "Jar of Flies"], correta: 0, album: "facelift" },
        { texto: "De qual álbum é a música \"Them Bones\"?", opcoes: ["Jar of Flies", "Dirt", "Facelift"], correta: 1, album: "dirt" },
        { texto: "De qual álbum é a música \"Nutshell\"?", opcoes: ["Dirt", "Facelift", "Jar of Flies"], correta: 2, album: "jarofflies" },
        { texto: "De qual álbum é a música \"Bleed the Freak\"?", opcoes: ["Facelift", "Jar of Flies", "Dirt"], correta: 0, album: "facelift" },
        { texto: "De qual álbum é a música \"Down in a Hole\"?", opcoes: ["Jar of Flies", "Facelift", "Dirt"], correta: 2, album: "dirt" },
        { texto: "De qual álbum é a música \"Rotten Apple\"?", opcoes: ["Jar of Flies", "Dirt", "Facelift"], correta: 0, album: "jarofflies" },
        { texto: "De qual álbum é a música \"Junkhead\"?", opcoes: ["Facelift", "Dirt", "Jar of Flies"], correta: 1, album: "dirt" },
        { texto: "De qual álbum é a música \"Dam That River\"?", opcoes: ["Dirt", "Jar of Flies", "Facelift"], correta: 0, album: "dirt" }
    ],
    medio: [
        { texto: "Qual música abre o álbum Dirt?", opcoes: ["Down in a Hole", "Them Bones", "Dam That River", "Rain When I Die"], correta: 1, album: "dirt" },
        { texto: "Qual música abre o EP Jar of Flies?", opcoes: ["Nutshell", "I Stay Away", "Rotten Apple", "No Excuses"], correta: 2, album: "jarofflies" },
        { texto: "Qual destas músicas NÃO está no álbum Facelift?", opcoes: ["Man in the Box", "Bleed the Freak", "Down in a Hole", "Sea of Sorrow"], correta: 2, album: "facelift" },
        { texto: "Qual música vem logo depois de \"Them Bones\" no álbum Dirt?", opcoes: ["Rain When I Die", "Dam That River", "Junkhead", "Down in a Hole"], correta: 1, album: "dirt" },
        { texto: "Qual música vem logo depois de \"Rotten Apple\" no Jar of Flies?", opcoes: ["Nutshell", "No Excuses", "Whale & Wasp", "Don't Follow"], correta: 0, album: "jarofflies" },
        { texto: "Em que ano o álbum Facelift foi lançado?", opcoes: ["1988", "1990", "1992", "1994"], correta: 1, album: "facelift" },
        { texto: "Qual música vem logo depois de \"Man in the Box\" no Facelift?", opcoes: ["Bleed the Freak", "Sunshine", "Sea of Sorrow", "Confusion"], correta: 2, album: "facelift" },
        { texto: "Qual música é a faixa-título do álbum Dirt?", opcoes: ["Angry Chair", "Dirt", "Junkhead", "Hate to Feel"], correta: 1, album: "dirt" }
    ],
    dificil: [
        { texto: "Qual música do álbum Dirt o Flávio mais gosta?", opcoes: ["Rooster", "Them Bones", "Angry Chair", "Hate to Feel"], correta: 1, album: "dirt" },
        { texto: "Qual música do álbum Facelift o Flávio mais gosta?", opcoes: ["Sunshine", "Man in the Box", "Put You Down", "Confusion"], correta: 1, album: "facelift" },
        { texto: "Qual música do Jar of Flies o Flávio mais gosta?", opcoes: ["Whale & Wasp", "Swing on This", "Nutshell", "Don't Follow"], correta: 2, album: "jarofflies" },
        { texto: "Quantas faixas tem o álbum Dirt?", opcoes: ["11", "12", "13", "14"], correta: 2, album: "dirt" },
        { texto: "Qual é a terceira faixa do álbum Dirt?", opcoes: ["Dam That River", "Rain When I Die", "Down in a Hole", "Rooster"], correta: 1, album: "dirt" },
        { texto: "Qual música encerra o álbum Facelift?", opcoes: ["Real Thing", "Put You Down", "Sunshine", "Confusion"], correta: 0, album: "facelift" },
        { texto: "Qual música do Jar of Flies foi o primeiro single e chegou ao 1º lugar do rock mainstream?", opcoes: ["I Stay Away", "No Excuses", "Don't Follow", "Nutshell"], correta: 1, album: "jarofflies" },
        { texto: "Qual efeito de guitarra aparece em \"Man in the Box\"?", opcoes: ["Slide", "Talk box", "Theremin", "Violão de 12 cordas"], correta: 1, album: "facelift" }
    ]
};

let pontosPorNivel = { facil: 10, medio: 20, dificil: 30 };
let nomesNivel = { facil: "Fácil", medio: "Médio", dificil: "Difícil" };
let nomesAlbuns = { facelift: "Facelift", dirt: "Dirt", jarofflies: "Jar of Flies" };

let nivel = "";
let nivelId = 0; // 1=facil,2=medio,3=dificil
let perguntas = [];
let indice = 0;
let acertos = 0;
let respostas = [];
let respondeu = false;

function escolherNivel(escolhido) {
    // determinar nome do nível (para exibição) e id numérico (para API)
    if (typeof escolhido === "number") {
        nivelId = escolhido;
        nivel = escolhido === 1 ? "facil" : escolhido === 2 ? "medio" : escolhido === 3 ? "dificil" : "";
    } else {
        nivel = escolhido;
        nivelId = nivel === "facil" ? 1 : nivel === "medio" ? 2 : nivel === "dificil" ? 3 : 0;
    }

    indice = 0;
    acertos = 0;
    respostas = [];
    respondeu = false;

    div_niveis.className = "escondido";
    div_fim.className = "painel fim escondido";
    div_jogo.className = "painel";

    // Tentar buscar as perguntas do servidor; se falhar, usar o banco local
    if (nivelId > 0) {
        fetch(`/quiz/perguntas/${nivelId}`)
            .then(function (res) { return res.json(); })
            .then(function (linhas) {
                let mapa = {};
                for (let i = 0; i < linhas.length; i++) {
                    let l = linhas[i];
                    if (!mapa[l.idPergunta]) {
                        let chaveAlbum = String(l.album || "").toLowerCase().replace(/\s+/g, "");
                        mapa[l.idPergunta] = { texto: l.texto, album: chaveAlbum, opcoes: [] };
                    }
                    mapa[l.idPergunta].opcoes.push({ id: l.idOpcao, texto: l.opcao, correta: l.correta });
                }

                perguntas = Object.keys(mapa).map(function (k) { return mapa[k]; });

                if (perguntas.length === 0) {
                    perguntas = bancoDePerguntas[nivel] || [];
                }

                mostrarPergunta(-1);
            })
            .catch(function () {
                perguntas = bancoDePerguntas[nivel] || [];
                mostrarPergunta(-1);
            });
    } else {
        perguntas = bancoDePerguntas[nivel] || [];
        mostrarPergunta(-1);
    }
}

function mostrarPergunta(escolhida) {
    let pergunta = perguntas[indice];
    let html = "";

    div_progresso.innerHTML = nomesNivel[nivel].toUpperCase() + " · PERGUNTA " + (indice + 1) + " DE " + perguntas.length;
    barra_cheia.style.width = ((indice / perguntas.length) * 100) + "%";

    html += `<p class="pergunta">${pergunta.texto}</p>`;
    html += `<div class="opcoes">`;

    for (let i = 0; i < pergunta.opcoes.length; i++) {
        let classe = "opcao";
        let opc = pergunta.opcoes[i];
        let estaCorreta = false;
        let textoOpc = typeof opc === "string" ? opc : opc.texto;

        if (escolhida != -1) {
            if (typeof opc === "string") {
                if (i == pergunta.correta) estaCorreta = true;
            } else {
                if (Number(opc.correta) == 1) estaCorreta = true;
            }

            if (estaCorreta) {
                classe = "opcao certa";
            } else if (i == escolhida) {
                classe = "opcao errada";
            }
        }

        html += `<button class="${classe}" onclick="responder(${i})">${textoOpc}</button>`;
    }

    html += `</div>`;

    if (escolhida != -1) {
        let acertouFlag = false;
        let opcEscolhida = pergunta.opcoes[escolhida];
        if (typeof opcEscolhida === "string") {
            if (escolhida == pergunta.correta) acertouFlag = true;
        } else {
            if (Number(opcEscolhida.correta) == 1) acertouFlag = true;
        }

        if (acertouFlag) {
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
    if (respondeu == true) {
        return;
    }
    respondeu = true;

    let pergunta = perguntas[indice];
    let opc = pergunta.opcoes[escolhida];
    let acertou = 0;

    if (typeof opc === "string") {
        if (escolhida == pergunta.correta) {
            acertou = 1;
            acertos++;
        }
        respostas.push(escolhida + 1);
    } else {
        if (Number(opc.correta) == 1) {
            acertou = 1;
            acertos++;
        }
        respostas.push(opc.id);
    }

    mostrarPergunta(escolhida);
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
    let pontos = acertos * pontosPorNivel[nivel];

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
            idNivelServer: nivelId,
            opcoesServer: respostas
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
