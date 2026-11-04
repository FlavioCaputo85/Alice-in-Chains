// ADICIONADO: dashboard.js -> busca os dados no MySQL (via API) e monta KPIs + gráficos (Chart.js)

validarSessao();

let idUsuario = sessionStorage.ID_USUARIO;
let nomesAlbuns = { facelift: "Facelift", dirt: "Dirt", jarofflies: "Jar of Flies" };
let chavesAlbuns = ["facelift", "dirt", "jarofflies"];

// cores padrão dos gráficos (texto claro, porque o fundo do site é escuro)
Chart.defaults.color = "#ffffff";
Chart.defaults.borderColor = "rgba(255, 255, 255, 0.2)";

// pega a cor de destaque do tema atual (a mesma variável do CSS)
function corDestaque() {
    let cor = getComputedStyle(document.body).getPropertyValue("--destaque").trim();

    if (cor == "") {
        cor = "#ffffff";
    }
    return cor;
}

carregarKpis();
carregarEvolucao();
carregarAlbuns();
carregarRanking();

// ---------- KPIs (COUNT, AVG, MAX, MIN e posição vêm do MySQL) ----------
function carregarKpis() {
    fetch(`/quiz/kpis/${idUsuario}`)
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (lista) {
            let kpi = lista[0];

            kpi_partidas.innerHTML = kpi.partidas;

            if (kpi.partidas == 0) {
                div_aviso.innerHTML = "Você ainda não jogou nenhuma partida. Vá até o Quiz e volte aqui!";
                return;
            }

            div_aviso.innerHTML = "Total acumulado: " + kpi.total_pontos + " pontos.";
            kpi_media.innerHTML = kpi.media_pontos;
            kpi_media_geral.innerHTML = "média de todos os jogadores: " + kpi.media_geral;
            kpi_melhor.innerHTML = kpi.melhor;
            kpi_pior.innerHTML = kpi.pior;
            kpi_posicao.innerHTML = "#" + kpi.posicao;
        })
        .catch(function (erro) {
            console.log(erro);
            div_aviso.innerHTML = "Não consegui buscar seus dados no servidor.";
        });
}

// ---------- GRÁFICO 1: evolução dos pontos (linha) ----------
function carregarEvolucao() {
    fetch(`/quiz/evolucao/${idUsuario}`)
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (lista) {
            let rotulos = [];
            let pontos = [];

            // a lista vem da partida mais nova para a mais antiga, então eu leio de trás para frente
            for (let i = lista.length - 1; i >= 0; i--) {
                rotulos.push(lista[i].momento_grafico);
                pontos.push(lista[i].pontos);
            }

            new Chart(grafico_evolucao, {
                type: "line",
                data: {
                    labels: rotulos,
                    datasets: [{
                        label: "Pontos por partida",
                        data: pontos,
                        borderColor: corDestaque(),
                        backgroundColor: corDestaque(),
                        tension: 0.3
                    }]
                },
                options: {
                    scales: { y: { beginAtZero: true } },
                    plugins: { title: { display: true, text: "Sua evolução (últimas 8 partidas)" } }
                }
            });
        })
        .catch(function (erro) {
            console.log(erro);
        });
}

// ---------- GRÁFICO 2: % de acerto por álbum (barras) ----------
function carregarAlbuns() {
    fetch(`/quiz/albuns/${idUsuario}`)
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (lista) {
            let rotulos = [];
            let valores = [];
            let melhorValor = 0;
            let melhorAlbum = "";

            // garante os 3 álbuns no gráfico, mesmo que ainda não tenha resposta de algum
            for (let i = 0; i < chavesAlbuns.length; i++) {
                let valor = 0;

                for (let j = 0; j < lista.length; j++) {
                    if (lista[j].album == chavesAlbuns[i]) {
                        valor = Number(lista[j].aproveitamento);
                    }
                }

                rotulos.push(nomesAlbuns[chavesAlbuns[i]]);
                valores.push(valor);

                if (valor > melhorValor) {
                    melhorValor = valor;
                    melhorAlbum = nomesAlbuns[chavesAlbuns[i]];
                }
            }

            // KPI "álbum que você mais domina"
            if (melhorAlbum != "") {
                kpi_album.innerHTML = melhorAlbum;
                kpi_album_detalhe.innerHTML = melhorValor + "% de acerto";
            }

            new Chart(grafico_albuns, {
                type: "bar",
                data: {
                    labels: rotulos,
                    datasets: [{
                        label: "% de acerto",
                        data: valores,
                        backgroundColor: corDestaque()
                    }]
                },
                options: {
                    scales: { y: { beginAtZero: true, max: 100 } },
                    plugins: { title: { display: true, text: "Desempenho por álbum" } }
                }
            });
        })
        .catch(function (erro) {
            console.log(erro);
        });
}

// ---------- GRÁFICO 3: ranking dos jogadores (barras na horizontal) ----------
function carregarRanking() {
    fetch("/quiz/ranking")
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (lista) {
            let nomes = [];
            let pontos = [];
            let cores = [];

            for (let i = 0; i < lista.length; i++) {
                nomes.push((i + 1) + "º " + lista[i].nome);
                pontos.push(lista[i].total_pontos);

                // a minha barra fica colorida, as dos outros ficam mais claras
                if (lista[i].nome == sessionStorage.NOME_USUARIO) {
                    cores.push(corDestaque());
                } else {
                    cores.push("rgba(255, 255, 255, 0.45)");
                }
            }

            new Chart(grafico_ranking, {
                type: "bar",
                data: {
                    labels: nomes,
                    datasets: [{
                        label: "Total de pontos",
                        data: pontos,
                        backgroundColor: cores
                    }]
                },
                options: {
                    indexAxis: "y",
                    plugins: { title: { display: true, text: "Ranking: top 5 jogadores" } }
                }
            });
        })
        .catch(function (erro) {
            console.log(erro);
        });
}
