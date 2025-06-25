CREATE PROCEDURE InsertResidencia
    @TipoDoImovel INT,
    @NomeDoMorador NVARCHAR(255),
    @Numero INT,
    @CodigoDaLocalidade NVARCHAR(100),
    @Complemento NVARCHAR(255),
    @NumeroDoQuarteirao BIGINT,
    @ComplementoDoQuarteirao NVARCHAR(255),
    @SituacaoDoImovel INT,
    @DataDeRegistro DATETIME,
    @DataDeAtualizacao DATETIME,
    @CriadoPor BIGINT,
    @AtualizadoPor BIGINT
AS
BEGIN
    INSERT INTO Residencia (TipoDoImovel, NomeDoMorador, Numero, CodigoDaLocalidade, Complemento, NumeroDoQuarteirao, ComplementoDoQuarteirao, SituacaoDoImovel, DataDeRegistro, DataDeAtualizacao, CriadoPor, AtualizadoPor)
    VALUES (@TipoDoImovel, @NomeDoMorador, @Numero, @CodigoDaLocalidade, @Complemento, @NumeroDoQuarteirao, @ComplementoDoQuarteirao, @SituacaoDoImovel, @DataDeRegistro, @DataDeAtualizacao, @CriadoPor, @AtualizadoPor);
END
GO