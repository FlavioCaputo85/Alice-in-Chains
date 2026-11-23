let albuns = {
    facelift: { nome: "Facelift", ano: 1990, musica: "Man in the Box", arquivo: "man-in-the-box.mp3" },
    dirt: { nome: "Dirt", ano: 1992, musica: "Them Bones", arquivo: "them-bones.mp3" },
    jarofflies: { nome: "Jar of Flies", ano: 1994, musica: "Nutshell", arquivo: "nutshell.mp3" }
};

function tocarAlbum(chave) {
    let album = albuns[chave];

    aplicarTema(chave);
    salvarAlbumFavorito(chave);
    marcarCapa(chave);

    img_rotulo.src = "assets/imgs/albuns/" + chave + ".jpg";
    img_rotulo.className = "";
    disco.className = "disco tocando";
    braco.className = "braco tocando";
    btn_pausar.className = "botao";
    btn_pausar.innerHTML = "Pausar";
    div_tocando.innerHTML = "Tocando agora: <b>" + album.musica + "</b> · " + album.nome + " (" + album.ano + ")";

    audio_player.src = "assets/audio/" + album.arquivo;
    audio_player.play().catch(function (erro) {
        console.log(erro);
    });
}

function marcarCapa(chave) {
    card_facelift.className = "capa-opcao";
    card_dirt.className = "capa-opcao";
    card_jarofflies.className = "capa-opcao";

    if (chave == "facelift") {
        card_facelift.className = "capa-opcao selecionada";
    } else if (chave == "dirt") {
        card_dirt.className = "capa-opcao selecionada";
    } else if (chave == "jarofflies") {
        card_jarofflies.className = "capa-opcao selecionada";
    }
}

function pausarOuContinuar() {
    if (audio_player.paused) {
        audio_player.play().catch(function (erro) {
            console.log(erro);
        });
        disco.className = "disco tocando";
        braco.className = "braco tocando";
        btn_pausar.innerHTML = "Pausar";
    } else {
        audio_player.pause();
        disco.className = "disco pausado";
        braco.className = "braco";
        btn_pausar.innerHTML = "Continuar";
    }
}

function musicaTerminou() {
    disco.className = "disco pausado";
    braco.className = "braco";
    btn_pausar.className = "botao escondido";
    div_tocando.innerHTML = "O trecho acabou. Escolha um álbum para ouvir de novo.";
}
