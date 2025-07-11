CREATE PROCEDURE GetPendingPITByFilters
    @CodigoDaLocalidade BIGINT = NULL,
    @NomeDoMorador NVARCHAR(255) = NULL,
    @NumeroDaCasa INT = NULL,
    @NumeroDoComplemento NVARCHAR(255) = NULL,
    @Order INT = 0,
    @OrderType INT = 0,
    @Page INT = 1,
    @Year INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PageSize INT = 10;
    DECLARE @Offset INT = (@Page - 1) * @PageSize;

    ;WITH PITPendentes AS (
        SELECT
            NULL AS Id,
            PIT.PitId AS PITId,
            PIT.CodigoDaLocalidade,
            NULL AS NomeDaLocalidade,
            NULL AS CategoriaDaLocalidade,
            PIT.NomeDoMorador,
            PIT.NumeroDaCasa AS Numero,
            NULL AS Complemento,
            PIT.DataDeRegistro,
            PIT.DataDeAtualizacao,
            PIT.CriadoPor,
            PIT.AtualizadoPor
        FROM PIT
        WHERE PIT.PesquisaId IS NULL
          AND (@CodigoDaLocalidade IS NULL OR PIT.CodigoDaLocalidade = @CodigoDaLocalidade)
          AND (@NomeDoMorador IS NULL OR PIT.NomeDoMorador LIKE '%' + @NomeDoMorador + '%')
          AND (@NumeroDaCasa IS NULL OR PIT.NumeroDaCasa = @NumeroDaCasa)
          AND (YEAR(PIT.DataDeRegistro) = @Year OR @Year IS NULL)
          AND NOT EXISTS (
              SELECT 1 FROM Residencia
              WHERE Residencia.CodigoDaLocalidade = PIT.CodigoDaLocalidade
                AND Residencia.Numero = PIT.NumeroDaCasa
          )

        UNION ALL

        SELECT
            R.ResidenciaId AS Id,
            PIT.PitId AS PITId,
            R.CodigoDaLocalidade,
            NULL AS NomeDaLocalidade,
            NULL AS CategoriaDaLocalidade,
            R.NomeDoMorador,
            R.Numero,
            R.Complemento,
            PIT.DataDeRegistro,
            PIT.DataDeAtualizacao,
            PIT.CriadoPor,
            PIT.AtualizadoPor
        FROM PIT
        INNER JOIN Residencia R
            ON R.CodigoDaLocalidade = PIT.CodigoDaLocalidade
            AND R.Numero = PIT.NumeroDaCasa
        WHERE PIT.PesquisaId IS NULL
          AND (@CodigoDaLocalidade IS NULL OR PIT.CodigoDaLocalidade = @CodigoDaLocalidade)
          AND (@NomeDoMorador IS NULL OR R.NomeDoMorador LIKE '%' + @NomeDoMorador + '%')
          AND (@NumeroDaCasa IS NULL OR R.Numero = @NumeroDaCasa)
          AND (YEAR(PIT.DataDeRegistro) = @Year OR @Year IS NULL)
    ),
    Total AS (
        SELECT COUNT(*) AS TotalCount FROM PITPendentes
    )
    SELECT 
        p.*,
        t.TotalCount,
        @PageSize AS PageSize,
        @Page AS PageNumber,
        CEILING(CAST(t.TotalCount AS FLOAT) / @PageSize) AS TotalPages
    FROM PITPendentes p
    CROSS JOIN Total t
    ORDER BY
        CASE WHEN @OrderType = 0 AND @Order = 0 THEN p.Complemento END ASC,
        CASE WHEN @OrderType = 0 AND @Order = 1 THEN p.Complemento END DESC,
        CASE WHEN @OrderType = 1 AND @Order = 0 THEN p.Numero END ASC,
        CASE WHEN @OrderType = 1 AND @Order = 1 THEN p.Numero END DESC,
        CASE WHEN @OrderType = 2 AND @Order = 0 THEN p.NomeDoMorador END ASC,
        CASE WHEN @OrderType = 2 AND @Order = 1 THEN p.NomeDoMorador END DESC
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
END
GO