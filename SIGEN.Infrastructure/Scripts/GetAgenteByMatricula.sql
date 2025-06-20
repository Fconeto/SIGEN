CREATE PROCEDURE GetAgenteByMatricula
    @Matricula BIGINT
AS
BEGIN
    SELECT * FROM Agente WHERE Matricula = @Matricula;
END
GO
