function cadastrar() {
    let nome = input_nome.value;
    let email = input_email.value;
    let senha = input_senha.value;
    let confirmacao = input_confirmacao.value;

    if (nome.length < 2) {
        div_mensagem.innerHTML = "Digite seu nome.";
    } else if (email.indexOf("@") == -1 || email.indexOf(".") == -1) {
        div_mensagem.innerHTML = "E-mail inválido.";
    } else if (senha.length < 6) {
        div_mensagem.innerHTML = "A senha precisa ter ao menos 6 caracteres.";
    } else if (senha != confirmacao) {
        div_mensagem.innerHTML = "As senhas não conferem.";
    } else {
        div_mensagem.innerHTML = "Cadastrando...";

        fetch("/usuarios/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome: nome, email: email, senha: senha })
        })
            .then(function (resposta) {
                if (resposta.ok) {
                    div_mensagem.innerHTML = "Conta criada! Redirecionando para o login...";
                    setTimeout(function () {
                        window.location = "login.html";
                    }, 1500);
                } else if (resposta.status == 409) {
                    div_mensagem.innerHTML = "Esse e-mail já está cadastrado.";
                } else {
                    div_mensagem.innerHTML = "Erro ao cadastrar. Tente novamente.";
                }
            })
            .catch(function () {
                div_mensagem.innerHTML = "Não foi possível conectar ao servidor.";
            });
    }
}
