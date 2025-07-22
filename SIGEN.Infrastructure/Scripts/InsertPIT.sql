CREATE PROCEDURE InsertPIT
    @AgenteId BIGINT,
    @NumeracaoDoPit BIGINT,
    @Cres NVARCHAR(255),
    @Municipio NVARCHAR(255),
    @CodigoDaLocalidade BIGINT,
    @NumeroDaCasa INT,
    @CapturaIntra BIT,
    @CapturaPeri BIT,
    @LocalOndeEncontrou NVARCHAR(255),
    @NomeDoMorador NVARCHAR(255),
    @NomeDoCapturador NVARCHAR(255),
    @TipoDoInseto INT,
    @OutroTipoDeInseto NVARCHAR(255),
    @NomeDoRecebedor NVARCHAR(255),
    @PesquisaId BIGINT = NULL,
    @DataDeRegistro DATETIME,
    @DataDeAtualizacao DATETIME,
    @CriadoPor BIGINT,
    @AtualizadoPor BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO PIT (
        AgenteId,
        NumeracaoDoPit,
        Cres,
        Municipio,
        CodigoDaLocalidade,
        NumeroDaCasa,
        CapturaIntra,
        CapturaPeri,
        LocalOndeEntrou,
        NomeDoMorador,
        NomeDoCapturador,
        TipoDeInseto,
        OutroTipoDeInseto,
        NomeDoRecebedor,
        PesquisaId,
        DataDeRegistro,
        DataDeAtualizacao,
        CriadoPor,
        AtualizadoPor
    )
    VALUES (
        @AgenteId,
        @NumeracaoDoPit,
        @Cres,
        @Municipio,
        @CodigoDaLocalidade,
        @NumeroDaCasa,
        @CapturaIntra,
        @CapturaPeri,
        @LocalOndeEncontrou,
        @NomeDoMorador,
        @NomeDoCapturador,
        @TipoDoInseto,
        @OutroTipoDeInseto,
        @NomeDoRecebedor,
        @PesquisaId,
        @DataDeRegistro,
        @DataDeAtualizacao,
        @CriadoPor,
        @AtualizadoPor
    );
END
GO