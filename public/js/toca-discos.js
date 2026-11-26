let albuns = {
    facelift: {
        nome: "Facelift",
        ano: 1990,
        faixas: ["We Die Young", "Man in the Box", "Sea of Sorrow", "Bleed the Freak", "I Can't Remember", "Love, Hate, Love", "It Ain't Like That", "Sunshine", "Put You Down", "Confusion", "I Know Somethin (Bout You)", "Real Thing"]
    },
    dirt: {
        nome: "Dirt",
        ano: 1992,
        faixas: ["Them Bones", "Dam That River", "Rain When I Die", "Sickman", "Rooster", "Junkhead", "Dirt", "God Smack", "Iron Gland", "Hate to Feel", "Angry Chair", "Down in a Hole", "Would?"]
    },
    jarofflies: {
        nome: "Jar of Flies",
        ano: 1994,
        faixas: ["Rotten Apple", "Nutshell", "I Stay Away", "No Excuses", "Whale & Wasp", "Don't Follow", "Swing on This"]
    }
};

let albumAtual = "";
let faixaAtual = 0;

function tocarAlbum(chave) {
    albumAtual = chave;

    aplicarTema(chave);
    salvarAlbumFavorito(chave);
    marcarCapa(chave);

    img_rotulo.src = "assets/imgs/albuns/" + chave + ".jpg";
    img_rotulo.className = "";
    div_controle.className = "controle";

    mostrarLista();
    tocarFaixa(0);
}

function mostrarLista() {
    let faixas = albuns[albumAtual].faixas;
    let html = "";

    for (let i = 0; i < faixas.length; i++) {
        let classe = "faixa";

        if (i == faixaAtual) {
            classe = "faixa atual";
        }

        html += `<li class="${classe}" onclick="tocarFaixa(${i})">${i + 1}. ${faixas[i]}</li>`;
    }

    lista_faixas.innerHTML = html;
}

function tocarFaixa(numero) {
    let album = albuns[albumAtual];

    faixaAtual = numero;

    div_tocando.innerHTML = "Tocando agora: <b>" + album.faixas[numero] + "</b> · " + album.nome + " (" + album.ano + ")";
    span_posicao.innerHTML = "Faixa " + (numero + 1) + " de " + album.faixas.length;
    btn_pausar.innerHTML = "Pausar";
    disco.className = "disco tocando";
    braco.className = "braco tocando";

    mostrarLista();

    audio_player.src = "assets/audio/" + albumAtual + "/" + (numero + 1) + ".mp3";
    audio_player.play().catch(function (erro) {
        console.log(erro);
    });
}

function proximaFaixa() {
    if (faixaAtual < albuns[albumAtual].faixas.length - 1) {
        tocarFaixa(faixaAtual + 1);
    } else {
        tocarFaixa(0);
    }
}

function faixaAnterior() {
    if (faixaAtual > 0) {
        tocarFaixa(faixaAtual - 1);
    } else {
        tocarFaixa(albuns[albumAtual].faixas.length - 1);
    }
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
        btn_pausar.innerHTML = "Tocar";
    }
}

function musicaTerminou() {
    proximaFaixa();
}
