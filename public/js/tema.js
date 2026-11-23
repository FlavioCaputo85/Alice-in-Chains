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
        let idAlbum = 1;

        if (chave == "dirt") {
            idAlbum = 2;
        } else if (chave == "jarofflies") {
            idAlbum = 3;
        }

        fetch("/usuarios/album-favorito", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idUsuarioServer: sessionStorage.ID_USUARIO,
                idAlbumServer: idAlbum
            })
        }).catch(function (erro) {
            console.log(erro);
        });
    }
}
