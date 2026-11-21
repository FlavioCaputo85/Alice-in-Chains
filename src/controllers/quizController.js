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
    let idNivel = Number(req.params.idNivel);

    if (isNaN(idNivel)) {
        res.status(400).send("O nível está inválido!");
    } else {
        responderLista(quizModel.buscarPerguntas(idNivel), res);
    }
}

function salvar(req, res) {
    let idUsuario = Number(req.body.idUsuarioServer);
    let idNivel = Number(req.body.idNivelServer);
    let opcoes = req.body.opcoesServer;
    let lista = "";
    let opcoesValidas = true;

    if (Array.isArray(opcoes) == false || opcoes.length == 0 || opcoes.length > 20) {
        opcoesValidas = false;
    } else {
        for (let i = 0; i < opcoes.length; i++) {
            let numero = Number(opcoes[i]);

            if (isNaN(numero)) {
                opcoesValidas = false;
            } else if (i == 0) {
                lista = String(numero);
            } else {
                lista += "," + numero;
            }
        }
    }

    if (isNaN(idUsuario) || isNaN(idNivel)) {
        res.status(400).send("Usuário ou nível inválido!");
    } else if (opcoesValidas == false) {
        res.status(400).send("As respostas estão inválidas!");
    } else {
        quizModel.salvarPartida(idUsuario, idNivel, lista)
            .then(function (resultado) {
                if (resultado.affectedRows == 1) {
                    res.status(400).send("Nenhuma resposta válida para este nível!");
                } else {
                    res.status(201).send("Partida salva!");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function kpis(req, res) {
    let idUsuario = Number(req.params.idUsuario);

    if (isNaN(idUsuario)) {
        res.status(400).send("O id do usuário está inválido!");
    } else {
        responderLista(quizModel.buscarKpis(idUsuario), res);
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
    kpis,
    evolucao,
    albuns,
    ranking,
    dificeis
};
