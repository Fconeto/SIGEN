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
    ELSE
    BEGIN
        SELECT 
            CAST(NULL AS BIGINT) AS Id,
            CAST(NULL AS BIGINT) AS CodigoDaLocalidade,
            CAST(NULL AS INT) AS TipoDoImovel,
            CAST(NULL AS INT) AS Demolida,
            CAST(NULL AS INT) AS Numero,
            CAST(NULL AS NVARCHAR(255)) AS Complemento,
            CAST(NULL AS BIGINT) AS NumeroDoQuarteirao,
            CAST(NULL AS NVARCHAR(255)) AS ComplementoDoQuarteirao,
            CAST(NULL AS NVARCHAR(255)) AS NomeDoMorador,
            CAST(NULL AS INT) AS Inabitado
    END
END