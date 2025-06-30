CREATE TABLE Localidade (
    LocalidadeId BIGINT PRIMARY KEY IDENTITY(1,1),
    CodigoDaLocalidade BIGINT NOT NULL,
    Nome NVARCHAR(255) NOT NULL,
    Categoria NVARCHAR(50) NOT NULL,
    DataDeRegistro DATETIME NOT NULL,
    DataDeAtualizacao DATETIME NOT NULL,
    CriadoPor BIGINT NOT NULL,
    AtualizadoPor BIGINT NOT NULL
);