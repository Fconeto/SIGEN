CREATE PROCEDURE GetLocalityByCode
    @CodigoDaLocalidade INT
AS
BEGIN
    SELECT LocalidadeId
      ,CodigoDaLocalidade
      ,Nome
      ,Categoria
      ,DataDeRegistro
      ,DataDeAtualizacao
      ,CriadoPor
      ,AtualizadoPor
    FROM Localidade
    WHERE @CodigoDaLocalidade = CodigoDaLocalidade;
END
GO