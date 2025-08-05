
CREATE PROCEDURE [dbo].[GetLocalityListByFilters]
    @CodigoDaLocalidade BIGINT = NULL,
    @Nome NVARCHAR(255) = NULL,
    @Categoria NVARCHAR(50) = NULL,
    @Order NVARCHAR(50) = 'Ascending',
    @OrderType NVARCHAR(50) = 'NumeroDoComplemento',
    @Page INT = 1
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PageSize INT = 10;
    DECLARE @Offset INT = (@Page - 1) * @PageSize;

    DECLARE @OrderColumn NVARCHAR(50);
    IF @OrderType = 0
        SET @OrderColumn = 'CodigoDaLocalidade';
    ELSE IF @OrderType = 1
        SET @OrderColumn = 'Nome';
    ELSE IF @OrderType = 2
        SET @OrderColumn = 'Categoria';
    ELSE
        SET @OrderColumn = 'DataDeRegistro';

    SELECT LocalidadeId, CodigoDaLocalidade, Nome, Categoria, DataDeRegistro, DataDeAtualizacao, CriadoPor, AtualizadoPor
    FROM Localidade
    WHERE (@CodigoDaLocalidade IS NULL OR CodigoDaLocalidade = @CodigoDaLocalidade)
      AND (@Nome IS NULL OR Nome LIKE '%' + @Nome + '%')
      AND (@Categoria IS NULL OR Categoria = @Categoria)
    ORDER BY 
			 CASE WHEN @OrderColumn = 'CodigoDaLocalidade' AND @Order = 0 THEN CodigoDaLocalidade END ASC,
			 CASE WHEN @OrderColumn = 'CodigoDaLocalidade' AND @Order = 1 THEN CodigoDaLocalidade END DESC,
             CASE WHEN @OrderColumn = 'Nome' AND @Order = 0 THEN Nome END ASC,
			 CASE WHEN @OrderColumn = 'Nome' AND @Order = 1 THEN Nome END DESC,
             CASE WHEN @OrderColumn = 'Categoria' AND @Order = 0 THEN Categoria END ASC,
			 CASE WHEN @OrderColumn = 'Categoria' AND @Order = 1 THEN Categoria END DESC,
             CASE WHEN @OrderColumn = 'DataDeRegistro' AND @Order = 0 THEN DataDeRegistro END ASC,
			 CASE WHEN @OrderColumn = 'DataDeRegistro' AND @Order = 1 THEN DataDeRegistro END DESC
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
END
GO