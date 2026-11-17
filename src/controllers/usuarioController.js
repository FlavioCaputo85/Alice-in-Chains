var usuarioModel = require("../models/usuarioModel");
var aquarioModel = require("../models/aquarioModel");
// ADICIONADO: as mesmas validações do navegador, agora também no servidor
var validacao = require("../../public/js/validacao.js");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else if (validacao.validarLogin(String(email), String(senha)) != "") {
        // ADICIONADO: valida e-mail e senha no servidor (o navegador pode ser burlado)
        res.status(400).send(validacao.validarLogin(String(email), String(senha)));
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        // ALTERADO: tirei a busca de aquários por empresa (aquarioModel.buscarAquariosPorEmpresa),
                        // porque o quiz não usa aquários. Agora o login devolve só os dados do usuário.
                        res.json({
                            id: resultadoAutenticar[0].id,
                            email: resultadoAutenticar[0].email,
                            nome: resultadoAutenticar[0].nome,
                            senha: resultadoAutenticar[0].senha
                        });
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    // ALTERADO: tirei a variável fkEmpresa (idEmpresaVincularServer) porque o quiz não tem empresas

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (validacao.validarCadastro(String(nome), String(email), String(senha), String(senha)) != "") {
        // ADICIONADO: valida nome, e-mail e senha segura no servidor (o navegador pode ser burlado)
        res.status(400).send(validacao.validarCadastro(String(nome), String(email), String(senha), String(senha)));
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nome, email, senha)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );

                    // ADICIONADO: e-mail repetido (a coluna email é UNIQUE no banco)
                    if (erro.code == "ER_DUP_ENTRY") {
                        res.status(409).send("Esse e-mail já está cadastrado.");
                    } else {
                        res.status(500).json(erro.sqlMessage);
                    }
                }
            );
    }
}

module.exports = {
    autenticar,
    cadastrar
} 