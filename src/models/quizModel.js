let database = require("../database/config");

function buscarPerguntas(nivel) {
    let instrucaoSql = `
        SELECT id, texto, album, pontos, opcao_a, opcao_b, opcao_c, opcao_d, correta
        FROM pergunta
        WHERE nivel = ${nivel}
        ORDER BY id;
    `;
    return database.executar(instrucaoSql);
}

function criarTentativa(idUsuario, nivel) {
    let instrucaoSql = `
        INSERT INTO tentativa (fk_usuario, nivel) VALUES (${idUsuario}, ${nivel});
    `;
    return database.executar(instrucaoSql);
}

function salvarRespostas(idTentativa, nivel, perguntas, escolhas) {
    let valores = "";

    for (let i = 0; i < perguntas.length; i++) {
        if (i > 0) {
            valores += ", ";
        }
        valores += `(${idTentativa}, ${perguntas[i]}, ${escolhas[i]},
            (SELECT correta = ${escolhas[i]} FROM pergunta WHERE id = ${perguntas[i]} AND nivel = ${nivel}))`;
    }

    let instrucaoSql = `
        INSERT INTO resposta (fk_tentativa, fk_pergunta, escolha, acertou) VALUES ${valores};
    `;
    return database.executar(instrucaoSql);
}

function calcularPontos(idTentativa) {
    let instrucaoSql = `
        UPDATE tentativa SET
            acertos = (SELECT SUM(acertou) FROM resposta WHERE fk_tentativa = ${idTentativa}),
            total = (SELECT COUNT(*) FROM resposta WHERE fk_tentativa = ${idTentativa}),
            pontos = (SELECT SUM(r.acertou * p.pontos) FROM resposta r
                      JOIN pergunta p ON p.id = r.fk_pergunta
                      WHERE r.fk_tentativa = ${idTentativa})
        WHERE id = ${idTentativa};
    `;
    return database.executar(instrucaoSql);
}

function apagarTentativa(idTentativa) {
    let instrucaoSql = `
        DELETE FROM tentativa WHERE id = ${idTentativa};
    `;
    return database.executar(instrucaoSql);
}

function buscarKpiPontos(idUsuario) {
    let instrucaoSql = `
        SELECT
            COUNT(*) AS partidas,
            COALESCE(SUM(pontos), 0) AS total_pontos,
            (SELECT pontos FROM tentativa WHERE fk_usuario = ${idUsuario}
             ORDER BY id DESC LIMIT 1) AS pontos_ultima
        FROM tentativa
        WHERE fk_usuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

function buscarKpiRanking() {
    let instrucaoSql = `
        SELECT fk_usuario, SUM(pontos) AS total
        FROM tentativa
        GROUP BY fk_usuario;
    `;
    return database.executar(instrucaoSql);
}

function buscarKpiAcertos(idUsuario) {
    let instrucaoSql = `
        SELECT acertos, total
        FROM tentativa
        WHERE fk_usuario = ${idUsuario}
        ORDER BY id DESC LIMIT 2;
    `;
    return database.executar(instrucaoSql);
}

function buscarEvolucao(idUsuario) {
    let instrucaoSql = `
        SELECT pontos, DATE_FORMAT(momento, '%d/%m %H:%i') AS momento_grafico
        FROM tentativa
        WHERE fk_usuario = ${idUsuario}
        ORDER BY id DESC LIMIT 8;
    `;
    return database.executar(instrucaoSql);
}

function buscarAlbuns(idUsuario) {
    let instrucaoSql = `
        SELECT p.album, SUM(r.acertou) AS acertos, COUNT(*) AS respostas
        FROM resposta r
        JOIN pergunta p ON p.id = r.fk_pergunta
        JOIN tentativa t ON t.id = r.fk_tentativa
        WHERE t.fk_usuario = ${idUsuario}
        GROUP BY p.album;
    `;
    return database.executar(instrucaoSql);
}

function buscarRanking() {
    let instrucaoSql = `
        SELECT u.nome, SUM(t.pontos) AS total_pontos
        FROM tentativa t
        JOIN usuario u ON t.fk_usuario = u.id
        GROUP BY u.id, u.nome
        ORDER BY total_pontos DESC
        LIMIT 5;
    `;
    return database.executar(instrucaoSql);
}

function buscarDificeis() {
    let instrucaoSql = `
        SELECT p.texto, p.album, SUM(r.acertou) AS acertos, COUNT(*) AS vezes
        FROM resposta r
        JOIN pergunta p ON p.id = r.fk_pergunta
        GROUP BY p.id, p.texto, p.album
        ORDER BY SUM(r.acertou) / COUNT(*) ASC, vezes DESC
        LIMIT 3;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarPerguntas,
    criarTentativa,
    salvarRespostas,
    calcularPontos,
    apagarTentativa,
    buscarKpiPontos,
    buscarKpiRanking,
    buscarKpiAcertos,
    buscarEvolucao,
    buscarAlbuns,
    buscarRanking,
    buscarDificeis
};
