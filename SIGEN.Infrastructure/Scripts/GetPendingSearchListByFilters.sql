CREATE PROCEDURE GetPendingSearchListByFilters
    @CodigoDaLocalidade BIGINT,
    @NomeDoMorador NVARCHAR(255) = NULL,
    @NumeroDaCasa INT = NULL,
    @NumeroDoComplemento NVARCHAR(255) = NULL,
    @Order INT = 0,         -- 0: Asc, 1: Desc
    @OrderType INT = 0,     -- 0: Complemento, 1: Numero, 2: NomeDoMorador
    @Page INT = 1,
    @Year INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PageSize INT = 10;
    DECLARE @Offset INT = (@Page - 1) * @PageSize;

    ;WITH ResidenciasPendentes AS (
        SELECT
            r.ResidenciaId AS Id,
            r.CodigoDaLocalidade,
            l.Nome AS NomeDaLocalidade,
            l.Categoria AS CategoriaDaLocalidade,
            r.NomeDoMorador,
            r.Numero,
            r.Complemento,
            r.DataDeRegistro,
            r.DataDeAtualizacao,
            r.CriadoPor,
            r.AtualizadoPor
        FROM Residencia r
        INNER JOIN Localidade l ON r.CodigoDaLocalidade = l.CodigoDaLocalidade
        WHERE r.CodigoDaLocalidade = @CodigoDaLocalidade
          AND (@NomeDoMorador IS NULL OR r.NomeDoMorador LIKE '%' + @NomeDoMorador + '%')
          AND (@NumeroDaCasa IS NULL OR r.Numero = @NumeroDaCasa)
          AND (@NumeroDoComplemento IS NULL OR r.Complemento = @NumeroDoComplemento)
          AND NOT EXISTS (
                SELECT 1
                FROM Pesquisa p
                WHERE p.ResidenciaId = r.ResidenciaId
                  AND YEAR(p.DataDaVisita) = @Year
            )
    ),
    Total AS (
        SELECT COUNT(*) AS TotalCount FROM ResidenciasPendentes
    )
    SELECT 
        rp.*,
        t.TotalCount,
        @PageSize AS PageSize,
        @Page AS PageNumber,
        CEILING(CAST(t.TotalCount AS FLOAT) / @PageSize) AS TotalPages
    FROM ResidenciasPendentes rp
    CROSS JOIN Total t
    ORDER BY
        CASE WHEN @OrderType = 0 AND @Order = 0 THEN rp.Complemento END ASC,
        CASE WHEN @OrderType = 0 AND @Order = 1 THEN rp.Complemento END DESC,
        CASE WHEN @OrderType = 1 AND @Order = 0 THEN rp.Numero END ASC,
        CASE WHEN @OrderType = 1 AND @Order = 1 THEN rp.Numero END DESC,
        CASE WHEN @OrderType = 2 AND @Order = 0 THEN rp.NomeDoMorador END ASC,
        CASE WHEN @OrderType = 2 AND @Order = 1 THEN rp.NomeDoMorador END DESC
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
END
GO