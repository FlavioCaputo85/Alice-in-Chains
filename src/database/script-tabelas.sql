-- ALTERADO: este arquivo era o script do AquaTech (empresa, usuario, aviso, aquario, medida).
-- Troquei pelas tabelas do quiz de Alice in Chains. Execute tudo no MySQL antes de rodar o site.

CREATE DATABASE quiz_aic;

USE quiz_aic;

CREATE TABLE usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50),
	email VARCHAR(50) UNIQUE,
	senha VARCHAR(50)
);

-- cada vez que o usuário termina um quiz, vira uma linha aqui
CREATE TABLE tentativa (
	id INT PRIMARY KEY AUTO_INCREMENT,
	fk_usuario INT,
	nivel VARCHAR(10),
	acertos INT,
	total INT,
	pontos INT,
	momento DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (fk_usuario) REFERENCES usuario(id),
	CONSTRAINT chk_nivel CHECK (nivel IN ('facil', 'medio', 'dificil'))
);

-- cada pergunta respondida de uma tentativa (acertou = 1 ou 0)
CREATE TABLE resposta (
	id INT PRIMARY KEY AUTO_INCREMENT,
	fk_tentativa INT,
	album VARCHAR(20),
	acertou TINYINT,
	FOREIGN KEY (fk_tentativa) REFERENCES tentativa(id),
	CONSTRAINT chk_album CHECK (album IN ('facelift', 'dirt', 'jarofflies'))
);

-- ===== consultas usadas no dashboard (para testar no Workbench) =====
-- SELECT COUNT(*), AVG(pontos), MAX(pontos), MIN(pontos) FROM tentativa WHERE fk_usuario = 1;
-- SELECT album, ROUND(AVG(acertou) * 100) FROM resposta GROUP BY album;
-- SELECT u.nome, SUM(t.pontos) FROM tentativa t JOIN usuario u ON t.fk_usuario = u.id GROUP BY u.id ORDER BY 2 DESC LIMIT 5;
