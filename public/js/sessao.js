// Funções de sessão usadas em todas as páginas internas
function validarSessao() {
    if (sessionStorage.getItem("ID_USUARIO") == null) {
        window.location = "login.html";
    }
}

function sair() {
    sessionStorage.clear();
    window.location = "login.html";
}
