function mostrarMsgEmail() {
    let erro = validarEmail(email_input.value);

    if (email_input.value == "") {
        div_msg_email.innerHTML = "";
    } else if (erro == "") {
        div_msg_email.innerHTML = '<span class="regra-ok">✔ E-mail válido</span>';
    } else {
        div_msg_email.innerHTML = '<span class="regra-erro">✖ ' + erro + '</span>';
    }
}

function mostrarRegrasSenha() {
    let regras = regrasDaSenha(senha_input.value);
    let html = "";

    for (let i = 0; i < regras.length; i++) {
        if (regras[i].ok == true) {
            html += '<div class="regra-ok">✔ ' + regras[i].texto + '</div>';
        } else {
            html += '<div class="regra-erro">✖ ' + regras[i].texto + '</div>';
        }
    }

    div_regras_senha.innerHTML = html;
}

function cadastrar() {
    let nome = nome_input.value;
    let email = email_input.value;
    let senha = senha_input.value;
    let confirmacao = confirmacao_input.value;
    let erro = validarCadastro(nome, email, senha, confirmacao);

    if (erro != "") {
        mensagem_erro.innerHTML = erro;
    } else {
        mensagem_erro.innerHTML = "Cadastrando...";

        fetch("/usuarios/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nomeServer: nome, emailServer: email, senhaServer: senha })
        }).then(function (resposta) {
            if (resposta.ok) {
                mensagem_erro.innerHTML = "Cadastro realizado! Indo para o login...";

                setTimeout(function () {
                    window.location = "login.html";
                }, 1500);
            } else if (resposta.status == 400 || resposta.status == 409) {
                resposta.text().then(function (texto) {
                    mensagem_erro.innerHTML = texto;
                });
            } else {
                mensagem_erro.innerHTML = "Houve um erro ao realizar o cadastro.";
            }
        }).catch(function (erro) {
            console.log(erro);
            mensagem_erro.innerHTML = "Não foi possível falar com o servidor.";
        });
    }
}
