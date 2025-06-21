CREATE TABLE Residencia (
    ResidenciaId BIGINT PRIMARY KEY,
    TipoDoImovel INT NOT NULL, -- Enum
    NomeDoMorador NVARCHAR(255) NOT NULL,
    Numero INT NOT NULL,
    CodigoDaLocalidade NVARCHAR(100) NOT NULL,
    Complemento NVARCHAR(255),
    NumeroDoQuarteirao BIGINT NOT NULL,
    ComplementoDoQuarteirao NVARCHAR(255),
    SituacaoDoImovel INT NOT NULL, -- Enum
    DataDeRegistro DATETIME NOT NULL,
    DataDeAtualizacao DATETIME NOT NULL,
    CriadoPor BIGINT NOT NULL,
    AtualizadoPor BIGINT NOT NULL
);