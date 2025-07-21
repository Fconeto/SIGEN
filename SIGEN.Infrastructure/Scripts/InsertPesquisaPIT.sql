CREATE PROCEDURE InsertPesquisaPIT
    @PITId BIGINT,
    @ResidenciaId BIGINT,
    @Data DATETIME,
    @Pendencia INT,
    @NomeDoMorador NVARCHAR(255),
    @NumeroDeHabitantes INT,
    @TipoDeParede INT,
    @OutroTipoDeParede NVARCHAR(255),
    @TipoDeTeto INT,
    @OutroTipoDeTeto NVARCHAR(255),
    @CapturaIntra BIT,
    @CapturaPeri BIT,
    @AnexosPositivos INT,
    @AnexosNegativos INT,
    @NumGatos INT,
    @NumCachorros INT,
    @AgenteId BIGINT,
    @DataDeRegistro DATETIME,
    @DataDeAtualizacao DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Pesquisa (
        ResidenciaId,
        DataDaVisita,
        Pendencia,
        NomeDoMorador,
        NumeroDeHabitantes,
        TipoDeParede,
        OutraParede,
        TipoDeTeto,
        OutroTeto,
        CapturaIntra,
        CapturaPeri,
        AnexosPositivos,
        AnexosNegativos,
        NumeroDeGatos,
        NumeroDeCachorros,
        DataDeRegistro,
        DataDeAtualizacao,
        CriadoPor,
        AtualizadoPor
    ) 
    VALUES (
        @ResidenciaId,
        @Data,
        @Pendencia,
        @NomeDoMorador,
        @NumeroDeHabitantes,
        @TipoDeParede,
        @OutroTipoDeParede,
        @TipoDeTeto,
        @OutroTipoDeTeto,
        @CapturaIntra,
        @CapturaPeri,
        @AnexosPositivos,
        @AnexosNegativos,
        @NumGatos,
        @NumCachorros,
        @DataDeRegistro,
        @DataDeAtualizacao,
        @AgenteId,
        @AgenteId
    );

    UPDATE PIT
    SET PesquisaId = SCOPE_IDENTITY(),
        DataDeAtualizacao = @DataDeAtualizacao,
        AtualizadoPor = @AgenteId
    WHERE PitId = @PITId;
END;