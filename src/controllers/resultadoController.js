let resultadoModel = require("../models/resultadoModel");

function salvar(req, res) {
    let idUsuario = Number(req.body.idUsuario);
    let acertos = Number(req.body.acertos);
    let total = Number(req.body.total);

    if (isNaN(idUsuario) || isNaN(acertos) || isNaN(total) || acertos < 0 || acertos > total) {
        res.status(400).send("Dados inválidos.");
    } else {
        resultadoModel.salvar(idUsuario, acertos, total)
            .then(function () {
                res.status(201).json({ mensagem: "Placar salvo!" });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).send("Erro ao salvar placar.");
            });
    }
}

function historico(req, res) {
    let idUsuario = Number(req.params.idUsuario);

    if (isNaN(idUsuario)) {
        res.status(400).send("Usuário inválido.");
    } else {
        resultadoModel.historico(idUsuario)
            .then(function (lista) {
                res.json(lista);
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).send("Erro ao buscar histórico.");
            });
    }
}

module.exports = { salvar, historico };
