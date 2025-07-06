CREATE PROCEDURE GetPendingSearchByResidenciaId
    @ResidenciaId BIGINT,
    @Year INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM Pesquisa
        WHERE ResidenciaId = @ResidenciaId
          AND YEAR(DataDaVisita) = @Year
    )
    BEGIN
        SELECT 
            ResidenciaId AS Id,
            CodigoDaLocalidade,
            TipoDoImovel,
            Demolida,
            Numero,
            Complemento,
            NumeroDoQuarteirao,
            ComplementoDoQuarteirao,
            NomeDoMorador,
            Inabitado
        FROM Residencia
        WHERE ResidenciaId = @ResidenciaId
    END
END