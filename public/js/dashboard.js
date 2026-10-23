// API Dat-Acqu-Ino: por padrão roda em http://localhost:3300 (npm start na pasta dela).
// AJUSTE o caminho da rota conforme o main.js da API.
let API_URL = "http://localhost:3300/sensores/analogico";

let COR_TEXTO = "#ffffff";
let COR_CLARA = "#ffffff";
let COR_ESCURA = "#4a1515";

let texto = localStorage.getItem("HISTORICO_QUIZ");
let lista = [];

if (texto != null) {
    lista = JSON.parse(texto);
}

montarDashboard();
carregarSensor();

// ---------- HISTÓRICO (guardado no navegador) ----------
function montarDashboard() {
    if (lista.length == 0) {
        div_frase.innerHTML = "Você ainda não jogou. Faça o quiz para ver seu placar!";
        kpi_acertos.innerHTML = 0;
        kpi_erros.innerHTML = 0;
        kpi_percentual.innerHTML = "0%";
        kpi_melhor.innerHTML = "0";
        return;
    }

    let ultimo = lista[lista.length - 1];
    let acertos = ultimo.acertos;
    let total = ultimo.total;
    let erros = total - acertos;
    let percentual = Math.round((acertos / total) * 100);
    let melhor = 0;
    let rotulos = [];
    let valores = [];

    for (let i = 0; i < lista.length; i++) {
        rotulos.push("Tentativa " + (i + 1));
        valores.push(lista[i].acertos);

        if (lista[i].acertos > melhor) {
            melhor = lista[i].acertos;
        }
    }

    kpi_acertos.innerHTML = acertos;
    kpi_erros.innerHTML = erros;
    kpi_percentual.innerHTML = percentual + "%";
    kpi_melhor.innerHTML = melhor + "/" + total;

    if (acertos >= 7) {
        div_frase.innerHTML = "Você é um verdadeiro Man in the Box!";
    } else if (acertos >= 4) {
        div_frase.innerHTML = "Nada mal, mas ainda tem muito Dirt pra ouvir.";
    } else {
        div_frase.innerHTML = "Hora de colocar Facelift e Dirt no repeat.";
    }

    new Chart(canvas_placar, {
        type: "doughnut",
        data: {
            labels: ["Acertos", "Erros"],
            datasets: [{
                data: [acertos, erros],
                backgroundColor: [COR_CLARA, COR_ESCURA],
                borderColor: "#b82828"
            }]
        },
        options: {
            plugins: {
                title: { display: true, text: "Último placar", color: COR_TEXTO },
                legend: { labels: { color: COR_TEXTO } }
            }
        }
    });

    new Chart(canvas_historico, {
        type: "bar",
        data: {
            labels: rotulos,
            datasets: [{
                label: "Acertos por tentativa",
                data: valores,
                backgroundColor: COR_CLARA
            }]
        },
        options: {
            scales: {
                x: { ticks: { color: COR_TEXTO } },
                y: { beginAtZero: true, max: total, ticks: { color: COR_TEXTO } }
            },
            plugins: {
                title: { display: true, text: "Sua evolução", color: COR_TEXTO },
                legend: { labels: { color: COR_TEXTO } }
            }
        }
    });
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

    new Chart(canvas_sensor, {
        type: "line",
        data: {
            labels: rotulos,
            datasets: [{
                label: "Volume do amp (leitura do sensor)",
                data: ultimos,
                borderColor: COR_CLARA,
                backgroundColor: COR_ESCURA
            }]
        },
        options: {
            scales: {
                x: { ticks: { color: COR_TEXTO } },
                y: { ticks: { color: COR_TEXTO } }
            },
            plugins: {
                legend: { labels: { color: COR_TEXTO } }
            }
        }
    });
}
