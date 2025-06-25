CREATE PROCEDURE InsertAgente
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
    INSERT INTO Agente (NomeDoAgente, Turma, Senha, Matricula, CPF, Hierarquia, DataDeRegistro, DataDeAtualizacao, CriadoPor, AtualizadoPor)
    VALUES (@NomeDoAgente, @Turma, @Senha, @Matricula, @CPF, @Hierarquia, @DataDeRegistro, @DataDeAtualizacao, @CriadoPor, @AtualizadoPor);
END
GO
