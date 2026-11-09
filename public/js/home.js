// Dados dos 3 álbuns. Os destaques são músicas que existem em cada um deles.
let albuns = {
    facelift: {
        nome: "Facelift",
        ano: 1990,
        resumo: "O álbum de estreia da banda. É daqui que vem Man in the Box, a música que fez o Alice in Chains ficar conhecido.",
        destaques: ["Man in the Box", "Sea of Sorrow", "Bleed the Freak"]
    },
    dirt: {
        nome: "Dirt",
        ano: 1992,
        resumo: "O segundo álbum, com 13 faixas e cinco singles com videoclipe, como Them Bones e Down in a Hole.",
        destaques: ["Them Bones", "Dam That River", "Rain When I Die", "Down in a Hole", "Junkhead"]
    },
    jarofflies: {
        nome: "Jar of Flies",
        ano: 1994,
        resumo: "Um EP acústico escrito e gravado em apenas uma semana. Foi o primeiro EP a estrear em 1º lugar na Billboard 200.",
        destaques: ["Rotten Apple", "Nutshell", "I Stay Away", "No Excuses"]
    }
};

// As músicas que eu mais gosto (ficam com destaque nos botões)
let favoritas = ["Man in the Box", "Bleed the Freak", "Them Bones", "Junkhead", "Rain When I Die",
    "Dam That River", "Down in a Hole", "Nutshell", "Rotten Apple"];

// Chamada quando clico num card de álbum
function escolherAlbum(chave) {
    aplicarTema(chave);               // troca a estética (js/tema.js)
    marcarCard(chave);                // destaca o card escolhido
    mostrarInfo(chave);               // mostra o painel com as informações
}

// Tira a marcação de todos os cards e coloca só no escolhido
function marcarCard(chave) {
    card_facelift.className = "album";
    card_dirt.className = "album";
    card_jarofflies.className = "album";

    if (chave == "facelift") {
        card_facelift.className = "album selecionado";
    } else if (chave == "dirt") {
        card_dirt.className = "album selecionado";
    } else if (chave == "jarofflies") {
        card_jarofflies.className = "album selecionado";
    }
}

function mostrarInfo(chave) {
    let album = albuns[chave];
    let chips = "";

    // monta um botão para cada música destaque (as favoritas ganham a classe "fav")
    for (let i = 0; i < album.destaques.length; i++) {
        let classe = "faixa-chip";

        if (favoritas.indexOf(album.destaques[i]) != -1) {
            classe = "faixa-chip fav";
        }

        chips += `<span class="${classe}">${album.destaques[i]}</span>`;
    }

    div_album_info.innerHTML = `
        <h3>${album.nome} · ${album.ano}</h3>
        <p>${album.resumo}</p>
        <div class="faixas">${chips}</div>
        <a class="btn-link" href="dashboard/quiz.html">Jogar o quiz</a>
    `;
}

// Menu: se tem usuário logado, esconde Login/Cadastro e mostra Sair
function ajustarMenu() {
    if (sessionStorage.NOME_USUARIO != undefined) {
        li_login.className = "escondido";
        li_cadastro.className = "escondido";
        li_sair.className = "";
    }
}

// Ao abrir a home: se já escolhi um álbum antes, mostra ele
function iniciarHome() {
    ajustarMenu();

    let salvo = localStorage.getItem("TEMA_ALBUM");

    if (salvo != null) {
        marcarCard(salvo);
        mostrarInfo(salvo);
    } else {
        div_album_info.innerHTML = "<p>Clique em um álbum para mudar a cara do site.</p>";
    }
}

function sairDaConta() {
    sessionStorage.clear();
    window.location = "index.html";
}

iniciarHome();
