CREATE PROCEDURE GetResidenciaByLocalidadeAndNumeroAndComplemento
    @CodigoDaLocalidade BIGINT,
    @Numero INT,
    @Complemento NVARCHAR(255)
AS
BEGIN
    SELECT ResidenciaId AS Id,
           CodigoDaLocalidade,
           TipoDoImovel,
           NomeDoMorador,
           Numero,
           Complemento,
           NumeroDoQuarteirao,
           ComplementoDoQuarteirao,
           Demolida,
           Inabitado,
           DataDeRegistro,
           DataDeAtualizacao,
           CriadoPor,
           AtualizadoPor
    FROM Residencia 
    WHERE CodigoDaLocalidade = @CodigoDaLocalidade 
      AND (@Numero IS NULL OR Numero = @Numero )
      AND Complemento = @Complemento;
END
