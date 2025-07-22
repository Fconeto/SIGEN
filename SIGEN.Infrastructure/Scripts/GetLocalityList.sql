CREATE PROCEDURE GetLocalityList
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        LocalidadeId,
        CodigoDaLocalidade,
        Nome,
        Categoria,
        DataDeRegistro,
        DataDeAtualizacao,
        CriadoPor,
        AtualizadoPor
    FROM Localidade;
END
GO
