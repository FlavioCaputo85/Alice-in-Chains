validarSessao();

let idUsuario = sessionStorage.ID_USUARIO;
let nomesAlbuns = { facelift: "Facelift", dirt: "Dirt", jarofflies: "Jar of Flies" };
let chavesAlbuns = ["facelift", "dirt", "jarofflies"];
let coresTema = { facelift: "#e0b73a", dirt: "#ffb199", jarofflies: "#bfe3e0" };

let cor = "#c9c9c9";

if (temaSalvo != null) {
    cor = coresTema[temaSalvo];
}

Chart.defaults.color = "#ffffff";
Chart.defaults.borderColor = "rgba(255, 255, 255, 0.2)";
Chart.defaults.maintainAspectRatio = false;

carregarKpiPontos();
carregarKpiAcertos();
carregarEvolucao();
carregarAlbuns();
carregarRanking();
carregarDificeis();

function carregarKpiPontos() {
    fetch(`/quiz/kpi-pontos/${idUsuario}`).then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(function (lista) {
                let total = Number(lista[0].total_pontos);
                let ultima = Number(lista[0].pontos_ultima);

                kpi_pontos.innerHTML = total + " pts";

                if (lista[0].partidas == 0) {
                    div_aviso.innerHTML = "Você ainda não jogou nenhuma partida. Vá até o Quiz e volte aqui!";
                    kpi_pontos_variacao.innerHTML = "nenhuma partida ainda";
                } else {
                    div_aviso.innerHTML = "Você já jogou " + lista[0].partidas + " partidas.";
                    kpi_pontos_variacao.innerHTML = "▲ +" + ultima + " pts na última partida";
                    kpi_pontos_variacao.className = "subiu";
                }

                carregarKpiRanking(total, ultima);
            });
        }
    }).catch(function (erro) {
        console.log(erro);
        div_aviso.innerHTML = "Não consegui buscar seus dados no servidor.";
    });
}

function carregarKpiRanking(meuTotal, minhaUltima) {
    fetch("/quiz/kpi-ranking").then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(function (lista) {
                let posicaoAtual = 1;
                let posicaoAnterior = 1;

                for (let i = 0; i < lista.length; i++) {
                    let totalJogador = Number(lista[i].total);

                    if (lista[i].fk_usuario != idUsuario) {
                        if (totalJogador > meuTotal) {
                            posicaoAtual++;
                        }
                        if (totalJogador > meuTotal - minhaUltima) {
                            posicaoAnterior++;
                        }
                    }
                }

                let diferenca = posicaoAnterior - posicaoAtual;

                kpi_posicao.innerHTML = posicaoAtual + "º lugar";

                if (diferenca > 0) {
                    kpi_posicao_variacao.innerHTML = "▲ subiu " + diferenca + " posição(ões)";
                    kpi_posicao_variacao.className = "subiu";
                } else if (diferenca < 0) {
                    kpi_posicao_variacao.innerHTML = "▼ caiu " + (diferenca * -1) + " posição(ões)";
                    kpi_posicao_variacao.className = "caiu";
                } else {
                    kpi_posicao_variacao.innerHTML = "manteve a posição";
                }
            });
        }
    }).catch(function (erro) {
        console.log(erro);
    });
}

function carregarKpiAcertos() {
    fetch(`/quiz/kpi-acertos/${idUsuario}`).then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(function (lista) {
                if (lista.length == 0) {
                    kpi_acertos_variacao.innerHTML = "nenhuma partida ainda";
                } else if (lista.length == 1) {
                    kpi_acertos.innerHTML = lista[0].acertos + " de " + lista[0].total;
                    kpi_acertos_variacao.innerHTML = "primeira partida";
                } else {
                    let diferenca = lista[0].acertos - lista[1].acertos;

                    kpi_acertos.innerHTML = lista[0].acertos + " de " + lista[0].total;

                    if (diferenca > 0) {
                        kpi_acertos_variacao.innerHTML = "▲ " + diferenca + " acerto(s) a mais que a anterior";
                        kpi_acertos_variacao.className = "subiu";
                    } else if (diferenca < 0) {
                        kpi_acertos_variacao.innerHTML = "▼ " + (diferenca * -1) + " acerto(s) a menos que a anterior";
                        kpi_acertos_variacao.className = "caiu";
                    } else {
                        kpi_acertos_variacao.innerHTML = "igual à partida anterior";
                    }
                }
            });
        }
    }).catch(function (erro) {
        console.log(erro);
    });
}

function carregarEvolucao() {
    fetch(`/quiz/evolucao/${idUsuario}`).then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(function (lista) {
                let rotulos = [];
                let pontos = [];

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
                            borderColor: cor,
                            backgroundColor: cor
                        }]
                    },
                    options: {
                        scales: { y: { beginAtZero: true } },
                        plugins: { title: { display: true, text: "Sua evolução (últimas 8 partidas)" } }
                    }
                });
            });
        }
    }).catch(function (erro) {
        console.log(erro);
    });
}

function carregarAlbuns() {
    fetch(`/quiz/albuns/${idUsuario}`).then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(function (lista) {
                let rotulos = [];
                let valores = [];

                for (let i = 0; i < chavesAlbuns.length; i++) {
                    let porcentagem = 0;

                    for (let j = 0; j < lista.length; j++) {
                        if (lista[j].album == chavesAlbuns[i]) {
                            porcentagem = Math.round(lista[j].acertos * 100 / lista[j].respostas);
                        }
                    }

                    rotulos.push(nomesAlbuns[chavesAlbuns[i]]);
                    valores.push(porcentagem);
                }

                new Chart(grafico_albuns, {
                    type: "bar",
                    data: {
                        labels: rotulos,
                        datasets: [{
                            label: "% de acerto",
                            data: valores,
                            backgroundColor: cor
                        }]
                    },
                    options: {
                        scales: { y: { beginAtZero: true, max: 100 } },
                        plugins: { title: { display: true, text: "Desempenho por álbum" } }
                    }
                });
            });
        }
    }).catch(function (erro) {
        console.log(erro);
    });
}

function carregarRanking() {
    fetch("/quiz/ranking").then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(function (lista) {
                let nomes = [];
                let pontos = [];
                let cores = [];

                for (let i = 0; i < lista.length; i++) {
                    nomes.push((i + 1) + "º " + lista[i].nome);
                    pontos.push(lista[i].total_pontos);

                    if (lista[i].nome == sessionStorage.NOME_USUARIO) {
                        cores.push(cor);
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
            });
        }
    }).catch(function (erro) {
        console.log(erro);
    });
}

function carregarDificeis() {
    fetch("/quiz/dificeis").then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(function (lista) {
                let html = "";

                for (let i = 0; i < lista.length; i++) {
                    let porcentagem = Math.round(lista[i].acertos * 100 / lista[i].vezes);

                    html += "<p><b>" + lista[i].texto + "</b><br>" + nomesAlbuns[lista[i].album] + " · " + porcentagem + "% de acerto em " + lista[i].vezes + " respostas</p>";
                }

                if (html == "") {
                    html = "<p>Ninguém jogou ainda.</p>";
                }

                div_dificeis.innerHTML = html;
            });
        }
    }).catch(function (erro) {
        console.log(erro);
    });
}
