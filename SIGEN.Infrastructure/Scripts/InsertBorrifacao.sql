CREATE PROCEDURE InsertBorrifacao
    @AgenteId BIGINT,
    @DataDoPreenchimento DATE,
    @Pendencia INT,
    @TipoDeInseticida NVARCHAR(255),
    @NumeroDeCarga INT,
    @PesquisaId BIGINT,
    @DataDeRegistro DATETIME,
    @DataDeAtualizacao DATETIME,
    @CriadoPor BIGINT,
    @AtualizadoPor BIGINT
AS
BEGIN
    INSERT INTO Borrifacao (
        AgenteId,
        DataDoPreenchimento,
        Pendencia,
        TipoDeInseticida,
        NumeroDeCarga,
        PesquisaId,
        DataDeRegistro,
        DataDeAtualizacao,
        CriadoPor,
        AtualizadoPor
    )
    VALUES (
        @AgenteId,
        @DataDoPreenchimento,
        @Pendencia,
        @TipoDeInseticida,
        @NumeroDeCarga,
        @PesquisaId,
        @DataDeRegistro,
        @DataDeAtualizacao,
        @CriadoPor,
        @AtualizadoPor
    );
END;