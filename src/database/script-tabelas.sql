SET NAMES utf8mb4;

DROP DATABASE IF EXISTS quiz_aic;
CREATE DATABASE quiz_aic CHARACTER SET utf8mb4;
USE quiz_aic;

CREATE TABLE album (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30),
    ano INT
);

CREATE TABLE nivel (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(10),
    pontos_por_acerto INT
);

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    senha VARCHAR(50)
);

CREATE TABLE perfil (
    fk_usuario INT PRIMARY KEY,
    fk_album_favorito INT,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id),
    FOREIGN KEY (fk_album_favorito) REFERENCES album(id)
);

CREATE TABLE pergunta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    texto VARCHAR(150),
    fk_nivel INT,
    fk_album INT,
    FOREIGN KEY (fk_nivel) REFERENCES nivel(id),
    FOREIGN KEY (fk_album) REFERENCES album(id)
);

CREATE TABLE opcao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_pergunta INT,
    texto VARCHAR(50),
    correta TINYINT,
    FOREIGN KEY (fk_pergunta) REFERENCES pergunta(id)
);

CREATE TABLE tentativa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT,
    fk_nivel INT,
    acertos INT DEFAULT 0,
    total INT DEFAULT 0,
    pontos INT DEFAULT 0,
    momento DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id),
    FOREIGN KEY (fk_nivel) REFERENCES nivel(id)
);

CREATE TABLE resposta (
    fk_tentativa INT,
    fk_pergunta INT,
    fk_opcao INT,
    acertou TINYINT,
    PRIMARY KEY (fk_tentativa, fk_pergunta),
    FOREIGN KEY (fk_tentativa) REFERENCES tentativa(id),
    FOREIGN KEY (fk_pergunta) REFERENCES pergunta(id),
    FOREIGN KEY (fk_opcao) REFERENCES opcao(id)
);

INSERT INTO album (nome, ano) VALUES
('Facelift', 1990),
('Dirt', 1992),
('Jar of Flies', 1994);

INSERT INTO nivel (nome, pontos_por_acerto) VALUES
('Fácil', 10),
('Médio', 20),
('Difícil', 30);

INSERT INTO pergunta (id, texto, fk_nivel, fk_album) VALUES
(1, 'De qual álbum é a música "Man in the Box"?', 1, 1),
(2, 'De qual álbum é a música "Them Bones"?', 1, 2),
(3, 'De qual álbum é a música "Nutshell"?', 1, 3),
(4, 'De qual álbum é a música "Bleed the Freak"?', 1, 1),
(5, 'De qual álbum é a música "Down in a Hole"?', 1, 2),
(6, 'De qual álbum é a música "Rotten Apple"?', 1, 3),
(7, 'De qual álbum é a música "Junkhead"?', 1, 2),
(8, 'De qual álbum é a música "Dam That River"?', 1, 2),
(9, 'Qual música abre o álbum Dirt?', 2, 2),
(10, 'Qual música abre o EP Jar of Flies?', 2, 3),
(11, 'Qual destas músicas NÃO está no álbum Facelift?', 2, 1),
(12, 'Qual música vem logo depois de "Them Bones" no álbum Dirt?', 2, 2),
(13, 'Qual música vem logo depois de "Rotten Apple" no Jar of Flies?', 2, 3),
(14, 'Em que ano o álbum Facelift foi lançado?', 2, 1),
(15, 'Qual música vem logo depois de "Man in the Box" no Facelift?', 2, 1),
(16, 'Qual música é a faixa-título do álbum Dirt?', 2, 2),
(17, 'Qual música do álbum Dirt o Flávio mais gosta?', 3, 2),
(18, 'Qual música do álbum Facelift o Flávio mais gosta?', 3, 1),
(19, 'Qual música do Jar of Flies o Flávio mais gosta?', 3, 3),
(20, 'Quantas faixas tem o álbum Dirt?', 3, 2),
(21, 'Qual é a terceira faixa do álbum Dirt?', 3, 2),
(22, 'Qual música encerra o álbum Facelift?', 3, 1),
(23, 'Qual música do Jar of Flies foi o primeiro single e chegou ao 1º lugar do rock mainstream?', 3, 3),
(24, 'Qual efeito de guitarra aparece em "Man in the Box"?', 3, 1);

INSERT INTO opcao (fk_pergunta, texto, correta) VALUES
(1, 'Facelift', 1),
(1, 'Dirt', 0),
(1, 'Jar of Flies', 0),
(2, 'Jar of Flies', 0),
(2, 'Dirt', 1),
(2, 'Facelift', 0),
(3, 'Dirt', 0),
(3, 'Facelift', 0),
(3, 'Jar of Flies', 1),
(4, 'Facelift', 1),
(4, 'Jar of Flies', 0),
(4, 'Dirt', 0),
(5, 'Jar of Flies', 0),
(5, 'Facelift', 0),
(5, 'Dirt', 1),
(6, 'Jar of Flies', 1),
(6, 'Dirt', 0),
(6, 'Facelift', 0),
(7, 'Facelift', 0),
(7, 'Dirt', 1),
(7, 'Jar of Flies', 0),
(8, 'Dirt', 1),
(8, 'Jar of Flies', 0),
(8, 'Facelift', 0),
(9, 'Down in a Hole', 0),
(9, 'Them Bones', 1),
(9, 'Dam That River', 0),
(9, 'Rain When I Die', 0),
(10, 'Nutshell', 0),
(10, 'I Stay Away', 0),
(10, 'Rotten Apple', 1),
(10, 'No Excuses', 0),
(11, 'Man in the Box', 0),
(11, 'Bleed the Freak', 0),
(11, 'Down in a Hole', 1),
(11, 'Sea of Sorrow', 0),
(12, 'Rain When I Die', 0),
(12, 'Dam That River', 1),
(12, 'Junkhead', 0),
(12, 'Down in a Hole', 0),
(13, 'Nutshell', 1),
(13, 'No Excuses', 0),
(13, 'Whale & Wasp', 0),
(13, 'Don''t Follow', 0),
(14, '1988', 0),
(14, '1990', 1),
(14, '1992', 0),
(14, '1994', 0),
(15, 'Bleed the Freak', 0),
(15, 'Sunshine', 0),
(15, 'Sea of Sorrow', 1),
(15, 'Confusion', 0),
(16, 'Angry Chair', 0),
(16, 'Dirt', 1),
(16, 'Junkhead', 0),
(16, 'Hate to Feel', 0),
(17, 'Rooster', 0),
(17, 'Them Bones', 1),
(17, 'Angry Chair', 0),
(17, 'Hate to Feel', 0),
(18, 'Sunshine', 0),
(18, 'Man in the Box', 1),
(18, 'Put You Down', 0),
(18, 'Confusion', 0),
(19, 'Whale & Wasp', 0),
(19, 'Swing on This', 0),
(19, 'Nutshell', 1),
(19, 'Don''t Follow', 0),
(20, '11', 0),
(20, '12', 0),
(20, '13', 1),
(20, '14', 0),
(21, 'Dam That River', 0),
(21, 'Rain When I Die', 1),
(21, 'Down in a Hole', 0),
(21, 'Rooster', 0),
(22, 'Real Thing', 1),
(22, 'Put You Down', 0),
(22, 'Sunshine', 0),
(22, 'Confusion', 0),
(23, 'I Stay Away', 0),
(23, 'No Excuses', 1),
(23, 'Don''t Follow', 0),
(23, 'Nutshell', 0),
(24, 'Slide', 0),
(24, 'Talk box', 1),
(24, 'Theremin', 0),
(24, 'Violão de 12 cordas', 0);
