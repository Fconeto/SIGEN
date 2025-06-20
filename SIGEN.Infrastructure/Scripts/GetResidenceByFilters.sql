CREATE PROCEDURE GetResidenceByFilters
    @CodigoDaLocalidade NVARCHAR(100),
    @NomeDoMorador NVARCHAR(255) = NULL,
    @Numero INT = NULL,
    @NumeroDoQuarteirao BIGINT = NULL,
    @OrderBy NVARCHAR(50) = NULL,
    @OrderDirection NVARCHAR(4) = 'ASC'
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @sql NVARCHAR(MAX) = N'SELECT * FROM Residencia WHERE CodigoDaLocalidade = @CodigoDaLocalidade';
    IF @NomeDoMorador IS NOT NULL
        SET @sql += N' AND NomeDoMorador = @NomeDoMorador';
    IF @Numero IS NOT NULL
        SET @sql += N' AND Numero = @Numero';
    IF @NumeroDoQuarteirao IS NOT NULL
        SET @sql += N' AND NumeroDoQuarteirao = @NumeroDoQuarteirao';
    IF @OrderBy IS NOT NULL AND @OrderBy IN (N'CodigoDaLocalidade', N'NomeDoMorador', N'Numero', N'NumeroDoQuarteirao')
        SET @sql += N' ORDER BY ' + @OrderBy + ' ' + @OrderDirection;
    EXEC sp_executesql @sql,
        N'@CodigoDaLocalidade NVARCHAR(100), @NomeDoMorador NVARCHAR(255), @Numero INT, @NumeroDoQuarteirao BIGINT',
        @CodigoDaLocalidade, @NomeDoMorador, @Numero, @NumeroDoQuarteirao;
END
GO