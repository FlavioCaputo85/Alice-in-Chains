let quizModel = require("../models/quizModel");

function responderLista(promessa, res) {
    promessa
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function perguntas(req, res) {
    let nivel = Number(req.params.nivel);

    if (nivel != 1 && nivel != 2 && nivel != 3) {
        res.status(400).send("O nível está inválido!");
    } else {
        responderLista(quizModel.buscarPerguntas(nivel), res);
    }
}

function salvar(req, res) {
    let idUsuario = Number(req.body.idUsuarioServer);
    let nivel = Number(req.body.nivelServer);
    let perguntas = req.body.perguntasServer;
    let escolhas = req.body.escolhasServer;
    let respostasValidas = true;

    if (perguntas == undefined || escolhas == undefined) {
        respostasValidas = false;
    } else if (perguntas.length == 0 || perguntas.length > 8 || perguntas.length != escolhas.length) {
        respostasValidas = false;
    } else {
        for (let i = 0; i < perguntas.length; i++) {
            perguntas[i] = Number(perguntas[i]);
            escolhas[i] = Number(escolhas[i]);

            if (isNaN(perguntas[i]) || isNaN(escolhas[i]) || escolhas[i] < 1 || escolhas[i] > 4) {
                respostasValidas = false;
            }
        }
    }

    if (isNaN(idUsuario) || (nivel != 1 && nivel != 2 && nivel != 3)) {
        res.status(400).send("Usuário ou nível inválido!");
    } else if (respostasValidas == false) {
        res.status(400).send("As respostas estão inválidas!");
    } else {
        quizModel.criarTentativa(idUsuario, nivel).then(function (resultado) {
            let idTentativa = resultado.insertId;

            quizModel.salvarRespostas(idTentativa, nivel, perguntas, escolhas).then(function () {
                quizModel.calcularPontos(idTentativa).then(function () {
                    res.status(201).send("Partida salva!");
                });
            }).catch(function (erro) {
                console.log(erro);
                quizModel.apagarTentativa(idTentativa);
                res.status(400).send("As respostas estão inválidas!");
            });
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
    }
}

function kpiPontos(req, res) {
    let idUsuario = Number(req.params.idUsuario);

    if (isNaN(idUsuario)) {
        res.status(400).send("O id do usuário está inválido!");
    } else {
        responderLista(quizModel.buscarKpiPontos(idUsuario), res);
    }
}

function kpiRanking(req, res) {
    responderLista(quizModel.buscarKpiRanking(), res);
}

function kpiAcertos(req, res) {
    let idUsuario = Number(req.params.idUsuario);

    if (isNaN(idUsuario)) {
        res.status(400).send("O id do usuário está inválido!");
    } else {
        responderLista(quizModel.buscarKpiAcertos(idUsuario), res);
    }
}

function evolucao(req, res) {
    let idUsuario = Number(req.params.idUsuario);

    if (isNaN(idUsuario)) {
        res.status(400).send("O id do usuário está inválido!");
    } else {
        responderLista(quizModel.buscarEvolucao(idUsuario), res);
    }
}

function albuns(req, res) {
    let idUsuario = Number(req.params.idUsuario);

    if (isNaN(idUsuario)) {
        res.status(400).send("O id do usuário está inválido!");
    } else {
        responderLista(quizModel.buscarAlbuns(idUsuario), res);
    }
}

function ranking(req, res) {
    responderLista(quizModel.buscarRanking(), res);
}

function dificeis(req, res) {
    responderLista(quizModel.buscarDificeis(), res);
}

module.exports = {
    perguntas,
    salvar,
    kpiPontos,
    kpiRanking,
    kpiAcertos,
    evolucao,
    albuns,
    ranking,
    dificeis
};
