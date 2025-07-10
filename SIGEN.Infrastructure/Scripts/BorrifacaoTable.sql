CREATE TABLE Borrifacao (
    BorrifacaoId BIGINT IDENTITY(1,1) PRIMARY KEY,
    AgenteId BIGINT NULL,
    MatriculaDoAgente BIGINT NOT NULL,
    DataDoPreenchimento DATE NOT NULL,
    Pendencia INT NOT NULL,
    TipoDeInseticida NVARCHAR(255) NOT NULL,
    NumeroDeCarga INT NOT NULL,
    PesquisaId BIGINT NOT NULL,
    DataDeRegistro DATETIME NOT NULL,
    DataDeAtualizacao DATETIME NOT NULL,
    CriadoPor BIGINT NOT NULL,
    AtualizadoPor BIGINT NOT NULL,
    CONSTRAINT FK_Borrifacao_Pesquisa FOREIGN KEY (PesquisaId) REFERENCES Pesquisa(PesquisaId)
);