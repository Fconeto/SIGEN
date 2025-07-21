CREATE PROCEDURE GetPITById
    @PITId BIGINT
AS
BEGIN

    SET NOCOUNT ON;

    SELECT 
        PitId,
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
    FROM PIT
    WHERE PitId = @PITId;
END;
