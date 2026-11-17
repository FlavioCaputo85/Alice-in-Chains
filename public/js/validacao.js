// ADICIONADO: validacao.js -> validações de nome, e-mail e senha.
// Eu usei só if / else if / else, for e while (sem regex), como pede a disciplina.
// O MESMO arquivo é usado no navegador (cadastro.html e login.html) e no servidor
// (usuarioController.js). Eu valido nos dois porque o navegador pode ser burlado.

// ---------- GRUPOS DE CARACTERES ----------
let GRUPO_MAIUSCULAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let GRUPO_MINUSCULAS = "abcdefghijklmnopqrstuvwxyz";
let GRUPO_NUMEROS = "0123456789";
// Não coloquei aspas, crase, barra invertida e ponto e vírgula de propósito:
// o SQL do projeto base é montado juntando texto, e esses caracteres poderiam quebrar o comando.
let GRUPO_ESPECIAIS = "!@#$%&*()_+-=[]{}:,.<>?/|~";
let GRUPO_ACENTOS = "áàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ";

// Conta quantos caracteres do texto fazem parte do grupo.
// Eu uso este "for" em quase todas as validações abaixo.
function contarDoGrupo(texto, grupo) {
    let total = 0;

    for (let i = 0; i < texto.length; i++) {
        if (grupo.indexOf(texto.charAt(i)) != -1) {
            total++;
        }
    }

    return total;
}

// ---------- NOME ----------
// Devolve "" se estiver ok, ou a mensagem do problema.
function validarNome(nome) {
    let erro = "";
    let letras = GRUPO_MAIUSCULAS + GRUPO_MINUSCULAS + GRUPO_ACENTOS;
    let permitidos = letras + " -";

    if (contarDoGrupo(nome, letras) < 2) {
        erro = "O nome precisa ter pelo menos 2 letras.";
    } else if (nome.length > 50) {
        erro = "O nome pode ter no máximo 50 caracteres.";
    } else if (contarDoGrupo(nome, permitidos) != nome.length) {
        erro = "O nome só pode ter letras, espaços e hífen.";
    }

    return erro;
}

// ---------- E-MAIL ----------
function validarEmail(email) {
    let erro = "";
    let arroba = email.indexOf("@");
    let local = "";
    let dominio = "";

    if (arroba != -1) {
        local = email.substring(0, arroba);
        dominio = email.substring(arroba + 1);
    }

    if (email.length == 0) {
        erro = "Digite o e-mail.";
    } else if (email.length > 50) {
        erro = "O e-mail pode ter no máximo 50 caracteres.";
    } else if (email.indexOf(" ") != -1) {
        erro = "O e-mail não pode ter espaços.";
    } else if (arroba == -1) {
        erro = "O e-mail precisa ter o @.";
    } else if (arroba != email.lastIndexOf("@")) {
        erro = "O e-mail só pode ter um @.";
    } else if (local.length == 0) {
        erro = "Falta o texto antes do @.";
    } else if (dominio.length == 0) {
        erro = "Falta o domínio depois do @ (ex.: gmail.com).";
    } else if (dominio.indexOf(".") == -1) {
        erro = "O domínio precisa ter um ponto (ex.: gmail.com).";
    } else if (contarDoGrupo(local, GRUPO_MAIUSCULAS + GRUPO_MINUSCULAS + GRUPO_NUMEROS + "._-+") != local.length) {
        erro = "Antes do @ use só letras, números, ponto, _ , - ou +.";
    } else if (contarDoGrupo(dominio, GRUPO_MAIUSCULAS + GRUPO_MINUSCULAS + GRUPO_NUMEROS + ".-") != dominio.length) {
        erro = "Depois do @ use só letras, números, ponto e hífen.";
    } else if (email.indexOf("..") != -1) {
        erro = "O e-mail não pode ter dois pontos seguidos.";
    } else if (local.charAt(0) == "." || local.charAt(local.length - 1) == ".") {
        erro = "O texto antes do @ não pode começar nem terminar com ponto.";
    } else if (dominio.charAt(0) == "." || dominio.charAt(dominio.length - 1) == ".") {
        erro = "O domínio não pode começar nem terminar com ponto.";
    } else {
        // a terminação (a parte depois do último ponto, ex.: com) precisa de 2 letras ou mais
        let partes = dominio.split(".");
        let terminacao = partes[partes.length - 1];

        if (terminacao.length < 2 || contarDoGrupo(terminacao, GRUPO_MAIUSCULAS + GRUPO_MINUSCULAS) != terminacao.length) {
            erro = "A terminação do e-mail (ex.: .com) precisa ter só letras, no mínimo 2.";
        }
    }

    return erro;
}

