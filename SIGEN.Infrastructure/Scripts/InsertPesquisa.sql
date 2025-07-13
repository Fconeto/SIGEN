CREATE PROCEDURE InsertPesquisa
    @ResidenciaId BIGINT,
    @AgenteId BIGINT,
    @MatriculaDoAgente BIGINT = NULL,
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

    -- Se MatriculaDoAgente for nulo, buscar na tabela Agente pelo AgenteId
    IF @MatriculaDoAgente IS NULL
    BEGIN
        SELECT TOP 1 @MatriculaDoAgente = Matricula
        FROM Agente
        WHERE AgenteId = @AgenteId;
    END

    INSERT INTO Pesquisa (
        ResidenciaId,
        MatriculaDoAgente,
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
        @MatriculaDoAgente,
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