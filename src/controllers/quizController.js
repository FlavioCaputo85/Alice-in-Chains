let quizModel = require("../models/quizModel");

let pesos = { facil: 10, medio: 20, dificil: 30 };
let albunsValidos = ["facelift", "dirt", "jarofflies"];

function salvar(req, res) {
    let idUsuario = Number(req.body.idUsuarioServer);
    let nivel = req.body.nivelServer;
    let respostas = req.body.respostasServer;

    if (isNaN(idUsuario)) {
        res.status(400).send("O id do usuário está inválido!");
    } else if (pesos[nivel] == undefined) {
        res.status(400).send("O nível está inválido!");
    } else if (!Array.isArray(respostas) || respostas.length == 0 || respostas.length > 20) {
        res.status(400).send("As respostas estão inválidas!");
    } else {
        let acertos = 0;
        let limpas = [];

        for (let i = 0; i < respostas.length; i++) {
            if (albunsValidos.indexOf(respostas[i].album) != -1) {
                let acertou = 0;
                if (respostas[i].acertou == 1) {
                    acertou = 1;
                    acertos++;
                }
                limpas.push({ album: respostas[i].album, acertou: acertou });
            }
        }

        if (limpas.length != respostas.length) {
            res.status(400).send("Existe uma resposta com álbum inválido!");
            return;
        }

        let pontos = acertos * pesos[nivel];

        quizModel.salvarTentativa(idUsuario, nivel, acertos, limpas.length, pontos)
            .then(function (resultado) {
                let idTentativa = resultado.insertId;
                let valores = "";

                for (let i = 0; i < limpas.length; i++) {
                    if (i > 0) {
                        valores += ", ";
                    }
                    valores += `(${idTentativa}, '${limpas[i].album}', ${limpas[i].acertou})`;
                }

                return quizModel.salvarRespostas(valores).then(function () {
                    res.status(201).json({ acertos: acertos, pontos: pontos });
                });
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao salvar a partida! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function kpis(req, res) {
    let idUsuario = Number(req.params.idUsuario);

    if (isNaN(idUsuario)) {
        res.status(400).send("O id do usuário está inválido!");
    } else {
        quizModel.buscarKpis(idUsuario)
            .then(function (resultado) {
                res.status(200).json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function evolucao(req, res) {
    let idUsuario = Number(req.params.idUsuario);

    if (isNaN(idUsuario)) {
        res.status(400).send("O id do usuário está inválido!");
    } else {
        quizModel.buscarEvolucao(idUsuario)
            .then(function (resultado) {
                res.status(200).json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function albuns(req, res) {
    let idUsuario = Number(req.params.idUsuario);

    if (isNaN(idUsuario)) {
        res.status(400).send("O id do usuário está inválido!");
    } else {
        quizModel.buscarAlbuns(idUsuario)
            .then(function (resultado) {
                res.status(200).json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function ranking(req, res) {
    quizModel.buscarRanking()
        .then(function (resultado) {
            res.status(200).json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = { salvar, kpis, evolucao, albuns, ranking };
