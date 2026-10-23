-- ESQUEMA PROVISÓRIO: ajustar quando o modelo oficial do banco for definido
CREATE DATABASE IF NOT EXISTS quiz_dirt;
USE quiz_dirt;

CREATE TABLE usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(200) NOT NULL
);

CREATE TABLE resultado (
    idResultado INT PRIMARY KEY AUTO_INCREMENT,
    fkUsuario INT NOT NULL,
    acertos INT NOT NULL,
    total INT NOT NULL,
    dtResultado DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario)
);
