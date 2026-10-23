let database = require("../database/config");

function salvar(fkUsuario, acertos, total) {
    return database.executar(
        "INSERT INTO resultado (fkUsuario, acertos, total) VALUES (?, ?, ?)",
        [fkUsuario, acertos, total]
    );
}

function historico(fkUsuario) {
    return database.executar(
        "SELECT idResultado, acertos, total, dtResultado FROM resultado WHERE fkUsuario = ? ORDER BY idResultado DESC LIMIT 8",
        [fkUsuario]
    );
}

module.exports = { salvar, historico };
