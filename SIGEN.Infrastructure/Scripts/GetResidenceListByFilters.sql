ALTER PROCEDURE GetResidenceListByFilters
    @CodigoDaLocalidade BIGINT,
    @NomeDoMorador NVARCHAR(255) = NULL,
    @NumeroDaCasa INT = NULL,
    @NumeroDoComplemento NVARCHAR(255) = NULL,
    @Order INT = 0,        
    @OrderType INT = 0,     
    @Page INT = 1           
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PageSize INT = 10;
    DECLARE @Offset INT = (@Page - 1) * @PageSize;

    WITH ResidenciasFiltradas AS (
        SELECT
            r.ResidenciaId AS Id,
            r.CodigoDaLocalidade,
            l.Nome AS NomeDaLocalidade,
            l.Categoria AS CategoriaDaLocalidade,
            CAST(r.TipoDoImovel AS NVARCHAR) AS TipoDeImovel,
            r.NomeDoMorador,
            r.Numero,
            r.Complemento,
            r.NumeroDoQuarteirao,
            r.ComplementoDoQuarteirao,
            CAST(r.Demolida AS BIT) AS Demolida,
            CAST(r.Inabitado AS BIT) AS Inabitado,
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
    )
    , Total AS (
        SELECT COUNT(*) AS TotalCount FROM ResidenciasFiltradas
    )
    SELECT 
        rf.*,
        t.TotalCount,
        @PageSize AS PageSize,
        @Page AS PageNumber,
        CEILING(CAST(t.TotalCount AS FLOAT) / @PageSize) AS TotalPages
    FROM ResidenciasFiltradas rf
    CROSS JOIN Total t
    ORDER BY
        CASE WHEN @OrderType = 0 AND @Order = 0 THEN Complemento END ASC,
        CASE WHEN @OrderType = 0 AND @Order = 1 THEN Complemento END DESC,
        CASE WHEN @OrderType = 1 AND @Order = 0 THEN Numero END ASC,
        CASE WHEN @OrderType = 1 AND @Order = 1 THEN Numero END DESC,
        CASE WHEN @OrderType = 2 AND @Order = 0 THEN NomeDoMorador END ASC,
        CASE WHEN @OrderType = 2 AND @Order = 1 THEN NomeDoMorador END DESC
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
END
GO