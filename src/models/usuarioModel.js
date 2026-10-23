let crypto = require("crypto");
let database = require("../database/config");

function gerarHash(senha, sal) {
    return crypto.scryptSync(senha, sal, 32).toString("hex");
}

function cadastrar(nome, email, senha) {
    let sal = crypto.randomBytes(16).toString("hex");
    let guardado = sal + ":" + gerarHash(senha, sal);
    return database.executar(
        "INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)",
        [nome, email, guardado]
    );
}

function buscarPorEmail(email) {
    return database.executar(
        "SELECT idUsuario, nome, email, senha FROM usuario WHERE email = ?",
        [email]
    );
}

function conferirSenha(senha, guardado) {
    let partes = guardado.split(":");
    if (gerarHash(senha, partes[0]) == partes[1]) {
        return true;
    }
    return false;
}

module.exports = { cadastrar, buscarPorEmail, conferirSenha };
