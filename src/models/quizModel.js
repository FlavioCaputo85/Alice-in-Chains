let database = require("../database/config");

function buscarPerguntas(idNivel) {
    let instrucaoSql = `
        SELECT p.id AS idPergunta, p.texto, a.nome AS album, n.pontos_por_acerto,
               o.id AS idOpcao, o.texto AS opcao, o.correta
        FROM pergunta p
        JOIN opcao o ON o.fk_pergunta = p.id
        JOIN album a ON a.id = p.fk_album
        JOIN nivel n ON n.id = p.fk_nivel
        WHERE p.fk_nivel = ${idNivel}
        ORDER BY p.id, o.id;
    `;
    return database.executar(instrucaoSql);
}

function salvarPartida(idUsuario, idNivel, listaOpcoes) {
    let criarTentativa = `
        INSERT INTO tentativa (fk_usuario, fk_nivel) VALUES (${idUsuario}, ${idNivel});
    `;

    return database.executar(criarTentativa).then(function (tentativa) {
        let id = tentativa.insertId;

        let salvarRespostas = `
            INSERT INTO resposta (fk_tentativa, fk_pergunta, fk_opcao, acertou)
            SELECT ${id}, o.fk_pergunta, o.id, o.correta
            FROM opcao o
            JOIN pergunta p ON p.id = o.fk_pergunta
            WHERE p.fk_nivel = ${idNivel} AND o.id IN (${listaOpcoes});
        `;

        let calcularPontos = `
            UPDATE tentativa SET
                acertos = (SELECT COALESCE(SUM(acertou), 0) FROM resposta WHERE fk_tentativa = ${id}),
                total = (SELECT COUNT(*) FROM resposta WHERE fk_tentativa = ${id}),
                pontos = (SELECT COALESCE(SUM(acertou), 0) FROM resposta WHERE fk_tentativa = ${id})
                         * (SELECT pontos_por_acerto FROM nivel WHERE id = ${idNivel})
            WHERE id = ${id};
        `;

        let apagarVazia = `DELETE FROM tentativa WHERE id = ${id} AND total = 0;`;

        return database.executar(salvarRespostas)
            .catch(function (erro) {
                return database.executar(`DELETE FROM tentativa WHERE id = ${id};`).then(function () {
                    throw erro;
                });
            })
            .then(function () {
                return database.executar(calcularPontos);
            })
            .then(function () {
                return database.executar(apagarVazia);
            });
    });
}

function buscarKpis(idUsuario) {
    let instrucaoSql = `
        SELECT
            COUNT(*) AS partidas,
            ROUND(AVG(pontos), 1) AS media_pontos,
            MAX(pontos) AS melhor,
            MIN(pontos) AS pior,
            COALESCE(SUM(pontos), 0) AS total_pontos,
            (SELECT ROUND(AVG(pontos), 1) FROM tentativa) AS media_geral,
            (SELECT COUNT(*) + 1 FROM (
                SELECT fk_usuario, SUM(pontos) AS soma FROM tentativa GROUP BY fk_usuario
            ) AS ranking
            WHERE ranking.soma > (SELECT COALESCE(SUM(pontos), 0) FROM tentativa WHERE fk_usuario = ${idUsuario})
            ) AS posicao
        FROM tentativa
        WHERE fk_usuario = ${idUsuario};
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
        SELECT a.nome AS album, COALESCE(ROUND(AVG(r.acertou) * 100), 0) AS aproveitamento
        FROM album a
        JOIN pergunta p ON p.fk_album = a.id
        LEFT JOIN resposta r ON r.fk_pergunta = p.id
            AND r.fk_tentativa IN (SELECT id FROM tentativa WHERE fk_usuario = ${idUsuario})
        GROUP BY a.id, a.nome
        ORDER BY a.id;
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
        SELECT p.texto, a.nome AS album, COUNT(*) AS vezes,
               ROUND(AVG(r.acertou) * 100) AS aproveitamento
        FROM resposta r
        JOIN pergunta p ON p.id = r.fk_pergunta
        JOIN album a ON a.id = p.fk_album
        GROUP BY p.id, p.texto, a.nome
        ORDER BY aproveitamento ASC, vezes DESC
        LIMIT 3;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarPerguntas,
    salvarPartida,
    buscarKpis,
    buscarEvolucao,
    buscarAlbuns,
    buscarRanking,
    buscarDificeis
};
