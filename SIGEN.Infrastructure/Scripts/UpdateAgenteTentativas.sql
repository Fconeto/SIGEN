CREATE PROCEDURE UpdateAgenteTentativas
    @AgenteId BIGINT,
    @Tentativas INT
AS
BEGIN
    UPDATE Agente
    SET Tentativas = @Tentativas,
        UltimaTentativa = GETDATE()
    WHERE AgenteId = @AgenteId;
END
GO
