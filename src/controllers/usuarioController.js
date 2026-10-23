let usuarioModel = require("../models/usuarioModel");

function cadastrar(req, res) {
    let nome = req.body.nome;
    let email = req.body.email;
    let senha = req.body.senha;

    if (nome == undefined || email == undefined || senha == undefined) {
        res.status(400).send("Dados incompletos.");
    } else if (senha.length < 6) {
        res.status(400).send("A senha precisa ter ao menos 6 caracteres.");
    } else {
        usuarioModel.cadastrar(nome, email, senha)
            .then(function () {
                res.status(201).json({ mensagem: "Cadastrado!" });
            })
            .catch(function (erro) {
                if (erro.code == "ER_DUP_ENTRY") {
                    res.status(409).send("E-mail já cadastrado.");
                } else {
                    console.log(erro);
                    res.status(500).send("Erro ao cadastrar.");
                }
            });
    }
}

function autenticar(req, res) {
    let email = req.body.email;
    let senha = req.body.senha;

    if (email == undefined || senha == undefined) {
        res.status(400).send("Dados incompletos.");
    } else {
        usuarioModel.buscarPorEmail(email)
            .then(function (lista) {
                if (lista.length == 0) {
                    res.status(403).send("E-mail e/ou senha inválidos.");
                } else if (usuarioModel.conferirSenha(senha, lista[0].senha)) {
                    res.json({
                        idUsuario: lista[0].idUsuario,
                        nome: lista[0].nome,
                        email: lista[0].email
                    });
                } else {
                    res.status(403).send("E-mail e/ou senha inválidos.");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).send("Erro ao autenticar.");
            });
    }
}

module.exports = { cadastrar, autenticar };
