CREATE PROCEDURE UpdateAgente
    @AgenteId BIGINT,
    @NomeDoAgente NVARCHAR(255),
    @Turma INT,
    @Senha NVARCHAR(255),
    @Matricula BIGINT,
    @CPF NVARCHAR(14),
    @Hierarquia INT,
    @DataDeRegistro DATETIME,
    @DataDeAtualizacao DATETIME,
    @CriadoPor BIGINT,
    @AtualizadoPor BIGINT
AS
BEGIN
    UPDATE Agente
    SET NomeDoAgente = @NomeDoAgente,
        Turma = @Turma,
        Senha = @Senha,
        Matricula = @Matricula,
        CPF = @CPF,
        Hierarquia = @Hierarquia,
        DataDeRegistro = @DataDeRegistro,
        DataDeAtualizacao = @DataDeAtualizacao,
        CriadoPor = @CriadoPor,
        AtualizadoPor = @AtualizadoPor
    WHERE AgenteId = @AgenteId;
END
GO
