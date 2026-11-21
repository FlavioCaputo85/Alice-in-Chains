function entrar() {
    let email = email_input.value;
    let senha = senha_input.value;
    let erro = validarLogin(email, senha);

    if (erro != "") {
        mensagem_erro.innerHTML = erro;
    } else {
        mensagem_erro.innerHTML = "Entrando...";

        fetch("/usuarios/autenticar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailServer: email, senhaServer: senha })
        }).then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (usuario) {
                    sessionStorage.ID_USUARIO = usuario.id;
                    sessionStorage.NOME_USUARIO = usuario.nome;
                    sessionStorage.EMAIL_USUARIO = usuario.email;

                    if (usuario.nomeAlbum != null) {
                        sessionStorage.NOME_ALBUM = usuario.nomeAlbum;
                    }

                    if (usuario.albumFavorito == 1) {
                        localStorage.setItem("TEMA_ALBUM", "facelift");
                    } else if (usuario.albumFavorito == 2) {
                        localStorage.setItem("TEMA_ALBUM", "dirt");
                    } else if (usuario.albumFavorito == 3) {
                        localStorage.setItem("TEMA_ALBUM", "jarofflies");
                    }

                    window.location = "index.html";
                });
            } else {
                resposta.text().then(function (texto) {
                    mensagem_erro.innerHTML = texto;
                });
            }
        }).catch(function (erro) {
            console.log(erro);
            mensagem_erro.innerHTML = "Não foi possível falar com o servidor.";
        });
    }
}
