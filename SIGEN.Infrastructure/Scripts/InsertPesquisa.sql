CREATE PROCEDURE InsertPesquisa
    @ResidenciaId BIGINT,
    @AgenteId BIGINT,
    @DataDaVisita DATE,
    @Pendencia INT,
    @NomeDoMorador NVARCHAR(255),
    @NumeroDeHabitantes INT,
    @TipoDeParede INT,
    @OutraParede NVARCHAR(255) = NULL,
    @TipoDeTeto INT,
    @OutroTeto NVARCHAR(255) = NULL,
    @CapturaIntra BIT,
    @CapturaPeri BIT,
    @AnexosPositivos INT,
    @AnexosNegativos INT,
    @NumeroDeGatos INT,
    @NumeroDeCachorros INT
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
        @DataDaVisita,
        @Pendencia,
        @NomeDoMorador,
        @NumeroDeHabitantes,
        @TipoDeParede,
        @OutraParede,
        @TipoDeTeto,
        @OutroTeto,
        @CapturaIntra,
        @CapturaPeri,
        @AnexosPositivos,
        @AnexosNegativos,
        @NumeroDeGatos,
        @NumeroDeCachorros,
        GETDATE(),
        GETDATE(),
        @AgenteId,
        @AgenteId
    );
END