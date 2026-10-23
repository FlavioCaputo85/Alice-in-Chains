function entrar() {
    let email = input_email.value;
    let senha = input_senha.value;

    if (email == "" || senha == "") {
        div_mensagem.innerHTML = "Preencha e-mail e senha.";
        return;
    }

    div_mensagem.innerHTML = "Entrando...";

    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, senha: senha })
    })
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (json) {
                    sessionStorage.setItem("ID_USUARIO", json.idUsuario);
                    sessionStorage.setItem("NOME_USUARIO", json.nome);
                    window.location = "inicio.html";
                });
            } else {
                div_mensagem.innerHTML = "E-mail e/ou senha inválidos.";
            }
        })
        .catch(function () {
            div_mensagem.innerHTML = "Não foi possível conectar ao servidor.";
        });
}
