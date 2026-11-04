// ADICIONADO: tema.js -> controla a estética do site por álbum.
// Este arquivo é carregado LOGO NO COMEÇO do <body> de todas as páginas,
// assim o tema já está aplicado antes da página aparecer (sem piscar).

// Troca o tema: coloca a classe "tema-dirt" (por exemplo) no <body>.
// O CSS (albuns.css) faz a mudança de cor com transição suave.
// Também guardo a escolha no localStorage para o site lembrar nas outras páginas.
function aplicarTema(nome) {
    document.body.className = "tema-" + nome;
    localStorage.setItem("TEMA_ALBUM", nome);
}

// Lê a escolha guardada e aplica. Se nunca escolheu, fica o tema padrão.
function carregarTema() {
    let salvo = localStorage.getItem("TEMA_ALBUM");

    if (salvo != null) {
        document.body.className = "tema-" + salvo;
    }
}

carregarTema();
