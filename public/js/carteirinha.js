validarSessao();

let nomes = { facelift: "Facelift", dirt: "Dirt", jarofflies: "Jar of Flies" };

let numero = String(sessionStorage.ID_USUARIO);

while (numero.length < 4) {
    numero = "0" + numero;
}

cart_nome.innerHTML = sessionStorage.NOME_USUARIO;
cart_numero.innerHTML = "Fã nº " + numero;

mostrarAlbum(temaSalvo);

if (temaSalvo != null) {
    salvarAlbumFavorito(temaSalvo);
}

carregarNivel();

function escolherAlbum(chave) {
    aplicarTema(chave);
    salvarAlbumFavorito(chave);
    mostrarAlbum(chave);
}

function mostrarAlbum(chave) {
    if (chave == null) {
        cart_album.innerHTML = "Escolha um álbum abaixo";
        cart_capa.src = "../assets/icon/logo.png";
    } else {
        cart_album.innerHTML = nomes[chave];
        cart_capa.src = "../assets/imgs/albuns/" + chave + ".jpg";
    }
}

function carregarNivel() {
    fetch("/quiz/kpis/" + sessionStorage.ID_USUARIO).then(function (resposta) {
        resposta.json().then(function (lista) {
            let pontos = Number(lista[0].total_pontos);
            let nivel = "Novo fã";

            if (pontos >= 500) {
                nivel = "Lenda do rock";
            } else if (pontos >= 200) {
                nivel = "Fã de carteirinha";
            } else if (pontos > 0) {
                nivel = "Fã em formação";
            }

            cart_nivel.innerHTML = nivel;
            cart_pontos.innerHTML = pontos + " pontos · " + lista[0].partidas + " partidas";
        });
    }).catch(function (erro) {
        console.log(erro);
        cart_nivel.innerHTML = "Novo fã";
    });
}
