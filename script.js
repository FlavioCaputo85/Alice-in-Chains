// ---------- CONFIGURAÇÃO ----------
// API Dat-Acqu-Ino: por padrão roda em http://localhost:3300 (npm start).
// AJUSTE o caminho da rota conforme o seu main.js da API.
let API_URL = "http://localhost:3300/sensores/analogico";

// ---------- DADOS DO QUIZ ----------
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

// ---------- VARIÁVEIS GLOBAIS ----------
let indice_atual = 0;
let acertos = 0;
let respostas = [];
let respondeu = false;
let grafico_placar = null;
let grafico_sensor = null;

// ---------- FLUXO DO QUIZ ----------
function iniciar() {
    indice_atual = 0;
    acertos = 0;
    respostas = [];
    tela_inicio.style.display = "none";
    tela_dashboard.style.display = "none";
    tela_quiz.style.display = "flex";
    mostrarPergunta(-1);
}

// escolhida = -1 (ainda não respondeu) ou o índice da opção clicada
function mostrarPergunta(escolhida) {
    let pergunta = perguntas[indice_atual];
    let html = "";

    div_progresso.innerHTML = "PERGUNTA " + (indice_atual + 1) + " DE " + perguntas.length;

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
            html += "<p class='feedback'>Errou... a resposta certa está em destaque.</p>";
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
        respostas.push(1);
    } else {
        respostas.push(0);
    }

    mostrarPergunta(escolhida);
}

function proxima() {
    respondeu = false;
    indice_atual++;

    if (indice_atual < perguntas.length) {
        mostrarPergunta(-1);
    } else {
        mostrarDashboard();
    }
}

// ---------- DASHBOARD ----------
function mostrarDashboard() {
    let erros = perguntas.length - acertos;
    let frase = "";

    tela_quiz.style.display = "none";
    tela_dashboard.style.display = "flex";

    if (acertos >= 7) {
        frase = "Você é um verdadeiro Man in the Box!";
    } else if (acertos >= 4) {
        frase = "Nada mal, mas ainda tem muito Dirt pra ouvir.";
    } else {
        frase = "Hora de colocar Facelift e Dirt no repeat.";
    }

    div_resultado.innerHTML = "Você acertou <b>" + acertos + "</b> de " + perguntas.length + "<br>" + frase;

    if (grafico_placar != null) {
        grafico_placar.destroy();
    }

    grafico_placar = new Chart(canvas_placar, {
        type: "doughnut",
        data: {
            labels: ["Acertos", "Erros"],
            datasets: [{
                data: [acertos, erros],
                backgroundColor: ["#d9c2a0", "#8b0000"],
                borderColor: "#1a0606"
            }]
        },
        options: {
            plugins: {
                title: { display: true, text: "Seu desempenho", color: "#f0d9d0" },
                legend: { labels: { color: "#f0d9d0" } }
            }
        }
    });

    carregarSensor();
}

// ---------- API DAT-ACQU-INO ----------
function carregarSensor() {
    div_status_api.innerHTML = "Buscando dados do Arduino...";

    fetch(API_URL)
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (dados) {
            let lista = [];

            // aceita array direto OU objeto que contenha um array
            if (Array.isArray(dados)) {
                lista = dados;
            } else {
                for (let chave in dados) {
                    if (Array.isArray(dados[chave]) && lista.length == 0) {
                        lista = dados[chave];
                    }
                }
            }

            let valores = [];
            for (let i = 0; i < lista.length; i++) {
                valores.push(Number(lista[i]));
            }

            if (valores.length == 0) {
                usarDadosSimulados("API respondeu sem dados");
            } else {
                desenharSensor(valores, "Dados reais do Arduino (Dat-Acqu-Ino)");
            }
        })
        .catch(function () {
            usarDadosSimulados("API offline (rode 'npm start' no Dat-Acqu-Ino)");
        });
}

function usarDadosSimulados(motivo) {
    let valores = [];
    for (let i = 0; i < 10; i++) {
        valores.push(Math.round(Math.random() * 300 + 200));
    }
    desenharSensor(valores, "Dados simulados - " + motivo);
}

function desenharSensor(valores, status) {
    let ultimos = [];
    let rotulos = [];
    let inicio = valores.length - 10;

    if (inicio < 0) {
        inicio = 0;
    }

    for (let i = inicio; i < valores.length; i++) {
        ultimos.push(valores[i]);
        rotulos.push(i + 1);
    }

    div_status_api.innerHTML = status;

    if (grafico_sensor != null) {
        grafico_sensor.destroy();
    }

    grafico_sensor = new Chart(canvas_sensor, {
        type: "line",
        data: {
            labels: rotulos,
            datasets: [{
                label: "Volume do amp (leitura do sensor)",
                data: ultimos,
                borderColor: "#e0463a",
                backgroundColor: "#8b0000"
            }]
        },
        options: {
            scales: {
                x: { ticks: { color: "#d9a8a0" } },
                y: { ticks: { color: "#d9a8a0" } }
            },
            plugins: {
                legend: { labels: { color: "#f0d9d0" } }
            }
        }
    });
}