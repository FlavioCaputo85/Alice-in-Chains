function aplicarTema(nome) {
    document.body.className = "tema-" + nome;
    localStorage.setItem("TEMA_ALBUM", nome);
}

let temaSalvo = localStorage.getItem("TEMA_ALBUM");

if (temaSalvo != null) {
    document.body.className = "tema-" + temaSalvo;
}

function salvarAlbumFavorito(chave) {
    if (sessionStorage.ID_USUARIO != undefined) {
        fetch("/usuarios/album-favorito", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idUsuarioServer: sessionStorage.ID_USUARIO,
                albumServer: chave
            })
        }).catch(function (erro) {
            console.log(erro);
        });
    }
}
