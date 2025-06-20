CREATE PROCEDURE DeleteResidence
    @ResidenciaId BIGINT
AS
BEGIN
    DELETE FROM Residencia WHERE ResidenciaId = @ResidenciaId;
END
GO