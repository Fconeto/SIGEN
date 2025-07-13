CREATE TABLE Residencia (
    ResidenciaId BIGINT PRIMARY KEY IDENTITY(1,1),
    CodigoDaLocalidade BIGINT NOT NULL,
    TipoDoImovel INT NOT NULL,
    NomeDoMorador NVARCHAR(255),
    Numero INT,
    Complemento NVARCHAR(255),
    NumeroDoQuarteirao BIGINT,
    ComplementoDoQuarteirao NVARCHAR(255),
    Demolida INT NOT NULL,
    Inabitado INT NOT NULL,
    DataDeRegistro DATETIME NOT NULL,
    DataDeAtualizacao DATETIME NOT NULL,
    CriadoPor BIGINT NOT NULL,
    AtualizadoPor BIGINT NOT NULL
);