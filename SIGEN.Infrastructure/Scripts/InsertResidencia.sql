CREATE PROCEDURE InsertResidencia
    @CodigoDaLocalidade BIGINT,
    @TipoDoImovel INT,
    @NomeDoMorador NVARCHAR(255),
    @Numero INT,
    @Complemento NVARCHAR(255),
    @NumeroDoQuarteirao BIGINT,
    @ComplementoDoQuarteirao NVARCHAR(255),
    @Demolida INT,
    @Inabitado INT,
    @DataDeRegistro DATETIME,
    @DataDeAtualizacao DATETIME,
    @CriadoPor BIGINT,
    @AtualizadoPor BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Residencia (
        TipoDoImovel, NomeDoMorador, Numero, CodigoDaLocalidade, Complemento,
        NumeroDoQuarteirao, ComplementoDoQuarteirao, Demolida, Inabitado,
        DataDeRegistro, DataDeAtualizacao, CriadoPor, AtualizadoPor
    )
    OUTPUT INSERTED.ResidenciaId
    VALUES (
        @TipoDoImovel, @NomeDoMorador, @Numero, @CodigoDaLocalidade, @Complemento,
        @NumeroDoQuarteirao, @ComplementoDoQuarteirao, @Demolida, @Inabitado,
        @DataDeRegistro, @DataDeAtualizacao, @CriadoPor, @AtualizadoPor
    );
END
GO