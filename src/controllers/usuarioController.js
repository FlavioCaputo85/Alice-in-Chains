let usuarioModel = require("../models/usuarioModel");
let validacao = require("../../public/js/validacao.js");

function autenticar(req, res) {
    let email = String(req.body.emailServer);
    let senha = String(req.body.senhaServer);
    let erro = validacao.validarLogin(email, senha);

    if (erro != "") {
        res.status(400).send(erro);
    } else {
        usuarioModel.autenticar(email, senha)
            .then(function (resultado) {
                if (resultado.length == 1) {
                    res.json(resultado[0]);
                } else {
                    res.status(403).send("E-mail e/ou senha inválido(s)");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function cadastrar(req, res) {
    let nome = String(req.body.nomeServer);
    let email = String(req.body.emailServer);
    let senha = String(req.body.senhaServer);
    let erro = validacao.validarCadastro(nome, email, senha, senha);

    if (erro != "") {
        res.status(400).send(erro);
    } else {
        usuarioModel.cadastrar(nome, email, senha)
            .then(function () {
                res.status(201).send("Cadastrado!");
            })
            .catch(function (erro) {
                console.log(erro);

                if (erro.code == "ER_DUP_ENTRY") {
                    res.status(409).send("Esse e-mail já está cadastrado.");
                } else {
                    res.status(500).json(erro.sqlMessage);
                }
            });
    }
}

function albumFavorito(req, res) {
    let idUsuario = Number(req.body.idUsuarioServer);
    let idAlbum = Number(req.body.idAlbumServer);

    if (isNaN(idUsuario) || isNaN(idAlbum)) {
        res.status(400).send("Dados inválidos!");
    } else {
        usuarioModel.atualizarAlbumFavorito(idUsuario, idAlbum)
            .then(function () {
                res.status(200).send("Álbum favorito salvo!");
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    autenticar,
    cadastrar,
    albumFavorito
};
