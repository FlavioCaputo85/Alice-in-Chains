let mysql = require("mysql2");

let pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10
});

// Consultas parametrizadas (?) evitam SQL Injection
function executar(instrucao, valores) {
    return new Promise(function (resolve, reject) {
        pool.execute(instrucao, valores, function (erro, resultados) {
            if (erro) {
                reject(erro);
            } else {
                resolve(resultados);
            }
        });
    });
}

module.exports = { executar };
