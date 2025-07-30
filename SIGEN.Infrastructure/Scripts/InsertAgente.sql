CREATE PROCEDURE InsertAgente
    @NomeDoAgente NVARCHAR(255),
    @Turma INT,
    @Senha NVARCHAR(255),
    @Salt NVARCHAR(64),
    @Matricula BIGINT,
    @CPF NVARCHAR(14),
    @Hierarquia INT,
    @Tentativas INT,
    @DataDeRegistro DATETIME,
    @DataDeAtualizacao DATETIME,
    @CriadoPor BIGINT,
    @AtualizadoPor BIGINT
AS
BEGIN
    INSERT INTO Agente (NomeDoAgente, Turma, Senha, Salt, Matricula, CPF, Hierarquia, Tentativas, DataDeRegistro, DataDeAtualizacao, CriadoPor, AtualizadoPor)
    VALUES (@NomeDoAgente, @Turma, @Senha, @Salt, @Matricula, @CPF, @Hierarquia, @Tentativas, @DataDeRegistro, @DataDeAtualizacao, @CriadoPor, @AtualizadoPor);
END
GO