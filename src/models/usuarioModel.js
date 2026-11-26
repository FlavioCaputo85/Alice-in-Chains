let database = require("../database/config");

function autenticar(email, senha) {
    let instrucaoSql = `
        SELECT u.id, u.nome, u.email, p.album_favorito AS albumFavorito
        FROM usuario u
        LEFT JOIN perfil p ON p.fk_usuario = u.id
        WHERE u.email = '${email}' AND u.senha = '${senha}';
    `;
    return database.executar(instrucaoSql);
}

function cadastrar(nome, email, senha) {
    let instrucaoSql = `
        INSERT INTO usuario (nome, email, senha) VALUES ('${nome}', '${email}', '${senha}');
    `;
    return database.executar(instrucaoSql).then(function (resultado) {
        return database.executar(`INSERT INTO perfil (fk_usuario) VALUES (${resultado.insertId});`);
    });
}

function atualizarAlbumFavorito(idUsuario, album) {
    let instrucaoSql = `
        UPDATE perfil SET album_favorito = '${album}' WHERE fk_usuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar,
    atualizarAlbumFavorito
};
