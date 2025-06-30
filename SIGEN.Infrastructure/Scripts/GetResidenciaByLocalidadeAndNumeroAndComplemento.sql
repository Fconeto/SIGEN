CREATE PROCEDURE GetResidenciaByLocalidadeAndNumeroAndComplemento
    @CodigoDaLocalidade BIGINT,
    @Numero INT,
    @Complemento NVARCHAR(255)
AS
BEGIN
    SELECT * 
    FROM Residencia 
    WHERE CodigoDaLocalidade = @CodigoDaLocalidade 
      AND Numero = @Numero 
      AND Complemento = @Complemento;
END
