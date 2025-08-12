CREATE TABLE questoes_oab (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          disciplina VARCHAR(255) NOT NULL,
                          assunto VARCHAR(255) NOT NULL,
                          material VARCHAR(255),
                          enunciado TEXT NOT NULL,
                          alternativa_a TEXT,
                          alternativa_b TEXT,
                          alternativa_c TEXT,
                          alternativa_d TEXT,
                          gabarito VARCHAR(1) NOT NULL,
                          comentario TEXT
);