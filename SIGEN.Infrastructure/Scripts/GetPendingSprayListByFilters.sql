CREATE PROCEDURE GetPendingSprayListByFilters
    @CodigoDaLocalidade BIGINT,
    @NomeDoMorador NVARCHAR(255) = NULL,
    @NumeroDaCasa INT = NULL,
    @NumeroDoComplemento NVARCHAR(255) = NULL,
    @Order INT = 0,
    @OrderType INT = 0,
    @Page INT = 1,
    @Year INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PageSize INT = 10;
    DECLARE @Offset INT = (@Page - 1) * @PageSize;

    ;WITH Pendentes AS (
        SELECT
            r.ResidenciaId AS Id,
            p.PesquisaId,
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
        FROM Pesquisa p
        INNER JOIN Residencia r ON r.ResidenciaId = p.ResidenciaId
        INNER JOIN Localidade l ON l.CodigoDaLocalidade = r.CodigoDaLocalidade
        WHERE r.CodigoDaLocalidade = @CodigoDaLocalidade
          AND YEAR(p.DataDaVisita) = @Year
          AND (p.CapturaIntra = 1 OR p.CapturaPeri = 1)
          AND NOT EXISTS (
                SELECT 1 FROM Borrifacao b WHERE b.PesquisaId = p.PesquisaId
          )
          AND (@NomeDoMorador IS NULL OR r.NomeDoMorador LIKE '%' + @NomeDoMorador + '%')
          AND (@NumeroDaCasa IS NULL OR r.Numero = @NumeroDaCasa)
          AND (@NumeroDoComplemento IS NULL OR r.Complemento = @NumeroDoComplemento)
    ),
    Total AS (
        SELECT COUNT(*) AS TotalCount FROM Pendentes
    )
    SELECT 
        p.*,
        t.TotalCount,
        @PageSize AS PageSize,
        @Page AS PageNumber,
        CEILING(CAST(t.TotalCount AS FLOAT) / @PageSize) AS TotalPages
    FROM Pendentes p
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