// ---------- SENHA ----------
// Devolve uma lista de regras: { texto: "...", ok: true ou false }.
// A tela do cadastro usa essa lista para mostrar o checklist ao vivo.
function regrasDaSenha(senha) {
    let todosPermitidos = GRUPO_MAIUSCULAS + GRUPO_MINUSCULAS + GRUPO_NUMEROS + GRUPO_ESPECIAIS;
    let repetido = false;

    // procura o mesmo caractere 3 vezes seguidas (ex.: aaa ou 111)
    for (let i = 0; i < senha.length - 2; i++) {
        if (senha.charAt(i) == senha.charAt(i + 1) && senha.charAt(i) == senha.charAt(i + 2)) {
            repetido = true;
        }
    }

    let regras = [];

    regras.push({ texto: "Entre 8 e 50 caracteres", ok: senha.length >= 8 && senha.length <= 50 });
    regras.push({ texto: "Uma letra maiúscula (A-Z)", ok: contarDoGrupo(senha, GRUPO_MAIUSCULAS) > 0 });
    regras.push({ texto: "Uma letra minúscula (a-z)", ok: contarDoGrupo(senha, GRUPO_MINUSCULAS) > 0 });
    regras.push({ texto: "Um número (0-9)", ok: contarDoGrupo(senha, GRUPO_NUMEROS) > 0 });
    regras.push({ texto: "Um caractere especial: " + GRUPO_ESPECIAIS, ok: contarDoGrupo(senha, GRUPO_ESPECIAIS) > 0 });
    regras.push({ texto: "Sem espaços, aspas ou caracteres fora da lista", ok: contarDoGrupo(senha, todosPermitidos) == senha.length });
    regras.push({ texto: "Sem o mesmo caractere 3 vezes seguidas", ok: repetido == false });

    return regras;
}

// Devolve "" se a senha é segura, ou a lista do que está faltando.
function validarSenha(senha) {
    let regras = regrasDaSenha(senha);
    let faltando = "";

    for (let i = 0; i < regras.length; i++) {
        if (regras[i].ok == false) {
            if (faltando != "") {
                faltando += "; ";
            }
            faltando += regras[i].texto;
        }
    }

    if (faltando == "") {
        return "";
    }
    return "Senha fraca. Falta: " + faltando + ".";
}

// ---------- JUNTANDO TUDO ----------
// Devolve a primeira mensagem de erro encontrada, ou "" se tudo estiver certo.
function validarCadastro(nome, email, senha, confirmacao) {
    let erro = validarNome(nome);

    if (erro == "") {
        erro = validarEmail(email);
    }
    if (erro == "") {
        erro = validarSenha(senha);
    }
    if (erro == "" && senha != confirmacao) {
        erro = "A confirmação da senha não é igual à senha.";
    }

    return erro;
}

// No login eu NÃO cobro senha forte (a regra é do cadastro). Só garanto
// que o e-mail está certo e que a senha não tem caractere proibido.
function validarLogin(email, senha) {
    let erro = validarEmail(email);
    let todosPermitidos = GRUPO_MAIUSCULAS + GRUPO_MINUSCULAS + GRUPO_NUMEROS + GRUPO_ESPECIAIS;

    if (erro == "") {
        if (senha.length == 0) {
            erro = "Digite a senha.";
        } else if (senha.length > 50 || contarDoGrupo(senha, todosPermitidos) != senha.length) {
            erro = "E-mail e/ou senha inválido(s).";
        }
    }

    return erro;
}

// Permite o servidor (Node) usar este mesmo arquivo. No navegador isto é ignorado.
if (typeof module != "undefined") {
    module.exports = { validarNome, validarEmail, validarSenha, validarCadastro, validarLogin };
}