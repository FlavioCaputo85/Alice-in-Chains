CREATE DATABASE quiz_aic;
USE quiz_aic;

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    senha VARCHAR(50)
);

CREATE TABLE perfil (
    fk_usuario INT PRIMARY KEY,
    album_favorito VARCHAR(20),
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);

CREATE TABLE pergunta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    texto VARCHAR(150),
    album VARCHAR(20),
    nivel INT,
    pontos INT,
    opcao_a VARCHAR(50),
    opcao_b VARCHAR(50),
    opcao_c VARCHAR(50),
    opcao_d VARCHAR(50),
    correta INT
);

CREATE TABLE tentativa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT,
    nivel INT,
    acertos INT DEFAULT 0,
    total INT DEFAULT 0,
    pontos INT DEFAULT 0,
    momento DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);

CREATE TABLE resposta (
    fk_tentativa INT,
    fk_pergunta INT,
    escolha INT,
    acertou TINYINT NOT NULL,
    PRIMARY KEY (fk_tentativa, fk_pergunta),
    FOREIGN KEY (fk_tentativa) REFERENCES tentativa(id),
    FOREIGN KEY (fk_pergunta) REFERENCES pergunta(id)
);

INSERT INTO pergunta (texto, album, nivel, pontos, opcao_a, opcao_b, opcao_c, opcao_d, correta) VALUES
('De qual álbum é a música "Man in the Box"?', 'facelift', 1, 10, 'Facelift', 'Dirt', 'Jar of Flies', NULL, 1),
('De qual álbum é a música "Them Bones"?', 'dirt', 1, 10, 'Jar of Flies', 'Dirt', 'Facelift', NULL, 2),
('De qual álbum é a música "Nutshell"?', 'jarofflies', 1, 10, 'Dirt', 'Facelift', 'Jar of Flies', NULL, 3),
('De qual álbum é a música "Bleed the Freak"?', 'facelift', 1, 10, 'Facelift', 'Jar of Flies', 'Dirt', NULL, 1),
('De qual álbum é a música "Down in a Hole"?', 'dirt', 1, 10, 'Jar of Flies', 'Facelift', 'Dirt', NULL, 3),
('De qual álbum é a música "Rotten Apple"?', 'jarofflies', 1, 10, 'Jar of Flies', 'Dirt', 'Facelift', NULL, 1),
('De qual álbum é a música "Junkhead"?', 'dirt', 1, 10, 'Facelift', 'Dirt', 'Jar of Flies', NULL, 2),
('De qual álbum é a música "Dam That River"?', 'dirt', 1, 10, 'Dirt', 'Jar of Flies', 'Facelift', NULL, 1),
('Qual música abre o álbum Dirt?', 'dirt', 2, 20, 'Down in a Hole', 'Them Bones', 'Dam That River', 'Rain When I Die', 2),
('Qual música abre o EP Jar of Flies?', 'jarofflies', 2, 20, 'Nutshell', 'I Stay Away', 'Rotten Apple', 'No Excuses', 3),
('Qual destas músicas NÃO está no álbum Facelift?', 'facelift', 2, 20, 'Man in the Box', 'Bleed the Freak', 'Down in a Hole', 'Sea of Sorrow', 3),
('Qual música vem logo depois de "Them Bones" no álbum Dirt?', 'dirt', 2, 20, 'Rain When I Die', 'Dam That River', 'Junkhead', 'Down in a Hole', 2),
('Qual música vem logo depois de "Rotten Apple" no Jar of Flies?', 'jarofflies', 2, 20, 'Nutshell', 'No Excuses', 'Whale & Wasp', 'Don''t Follow', 1),
('Em que ano o álbum Facelift foi lançado?', 'facelift', 2, 20, '1988', '1990', '1992', '1994', 2),
('Qual música vem logo depois de "Man in the Box" no Facelift?', 'facelift', 2, 20, 'Bleed the Freak', 'Sunshine', 'Sea of Sorrow', 'Confusion', 3),
('Qual música é a faixa-título do álbum Dirt?', 'dirt', 2, 20, 'Angry Chair', 'Dirt', 'Junkhead', 'Hate to Feel', 2),
('Qual música do álbum Dirt o Flávio mais gosta?', 'dirt', 3, 30, 'Rooster', 'Them Bones', 'Angry Chair', 'Hate to Feel', 2),
('Qual música do álbum Facelift o Flávio mais gosta?', 'facelift', 3, 30, 'Sunshine', 'Man in the Box', 'Put You Down', 'Confusion', 2),
('Qual música do Jar of Flies o Flávio mais gosta?', 'jarofflies', 3, 30, 'Whale & Wasp', 'Swing on This', 'Nutshell', 'Don''t Follow', 3),
('Quantas faixas tem o álbum Dirt?', 'dirt', 3, 30, '11', '12', '13', '14', 3),
('Qual é a terceira faixa do álbum Dirt?', 'dirt', 3, 30, 'Dam That River', 'Rain When I Die', 'Down in a Hole', 'Rooster', 2),
('Qual música encerra o álbum Facelift?', 'facelift', 3, 30, 'Real Thing', 'Put You Down', 'Sunshine', 'Confusion', 1),
('Qual música do Jar of Flies foi o primeiro single e chegou ao 1º lugar do rock mainstream?', 'jarofflies', 3, 30, 'I Stay Away', 'No Excuses', 'Don''t Follow', 'Nutshell', 2),
('Qual efeito de guitarra aparece em "Man in the Box"?', 'facelift', 3, 30, 'Slide', 'Talk box', 'Theremin', 'Violão de 12 cordas', 2);
