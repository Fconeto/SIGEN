CREATE TABLE Agente (
    AgenteId BIGINT PRIMARY KEY IDENTITY(1,1),
    NomeDoAgente NVARCHAR(255) NOT NULL,
    Turma INT NOT NULL,
    Senha NVARCHAR(255) NOT NULL,
    Salt NVARCHAR(64) NOT NULL,
    Matricula BIGINT NOT NULL,
    CPF NVARCHAR(14) NOT NULL UNIQUE,
    Hierarquia INT NOT NULL,
    Tentativas INT NOT NULL DEFAULT 0,
    UltimaTentativa DATETIME NULL,
    DataDeRegistro DATETIME NOT NULL,
    DataDeAtualizacao DATETIME NOT NULL,
    CriadoPor BIGINT NOT NULL,
    AtualizadoPor BIGINT NOT NULL
);
