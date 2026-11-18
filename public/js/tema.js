function aplicarTema(nome) {
    document.body.className = "tema-" + nome;
    localStorage.setItem("TEMA_ALBUM", nome);
}

function carregarTema() {
    let salvo = localStorage.getItem("TEMA_ALBUM");

    if (salvo != null) {
        document.body.className = "tema-" + salvo;
    }
}

carregarTema();
