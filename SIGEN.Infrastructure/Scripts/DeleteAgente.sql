CREATE PROCEDURE DeleteAgente
    @AgenteId BIGINT
AS
BEGIN
    DELETE FROM Agente WHERE AgenteId = @AgenteId;
END
GO
