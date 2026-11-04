// ADICIONADO: aqui ficam os comandos SQL do quiz.
// Os valores que entram nos comandos (ids, nível, álbum) são validados no controller antes de chegar aqui.
let database = require("../database/config");

function salvarTentativa(idUsuario, nivel, acertos, total, pontos) {
    let instrucaoSql = `
        INSERT INTO tentativa (fk_usuario, nivel, acertos, total, pontos)
        VALUES (${idUsuario}, '${nivel}', ${acertos}, ${total}, ${pontos});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// valores já vem montado: (1, 'dirt', 1), (1, 'facelift', 0), ...
function salvarRespostas(valores) {
    let instrucaoSql = `
        INSERT INTO resposta (fk_tentativa, album, acertou) VALUES ${valores};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// KPIs do usuário: COUNT, AVG, MAX, MIN, SUM e a posição no ranking
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
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// últimas 8 partidas (para o gráfico de linha)
function buscarEvolucao(idUsuario) {
    let instrucaoSql = `
        SELECT pontos, DATE_FORMAT(momento, '%d/%m %H:%i') AS momento_grafico
        FROM tentativa
        WHERE fk_usuario = ${idUsuario}
        ORDER BY id DESC LIMIT 8;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// % de acerto por álbum (AVG de acertou, que vale 0 ou 1)
function buscarAlbuns(idUsuario) {
    let instrucaoSql = `
        SELECT r.album, ROUND(AVG(r.acertou) * 100, 0) AS aproveitamento
        FROM resposta r
        JOIN tentativa t ON r.fk_tentativa = t.id
        WHERE t.fk_usuario = ${idUsuario}
        GROUP BY r.album;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// ranking geral: top 5 por soma de pontos
function buscarRanking() {
    let instrucaoSql = `
        SELECT u.nome, SUM(t.pontos) AS total_pontos
        FROM tentativa t
        JOIN usuario u ON t.fk_usuario = u.id
        GROUP BY u.id, u.nome
        ORDER BY total_pontos DESC
        LIMIT 5;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    salvarTentativa,
    salvarRespostas,
    buscarKpis,
    buscarEvolucao,
    buscarAlbuns,
    buscarRanking
};
