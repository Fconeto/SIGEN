CREATE TABLE Agente (
    AgenteId BIGINT PRIMARY KEY,
    NomeDoAgente NVARCHAR(255) NOT NULL,
    Turma INT NOT NULL,
    Senha NVARCHAR(255) NOT NULL,
    Matricula BIGINT NOT NULL,
    CPF NVARCHAR(14) NOT NULL UNIQUE,
    Hierarquia INT NOT NULL,
    DataDeRegistro DATETIME NOT NULL,
    DataDeAtualizacao DATETIME NOT NULL,
    CriadoPor BIGINT NOT NULL,
    AtualizadoPor BIGINT NOT NULL
);
