CREATE PROCEDURE UpdateResidence
    @ResidenciaId BIGINT,
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
    UPDATE Residencia
    SET TipoDoImovel = @TipoDoImovel,
        NomeDoMorador = @NomeDoMorador,
        Numero = @Numero,
        CodigoDaLocalidade = @CodigoDaLocalidade,
        Complemento = @Complemento,
        NumeroDoQuarteirao = @NumeroDoQuarteirao,
        ComplementoDoQuarteirao = @ComplementoDoQuarteirao,
        SituacaoDoImovel = @SituacaoDoImovel,
        DataDeRegistro = @DataDeRegistro,
        DataDeAtualizacao = @DataDeAtualizacao,
        CriadoPor = @CriadoPor,
        AtualizadoPor = @AtualizadoPor
    WHERE ResidenciaId = @ResidenciaId;
END
GO